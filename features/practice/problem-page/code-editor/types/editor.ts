import type { ProblemRecord, SubmissionHistory } from "@/features/practice/problem-page/problem/types";
import type { TestCase } from "./test-case";

export type Language = "Python";

export type StarterCodeMap = Partial<Record<Language, string>>;

export type ProblemEditorProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
  testCases: TestCase[];
};

export interface ProblemEditorPanelProps {
  isAiHintsOpen: boolean;
  onAiHintsOpenChange: (isOpen: boolean) => void;
  problem_id: string;
  problem: ProblemRecord;
  function_name: string;
  class_name: string;
  starterCodeMap: StarterCodeMap;
  visibleTestCases: TestCase[];
  submission_history: SubmissionHistory[];
}

export interface ProblemCodeEditorPanelProps {
  isAiHintsOpen: boolean;
  onAiHintsOpenChange: (isOpen: boolean) => void;
  problem_id: string;
  problem: ProblemRecord;
  function_name: string;
  class_name: string;
  starterCodeMap: StarterCodeMap;
  onRunStart: () => void;
  onSubmitStart: () => void;
  submissionLoadRequest: {
    submission: SubmissionHistory;
    requestId: number;
  } | null;
}
