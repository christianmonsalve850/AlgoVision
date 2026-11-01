import AssessmentSession from "@/features/interview/assessment/components/AssessmentSession";
import type { Difficulty, Duration } from "@/features/interview/types";
import type {
  ProblemDescription,
  ProblemExample,
} from "@/features/interview/assessment/types";
import { createClient } from "@/lib/supabase/server";

type InterviewSessionProps = {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{
    duration?: string | string[];
    problemCount?: string | string[];
    difficulty?: string | string[];
  }>;
};

const validDurations: Duration[] = [15, 30, 45, 60];
const validProblemCounts = [1, 2, 3];
const validDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export default async function InterviewSessionPage({
  params,
  searchParams,
}: InterviewSessionProps) {
  const [
    { sessionId },
    {
      duration: durationParam,
      problemCount: problemCountParam,
      difficulty: difficultyParams,
    },
  ] = await Promise.all([params, searchParams]);
  const parsedDuration =
    typeof durationParam === "string" ? Number(durationParam) : NaN;
  const duration = validDurations.find((value) => value === parsedDuration) ?? 30;
  const parsedProblemCount =
    typeof problemCountParam === "string" ? Number(problemCountParam) : NaN;
  const problemCount =
    validProblemCounts.find((value) => value === parsedProblemCount) ?? 2;
  const requestedDifficulties =
    typeof difficultyParams === "string"
      ? [difficultyParams]
      : (difficultyParams ?? []);
  let selectedDifficulties: Difficulty[];

  if (requestedDifficulties.length === 0) {
    selectedDifficulties = ["Easy"];
  } else if (requestedDifficulties.includes("Random")) {
    selectedDifficulties = [];
  } else {
    selectedDifficulties = validDifficulties.filter((value) =>
      requestedDifficulties.includes(value),
    );
    if (selectedDifficulties.length === 0) {
      selectedDifficulties = ["Easy"];
    }
  }

  const supabase = await createClient();
  const { data: problemRows, error: problemError } = await supabase.rpc(
    "get_random_assessment_problems",
    {
      p_problem_limit: problemCount,
      p_difficulties: selectedDifficulties.length
        ? selectedDifficulties
        : null,
    },
  );

  if (problemError) {
    throw new Error("Failed to load assessment problems.", {
      cause: problemError,
    });
  }

  const untrustedProblemRows: unknown[] = problemRows ?? [];
  const typedProblems: Omit<ProblemDescription, "examples">[] =
    untrustedProblemRows.map((problem) => {
      if (
        typeof problem !== "object" ||
        problem === null ||
        Array.isArray(problem)
      ) {
        throw new Error("An assessment problem had an invalid format.");
      }

      const row = problem as Record<string, unknown>;
      const problemDifficulty =
        typeof row.difficulty === "string"
          ? validDifficulties.find((value) => value === row.difficulty)
          : undefined;

      if (
        typeof row.id !== "string" ||
        typeof row.title !== "string" ||
        typeof row.description !== "string" ||
        !problemDifficulty ||
        !Array.isArray(row.constraints) ||
        !row.constraints.every((constraint) => typeof constraint === "string")
      ) {
        throw new Error("An assessment problem had an invalid format.");
      }

      return {
        id: row.id,
        title: row.title,
        difficulty: problemDifficulty,
        description: row.description,
        constraints: row.constraints,
      } satisfies Omit<ProblemDescription, "examples">;
    });
  const problemIds = typedProblems.map((problem) => problem.id);

  let examplesByProblemId = new Map<string, ProblemExample[]>();

  if (problemIds.length > 0) {
    const { data: exampleRows, error: examplesError } = await supabase
      .from("problem_examples")
      .select("problem_id, example_number, input, output, explanation")
      .in("problem_id", problemIds)
      .order("example_number", { ascending: true });

    if (examplesError) {
      throw new Error("Failed to load assessment problem examples.", {
        cause: examplesError,
      });
    }

    examplesByProblemId = (exampleRows ?? []).reduce<
      Map<string, ProblemExample[]>
    >((examplesById, example) => {
      const problemExamples = examplesById.get(example.problem_id) ?? [];
      problemExamples.push({
        example_number: example.example_number,
        input: example.input,
        output: example.output,
        explanation: example.explanation,
      });
      examplesById.set(example.problem_id, problemExamples);
      return examplesById;
    }, new Map());
  }

  const problems: ProblemDescription[] = typedProblems.map((problem) => {
    return {
      ...problem,
      examples: examplesByProblemId.get(problem.id) ?? [],
    };
  });

  return (
    <AssessmentSession
      sessionId={sessionId}
      duration={duration}
      difficulties={selectedDifficulties}
      problems={problems}
    />
  );
}
