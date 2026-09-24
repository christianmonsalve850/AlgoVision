import { Language } from "@/features/practice/problem-page/code-editor/types";
import { StarterCodeMap } from "@/features/practice/problem-page/code-editor/types";
export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export type PlaybackControlsProps = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isDisabled: boolean;
  speed: PlaybackSpeed;
  onStepChange: (step: number) => void;
  onPlayPauseToggle: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
};

export interface UseCodeEditorReturn {
  code: string;
  language: Language;
  setLanguage: (newLang: Language) => void;
  handleReset: () => void;
  handleEditorChange: (value: string | undefined) => void;
}

export interface UseCodeEditorOptions {
  problemId: string;
  starterCodeMap: StarterCodeMap;
  defaultLanguage?: Language;
}