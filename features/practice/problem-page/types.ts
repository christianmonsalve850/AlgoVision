import { StarterCodeMap, TestResult, TestCase, Language } from "@/features/practice/problem-page/code-editor/types";
import { TraceStep } from "@/lib/algovision-harness/src/runtime/types";

export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export type PlaybackControlsProps = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isDisabled: boolean;
  speed: PlaybackSpeed;
  onStepChange: (step: number) => void;
  onPlayPauseToggle: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
};

export type ExecutionStatus = "idle" | "running" | "submitting";

export interface UseCodeEditorReturn {
  code: string;
  language: Language;
  handleLanguageChange: (newLang: Language) => void;
  handleReset: () => void;
  handleEditorChange: (value: string | undefined) => void;
}

export interface UseCodeEditorOptions {
  problemId: string;
  starterCodeMap: StarterCodeMap;
  defaultLanguage?: Language;
}

export interface UseProblemRunnerOptions {
  code: string;
  visibleTestCases: TestCase[];
  functionName: string;
  className: string;
  setExecutionStatus: React.Dispatch<React.SetStateAction<ExecutionStatus>>;
  onRunStart?: () => void;
}

export interface UseProblemRunnerReturn {
  run: () => Promise<void>;
}

export interface ExecuteProblemOptions {
  code: string;
  testCases: TestCase[];
  functionName: string;
  className: string;
}

export interface ExecuteProblemReturn {
  testCaseId: string;
  trace: TraceStep[];
  testResult: TestResult;
}

export interface UseProblemSubmitterOptions {
  code: string;
  visibleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  functionName: string;
  className: string;
  setExecutionStatus: React.Dispatch<React.SetStateAction<ExecutionStatus>>;
  onSubmitStart?: () => void;
  onSubmitEnd?: (result: SubmissionResult) => void;
}

export interface SubmissionResult {
  success: boolean;
  failedTestCase?: TestResult;
  error?: string;
}

export interface UseProblemSubmitterReturn {
  submit: () => Promise<SubmissionResult>;
}