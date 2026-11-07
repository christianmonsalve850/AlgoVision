import type { SupportedLanguage } from "@/features/code-editor/languages";
import type { SingleTestExecutionResult } from "@/lib/docker-runner/types";

interface RequestRunTestCaseOptions {
  problemId: string;
  language: SupportedLanguage;
  sourceCode: string;
  input: Record<string, unknown> | unknown[];
  expectedOutput: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseResult(value: unknown): SingleTestExecutionResult {
  if (
    !isRecord(value) ||
    (value.status !== "passed" &&
      value.status !== "failed" &&
      value.status !== "error") ||
    typeof value.correct !== "boolean" ||
    typeof value.stdout !== "string" ||
    (value.error !== undefined && typeof value.error !== "string") ||
    (value.errorType !== undefined && typeof value.errorType !== "string")
  ) {
    throw new Error("Interview execution API returned an invalid response.");
  }

  return {
    status: value.status,
    correct: value.correct,
    stdout: value.stdout,
    ...(Object.hasOwn(value, "actualOutput")
      ? { actualOutput: value.actualOutput }
      : {}),
    ...(typeof value.error === "string" ? { error: value.error } : {}),
    ...(typeof value.errorType === "string"
      ? { errorType: value.errorType }
      : {}),
  };
}

export async function requestRunTestCase(
  options: RequestRunTestCaseOptions,
): Promise<SingleTestExecutionResult> {
  const response = await fetch("/api/v1/interview/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });

  const responseBody = await response.text();
  let result: unknown;

  try {
    result = responseBody ? JSON.parse(responseBody) : null;
  } catch {
    throw new Error(
      `Interview execution API returned a non-JSON response (HTTP ${response.status}): ${responseBody || "empty response body"}`,
    );
  }

  if (!response.ok) {
    console.error("Interview execution API request failed:", {
      status: response.status,
      body: result,
    });
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return parseResult(result);
}
