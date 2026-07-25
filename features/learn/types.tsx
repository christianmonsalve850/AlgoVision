export type LessonCategory =
  | "Recommended"
  | "All"
  | "Arrays"
  | "Strings"
  | "Hash Table"
  | "Linked List"
  | "Stacks & Queues"
  | "Trees & BST"
  | "Heaps & Priority Queue"
  | "Graphs"
  | "Sorting & Searching"
  | "Dynamic Programming"
  | "Greedy Algorithms"
  | "Bit Manipulation"
  | "Math & Geometry"
  | "Recursion & Backtracking";

export type LessonMetadata = {
  icon: React.ReactNode;
  bg: string;
  color: string;
  progressColor?: string;
};

export type LessonCategoryItem = {
  name: LessonCategory,
  meta: LessonMetadata;
};

export type LessonListItem = {
  id: string,
  title: string,
  category: LessonCategory,
  is_recommended: boolean | null,
  progress: number;
};
