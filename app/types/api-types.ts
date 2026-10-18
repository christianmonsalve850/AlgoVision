import { Language } from "@/features/practice/problem-page/code-editor/types";

export interface UseCodeExecuterOptions {
  operation: "run" | "submit";
  problemId: string;
  language: Language;
  sourceCode: string;
  className: string;
  functionName: string;
}