import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UseCodeExecuterOptions } from "@/app/types/api-types";
import { executePython } from "@/lib/docker-runner/docker-runner";

export const runtime = "nodejs";

function isExecutionRequest(value: unknown): value is UseCodeExecuterOptions {
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
    request.mode.length > 0
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

  const { problemId, language, sourceCode, className, functionName } = body;

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
            message: "Failed to fetch test cases. Check the server logs for details.",
          },
        },
        { status: 500 },
      );
    }

    const { data: executionRequest, error: insertError } = await supabase
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

    if (insertError) {
      console.error("Failed to insert execution metadata into Supabase:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });

      return NextResponse.json(
        {
          error: {
            code: "INSERT_FAILED",
            message: "Failed to insert execution metadata. Check the server logs for details.",
          },
        },
        { status: 500 },
      );
    }

    switch (language) {
      case "Python":
        const startTime = Date.now();
        const executionResult = await executePython({
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
                message: "Execution completed, but its metadata could not be updated.",
              },
            },
            { status: 500 },
          );
        }

        console.info("Execution metadata updated in Supabase:", updatedExecution);
        return NextResponse.json(
          { executionId: executionRequest.id, ...executionResult },
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
