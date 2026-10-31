
import type { Difficulty } from "@/features/interview/types";

export interface AssessmentNavProps {
    onQuitOpen: () => void;
    initialTimeMinutes: number;
    difficulty: Difficulty;
}