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
    request.mode === "trace"
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
      .select("id, input, is_hidden, order_index")
      .eq("problem_id", problemId)
      .eq("is_hidden", false)
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

    switch (language) {
      case "Python":
        const executionResult = await executePython({
          operation: "trace",
          problemId,
          sourceCode,
          className,
          functionName,
          testCases: (testCases ?? []).map(({ id, input }) => ({ id, input })),
        });
        return NextResponse.json(executionResult, { status: 200 });
      default:
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
          message: "Failed to run code.",
        },
      },
      { status: 500 },
    );
  }
}
