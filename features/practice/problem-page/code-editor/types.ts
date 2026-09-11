export type Language = "Python" | "JavaScript" | "Java";

export type StarterCodeMap = Partial<Record<Language, string>>;

export type ProblemEditorPanelProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
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