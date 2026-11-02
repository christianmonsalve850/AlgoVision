import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type SessionRouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function PATCH(_request: Request, { params }: SessionRouteContext) {
  const { sessionId } = await params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session, error: updateError } = await supabase
      .from("sessions")
      .update({ status: "abandoned" })
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError?.code === "22P02") {
      return NextResponse.json({ error: "Assessment session not found." }, { status: 404 });
    }

    if (updateError) {
      console.error("Failed to abandon assessment session:", {
        code: updateError.code,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
      });

      return NextResponse.json(
        { error: "Failed to abandon assessment session." },
        { status: 500 },
      );
    }

    if (!session) {
      return NextResponse.json({ error: "Assessment session not found." }, { status: 404 });
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Unexpected error while abandoning assessment session:", error);
    return NextResponse.json(
      { error: "Failed to abandon assessment session." },
      { status: 500 },
    );
  }
}
