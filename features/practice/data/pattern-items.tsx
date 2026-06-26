import { PatternItem } from "@/features/practice/types/pattern-types";

import {
  ArrowLeftRight,
  BarChart2,
  Binary,
  GitFork,
  Hash,
  Layers,
  LayoutGrid,
  List,
  Network,
  Repeat,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export const patternItems: PatternItem[] = [
  { name: "Recommended", meta: { icon: <Sparkles size={13} />, bg: "bg-sidebar-primary/10", color: "text-sidebar-primary" } },
  { name: "All", meta: { icon: <LayoutGrid size={13} />, bg: "bg-sidebar-accent", color: "text-sidebar-accent-foreground"} },
  { name: "Hash Table", meta: { icon: <Hash size={13} />, bg: "bg-violet-500/10", color: "text-violet-400" } },
  { name: "Binary Search", meta: { icon: <Binary size={13} />, bg: "bg-slate-500/10", color: "text-slate-400" } },
  { name: "Two Pointers", meta: { icon: <ArrowLeftRight size={13} />, bg: "bg-sky-500/10", color: "text-sky-400" } },
  { name: "Sliding Window", meta: { icon: <SlidersHorizontal size={13} />, bg: "bg-cyan-500/10", color: "text-cyan-400" } },
  { name: "Linked List", meta: { icon: <List size={13} />, bg: "bg-orange-500/10", color: "text-orange-400" } },
  { name: "Stack", meta: { icon: <Layers size={13} />, bg: "bg-pink-500/10", color: "text-pink-400" } },
  { name: "Tree Traversal", meta: { icon: <GitFork size={13} />, bg: "bg-emerald-500/10", color: "text-emerald-400" } },
  { name: "Dynamic Programming", meta: { icon: <BarChart2 size={13} />, bg: "bg-amber-500/10", color: "text-amber-400" } },
  { name: "DFS/BFS", meta: { icon: <Network size={13} />, bg: "bg-indigo-500/10", color: "text-indigo-400" } },
  { name: "Topological Sort", meta: { icon: <GitFork size={13} />, bg: "bg-teal-500/10", color: "text-teal-400" } },
  { name: "Fast & Slow Pointers", meta: { icon: <Repeat size={13} />, bg: "bg-rose-500/10", color: "text-rose-400" } },
  { name: "Intervals", meta: { icon: <SlidersHorizontal size={13} />, bg: "bg-lime-500/10", color: "text-lime-400" } },
];
