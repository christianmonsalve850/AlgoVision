"use client";

import { ProblemEditorPanel } from "@/features/practice/problem-page/code-editor/components/problem-editor-panel";
import { ProblemSidebar } from "@/features/practice/problem-page/problem/components/problem-sidebar";
import { ProblemVisualizationPanel } from "@/features/practice/problem-page/visualization/components/common/problem-visualization-panel";
import type { ProblemPageData } from "@/features/practice/problem-page/problem/types";
import { PlaybackControls } from "@/features/practice/problem-page/playback-controls";
import type { PlaybackSpeed } from "@/features/practice/problem-page/types";
import { filterUserTrace } from "@/features/practice/problem-page/visualization/utils";
import { useTraceStore } from "@/features/practice/problem-page/stores/use-trace-store";
import { useEffect, useState } from "react";

export function ProblemPageShell({
  problem,
  examples,
  starterCodeMap,
}: ProblemPageData) {
  const trace = filterUserTrace(useTraceStore((state) => state.trace));
  const currentStepIndex = useTraceStore((state) => state.currentStepIndex);
  const setCurrentStepIndex = useTraceStore(
    (state) => state.setCurrentStepIndex,
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);

  const lastStepIndex = trace.length - 1;
  const isAtEnd = trace.length === 0 || currentStepIndex >= lastStepIndex;
  
  const isDisabled = isAtEnd;

  useEffect(() => {
    if (isAtEnd && isPlaying) {
      setIsPlaying(false);
    }
  }, [isAtEnd, isPlaying]);

  useEffect(() => {
    if (!isPlaying || isAtEnd) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= lastStepIndex) {
          setIsPlaying(false);
          return lastStepIndex;
        }
        return next;
      });
    }, 1000 / speed);

    return () => window.clearInterval(intervalId);
  }, [isPlaying, isAtEnd, lastStepIndex, speed, setCurrentStepIndex]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <div className="grid min-h-0 flex-1 grid-cols-12 bg-background">
        <ProblemSidebar problem={problem} examples={examples} />
        <ProblemEditorPanel
          problem_id={problem.id}
          starterCodeMap={starterCodeMap}
        />
        <ProblemVisualizationPanel />
      </div>
      <PlaybackControls
        currentStep={currentStepIndex + 1}
        totalSteps={trace.length}
        isPlaying={isPlaying && !isDisabled}
        isDisabled={isDisabled}
        speed={speed}
        onStepChange={(step) => setCurrentStepIndex(step - 1)}
        onPlayPauseToggle={() => setIsPlaying((playing) => !playing)}
        onSpeedChange={setSpeed}
      />
    </div>
  );
}