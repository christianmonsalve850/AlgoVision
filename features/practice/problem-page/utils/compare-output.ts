export function isEqual(actual: any, expected: any): boolean {
  try {
    return JSON.stringify(actual) === JSON.stringify(expected);
  } catch {
    return actual === expected;
  }
}
