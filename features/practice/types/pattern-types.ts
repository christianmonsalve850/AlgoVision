export type PatternName =
  | "Recommended"
  | "All"
  | "Hash Table"
  | "Binary Search"
  | "Two Pointers"
  | "Sliding Window"
  | "Linked List"
  | "Stack"
  | "Tree Traversal"
  | "Dynamic Programming"
  | "DFS/BFS"
  | "Topological Sort"
  | "Fast & Slow Pointers"
  | "Intervals";

export type PatternMetadata = {
  icon: React.ReactNode;
  bg: string;
  color: string;
};

export type PatternItem = {
  name: PatternName;
  meta: PatternMetadata;
};
