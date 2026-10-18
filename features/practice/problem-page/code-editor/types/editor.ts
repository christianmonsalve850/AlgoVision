import type { SubmissionHistory } from "@/features/practice/problem-page/problem/types";
import type { TestCase } from "./test-case";

export type Language = "Python";

export type StarterCodeMap = Partial<Record<Language, string>>;

export type ProblemEditorProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
  testCases: TestCase[];
};

export interface ProblemEditorPanelProps {
  problem_id: string;
  function_name: string;
  class_name: string;
  starterCodeMap: StarterCodeMap;
  visibleTestCases: TestCase[];
  submission_history: SubmissionHistory[];
}

export interface ProblemCodeEditorPanelProps {
  problem_id: string;
  function_name: string;
  class_name: string;
  starterCodeMap: StarterCodeMap;
  setIsOpenConsole: React.Dispatch<React.SetStateAction<boolean>>;
}
