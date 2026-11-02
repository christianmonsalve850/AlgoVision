import AssessmentSession from "@/features/interview/assessment/components/AssessmentSession";
import type { Difficulty, Duration } from "@/features/interview/types";
import type {
  ProblemDescription,
  ProblemExample,
} from "@/features/interview/assessment/types";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { StarterCodeMap } from "@/features/practice/problem-page/problem/types";
import { isSupportedLanguage } from "@/features/code-editor/languages";

type InterviewSessionProps = {
  params: Promise<{ sessionId: string }>;
};

const validDurations: Duration[] = [15, 30, 45, 60];
const validProblemCounts = [1, 2, 3];
const validDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

function isDifficulty(value: unknown): value is Difficulty {
  return validDifficulties.some((difficulty) => difficulty === value);
}

function parseDifficulties(value: unknown): Difficulty[] | null {
  let parsedValue = value;

  if (typeof parsedValue === "string") {
    try {
      parsedValue = JSON.parse(parsedValue);
    } catch {
      return null;
    }
  }

  if (parsedValue === null) {
    return [];
  }

  if (Array.isArray(parsedValue) && parsedValue.every(isDifficulty)) {
    return parsedValue;
  }

  return null;
}

export default async function InterviewSessionPage({
  params,
}: InterviewSessionProps) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("Failed to verify assessment session access.", {
      cause: userError,
    });
  }

  if (!user) {
    notFound();
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, duration, difficulties, problem_count, started_at, language")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (sessionError?.code === "22P02") {
    notFound();
  }

  if (sessionError) {
    throw new Error("Failed to load assessment session.", {
      cause: sessionError,
    });
  }

  if (!session) {
    notFound();
  }

  const storedDuration =
    typeof session.duration === "string"
      ? Number(session.duration)
      : session.duration;

  const storedProblemCount =
    typeof session.problem_count === "string"
      ? Number(session.problem_count)
      : session.problem_count;

  const duration = validDurations.find((value) => value === storedDuration);

  const problemCount = validProblemCounts.find(
    (value) => value === storedProblemCount,
  );

  const selectedDifficulties = parseDifficulties(session.difficulties);
  const language = isSupportedLanguage(session.language)
    ? session.language
    : null;

  if (!duration || !problemCount || selectedDifficulties === null || !language) {
    const invalidFields = [
      !duration ? `duration=${JSON.stringify(session.duration)}` : null,
      !problemCount
        ? `problem_count=${JSON.stringify(session.problem_count)}`
        : null,
      selectedDifficulties === null
        ? `difficulties=${JSON.stringify(session.difficulties)}`
        : null,
      !language ? `language=${JSON.stringify(session.language)}` : null,
    ].filter((field): field is string => field !== null);
    const details = `Invalid assessment session configuration: ${invalidFields.join(", ")}`;

    console.error(details);
    throw new Error(details);
  }

  const { data: sessionProblemRows, error: sessionProblemsError } =
    await supabase
      .from("session_problems")
      .select("problem_id, problem_index")
      .eq("session_id", session.id)
      .order("problem_index", { ascending: true });

  if (sessionProblemsError) {
    throw new Error("Failed to load persisted assessment problems.", {
      cause: sessionProblemsError,
    });
  }

  if (!sessionProblemRows?.length) {
    throw new Error("Assessment session has no persisted problems.");
  }

  if (sessionProblemRows.length !== problemCount) {
    throw new Error("Assessment session problem count does not match its saved configuration.");
  }

  const problemIds = sessionProblemRows.map((row) => row.problem_id);
  const { data: problemRows, error: problemError } = await supabase
    .from("problems")
    .select("id, title, description, difficulty, constraints")
    .in("id", problemIds);

  if (problemError) {
    throw new Error("Failed to load persisted assessment problem details.", {
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
  const problemsById = new Map(
    typedProblems.map((problem) => [problem.id, problem]),
  );
  const orderedProblems = sessionProblemRows.map((sessionProblem) => {
    const problem = problemsById.get(sessionProblem.problem_id);

    if (!problem) {
      throw new Error(
        `Persisted assessment problem ${sessionProblem.problem_id} could not be found.`,
      );
    }

    return problem;
  });
  const orderedProblemIds = orderedProblems.map((problem) => problem.id);

  let examplesByProblemId = new Map<string, ProblemExample[]>();

  if (orderedProblemIds.length > 0) {
    const { data: exampleRows, error: examplesError } = await supabase
      .from("problem_examples")
      .select("problem_id, example_number, input, output, explanation")
      .in("problem_id", orderedProblemIds)
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

  const problems: ProblemDescription[] = orderedProblems.map((problem) => {
    return {
      ...problem,
      examples: examplesByProblemId.get(problem.id) ?? [],
    };
  });

  const { data: starterCodeRows, error: starterCodeError } = await supabase
    .from("problem_starter_code")
    .select("problem_id, starter_code")
    .in("problem_id", orderedProblemIds)
    .eq("language", language);

  if (starterCodeError) {
    throw new Error("Failed to load assessment starter code.", {
      cause: starterCodeError,
    });
  }

  const starterCodeMaps: Record<string, StarterCodeMap> = {};

  for (const row of starterCodeRows ?? []) {
    starterCodeMaps[row.problem_id] = {
      [language]: row.starter_code.replace(/\\n/g, "\n"),
    };
  }

  const sessionStartDate = session.started_at;

  return (
    <AssessmentSession
      sessionId={sessionId}
      sessionStartDate={sessionStartDate}
      language={language}
      duration={duration}
      difficulties={selectedDifficulties}
      problems={problems}
      starterCodeMaps={starterCodeMaps}
    />
  );
}
