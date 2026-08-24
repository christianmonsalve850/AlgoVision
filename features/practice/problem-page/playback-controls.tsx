"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Gauge,
  ChevronUp,
} from "lucide-react";

import type {
  PlaybackControlsProps,
  PlaybackSpeed,
} from "@/features/practice/problem-page/types";

export function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  isDisabled,
  speed,
  onStepChange,
  onPlayPauseToggle,
  onSpeedChange,
}: PlaybackControlsProps) {
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState(false);
  const speeds: PlaybackSpeed[] = [0.5, 1, 2, 4];

  const progressPercent =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="relative flex h-14 items-center justify-between bg-background px-6 py-3 border-t border-border select-none">
      {/* LEFT: STEP COUNTER METADATA */}
      <div className="flex w-32 items-center gap-2 font-mono text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          Step {currentStep}
        </span>
        <span className="text-zinc-800">/</span>
        <span>{totalSteps}</span>
      </div>

      {/* CENTER: PRIMARY TIMELINE SCRUBBER & MEDIA ACTIONS */}
      <div className="flex flex-1 max-w-2xl items-center gap-6 mx-8">
        {/* MEDIA BUTTON GROUP */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            disabled={currentStep <= 1}
            onClick={() => onStepChange(1)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            title="Rewind to Start"
          >
            <SkipBack className="size-4 fill-current" />
          </button>

          <button
            type="button"
            onClick={onPlayPauseToggle}
            disabled={isDisabled}
            className="flex size-8 items-center justify-center rounded-full bg-foreground text-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:scale-100"
            title={isPlaying ? "Pause Execution" : "Play Execution"}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current text-background" />
            ) : (
              <Play className="size-4 fill-current text-background ml-0.5" />
            )}
          </button>

          <button
            type="button"
            disabled={currentStep >= totalSteps}
            onClick={() => onStepChange(totalSteps)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            title="Fast Forward to End"
          >
            <SkipForward className="size-4 fill-current" />
          </button>
        </div>

        {/* TIMELINE SLIDER (SCRUBBER) */}
        <div className="relative flex flex-1 items-center">
          <input
            type="range"
            min={1}
            max={totalSteps || 1}
            value={currentStep}
            onChange={(e) => onStepChange(Number(e.target.value))}
            className="h-1 w-full cursor-pointer bg-muted-foreground appearance-none rounded-lg accent-foreground outline-none transition-all focus-visible:ring-1 focus-visible:ring-ring"
            style={
              {
                background: ` ${progressPercent}%, #27272a ${progressPercent}%)`,
                "--tw-content-color": "#a1a1aa",
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {/* RIGHT: SPEED MODIFIER DRAWER */}
      <div className="relative w-32 flex justify-end">
        <button
          type="button"
          onClick={() => setIsSpeedMenuOpen(!isSpeedMenuOpen)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium font-mono transition-colors ${
            isSpeedMenuOpen
              ? "border-foreground bg-background  text-foreground"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Gauge className="size-3.5" />
          <span>{speed}x</span>
          <ChevronUp
            className={`size-3 transition-transform duration-200 ${isSpeedMenuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* FLOATING SPEED SELECTOR POPUP MENU */}
        {isSpeedMenuOpen && (
          <>
            {/* Click-away overlay backdrop anchor */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsSpeedMenuOpen(false)}
            />

            <div className="absolute bottom-full right-0 z-50 mb-2 w-24 rounded-lg border border-border bg-background p-1 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-forgeround">
                Speed
              </div>
              {speeds.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onSpeedChange(s);
                    setIsSpeedMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-mono text-xs transition-colors ${
                    speed === s
                      ? "bg-background font-semibold text-foreground"
                      : "text-foreground hover:bg-background-muted"
                  }`}
                >
                  <span>{s}x</span>
                  {speed === s && (
                    <span className="size-1 rounded-full bg-background" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
