import { Language } from "@/features/practice/problem-page/code-editor/types";

export interface UseCodeExecuterOptions {
  problemId: string;
  language: Language;
  sourceCode: string;
  mode: string;
}