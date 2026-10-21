import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UseCodeExecuterOptions } from "@/app/types/api-types";
import { executePython } from "@/lib/docker-runner/docker-runner";

export const runtime = "nodejs";

type SubmitExecutionRequest = UseCodeExecuterOptions & { timeZone: string };

function isTimeZone(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) {
    return false;
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function isExecutionRequest(value: unknown): value is SubmitExecutionRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;
  return (
    typeof request.problemId === "string" &&
    request.problemId.length > 0 &&
    typeof request.language === "string" &&
    request.language.length > 0 &&
    typeof request.sourceCode === "string" &&
    typeof request.className === "string" &&
    request.className.length > 0 &&
    typeof request.functionName === "string" &&
    request.functionName.length > 0 &&
    typeof request.mode === "string" &&
    request.mode.length > 0 &&
    isTimeZone(request.timeZone)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isExecutionRequest(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  const { problemId, language, sourceCode, className, functionName, timeZone } =
    body;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: testCases, error: testCaseError } = await supabase
      .from("test_cases")
      .select()
      .eq("problem_id", problemId)
      .order("order_index", { ascending: true });

    if (testCaseError) {
      return NextResponse.json(
        {
          error: {
            code: "EXECUTION_FAILED",
            message:
              "Failed to fetch test cases. Check the server logs for details.",
          },
        },
        { status: 500 },
      );
    }

    const { data: executionRequest, error: exectuionRequestInsertError } =
      await supabase
        .from("execution_requests")
        .insert({
          problem_id: problemId,
          user_id: user.id,
          language: language,
          status: "pending",
          mode: "run",
        })
        .select("id")
        .single();

    if (exectuionRequestInsertError) {
      console.error("Failed to insert execution metadata into Supabase:", {
        code: exectuionRequestInsertError.code,
        message: exectuionRequestInsertError.message,
        details: exectuionRequestInsertError.details,
        hint: exectuionRequestInsertError.hint,
      });

      return NextResponse.json(
        {
          error: {
            code: "INSERT_FAILED",
            message:
              "Failed to insert execution metadata. Check the server logs for details.",
          },
        },
        { status: 500 },
      );
    }

    switch (language) {
      case "Python":
        const startTime = Date.now();
        const executionResult = await executePython({
          operation: "grade",
          executionId: executionRequest.id,
          problemId,
          sourceCode,
          className,
          functionName,
          testCases: testCases ?? [],
        });
        const durationMs = Date.now() - startTime;
        const { data: updatedExecution, error: updateError } = await supabase
          .from("execution_requests")
          .update({
            status: "completed",
            verdict: executionResult.verdict,
            passed_tests: executionResult.passed,
            total_tests: executionResult.total,
            execution_time_ms: durationMs,
            output_payload: executionResult,
          })
          .eq("id", executionRequest.id)
          .select("id")
          .maybeSingle();

        if (updateError || !updatedExecution) {
          console.error("Failed to update execution metadata in Supabase:", {
            code: updateError?.code,
            message: updateError?.message ?? "No row was updated or returned",
            details: updateError?.details,
            hint: updateError?.hint,
            executionId: executionRequest.id,
          });

          return NextResponse.json(
            {
              error: {
                code: "UPDATE_FAILED",
                message:
                  "Execution completed, but its metadata could not be updated.",
              },
            },
            { status: 500 },
          );
        }

        const { error: submissionInsertError } = await supabase
          .from("submissions")
          .insert({
            problem_id: problemId,
            user_id: user.id,
            language: language,
            source_code: sourceCode,
            execution_request_id: executionRequest.id,
            verdict: executionResult.verdict,
            results: executionResult.results,
          });

        if (submissionInsertError) {
          console.error("Failed to insert submission into Supabase:", {
            code: submissionInsertError.code,
            message: submissionInsertError.message,
            details: submissionInsertError.details,
            hint: submissionInsertError.hint,
          });

          return NextResponse.json(
            {
              error: {
                code: "INSERT_FAILED",
                message:
                  "Failed to insert submission into Supabase. Check the server logs for details.",
              },
            },
            { status: 500 },
          );
        }

        const { error: activityLogError } = await supabase
          .from("activity_log")
          .insert({
            user_id: user.id,
            action_type: "problem",
            action_id: problemId,
            completed: executionResult.verdict === "accepted",
          });

        if (activityLogError) {
          console.error("Failed to insert problem activity log:", {
            code: activityLogError.code,
            message: activityLogError.message,
            details: activityLogError.details,
            hint: activityLogError.hint,
          });

          return NextResponse.json(
            {
              error: {
                code: "ACTIVITY_LOG_FAILED",
                message:
                  "The submission was recorded, but its activity could not be saved.",
              },
            },
            { status: 500 },
          );
        }

        if (executionResult.verdict === "accepted") {
          const { error: streakError } = await supabase.rpc(
            "record_accepted_problem",
            {
              p_user_id: user.id,
              p_time_zone: timeZone,
            },
          );

          if (streakError) {
            console.error("Failed to update user streak:", {
              code: streakError.code,
              message: streakError.message,
              details: streakError.details,
              hint: streakError.hint,
            });

            return NextResponse.json(
              {
                error: {
                  code: "STREAK_UPDATE_FAILED",
                  message:
                    "The solution was accepted, but streak progress could not be updated.",
                },
              },
              { status: 500 },
            );
          }

          const { error: userProblemProgressError } = await supabase
            .from("user_problem_progress")
            .insert({
              problem_id: problemId,
              user_id: user.id,
              solved: true,
              language: language,
              code: sourceCode,
            });

          if (userProblemProgressError) {
            console.error(
              "Failed to insert execution metadata into Supabase:",
              {
                code: userProblemProgressError.code,
                message: userProblemProgressError.message,
                details: userProblemProgressError.details,
                hint: userProblemProgressError.hint,
              },
            );

            return NextResponse.json(
              {
                error: {
                  code: "INSERT_FAILED",
                  message:
                    "Failed to insert execution metadata. Check the server logs for details.",
                },
              },
              { status: 500 },
            );
          }
        }

        const { error: insertLatestProblemError } = await supabase
          .from("user_progress")
          .update({
            latest_problem_id: problemId,
          })
          .eq("user_id", user.id);

        if (insertLatestProblemError) {
          console.error("Failed to insert latest problem attempted metadata:", {
            code: insertLatestProblemError.code,
            message: insertLatestProblemError.message,
            details: insertLatestProblemError.details,
            hint: insertLatestProblemError.hint,
          });

          return NextResponse.json(
            {
              error: {
                code: "INSERT_FAILED",
                message:
                  "Failed to insert latest problem attempted metadata. Check the server logs for details.",
              },
            },
            { status: 500 },
          );
        }

        return NextResponse.json(
          {
            executionId: executionRequest.id,
            status: executionResult.status,
            verdict: executionResult.verdict,
            passed: executionResult.passed,
            total: executionResult.total,
          },
          { status: 201 },
        );
      default:
        const { data: failedExecution, error: failureUpdateError } =
          await supabase
            .from("execution_requests")
            .update({
              status: "failed",
              verdict: "Runtime Error",
              error_message: "Only Python is supported right now.",
            })
            .eq("id", executionRequest.id)
            .select("id")
            .maybeSingle();

        if (failureUpdateError || !failedExecution) {
          console.error("Failed to mark unsupported execution in Supabase:", {
            code: failureUpdateError?.code,
            message:
              failureUpdateError?.message ?? "No row was updated or returned",
            details: failureUpdateError?.details,
            hint: failureUpdateError?.hint,
            executionId: executionRequest.id,
          });
        }

        return NextResponse.json(
          {
            error: {
              code: "UNSUPPORTED_LANGUAGE",
              message: "Only Python is supported right now.",
            },
          },
          { status: 422 },
        );
    }
  } catch (error) {
    console.error("Failed to process execution request:", error);

    return NextResponse.json(
      {
        error: {
          code: "EXECUTION_FAILED",
          message: "Execution failed. Check the server logs for details.",
        },
      },
      { status: 500 },
    );
  }
}
