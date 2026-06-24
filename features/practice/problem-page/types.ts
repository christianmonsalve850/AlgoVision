export type PlaybackSpeed = 0.5 | 1 | 2 | 4;

export type PlaybackControlsProps = {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  onStepChange: (step: number) => void;
  onPlayPauseToggle: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
};