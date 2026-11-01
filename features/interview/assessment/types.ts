
import type { Difficulty } from "@/features/interview/types";
import type { Duration } from "@/features/interview/types";

export type AssessmentSessionProps = {
  sessionId: string;
  duration: Duration;
  difficulties: Difficulty[];
  problems: ProblemDescription[];
  problemCount: number;
};

export interface AssessmentNavProps {
    onQuitOpen: () => void;
    initialTimeMinutes: number;
    difficulties: Difficulty[];
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
  problems: ProblemDescription[];
  problemCount: number;
};

export type ProblemTab = "description" | "guidelines";

export type AssessmentBodyProps = {
    problems: ProblemDescription[];
    problemCount: number;
}
