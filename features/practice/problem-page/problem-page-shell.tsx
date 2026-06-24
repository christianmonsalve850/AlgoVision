'use client'

import { ProblemEditorPanel } from "./code-editor/components/problem-editor-panel";
import { ProblemSidebar } from "./problem/components/problem-sidebar";
import { ProblemVisualizationPanel } from "./visualization/components/problem-visualization-panel";
import type { ProblemPageData } from "./problem/types";
import { PlaybackControls } from "./playback-controls";

export function ProblemPageShell({ problem, examples, starterCodeMap }: ProblemPageData) {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <div className="grid min-h-0 flex-1 grid-cols-12 bg-background">
        <ProblemSidebar problem={problem} examples={examples} />
        <ProblemEditorPanel problem_id={problem.id} starterCodeMap={starterCodeMap} />
        <ProblemVisualizationPanel />
      </div>
      <PlaybackControls 
        currentStep={1} 
        totalSteps={14} 
        isPlaying={false} 
        speed={1} 
        onStepChange={() => console.log()} 
        onPlayPauseToggle={() => console.log()}
        onSpeedChange={() => console.log()} 
      />
    </div>
    
  );
}
