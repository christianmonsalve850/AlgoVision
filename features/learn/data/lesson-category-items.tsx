import { LessonCategoryItem } from "../types";

import {
  ArrowUpDown,
  BarChart2,
  Binary,
  Boxes,
  Cpu,
  FileText,
  FolderTree,
  Grid,
  Hash,
  Layers,
  LayoutGrid,
  ListOrdered,
  Network,
  Sigma,
  Sparkles,
  Zap,
} from "lucide-react";

export const lessonCategoryItems: LessonCategoryItem[] = [
  // General Filters
  { name: "Recommended", meta: { icon: <Sparkles size={13} />, bg: "bg-sidebar-primary/10", color: "text-sidebar-primary" } },
  { name: "All", meta: { icon: <LayoutGrid size={13} />, bg: "bg-sidebar-accent", color: "text-sidebar-accent-foreground" } },

  // Primary Data Structures
  { name: "Arrays", meta: { icon: <Grid size={13} />, bg: "bg-blue-500/10", color: "text-blue-400" } },
  { name: "Strings", meta: { icon: <FileText size={13} />, bg: "bg-cyan-500/10", color: "text-cyan-400" } },
  { name: "Hash Table", meta: { icon: <Hash size={13} />, bg: "bg-violet-500/10", color: "text-violet-400" } },
  { name: "Linked List", meta: { icon: <ListOrdered size={13} />, bg: "bg-orange-500/10", color: "text-orange-400" } },
  { name: "Stacks & Queues", meta: { icon: <Layers size={13} />, bg: "bg-pink-500/10", color: "text-pink-400" } },
  { name: "Trees & BST", meta: { icon: <FolderTree size={13} />, bg: "bg-emerald-500/10", color: "text-emerald-400" } },
  { name: "Heaps & Priority Queue", meta: { icon: <Boxes size={13} />, bg: "bg-rose-500/10", color: "text-rose-400" } },
  { name: "Graphs", meta: { icon: <Network size={13} />, bg: "bg-indigo-500/10", color: "text-indigo-400" } },

  // Core Algorithms & Topics
  { name: "Sorting & Searching", meta: { icon: <ArrowUpDown size={13} />, bg: "bg-teal-500/10", color: "text-teal-400" } },
  { name: "Dynamic Programming", meta: { icon: <BarChart2 size={13} />, bg: "bg-amber-500/10", color: "text-amber-400" } },
  { name: "Greedy Algorithms", meta: { icon: <Zap size={13} />, bg: "bg-yellow-500/10", color: "text-yellow-400" } },
  { name: "Bit Manipulation", meta: { icon: <Binary size={13} />, bg: "bg-slate-500/10", color: "text-slate-400" } },
  { name: "Math & Geometry", meta: { icon: <Sigma size={13} />, bg: "bg-lime-500/10", color: "text-lime-400" } },
  { name: "Recursion & Backtracking", meta: { icon: <Cpu size={13} />, bg: "bg-fuchsia-500/10", color: "text-fuchsia-400" } },
];