import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { RequestStartSessionOptions } from "@/app/types/api-types";
import type { Difficulty, Duration } from "@/features/interview/types";
import { isSupportedLanguage } from "@/features/code-editor/languages";
import type { ProblemDescription } from "@/features/interview/assessment/types";


const validDifficulties: Difficulty[] = ["Easy", "Medium", "Hard"];
const validDurations: Duration[] = [15, 30, 45, 60];
const validProblemCounts = [1, 2, 3];

function isDifficulty(value: unknown): value is Difficulty {
  return validDifficulties.some((difficulty) => difficulty === value);
}

function isValidRequestBody(body: unknown): body is RequestStartSessionOptions {
  return (
    typeof body === "object" &&
    body !== null &&
    "difficulties" in body &&
    Array.isArray(body.difficulties) &&
    body.difficulties.every(isDifficulty) &&
    "duration" in body &&
    validDurations.some((duration) => duration === body.duration) &&
    "problemCount" in body &&
    typeof body.problemCount === "number" &&
    validProblemCounts.includes(body.problemCount) &&
    "language" in body &&
    isSupportedLanguage(body.language)
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidRequestBody(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  const { difficulties, duration, problemCount, language } = body;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sessionData, error: sessionsError } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        status: "in_progress",
        difficulties: difficulties,
        duration: duration,
        problem_count: problemCount,
        language,
      })
      .select("id, difficulties")
      .single();

    if (sessionsError) {
      console.error("Failed to insert assessment session into Supabase:", {
        code: sessionsError.code,
        message: sessionsError.message,
        details: sessionsError.details,
        hint: sessionsError.hint,
      });

      return NextResponse.json(
        {
          error: {
            code: "INSERT_FAILED",
            message:
              "Failed to insert session metadata. Check the server logs for details.",
          },
        },
        { status: 500 },
      );
    }

    const { data: selectedProblems, error: problemError } = await supabase.rpc(
      "get_random_assessment_problems",
      {
        p_problem_limit: problemCount,
        p_difficulties: difficulties.length ? difficulties : null,
      },
    );

    if (problemError) {
      return NextResponse.json(
        {
          error: {
            code: "ASSESSMENT_PROBLEMS_ERROR",
            message: problemError,
          },
        },
        { status: 500 },
      );
    }

    if (!selectedProblems || selectedProblems.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "ASSESSMENT_PROBLEMS_ERROR",
            message: "No problems returned.",
          },
        },
        { status: 500 },
      );
    }

    const problems = selectedProblems as ProblemDescription[];

    const sessionProblemRows = problems.map((problem, index) => ({
      session_id: sessionData.id,
      problem_id: problem.id,
      problem_index: index + 1,
    }));

    const { error: insertError } = await supabase
      .from("session_problems")
      .insert(sessionProblemRows);

    if (insertError) {
      return NextResponse.json(
        {
          error: {
            code: "INSERT_ERROR",
            message: "Could not insert problem id's to database.",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        sessionId: sessionData.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected error while starting assessment session:", error);
    return NextResponse.json(
      {
        error: {
          code: "START_SESSION_FAILED",
          message: "Failed to start session.",
        },
      },
      { status: 500 },
    );
  }
}
