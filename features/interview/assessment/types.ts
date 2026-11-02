
import type { Difficulty } from "@/features/interview/types";
import type { Duration } from "@/features/interview/types";

export type AssessmentSessionProps = {
  sessionId: string;
  duration: Duration;
  difficulties: Difficulty[];
  problems: ProblemDescription[];
  sessionStartDate: string;
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
  problems: ProblemDescription[];
  currentProblemIndex: number;
}

export type AssessmentFooterProps = {
  currentProblemIndex: number;
  problemCount: number;
  onProblemChange: (index: number) => void;
};
