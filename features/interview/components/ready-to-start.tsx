"use client";

import type { ReadyToStartProps } from "@/features/interview/types";
import { CirclePlay } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestStartSession } from "@/features/interview/services/request-start-session";

export default function ReadyToStart({
  difficulties,
  duration,
  problemCount,
}: ReadyToStartProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const difficultyLabel =
    difficulties.length === 0 ? "Random difficulty" : difficulties.join(" + ");

  const startAssessment = async () => {
    if (isStarting) {
      return;
    }

    setIsStarting(true);
    setStartError(null);

    try {
      const { sessionId } = await requestStartSession({
        difficulties,
        duration,
        problemCount,
      });

      router.replace(`/interview/${encodeURIComponent(sessionId)}`);
    } catch (error) {
      console.error("Failed to start assessment session:", error);
      setStartError(
        error instanceof Error
          ? error.message
          : "Could not start the assessment. Please try again.",
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg p-6 bg-muted">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Ready to Start?
        </h2>
        <p className="text-sm text-muted-foreground">
          {difficultyLabel} · {duration} minutes · {problemCount}{" "}
          {problemCount === 1 ? "problem" : "problems"}
        </p>
      </div>
      <button
        type="button"
        disabled={isStarting}
        aria-busy={isStarting}
        className="flex gap-2 items-center justify-center text-background bg-foreground rounded-lg p-4 hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all duration-150 font-semibold"
        onClick={startAssessment}
      >
        <CirclePlay aria-hidden="true" />
        <span>{isStarting ? "Starting..." : "Start Assessment"}</span>
      </button>
      {startError && (
        <p role="alert" className="text-sm text-destructive">
          {startError}
        </p>
      )}
    </div>
  );
}
