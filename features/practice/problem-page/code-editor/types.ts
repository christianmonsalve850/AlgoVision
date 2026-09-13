export type Language = "Python" | "JavaScript" | "Java";

export type StarterCodeMap = Partial<Record<Language, string>>;

export interface TestCase {
  id: string;
  problem_id: string;
  input: Record<string, any>;
  expected_output: any;
  is_hidden: boolean;
  order_index: number;
  created_at?: string;
}

export type ProblemEditorProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
  testCases: TestCase[];
};

export type ProblemCodeEditorPanelProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
};

export type TestCaseStatus = "idle" | "passed" | "failed";

export type ProblemTestCaseTabProps = {
  testCase: TestCase;
  selected: boolean;
  onSelect: (id: string) => void;
};

export type ProblemTestCaseOutputProps = {
  value?: string;
};