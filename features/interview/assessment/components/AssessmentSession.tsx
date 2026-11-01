"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import AssessmentBody from "@/features/interview/assessment/components/AssessmentBody";
import type { AssessmentSessionProps } from "@/features/interview/assessment/types";
import Footer from "@/features/interview/assessment/components/Footer";

export default function AssessmentSession({
  sessionId,
  duration,
  difficulties,
  problems,
}: AssessmentSessionProps) {
  const router = useRouter();
  const [quitOpen, setQuitOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  return (
    <div
      data-session-id={sessionId}
      className="flex h-dvh min-h-0 flex-col overflow-hidden"
    >
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        initialTimeMinutes={duration}
        difficulties={difficulties}
      />
      <AssessmentBody
        problems={problems}
        currentProblemIndex={currentProblemIndex}
      />
      <Footer
        currentProblemIndex={currentProblemIndex}
        problemCount={problems.length}
        onProblemChange={setCurrentProblemIndex}
      />
      <QuitAssessmentModal
        open={quitOpen}
        onCancel={() => setQuitOpen(false)}
        onConfirm={() => router.replace("/interview")}
      />
    </div>
  );
}
