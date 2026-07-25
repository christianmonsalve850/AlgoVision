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
  { name: "Recommended", meta: { icon: <Sparkles className="w-full h-full" />, bg: "bg-sidebar-primary/10", color: "text-sidebar-primary", progressColor: "bg-sidebar-primary" } },
  { name: "All", meta: { icon: <LayoutGrid className="w-full h-full" />, bg: "bg-sidebar-accent", color: "text-sidebar-accent-foreground", progressColor: "bg-sidebar-accent-foreground" } },

  // Primary Data Structures
  { name: "Arrays", meta: { icon: <Grid className="w-full h-full" />, bg: "bg-blue-500/10", color: "text-blue-400", progressColor: "bg-blue-500" } },
  { name: "Strings", meta: { icon: <FileText className="w-full h-full" />, bg: "bg-cyan-500/10", color: "text-cyan-400", progressColor: "bg-cyan-500" } },
  { name: "Hash Table", meta: { icon: <Hash className="w-full h-full" />, bg: "bg-violet-500/10", color: "text-violet-400", progressColor: "bg-violet-500" } },
  { name: "Linked List", meta: { icon: <ListOrdered className="w-full h-full" />, bg: "bg-orange-500/10", color: "text-orange-400", progressColor: "bg-orange-500" } },
  { name: "Stacks & Queues", meta: { icon: <Layers className="w-full h-full" />, bg: "bg-pink-500/10", color: "text-pink-400", progressColor: "bg-pink-500" } },
  { name: "Trees & BST", meta: { icon: <FolderTree className="w-full h-full" />, bg: "bg-emerald-500/10", color: "text-emerald-400", progressColor: "bg-emerald-500" } },
  { name: "Heaps & Priority Queue", meta: { icon: <Boxes className="w-full h-full" />, bg: "bg-rose-500/10", color: "text-rose-400", progressColor: "bg-rose-500" } },
  { name: "Graphs", meta: { icon: <Network className="w-full h-full" />, bg: "bg-indigo-500/10", color: "text-indigo-400", progressColor: "bg-indigo-500" } },

  // Core Algorithms & Topics
  { name: "Sorting & Searching", meta: { icon: <ArrowUpDown className="w-full h-full" />, bg: "bg-teal-500/10", color: "text-teal-400", progressColor: "bg-teal-500" } },
  { name: "Dynamic Programming", meta: { icon: <BarChart2 className="w-full h-full" />, bg: "bg-amber-500/10", color: "text-amber-400", progressColor: "bg-amber-500" } },
  { name: "Greedy Algorithms", meta: { icon: <Zap className="w-full h-full" />, bg: "bg-yellow-500/10", color: "text-yellow-400", progressColor: "bg-yellow-500" } },
  { name: "Bit Manipulation", meta: { icon: <Binary className="w-full h-full" />, bg: "bg-slate-500/10", color: "text-slate-400", progressColor: "bg-slate-500" } },
  { name: "Math & Geometry", meta: { icon: <Sigma className="w-full h-full" />, bg: "bg-lime-500/10", color: "text-lime-400", progressColor: "bg-lime-500" } },
  { name: "Recursion & Backtracking", meta: { icon: <Cpu className="w-full h-full" />, bg: "bg-fuchsia-500/10", color: "text-fuchsia-400", progressColor: "bg-fuchsia-500" } },
];