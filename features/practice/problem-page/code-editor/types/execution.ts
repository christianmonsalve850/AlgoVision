export type TestCaseStatus = "idle" | "passed" | "failed";

export type ProblemTestCaseOutputProps = {
  value?: string;
};

export type TestResult =
  | {
      passed: boolean;
      status: "passed" | "error" | "failed";
      actualOutput: any;
      expectedOutput: any;
      error: string | undefined;
      errorDetails: any;
    }
  | undefined;