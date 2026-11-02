
import type { Difficulty } from "@/features/interview/types";
import type { Duration } from "@/features/interview/types";
import type {
  Language,
  StarterCodeMap,
} from "@/features/practice/problem-page/problem/types";

export type AssessmentStarterCodeMaps = Record<string, StarterCodeMap>;

export type AssessmentSessionProps = {
  sessionId: string;
  language: Language;
  duration: Duration;
  difficulties: Difficulty[];
  problems: ProblemDescription[];
  sessionStartDate: string;
  starterCodeMaps: AssessmentStarterCodeMaps;
};

export interface AssessmentNavProps {
    onQuitOpen: () => void;
    initialTimeMinutes: number;
    difficulties: Difficulty[];
    sessionStartDate: string;
}

export type ProblemDescription = {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
};

export type ProblemExample = {
  example_number: number;
  input: string | null;
  output: string | null;
  explanation: string | null;
};

export type DescriptionProps = {
  problem: ProblemDescription;
  problemNumber: number;
  problemCount: number;
};

export type ProblemTab = "description" | "guidelines";

export type AssessmentBodyProps = {
  sessionId: string;
  language: Language;
  problems: ProblemDescription[];
  currentProblemIndex: number;
  starterCodeMaps: AssessmentStarterCodeMaps;
}

export type AssessmentFooterProps = {
  currentProblemIndex: number;
  problemCount: number;
  onProblemChange: (index: number) => void;
};

export interface UseAssessmentEditorReturn {
  code: string;
  language: Language;
  handleReset: () => void;
  handleEditorChange: (value: string | undefined) => void;
}

export interface UseAssessmentEditorOptions {
  sessionId: string;
  problemId: string;
  language: Language;
  starterCodeMap: StarterCodeMap;
}