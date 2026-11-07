import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { executePython } from "@/lib/docker-runner/docker-runner";

export const runtime = "nodejs";

interface InterviewRunRequest {
  problemId: string;
  language: string;
  sourceCode: string;
  input: Record<string, unknown> | unknown[];
  expectedOutput: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isInterviewRunRequest(value: unknown): value is InterviewRunRequest {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.problemId === "string" &&
    value.problemId.length > 0 &&
    typeof value.language === "string" &&
    value.language.length > 0 &&
    typeof value.sourceCode === "string" &&
    (isRecord(value.input) || Array.isArray(value.input)) &&
    Object.hasOwn(value, "expectedOutput")
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isInterviewRunRequest(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  if (body.language !== "Python") {
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

    const result = await executePython({
      operation: "test",
      problemId: body.problemId,
      sourceCode: body.sourceCode,
      className: problem.class_name,
      functionName: problem.function_name,
      testCase: {
        input: body.input,
        expectedOutput: body.expectedOutput,
      },
    });

    return NextResponse.json(result, { status: 200 });
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
