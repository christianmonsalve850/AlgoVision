'use client';

import { useState } from "react";

import { LessonSidebar } from "./lesson-sidebar";
import type { LessonCategory, LessonListItem } from "../types";
import { Lessons } from "./lessons";

// Temporary Placeholder (Until adding db logic)

export const mockLessonListItems: LessonListItem[] = [
  {
    id: "lesson-1",
    title: "Two Sum & Container With Most Water",
    category: "Arrays",
    is_recommended: true,
    progress: 25,
  },
  {
    id: "lesson-2",
    title: "Valid Anagram & Group Anagrams",
    category: "Strings",
    is_recommended: true,
    progress: 78,
  },
  {
    id: "lesson-3",
    title: "LRU Cache Implementation",
    category: "Hash Table",
    is_recommended: false,
    progress: 34,
  },
  {
    id: "lesson-4",
    title: "Reverse Linked List & Fast Pointer Cycle Detection",
    category: "Linked List",
    is_recommended: true,
    progress: 56,
  },
  {
    id: "lesson-5",
    title: "Valid Parentheses & Min Stack",
    category: "Stacks & Queues",
    is_recommended: null,
    progress: 10,
  },
  {
    id: "lesson-6",
    title: "Binary Tree Level Order Traversal",
    category: "Trees & BST",
    is_recommended: false,
    progress: 50,
  },
  {
    id: "lesson-7",
    title: "Kth Largest Element in an Array",
    category: "Heaps & Priority Queue",
    is_recommended: true,
    progress: 89,
  },
  {
    id: "lesson-8",
    title: "Clone Graph & Topological Sort",
    category: "Graphs",
    is_recommended: null,
    progress: 44,
  },
  {
    id: "lesson-9",
    title: "Search in Rotated Sorted Array",
    category: "Sorting & Searching",
    is_recommended: true,
    progress: 29,
  },
  {
    id: "lesson-10",
    title: "0/1 Knapsack & Coin Change",
    category: "Dynamic Programming",
    is_recommended: false,
    progress: 81,
  },
  {
    id: "lesson-11",
    title: "Jump Game & Gas Station",
    category: "Greedy Algorithms",
    is_recommended: null,
    progress: 68,
  },
  {
    id: "lesson-12",
    title: "Number of 1 Bits & Counting Bits",
    category: "Bit Manipulation",
    is_recommended: false,
    progress: 70,
  },
  {
    id: "lesson-13",
    title: "Spiral Matrix & Rotate Image",
    category: "Math & Geometry",
    is_recommended: null,
    progress: 38,
  },
  {
    id: "lesson-14",
    title: "Subsets & N-Queens Strategy",
    category: "Recursion & Backtracking",
    is_recommended: true,
    progress: 90,
  },
];

export function LessonShell() {
  const [selectedLesson, setSelectedLesson] = useState<LessonCategory>("Recommended");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start bg-background px-6">
        <LessonSidebar selectedLesson={selectedLesson} onSelectLesson={setSelectedLesson} />
        <div className="w-full">
            <Lessons selectedCategory={selectedLesson} lessons={mockLessonListItems} />
        </div>
    </main>
  );
}
