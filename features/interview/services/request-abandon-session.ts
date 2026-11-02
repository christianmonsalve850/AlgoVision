function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function requestAbandonSession(sessionId: string): Promise<void> {
  const response = await fetch(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
    { method: "PATCH" },
  );
  const responseBody = await response.text();

  let result: unknown;

  try {
    result = responseBody ? JSON.parse(responseBody) : null;
  } catch {
    throw new Error(
      `Session API returned a non-JSON response (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const errorMessage = isRecord(result) ? result.error : undefined;
    throw new Error(
      typeof errorMessage === "string"
        ? errorMessage
        : `Failed to abandon assessment session (HTTP ${response.status}).`,
    );
  }
}
