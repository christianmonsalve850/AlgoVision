export function serializeErrorReport(error: unknown, errorDetails?: unknown): string {
  if (
    errorDetails &&
    typeof errorDetails === "object" &&
    "type" in errorDetails &&
    "line" in errorDetails &&
    "code" in errorDetails
  ) {
    const details = errorDetails as {
      type: string;
      line: number | null;
      code: string | null;
      message?: string;
    };

    return [
      `${details.type}${details.line ? ` on line ${details.line}` : ""}`,
      details.code ? `Code: ${details.code}` : null,
      details.message ? `Message: ${details.message}` : null,
    ]
      .filter((value): value is string => value !== null)
      .join("\n");
  }

  const candidates: unknown[] = [];

  if (typeof error === "string" && error.trim()) {
    candidates.push(error);
  } else if (error instanceof Error) {
    candidates.push(error.message);
    if (error.stack) {
      candidates.push(error.stack);
    }
  }

  if (errorDetails !== undefined) {
    candidates.push(errorDetails);
  }

  const rendered = candidates
    .flatMap((candidate) => {
      if (candidate === undefined || candidate === null) {
        return [];
      }

      if (typeof candidate === "string") {
        return [candidate];
      }

      if (candidate instanceof Error) {
        return [candidate.message, ...(candidate.stack ? [candidate.stack] : [])];
      }

      try {
        return [JSON.stringify(candidate, null, 2)];
      } catch {
        return [String(candidate)];
      }
    })
    .filter((value) => value && value.trim().length > 0);

  return rendered.length > 0 ? rendered.join("\n\n") : "Unknown runtime error";
}