import { InterviewDifficultyProps } from "@/features/interview/types";

export default function InterviewDifficulty({
  difficulty,
  subtext,
  selectedDifficulty,
  onSelectedDifficulty,
  difficultyColor,
}: InterviewDifficultyProps) {
  return (
    <button
      className={`flex flex-col border-2 bg-background rounded-lg p-5 gap-2 text-start ${
        selectedDifficulty === difficulty
          ? "border-foreground"
          : "border-border"
      }`}
      onClick={onSelectedDifficulty}
    >
      <h2
        className={`text-xl font-semibold tracking-tight ${difficultyColor ?? "text-foreground"}`}
      >
        {difficulty}
      </h2>
      <p className="text-sm text-muted-foreground">{subtext}</p>
    </button>
  );
}
