import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import ProblemsSolved from "@/features/dashboard/components/problems-solved";
import SmallWidget from "@/features/dashboard/components/small-widget";
import { TrendingUp, Flame, Clock, BookOpen } from "lucide-react";
import RecentActivity from "@/features/dashboard/components/recent-activity";
import CategoryMastery from "@/features/dashboard/components/category-mastery";
import { createClient } from "@/lib/supabase/server";

function getCurrentStreak(
  streak: number | null | undefined,
  lastSolvedDate: string | null | undefined,
  timeZone: string | null | undefined,
) {
  if (!streak || !lastSolvedDate) {
    return 0;
  }

  const dateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone ?? "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const dateValues = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value]),
  );
  const today = `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
  const yesterday = new Date(
    Date.parse(`${today}T00:00:00Z`) - 24 * 60 * 60 * 1000,
  )
    .toISOString()
    .slice(0, 10);

  return lastSolvedDate === today || lastSolvedDate === yesterday ? streak : 0;
}

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select(
      "streak, last_solved_date, time_zone, lessons_completed, latest_problem_id, interviews_completed, problems_solved",
    )
    .eq("user_id", user?.id)
    .single();

  if (progressError) {
    console.log(progressError);
  }

  const currentStreak = getCurrentStreak(
    progress?.streak,
    progress?.last_solved_date,
    progress?.time_zone,
  );

  const { data: problem, error: problemError } = await supabase
    .from("problems")
    .select("title, difficulty")
    .eq("id", progress?.latest_problem_id)
    .single();

  if (problemError) {
    console.log(problemError);
  }

  const { count: total, error: totalError } = await supabase
    .from("problems")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    console.log(totalError);
  }

  const { data: categoryCompletion, error: categoryCompletionError } =
    await supabase
      .from("category_completion_rates")
      .select("category, completed_lessons_count, total_lessons_count")
      .eq("user_id", user?.id);

  if (categoryCompletionError) {
    console.log(categoryCompletionError);
  }


  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col bg-background p-6 gap-5">
      <DashboardHeader />
      <ProblemsSolved
        solved={progress?.problems_solved ?? 0}
        total={total ?? 0}
      />
      <div className="grid grid-cols-4 gap-4">
        <SmallWidget
          icon={TrendingUp}
          icon_bg="bg-emerald-500/10 dark: bg-emerald-500/20"
          icon_color="text-emerald-600 dark:text-emerald-400"
          title="Interviews Completed"
          value={progress?.interviews_completed}
          subtext=""
        />
        <SmallWidget
          icon={Flame}
          icon_bg="bg-orange-500/10 dark: bg-orange-500/20"
          icon_color="text-orange-600 dark:text-orange-400"
          title="Current Streak"
          value={String(currentStreak)}
          subtext="days in a row"
        />
        <SmallWidget
          icon={Clock}
          icon_bg="bg-amber-500/10 dark: bg-amber-500/20"
          icon_color="text-amber-600 dark:text-amber-400"
          title="Latest Problem"
          value={problem?.title ?? ""}
          subtext={problem?.difficulty ?? "--"}
        />
        <SmallWidget
          icon={BookOpen}
          icon_bg="bg-indigo-500/10 dark:bg-indigo-500/20"
          icon_color="text-indigo-600 dark:text-indigo-400"
          title="Lessons Completed"
          value={progress?.lessons_completed}
          subtext=""
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CategoryMastery categoryCompletion={categoryCompletion} />
        <RecentActivity />
      </div>
    </main>
  );
}
