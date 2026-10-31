"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import type { Difficulty, Duration } from "@/features/interview/types";
import AssessmentBody from "@/features/interview/assessment/components/AssessmentBody";

type AssessmentSessionProps = {
  sessionId: string;
  duration: Duration;
  difficulty: Difficulty;
};

export default function AssessmentSession({
  sessionId,
  duration,
  difficulty,
}: AssessmentSessionProps) {
  const router = useRouter();
  const [quitOpen, setQuitOpen] = useState(false);

  return (
    <div
      data-session-id={sessionId}
      className="flex h-dvh min-h-0 flex-col overflow-hidden"
    >
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        initialTimeMinutes={duration}
        difficulty={difficulty}
      />
      <AssessmentBody />

      <QuitAssessmentModal
        open={quitOpen}
        onCancel={() => setQuitOpen(false)}
        onConfirm={() => router.replace("/interview")}
      />
    </div>
  );
}
