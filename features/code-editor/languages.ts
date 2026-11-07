export const SUPPORTED_LANGUAGES = {
  Python: {
    label: "Python",
    value: "Python",
    fileName: "solution.py",
    monacoLanguage: "python",
  },
  Java: {
    label: "Java",
    value: "Java",
    fileName: "Solution.java",
    monacoLanguage: "java",
  },
  JavaScript: {
    label: "JavaScript",
    value: "JavaScript",
    fileName: "solution.js",
    monacoLanguage: "javascript",
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

export function isSupportedLanguage(
  value: unknown,
): value is SupportedLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, value)
  );
}
