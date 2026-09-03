"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

export interface Pointer {
  name: string;
  index: number;
  color?: "purple" | "emerald" | "amber" | "rose" | "cyan";
}

export interface ArrayVisualizerProps {
  /** The target array to render */
  data: number[];
  /** Pointers currently pointing to indices in the array */
  pointers?: Pointer[];
  /** Keep the last non-empty pointers and highlights visible until new ones are provided */
  keepPointers?: boolean;
  /** Highlighted indices (e.g. active comparison or read) */
  highlightedIndices?: number[];
  /** Render mode: horizontal cell sequence or vertical bar chart */
  mode?: "cells" | "bars";
  /** Max height for bars mode in pixels */
  maxBarHeight?: number;
  className?: string;
}

const POINTER_COLORS = {
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  amber: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  rose: "bg-rose-500/20 text-rose-300 border-rose-500/40",
  cyan: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
};

export function ArrayVisualizer({
  data = [],
  pointers = [],
  keepPointers = false,
  highlightedIndices = [],
  mode = "bars",
  maxBarHeight = 180,
  className = "",
}: ArrayVisualizerProps) {
  const maxVal = useMemo(() => Math.max(...data, 1), [data]);
  const [lastPointers, setLastPointers] = useState<Pointer[]>([]);
  const [lastHighlightedIndices, setLastHighlightedIndices] = useState<
    number[]
  >([]);

  if (keepPointers && pointers.length > 0 && pointers !== lastPointers) {
    setLastPointers(pointers);
  } else if (!keepPointers && lastPointers.length > 0) {
    setLastPointers([]);
  }

  if (
    keepPointers &&
    highlightedIndices.length > 0 &&
    highlightedIndices !== lastHighlightedIndices
  ) {
    setLastHighlightedIndices(highlightedIndices);
  } else if (!keepPointers && lastHighlightedIndices.length > 0) {
    setLastHighlightedIndices([]);
  }

  const displayedPointers =
    keepPointers && pointers.length === 0 ? lastPointers : pointers;
  const displayedHighlightedIndices =
    keepPointers && highlightedIndices.length === 0
      ? lastHighlightedIndices
      : highlightedIndices;

  const pointersByIndex = useMemo(() => {
    const map = new Map<number, Pointer[]>();
    displayedPointers.forEach((p) => {
      if (p.index >= 0 && p.index < data.length) {
        const existing = map.get(p.index) || [];
        map.set(p.index, [...existing, p]);
      }
    });
    return map;
  }, [displayedPointers, data.length]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-border/60 text-xs font-mono text-muted-foreground">
        No array data available
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full min-w-0 p-2 ${className}`}>
      <div className="flex items-end justify-center gap-1 sm:gap-2 w-full min-w-0 max-w-full pt-12">
        {data.map((value, idx) => {
          const isHighlighted = displayedHighlightedIndices.includes(idx);
          const attachedPointers = pointersByIndex.get(idx) || [];
          const barHeightPct = Math.max((value / maxVal) * 100, 10);

          return (
            <div
              key={idx}
              className="relative flex-1 min-w-0 max-w-11 flex flex-col items-center group"
            >
              {/* STACKED POINTER BADGES */}
              <div className="absolute -top-9 flex flex-col items-center gap-0.5 z-10 w-full min-w-0">
                <AnimatePresence>
                  {attachedPointers.map((pointer) => {
                    const colorStyle =
                      POINTER_COLORS[pointer.color || "purple"];
                    return (
                      <motion.div
                        key={pointer.name}
                        initial={{ opacity: 0, y: -6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-0.5 rounded px-1 py-0.2 font-mono text-[9px] font-bold uppercase shadow-xs truncate max-w-full ${colorStyle}`}
                      >
                        <span className="truncate">{pointer.name}</span>
                        <span className="text-[7px] opacity-70">↓</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* VISUAL ELEMENT (BAR OR CELL) */}
              {mode === "bars" ? (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{ height: `${(barHeightPct * maxBarHeight) / 100}px` }}
                  className={`relative flex w-full flex-col items-center justify-between rounded-md border p-0.5 transition-colors ${
                    isHighlighted
                      ? "border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/10"
                      : "border-border bg-muted hover:border-muted"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold text-foreground truncate">
                    {value}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex w-full aspect-square items-center justify-center rounded-md border font-mono text-xs font-bold transition-colors ${
                    isHighlighted
                      ? "border-purple-400 bg-purple-500/20 text-purple-200"
                      : "border-border/80 bg-zinc-900/90 text-zinc-200"
                  }`}
                >
                  <span className="truncate">{value}</span>
                </motion.div>
              )}

              {/* INDEX LABEL AT BOTTOM */}
              <span className="mt-1 font-mono text-[9px] text-muted-foreground truncate w-full text-center">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}