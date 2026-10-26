import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { HintOptions } from "@/app/types/api-types";
import { AI_INSTRUCTORS_SYSTEM_PROMPT } from "@/app/api/v1/hints/instructions";
import OpenAI from "openai";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidHintPayload(value: unknown): value is HintOptions {
  if (!isRecord(value) || !isRecord(value.problem)) {
    return false;
  }

  const problemId = value.problemId;
  const problem = value.problem;
  const executionId = value.executionId;
  const hintLevel = value.hintLevel;

  return (
    typeof problemId === "string" &&
    problemId.length > 0 &&
    typeof problem.title === "string" &&
    typeof problem.description === "string" &&
    Array.isArray(problem.constraints) &&
    problem.constraints.every(
      (constraint: unknown) => typeof constraint === "string",
    ) &&
    typeof value.userCode === "string" &&
    (executionId === null ||
      (typeof executionId === "string" && executionId.length > 0)) &&
    (hintLevel === 1 || hintLevel === 2 || hintLevel === 3)
  );
}

function isGradeTestResult(
  value: unknown,
): value is { passed: boolean; status: string } {
  return (
    isRecord(value) &&
    typeof value.passed === "boolean" &&
    typeof value.status === "string"
  );
}

function getFailureSummary(payload: unknown) {
  if (
    !isRecord(payload) ||
    !Array.isArray(payload.results) ||
    !payload.results.every(isGradeTestResult)
  ) {
    throw new Error("Stored execution results have an invalid format.");
  }

  const failedResults = payload.results.filter((result) => !result.passed);

  return {
    total: payload.results.length,
    failed: failedResults.length,
    wrongAnswer: failedResults.filter((result) => result.status === "failed")
      .length,
    runtimeError: failedResults.filter((result) => result.status === "error")
      .length,
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidHintPayload(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  const {
    problemId,
    problem,
    userCode,
    executionId,
    hintLevel,
  } = body;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let failureSummary = "No submission results available.";

    if (executionId) {
      const { data: execution, error: executionError } = await supabase
        .from("execution_requests")
        .select("output_payload")
        .eq("id", executionId)
        .eq("user_id", user.id)
        .eq("problem_id", problemId)
        .eq("status", "completed")
        .maybeSingle();

      if (executionError) {
        console.error("Failed to load hint execution results:", executionError);
        return NextResponse.json(
          { error: "Failed to load submission results." },
          { status: 500 },
        );
      }

      if (!execution) {
        return NextResponse.json(
          { error: "Submission not found." },
          { status: 404 },
        );
      }

      const summary = getFailureSummary(execution.output_payload);
      failureSummary =
        `Total tests: ${summary.total}; failed: ${summary.failed}; ` +
        `wrong answers: ${summary.wrongAnswer}; runtime errors: ${summary.runtimeError}.`;
    }

    const client = new OpenAI();

    const response = await client.responses.create({
      model: "gpt-6-luna",
      reasoning: { effort: "medium" },
      instructions: AI_INSTRUCTORS_SYSTEM_PROMPT,
      input: `
      Hint Level: ${hintLevel}
      Problem: ${problem.title}
      Problem Description: ${problem.description}
      Constraints: ${problem.constraints.join("; ")}
      User Code: ${userCode}
      Failure Summary: ${failureSummary}
    `,
      text: {
        format: {
          name: "hint_response",
          type: "json_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              hint: { type: "string" },
              revealsSolution: { type: "boolean" },
            },
            required: ["hint", "revealsSolution"],
            additionalProperties: false,
          },
        },
      },
    });

    const hintData = JSON.parse(response.output_text);

    return NextResponse.json(hintData, { status: 200 });

  } catch(error) {
    return NextResponse.json(
      {
        error: {
          code: "FAILED_TO_GENERATE_HINT",
          message: "Failed to generate AI hint.",
          error_log: error,
        },
      },
      { status: 500 },
    );
  }
}
