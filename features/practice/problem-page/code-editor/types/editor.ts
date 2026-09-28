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
  testCases: TestCase[];
}

export interface ProblemCodeEditorPanelProps extends ProblemEditorPanelProps {
  setIsOpenConsole: React.Dispatch<React.SetStateAction<boolean>>;
}
