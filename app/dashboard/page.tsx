import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import ProblemsSolved from "@/features/dashboard/components/problems-solved";
import SmallWidget from "@/features/dashboard/components/small-widget";
import { TrendingUp, Flame, Clock, BookOpen } from "lucide-react";
import RecentActivity from "@/features/dashboard/components/recent-activity";
import CategoryMastery from "@/features/dashboard/components/category-mastery";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select(
      "streak, lessons_completed, latest_problem_id, interviews_completed, problems_solved",
    )
    .eq("user_id", user?.id)
    .single();

  if (progressError) {
    console.log(progressError);
  }

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
      .select("category, completion_percentage")
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
          value={progress?.streak}
          subtext="days in a row"
        />
        <SmallWidget
          icon={Clock}
          icon_bg="bg-amber-500/10 dark: bg-amber-500/20"
          icon_color="text-amber-600 dark:text-amber-400"
          title="Latest Problem"
          value={problem?.difficulty ?? "--"}
          subtext={problem?.title ?? ""}
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
