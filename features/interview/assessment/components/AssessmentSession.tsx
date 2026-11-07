"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import AssessmentBody from "@/features/interview/assessment/components/AssessmentBody";
import type { AssessmentSessionProps } from "@/features/interview/assessment/types";
import Footer from "@/features/interview/assessment/components/Footer";
import { requestAbandonSession } from "@/features/interview/services/request-abandon-session";

export default function AssessmentSession({
  sessionId,
  sessionStartDate,
  language,
  duration,
  difficulties,
  problems,
  starterCodeMaps,
}: AssessmentSessionProps) {
  const router = useRouter();
  const [quitOpen, setQuitOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [abandonError, setAbandonError] = useState<string | null>(null);
  const [runRequest, setRunRequest] = useState(0);
  const [isExecutionRunning, setIsExecutionRunning] = useState(false);

  const abandonAssessment = async () => {
    if (isAbandoning) {
      return;
    }

    setIsAbandoning(true);
    setAbandonError(null);

    try {
      await requestAbandonSession(sessionId);
      router.replace("/interview");
    } catch (error) {
      console.error("Failed to abandon assessment:", error);
      setAbandonError(
        error instanceof Error
          ? error.message
          : "Could not quit the assessment. Please try again.",
      );
      setIsAbandoning(false);
    }
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        initialTimeMinutes={duration}
        difficulties={difficulties}
        sessionStartDate={sessionStartDate}
      />
      <AssessmentBody
        sessionId={sessionId}
        language={language}
        problems={problems}
        currentProblemIndex={currentProblemIndex}
        starterCodeMaps={starterCodeMaps}
        runRequest={runRequest}
        onExecutionRunningChange={setIsExecutionRunning}
      />
      <Footer
        currentProblemIndex={currentProblemIndex}
        problemCount={problems.length}
        onProblemChange={setCurrentProblemIndex}
        onRun={() => setRunRequest((request) => request + 1)}
        isRunning={isExecutionRunning}
      />
      <QuitAssessmentModal
        open={quitOpen}
        onCancel={() => setQuitOpen(false)}
        onConfirm={abandonAssessment}
        isSubmitting={isAbandoning}
        error={abandonError}
      />
    </div>
  );
}
