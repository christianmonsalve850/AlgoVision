"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEditorSettings } from "@/components/code-editor/hooks/use-editor-settings";
import { AssessmentNav } from "@/features/interview/assessment/components/AssessmentNav";
import QuitAssessmentModal from "@/features/interview/assessment/components/QuitAssessmentModal";
import FinishAssessmentModal from "@/features/interview/assessment/components/FinishAssessmentModal";
import AssessmentBody from "@/features/interview/assessment/components/AssessmentBody";
import type { AssessmentSessionProps } from "@/features/interview/assessment/types";
import Footer from "@/features/interview/assessment/components/Footer";
import {
  requestAbandonSession,
  requestTimeoutSession,
} from "@/features/interview/services/request-abandon-session";
import EditorSettingsModal from "@/components/code-editor/EditorSettingsModal";
import { useProblemSubmitter } from "@/features/interview/assessment/hooks/use-problem-submitter";
import type { ExecutionStatus } from "@/features/practice/problem-page/types";
import { useAssessmentEditor } from "@/features/interview/assessment/hooks/use-assessment-editor";
import { SubmissionOverlay } from "@/features/practice/problem-page/code-editor/components/submission-overlay";

const EMPTY_STARTER_CODE_MAP = {};

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
  const [finishOpen, setFinishOpen] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isAbandoning, setIsAbandoning] = useState(false);
  const [abandonError, setAbandonError] = useState<string | null>(null);
  const [runRequest, setRunRequest] = useState(0);
  const [isExecutionRunning, setIsExecutionRunning] = useState(false);
  const [executionStatus, setExecutionStatus] =
    useState<ExecutionStatus>("idle");
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [submissionRefreshKey, setSubmissionRefreshKey] = useState(0);

  const currentProblem = problems[currentProblemIndex];
  const {
    code,
    handleReset,
    handleEditorChange,
  } = useAssessmentEditor({
    sessionId,
    problemId: currentProblem?.id ?? "",
    language,
    starterCodeMap: currentProblem
      ? starterCodeMaps[currentProblem.id] ?? EMPTY_STARTER_CODE_MAP
      : EMPTY_STARTER_CODE_MAP,
  });

  const { submit } = useProblemSubmitter({
    sessionId,
    problemOrderIndex: currentProblemIndex,
    problemId: currentProblem?.id ?? "",
    language,
    code,
    setExecutionStatus,
    onSubmitStart: () => {
      setSubmissionStatus(null);
    },
    onSubmitEnd: (result) => {
      setSubmissionStatus(result.success ? "success" : "failure");
      if (result.recorded) {
        setSubmissionRefreshKey((key) => key + 1);
      }
    },
  });

  useEffect(() => {
    if (submissionRefreshKey > 0) {
      router.refresh();
    }
  }, [router, submissionRefreshKey]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    settings: editorSettings,
    setFontSize,
    setMinimapEnabled,
    setLineNumbersEnabled,
    setWordWrapEnabled,
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
      <SubmissionOverlay
        status={submissionStatus}
        onClose={() => setSubmissionStatus(null)}
        durationMs={2000}
      />
      <AssessmentNav
        onQuitOpen={() => setQuitOpen(true)}
        onFinishOpen={() => setFinishOpen(true)}
        initialTimeMinutes={duration}
        difficulties={difficulties}
        sessionStartDate={sessionStartDate}
        onExpire={timeoutAssessment}
      />
      <AssessmentBody
        language={language}
        problems={problems}
        currentProblemIndex={currentProblemIndex}
        code={code}
        onCodeChange={handleEditorChange}
        onCodeReset={handleReset}
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
        onSubmit={() => void submit()}
        isRunning={isExecutionRunning}
        isSubmitting={executionStatus === "submitting"}
      />
      <QuitAssessmentModal
        open={quitOpen}
        onCancel={() => setQuitOpen(false)}
        onConfirm={abandonAssessment}
        isSubmitting={isAbandoning}
        error={abandonError}
      />
      <FinishAssessmentModal
        open={finishOpen}
        problemCount={problems.length}
        onCancel={() => setFinishOpen(false)}
        onConfirm={() => router.replace("/interview")}
      />
      <EditorSettingsModal
        open={settingsOpen}
        mode="interview"
        fontSize={editorSettings.fontSize}
        onFontSizeChange={setFontSize}
        minimapEnabled={editorSettings.minimapEnabled}
        onMinimapChange={setMinimapEnabled}
        lineNumbersEnabled={editorSettings.lineNumbersEnabled}
        onLineNumbersChange={setLineNumbersEnabled}
        wordWrapEnabled={editorSettings.wordWrapEnabled}
        onWordWrapChange={setWordWrapEnabled}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
