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

export type ProblemEditorPanelProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
  testCases: TestCase[]
};

export type TestCaseStatus = "idle" | "passed" | "failed";

export type TestCaseItem = {
  id: number;
  input: Record<string, string>;
  expected: string;
  status: TestCaseStatus;
};

export type ProblemTestCaseTabProps = {
  testCase: TestCaseItem;
  selected: boolean;
  onSelect: (id: number) => void;
};

export type ProblemTestCaseOutputProps = {
  value?: string;
};

export type ProblemTestCaseDetailProps = {
  testCase: TestCaseItem;
};