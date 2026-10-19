
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LessonMdxSteps from '@/features/learn/components/lesson-mdx-steps';

interface LessonPageProps {
  params: Promise<{ title: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { title } = await params;
  const originalTitle = title
    .toString()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  const supabase = await createClient();

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select()
    .eq('title', originalTitle)
    .single();

  if (lessonError) {
    console.log(lessonError);
  }
  
  if (!lesson) {
    notFound();
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to load the current user: ${userError.message}`);
  }

  let currentLessonStep = 1;

  if (user) {
    const { data: progress, error: progressError } = await supabase
      .from('user_lesson_progress')
      .select('current_lesson_step')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle();

    if (progressError) {
      throw new Error(`Failed to load lesson progress: ${progressError.message}`);
    }

    currentLessonStep = progress?.current_lesson_step ?? 1;
  }
  
  return (
    <main className="mx-auto w-187.5 px-4 py-8 ">
      <div className="mb-8 border-b border-border pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
          {lesson.category}
        </span>
        <h1 className="mt-2 text-3xl font-bold text-primary">{lesson.title}</h1>
        <p className="mt-1 text-neutral-400">{lesson.description}</p>
      </div>

      <LessonMdxSteps
        lessonId={lesson.id}
        slug={title.toString()}
        step={`step_${currentLessonStep}`}
      />
    </main>
  );
}