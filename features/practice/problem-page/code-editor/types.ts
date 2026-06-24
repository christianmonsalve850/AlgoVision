export type Language = "Python" | "JavaScript" | "Java";

export type StarterCodeMap = Partial<Record<Language, string>>;

export type ProblemCodeEditorProps = {
  language: Language;
  code: string;
  onLanguageChange: (language: Language) => void;
  onCodeChange: (code: string | undefined) => void;
};

export type ProblemEditorPanelProps = {
  problem_id: string;
  starterCodeMap: StarterCodeMap;
};

export type TestCaseStatus = "idle" | "passed" | "failed";

export type TestCaseItem = {
  id: number;
  input: string;
  expected: string;
  status: TestCaseStatus;
};

export type ProblemTestCaseTabProps = {
  testCase: TestCaseItem;
  selected: boolean;
  onSelect: (id: number) => void;
};

export type ProblemTestCaseOutputProps = {
  value: string;
};

export type ProblemTestCaseDetailProps = {
  testCase: TestCaseItem;
};