import type { Difficulty, Duration } from "@/features/interview/types";
import type { RequestStartSessionOptions, StartSessionResponse } from "@/app/types/api-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function requestStartSession({
  difficulties,
  duration,
  problemCount,
}: RequestStartSessionOptions): Promise<StartSessionResponse> {
  const response = await fetch("/api/v1/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      difficulties,
      duration,
      problemCount,
    }),
  });

  const responseBody = await response.text();

  let result: unknown;

  try {
    result = responseBody ? JSON.parse(responseBody) : null;
  } catch {
    throw new Error(
      `Session API returned a non-JSON response (HTTP ${response.status}): ${responseBody || "empty response body"}`,
    );
  }

  if (!response.ok) {
    const errorBody = isRecord(result) ? result.error : undefined;
    const errorMessage = isRecord(errorBody)
      ? errorBody.message
      : typeof errorBody === "string"
        ? errorBody
      : isRecord(result)
        ? result.message
        : undefined;

    throw new Error(
      `Failed to start session (HTTP ${response.status}): ${
        typeof errorMessage === "string"
          ? errorMessage
          : response.statusText || "Unknown error"
      }`,
    );
  }

  if (!isRecord(result) || typeof result.sessionId !== "string") {
    throw new Error("Session API returned an invalid session ID.");
  }

  return { sessionId: result.sessionId };
}
