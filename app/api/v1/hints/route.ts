import { NextResponse } from "next/server";
import type { HintOptions } from "@/app/types/api-types";
import OpenAI from "openai";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidHintPayload(value: unknown): value is HintOptions {
  if (!isRecord(value) || !isRecord(value.problem)) {
    return false;
  }

  const problem = value.problem;
  const failedTests = value.failedTests;
  const requestedHintType = value.requestedHintType;

  return (
    typeof problem.title === "string" &&
    typeof problem.description === "string" &&
    Array.isArray(problem.constraints) &&
    problem.constraints.every(
      (constraint: unknown) => typeof constraint === "string",
    ) &&
    typeof value.userCode === "string" &&
    Array.isArray(failedTests) &&
    failedTests.every(
      (test: unknown) =>
        isRecord(test) &&
        typeof test.input === "string" &&
        typeof test.expected === "string" &&
        typeof test.actual === "string",
    ) &&
    (requestedHintType === "pattern" ||
      requestedHintType === "complexity" ||
      requestedHintType === "data_structure")
  );
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

  const { userHintRequest, problem, userCode, failedTests, requestedHintType } = body;

  try {
    const client = new OpenAI();

    const response = await client.responses.create({
      model: "gpt-6-luna",
      instructions: `
      You are AlgoVision’s educational coding coach.

      Give one concise, actionable hint based on the supplied problem, learner code,
      and failed tests.

      Rules:
      - Never provide complete code, pseudocode that is directly implementable, or a full algorithm.
      - Do not name the exact final solution unless the learner has reached hint level 3.
      - Focus on a misconception, a useful question, or the next concept to investigate.
      - Refer to the learner’s code or failing test when useful.
      - Return the required structured response.
      - Set revealsSolution to false unless the response substantially gives away the solution.
    `.trim(),
      input: `
      User Hint Request: ${userHintRequest}
      Problem: ${problem.title}
      User Code: ${userCode}
      Failed Tests: ${failedTests}
      Requested Hint Type: ${requestedHintType}
    `,
      text: {
        format: {
          name: "hint_response",
          type: "json_schema",
          schema: {
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
