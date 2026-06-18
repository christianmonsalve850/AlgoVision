import type { Difficulty } from "@/features/practice/components/difficulty-badge";
import type { PatternName } from "@/features/practice/types/pattern-types";

export type ProblemListItem = {
  id: number;
  title: string;
  difficulty: Difficulty;
  pattern: PatternName;
  solved?: boolean | null;
};
