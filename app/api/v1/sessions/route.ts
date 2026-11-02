import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { RequestStartSessionOptions } from "@/app/types/api-types";
import type { Difficulty, Duration } from "@/features/interview/types";

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
    validProblemCounts.includes(body.problemCount)
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

  const { difficulties, duration, problemCount } = body;

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
      })
      .select("id")
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
