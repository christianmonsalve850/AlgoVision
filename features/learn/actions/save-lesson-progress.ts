'use server'

import { createClient } from "@/lib/supabase/server";
import { SaveLessonProgressOptions } from "@/features/learn/types";

export async function saveLessonProgress({
  lessonId,
  currentStep,
  completed,
}: SaveLessonProgressOptions): Promise<void> {

  if (
    !lessonId ||
    !Number.isInteger(currentStep) ||
    currentStep < 1 ||
    typeof completed !== "boolean"
  ) {
    throw new Error("Invalid lesson progress.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to verify the current user: ${userError.message}`);
  }

  if (!user) {
    throw new Error("Please sign in to save lesson progress.");
  }

  const { error } = await supabase.from("user_lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      current_lesson_step: currentStep,
      completed,
      updated_at: new Date().toISOString(),
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: "user_id, lesson_id" },
  );

  if (error) {
    throw new Error(`Failed to save lesson progress: ${error.message}`);
  }
}
