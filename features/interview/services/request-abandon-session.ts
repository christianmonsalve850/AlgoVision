function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function requestSessionStatus(
  sessionId: string,
  status: "abandoned" | "timed_out",
): Promise<void> {
  const response = await fetch(
    `/api/v1/sessions/${encodeURIComponent(sessionId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
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
      : `Failed to update assessment session status (HTTP ${response.status}).`,
    );
  }
}

export async function requestAbandonSession(sessionId: string): Promise<void> {
  await requestSessionStatus(sessionId, "abandoned");
}

export async function requestTimeoutSession(sessionId: string): Promise<void> {
  await requestSessionStatus(sessionId, "timed_out");
}
