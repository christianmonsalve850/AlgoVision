export type LessonName =
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
};

export type LessonCategoryItem = {
  name: LessonName;
  meta: LessonMetadata;
};