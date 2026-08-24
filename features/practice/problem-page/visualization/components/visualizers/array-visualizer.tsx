
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

  // Group pointers by index so multiple pointers pointing to the same element stack cleanly
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
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      {/* ARRAY CONTAINER */}
      <div className="flex items-end justify-center gap-2.5 sm:gap-3.5">
        {data.map((value, idx) => {
          const isHighlighted = displayedHighlightedIndices.includes(idx);
          const attachedPointers = pointersByIndex.get(idx) || [];
          const barHeightPct = Math.max((value / maxVal) * 100, 10);

          return (
            <div key={idx} className="relative flex flex-col items-center group">
              {/* STACKED POINTER BADGES ABOVE ELEMENT */}
              <div className="absolute -top-10 flex flex-col items-center gap-1 z-10">
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
                        className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase shadow-xs ${colorStyle}`}
                      >
                        <span>{pointer.name}</span>
                        <span className="text-[8px] opacity-70">↓</span>
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
                  className={`relative flex w-9 sm:w-11 flex-col items-center justify-between rounded-lg border p-1 transition-colors ${
                    isHighlighted
                      ? "border-purple-400 bg-purple-500/20 shadow-md shadow-purple-500/10"
                      : "border-border/80 bg-zinc-900/90 hover:border-zinc-700"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-zinc-100">
                    {value}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex size-11 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors ${
                    isHighlighted
                      ? "border-purple-400 bg-purple-500/20 text-purple-200"
                      : "border-border/80 bg-zinc-900/90 text-zinc-200"
                  }`}
                >
                  {value}
                </motion.div>
              )}

              {/* INDEX LABEL AT BOTTOM */}
              <span className="mt-2 font-mono text-[10px] text-zinc-500">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
