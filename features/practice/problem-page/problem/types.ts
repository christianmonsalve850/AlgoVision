import type { Difficulty } from "@/features/practice/components/difficulty-badge";
import type { PatternName } from "@/features/practice/types/pattern-types";

export type Language = "Python" | "JavaScript" | "Java";

export type StarterCodeMap = Partial<Record<Language, string>>;

export type ProblemConstraintsListProps = {
  constraints: string[];
};

export type ProblemExample = {
  id: string;
  problem_id: string;
  example_number: number;
  input: string | null;
  output: string | null;
  explanation: string | null;
};

export type ProblemExampleCardProps = {
  example: ProblemExample;
};

export type ProblemRecord = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  pattern: PatternName;
  constraints: string[];
};

export type ProblemSidebarProps = {
  problem: ProblemRecord;
  examples: ProblemExample[];
};

export type ProblemEditorPanelProps = {
  starterCodeMap: StarterCodeMap;
};

export type ProblemPageData = ProblemSidebarProps & ProblemEditorPanelProps;