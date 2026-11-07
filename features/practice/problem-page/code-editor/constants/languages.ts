import { SUPPORTED_LANGUAGES } from "@/features/code-editor/languages";
import type { Language } from "@/features/practice/problem-page/code-editor/types";

export const languageOptions = [
  {
    ...SUPPORTED_LANGUAGES.Python,
    extension: SUPPORTED_LANGUAGES.Python.monacoLanguage,
  },
] satisfies {
  label: Language;
  value: Language;
  fileName: string;
  extension: string;
}[];