import type { SubmissionExecutionSummary } from "@/app/types/api-types";
import { parseSubmissionSummary } from "@/lib/api-response-parsers";

interface RequestSubmitOptions {
  sessionId: string;
  problemOrderIndex: number;
  problemId: string;
  language: string;
  code: string;
};

export async function requestSubmit(
    options: RequestSubmitOptions
): Promise<SubmissionExecutionSummary> {
  const response = await fetch("/api/v1/interview/submit", {
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

  return parseSubmissionSummary(result);
}
