"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(13);
  const [minimapEnabled, setMinimapEnabled] = useState(false);
  const [lineNumbersEnabled, setLineNumbersEnabled] = useState(true);
  const [tabSize, setTabSize] = useState<2 | 4>(4);

  useEffect(() => {
    const saved = Number(localStorage.getItem("algovision:editor-font-size"));
    setEditorFontSize(saved >= 11 && saved <= 20 ? saved : 13);
    setMinimapEnabled(
      localStorage.getItem("algovision:editor-minimap") === "true",
    );
    setLineNumbersEnabled(
      localStorage.getItem("algovision:editor-line-numbers") !== "false",
    );
    setTabSize(
      localStorage.getItem("algovision:editor-tab-size") === "2" ? 2 : 4,
    );
    setSettingsLoaded(true);
  }, []);

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

  useEffect(() => {
    if (!settingsLoaded) {
      return;
    }

    localStorage.setItem("algovision:editor-font-size", String(editorFontSize));
    localStorage.setItem("algovision:editor-minimap", String(minimapEnabled));
    localStorage.setItem(
      "algovision:editor-line-numbers",
      String(lineNumbersEnabled),
    );
    localStorage.setItem("algovision:editor-tab-size", String(tabSize));
  }, [
    editorFontSize,
    lineNumbersEnabled,
    minimapEnabled,
    settingsLoaded,
    tabSize,
  ]);

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
        fontSize={editorFontSize}
        onFontSizeChange={setEditorFontSize}
        minimapEnabled={minimapEnabled}
        onMinimapChange={setMinimapEnabled}
        lineNumbersEnabled={lineNumbersEnabled}
        onLineNumbersChange={setLineNumbersEnabled}
        tabSize={tabSize}
        onTabSizeChange={setTabSize}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
