import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executePython } from "@/lib/docker-runner/docker-runner";

export const runtime = "nodejs";

interface InterviewSubmitRequest {
  sessionId: string;
  problemOrderIndex: number;
  problemId: string;
  language: string;
  code: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInterviewSubmitRequest(
  value: unknown,
): value is InterviewSubmitRequest {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.sessionId === "string" &&
    value.sessionId.length > 0 &&
    typeof value.problemId === "string" &&
    value.problemId.length > 0 &&
    typeof value.problemOrderIndex === "number" &&
    typeof value.language === "string" &&
    value.language.length > 0 &&
    typeof value.code === "string"
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isInterviewSubmitRequest(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  const { sessionId, problemId, language, problemOrderIndex, code } = body;

  if (language !== "Python") {
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

    const { data: problem, error: problemError } = await supabase
      .from("problems")
      .select("class_name, function_name")
      .eq("id", body.problemId)
      .maybeSingle();

    if (problemError) {
      console.error("Failed to load interview problem execution metadata:", {
        code: problemError.code,
        message: problemError.message,
        problemId: body.problemId,
      });
      return NextResponse.json(
        {
          error: {
            code: "PROBLEM_LOOKUP_FAILED",
            message: "Could not load the problem execution configuration.",
          },
        },
        { status: 500 },
      );
    }

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    if (
      typeof problem.class_name !== "string" ||
      typeof problem.function_name !== "string" ||
      problem.class_name.length === 0 ||
      problem.function_name.length === 0
    ) {
      console.error("Interview problem has invalid execution metadata:", {
        problemId: body.problemId,
      });
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PROBLEM_CONFIGURATION",
            message: "The problem execution configuration is invalid.",
          },
        },
        { status: 500 },
      );
    }

    const { data: executionRequest, error: executionRequestInsertError } =
      await supabase
        .from("execution_requests")
        .insert({
          session_id: sessionId,
          problem_id: problemId,
          user_id: user.id,
          language: language,
          status: "pending",
          mode: "submit",
        })
        .select("id")
        .single();

    if (executionRequestInsertError) {
      console.error("Failed to insert execution metadata into Supabase:", {
        code: executionRequestInsertError.code,
        message: executionRequestInsertError.message,
        details: executionRequestInsertError.details,
        hint: executionRequestInsertError.hint,
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
          sourceCode: code,
          className: problem.class_name,
          functionName: problem.function_name,
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

        const { error: interviewSubmissionInsertError } = await supabase
          .from("interview_submissions")
          .insert({
            session_id: sessionId,
            problem_id: problemId,
            problem_order_index: problemOrderIndex,
            user_id: user.id,
            language: language,
            code,
            execution_request_id: executionRequest.id,
            verdict: executionResult.verdict,
            results: executionResult.results,
            score:
              executionResult.total > 0
                ? Math.round(
                    (executionResult.passed / executionResult.total) * 100,
                  )
                : 0,
          });

        if (interviewSubmissionInsertError) {
          console.error("Failed to insert submission into Supabase:", {
            code: interviewSubmissionInsertError.code,
            message: interviewSubmissionInsertError.message,
            details: interviewSubmissionInsertError.details,
            hint: interviewSubmissionInsertError.hint,
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
    console.error("Failed to run interview test case:", error);
    return NextResponse.json(
      {
        error: {
          code: "EXECUTION_FAILED",
          message: "Failed to run code.",
        },
      },
      { status: 500 },
    );
  }
}
