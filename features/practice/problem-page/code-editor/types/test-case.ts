export interface TestCase {
  id: string;
  problem_id: string;
  input: Record<string, unknown>;
  expected_output: unknown;
  is_hidden: boolean;
  order_index: number;
  created_at?: string;
}

export type ProblemTestCaseTabProps = {
  testCase: TestCase;
  selected: boolean;
  onSelect: (id: string) => void;
};
