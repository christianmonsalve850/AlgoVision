import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SessionRouteContext = {
  params: Promise<{ sessionId: string }>;
};

function isSessionStatus(
  value: unknown,
): value is "abandoned" | "timed_out" {
  return value === "abandoned" || value === "timed_out";
}

export async function PATCH(request: Request, { params }: SessionRouteContext) {
  const { sessionId } = await params;

  try {
    const requestBody = await request.text();
    let status: "abandoned" | "timed_out" = "abandoned";

    if (requestBody.length > 0) {
      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(requestBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }

      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        !("status" in parsedBody) ||
        !isSessionStatus(parsedBody.status)
      ) {
        return NextResponse.json(
          { error: "Missing or invalid session status." },
          { status: 400 },
        );
      }
      status = parsedBody.status;
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (status === "timed_out") {
      const { data: currentSession, error: lookupError } = await supabase
        .from("sessions")
        .select("id, status, started_at, duration")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (lookupError?.code === "22P02") {
        return NextResponse.json(
          { error: "Assessment session not found." },
          { status: 404 },
        );
      }

      if (lookupError) {
        console.error("Failed to load assessment session timeout:", {
          code: lookupError.code,
          message: lookupError.message,
          details: lookupError.details,
          hint: lookupError.hint,
        });
        return NextResponse.json(
          { error: "Failed to update assessment session status." },
          { status: 500 },
        );
      }

      if (!currentSession) {
        return NextResponse.json(
          { error: "Assessment session not found." },
          { status: 404 },
        );
      }

      if (currentSession.status === "timed_out") {
        return NextResponse.json({ sessionId: currentSession.id });
      }

      const startTime = Date.parse(currentSession.started_at);
      const durationMinutes = Number(currentSession.duration);
      const expiryTime = startTime + durationMinutes * 60_000;

      if (
        currentSession.status !== "in_progress" ||
        !Number.isFinite(startTime) ||
        !Number.isFinite(durationMinutes) ||
        durationMinutes <= 0 ||
        Date.now() < expiryTime
      ) {
        return NextResponse.json(
          { error: "Assessment session has not timed out." },
          { status: 409 },
        );
      }
    }

    const { data: session, error: updateError } = await supabase
      .from("sessions")
      .update({ status })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .eq("status", "in_progress")
      .select("id")
      .maybeSingle();

    if (updateError?.code === "22P02") {
      return NextResponse.json({ error: "Assessment session not found." }, { status: 404 });
    }

    if (updateError) {
      console.error(`Failed to mark assessment session as ${status}:`, {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });

      return NextResponse.json(
        { error: `Failed to mark assessment session as ${status}.` },
        { status: 500 },
      );
    }

    if (!session) {
      if (status === "timed_out") {
        const { data: currentSession, error: lookupError } = await supabase
          .from("sessions")
          .select("id, status")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (lookupError) {
          console.error("Failed to verify assessment session status:", {
            code: lookupError.code,
            message: lookupError.message,
            details: lookupError.details,
            hint: lookupError.hint,
          });
          return NextResponse.json(
            { error: "Failed to update assessment session status." },
            { status: 500 },
          );
        }

        if (currentSession?.status === "timed_out") {
          return NextResponse.json({ sessionId: currentSession.id });
        }
      }
      return NextResponse.json(
        { error: "Assessment session not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Unexpected error while updating assessment session:", error);
    return NextResponse.json(
      { error: "Failed to update assessment session status." },
      { status: 500 },
    );
  }
}
