import clsx from "clsx";

export type Difficulty = "Easy" | "Medium" | "Hard";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

const difficultyClasses: Record<
  Difficulty,
  { background: string; foreground: string; border: string }
> = {
  Easy: {
    background: "bg-difficulty-easy",
    foreground: "text-difficulty-easy-foreground",
    border: "border-difficulty-easy-border",
  },
  Medium: {
    background: "bg-difficulty-medium",
    foreground: "text-difficulty-medium-foreground",
    border: "border-difficulty-medium-border",
  },
  Hard: {
    background: "bg-difficulty-hard",
    foreground: "text-difficulty-hard-foreground",
    border: "border-difficulty-hard-border",
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const styles = difficultyClasses[difficulty];

  return (
    <span
      className={clsx(
        "inline-flex w-16 items-center justify-center truncate rounded-full border px-2 py-0.5 text-center text-xs font-semibold",
        styles.background,
        styles.foreground,
        styles.border
      )}
    >
      {difficulty}
    </span>
  );
}
