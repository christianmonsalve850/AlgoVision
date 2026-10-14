import { Language } from "@/features/practice/problem-page/code-editor/types";

export interface UseCodeExecuterOptions {
  problemId: string;
  language: Language;
  sourceCode: string;
  className: string;
  functionName: string;
  mode: string;
}