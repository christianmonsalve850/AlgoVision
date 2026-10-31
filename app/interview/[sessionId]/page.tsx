import AssessmentSession from "@/features/interview/assessment/components/AssessmentSession";
import type { Difficulty, Duration } from "@/features/interview/types";

type InterviewSessionProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{
    duration?: string | string[];
    difficulty?: string | string[];
  }>;
};

const validDurations: Duration[] = [15, 30, 45, 60];
const validDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export default async function InterviewSessionPage({
  params,
  searchParams,
}: InterviewSessionProps) {
  const [
    { sessionId },
    { duration: durationParam, difficulty: difficultyParam },
  ] = await Promise.all([params, searchParams]);
  const parsedDuration =
    typeof durationParam === "string" ? Number(durationParam) : NaN;
  const duration = validDurations.find((value) => value === parsedDuration) ?? 30;
  const difficulty =
    typeof difficultyParam === "string"
      ? validDifficulties.find((value) => value === difficultyParam) ?? "Easy"
      : "Easy";

  return (
    <AssessmentSession
      sessionId={sessionId}
      duration={duration}
      difficulty={difficulty}
    />
  );
}
