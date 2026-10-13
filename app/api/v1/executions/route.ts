import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UseCodeExecuterOptions } from "@/app/types/api-types";

function isExecutionRequest(value: unknown): value is UseCodeExecuterOptions {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const request = value as Record<string, unknown>;
  return (
    typeof request.problemId === "string" &&
    request.problemId.length > 0 &&
    typeof request.language === "string" &&
    request.language.length > 0 &&
    typeof request.sourceCode === "string" &&
    typeof request.mode === "string" &&
    request.mode.length > 0
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isExecutionRequest(body)) {
    return NextResponse.json(
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  const { problemId, language, sourceCode, mode } = body;

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Create initial "pending" entry in Supabase
  const { data: executionRequest, error: insertError } = await supabase
    .from('execution_requests')
    .insert({
      user_id: user.id,
      problem_id: problemId,
      language,
      status: 'pending',
      mode,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to insert execution request into Supabase", {
      code: insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint: insertError.hint,
    });

    return NextResponse.json(
      { error: "Failed to create execution record." },
      { status: 500 },
    );
  }

  return NextResponse.json(executionRequest, { status: 201 });
}
