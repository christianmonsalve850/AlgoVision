"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import type { Difficulty, Duration } from "@/features/interview/types";

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
    <div data-session-id={sessionId}>
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        initialTimeMinutes={duration}
        difficulty={difficulty}
      />

      <QuitAssessmentModal
        open={quitOpen}
        onCancel={() => setQuitOpen(false)}
        onConfirm={() => router.replace("/interview")}
      />
    </div>
  );
}
