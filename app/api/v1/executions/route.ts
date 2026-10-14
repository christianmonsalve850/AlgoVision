import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UseCodeExecuterOptions } from "@/app/types/api-types";
import { executePython } from "@/lib/docker-runner/docker-runner";

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
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: testCases, error: testCaseError } =
      await supabase
        .from("test_cases")
        .select()
        .eq("problem_id", problemId)
        .order("order_index", { ascending: true });

    if (testCaseError) {
      console.error("Failed to fetch visible test cases:", testCaseError);
    }

    switch (language) {
      case "Python":
        const executionResult = await executePython({
          problemId,
          sourceCode,
          className,
          functionName,
          testCases: testCases ?? [],
        });
        return NextResponse.json(executionResult, { status: 201 });
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
          message: "Execution failed. Check the server logs for details.",
        },
      },
      { status: 500 },
    );
  }
}
