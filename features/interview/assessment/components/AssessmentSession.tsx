"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditorSettings } from "@/components/code-editor/hooks/use-editor-settings";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import AssessmentBody from "@/features/interview/assessment/components/AssessmentBody";
import type { AssessmentSessionProps } from "@/features/interview/assessment/types";
import Footer from "@/features/interview/assessment/components/Footer";
import {
  requestAbandonSession,
  requestTimeoutSession,
} from "@/features/interview/services/request-abandon-session";
import SettingsModal from "@/features/interview/assessment/components/SettingsModal";

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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    settings: editorSettings,
    setFontSize,
    setMinimapEnabled,
    setLineNumbersEnabled,
    setTabSize,
  } = useEditorSettings();

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

  const timeoutAssessment = useCallback(async () => {
    try {
      await requestTimeoutSession(sessionId);
    } catch (error) {
      console.error("Failed to mark assessment session as timed out:", error);
    }
  }, [sessionId]);

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        initialTimeMinutes={duration}
        difficulties={difficulties}
        sessionStartDate={sessionStartDate}
        onExpire={timeoutAssessment}
      />
      <AssessmentBody
        sessionId={sessionId}
        language={language}
        problems={problems}
        currentProblemIndex={currentProblemIndex}
        starterCodeMaps={starterCodeMaps}
        editorSettings={editorSettings}
        runRequest={runRequest}
        onExecutionRunningChange={setIsExecutionRunning}
        onSettingsOpen={() => setSettingsOpen(true)}
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
      <SettingsModal
        open={settingsOpen}
        fontSize={editorSettings.fontSize}
        onFontSizeChange={setFontSize}
        minimapEnabled={editorSettings.minimapEnabled}
        onMinimapChange={setMinimapEnabled}
        lineNumbersEnabled={editorSettings.lineNumbersEnabled}
        onLineNumbersChange={setLineNumbersEnabled}
        tabSize={editorSettings.tabSize}
        onTabSizeChange={setTabSize}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
