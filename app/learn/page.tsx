import { LessonShell } from "@/features/learn/components/lesson-shell";
import { createClient } from "@/lib/supabase/server";

export default async function Learn() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progress, error: progressError } = await supabase
    .from("user_lesson_progress_with_percentage")
    .select("lesson_id, progress_percentage")
    .eq("user_id", user?.id);

  if (progressError) {
    console.log(progressError);
  }

  const { data: lessons, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, steps, category, is_recommended")
    .order("title", { ascending: true });

  if (lessonError) {
    console.log(lessonError);
  }

  if (progressError) {
    console.log(progressError);
  }

  const progressMap = new Map(
    (progress ?? []).map((row) => [row.lesson_id, row.progress_percentage]),
  );

  const typedLessons = (lessons ?? []).map((lesson) => ({
    ...lesson,
    progress: progressMap.get(lesson.id).toFixed() ?? 0,
  }));

  return <LessonShell lessons={typedLessons} />;
}
