import { LucideIcon } from "lucide-react";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface InterviewDifficultyProps {
    difficulty: Difficulty;
    subtext: string;
    selectedDifficulty: Difficulty;
    onSelectedDifficulty: () => void;
    difficultyColor?: string;
}
export type Duration = 15 | 30 | 45 | 60; // in minutes

export interface SelectDurationProps {
    icon: LucideIcon;
    duration: Duration;
    selectedDuration: Duration;
    onSelectedDuration: () => void;
}

export interface ReadyToStartProps {
    difficulty: Difficulty,
    duration: Duration,
    onStartAssesment?: () => void;
}