import type { Difficulty } from "@/features/practice/components/difficulty-badge";
import type { PatternName } from "@/features/practice/types/pattern-types";

export type ProblemExample = {
  id: string;
  problem_id: string;
  example_number: number;
  input: string | null;
  output: string | null;
  explanation: string | null;
};

export type ProblemRecord = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  pattern: PatternName;
  constraints: string[];
};

export type ProblemPageData = {
  problem: ProblemRecord;
  examples: ProblemExample[];
};
