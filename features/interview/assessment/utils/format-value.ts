export function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.length === 0
      ? "[]"
      : `[${value.map(formatValue).join(", ")}]`;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value).map(
      ([key, entryValue]) =>
        `${JSON.stringify(key)}: ${formatValue(entryValue)}`,
    );

    return entries.length === 0 ? "{}" : `{${entries.join(", ")}}`;
  }

  return JSON.stringify(value) ?? String(value);
}
