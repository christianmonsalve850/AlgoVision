import { BookOpen, CheckCircle, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ActivityLog, ActivityItem } from "@/features/dashboard/types";

function formatRelativeTime(timestamp: string) {
  const elapsedSeconds = Math.round(
    (Date.now() - new Date(timestamp).getTime()) / 1000,
  );
  const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (elapsedSeconds < 60) {
    return relativeTime.format(-elapsedSeconds, "second");
  }

  const elapsedMinutes = Math.round(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return relativeTime.format(-elapsedMinutes, "minute");
  }

  const elapsedHours = Math.round(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return relativeTime.format(-elapsedHours, "hour");
  }

  const elapsedDays = Math.round(elapsedHours / 24);
  return relativeTime.format(-elapsedDays, "day");
}

async function getRecentActivities(): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(`Failed to load the current user: ${userError.message}`);
  }

  if (!user) {
    return [];
  }

  const { data: activityLogs, error: activityLogError } = await supabase
    .from("activity_log")
    .select("id, action_type, action_id, completed, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (activityLogError) {
    throw new Error(`Failed to load recent activity: ${activityLogError.message}`);
  }

  const mostRecentByAction = new Map<string, ActivityLog>();
  for (const log of (activityLogs ?? []) as ActivityLog[]) {
    const key = `${log.action_type}:${log.action_id}`;
    if (!mostRecentByAction.has(key)) {
      mostRecentByAction.set(key, log);
    }
  }
  const logs = [...mostRecentByAction.values()].slice(0, 5);
  const problemIds = [
    ...new Set(
      logs
        .filter((log) => log.action_type === "problem")
        .map((log) => log.action_id),
    ),
  ];
  const lessonIds = [
    ...new Set(
      logs
        .filter((log) => log.action_type === "lesson")
        .map((log) => log.action_id),
    ),
  ];

  const [problemsResult, lessonsResult] = await Promise.all([
    problemIds.length > 0
      ? supabase.from("problems").select("id, title, pattern").in("id", problemIds)
      : Promise.resolve({ data: [], error: null }),
    lessonIds.length > 0
      ? supabase.from("lessons").select("id, title, category").in("id", lessonIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (problemsResult.error) {
    throw new Error(`Failed to load activity problem titles: ${problemsResult.error.message}`);
  }

  if (lessonsResult.error) {
    throw new Error(`Failed to load activity lesson titles: ${lessonsResult.error.message}`);
  }

  const problemById = new Map(
    (problemsResult.data ?? []).map((problem) => [problem.id, problem]),
  );
  const lessonById = new Map(
    (lessonsResult.data ?? []).map((lesson) => [lesson.id, lesson]),
  );

  return logs.flatMap((log) => {
    if (log.action_type === "problem") {
      const problem = problemById.get(log.action_id);
      if (!problem) {
        return [];
      }

      return [{
        ...log,
        title: problem.title,
        category: problem.pattern ?? "Problems",
        icon: log.completed ? CheckCircle : Circle,
        iconColor: log.completed
          ? "text-emerald-500 dark:text-emerald-400"
          : "text-gray-500 dark:text-gray-400",
        activityLabel: log.completed ? "Solved" : "Attempted",
      }];
    }

    if (log.action_type === "lesson") {
      const lesson = lessonById.get(log.action_id);
      if (!lesson) {
        return [];
      }

      return [{
        ...log,
        title: lesson.title,
        category: lesson.category ?? "Lessons",
        icon: BookOpen,
        iconColor: "text-indigo-600 dark:text-indigo-400",
        activityLabel: log.completed ? "Completed" : "Studied",
      }];
    }

    return [];
  });
}

export default async function RecentActivity() {
  const activities = await getRecentActivities();

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Recent Activity
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Pick up where you left off
          </p>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No recent activity yet. Submit a problem or make progress in a lesson
          to see it here.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="group -mx-2.5 grid grid-cols-20 gap-2 rounded-lg p-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-center p-0.5">
                  <Icon className={`col-span-1 ${activity.iconColor}`} />
                </div>
                <div className="col-span-19 flex flex-col justify-center gap-1 text-sm">
                  <span className="font-medium tracking-wide text-foreground transition-colors group-hover:text-primary">
                    {activity.activityLabel}: {activity.title}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    {activity.category} · {formatRelativeTime(activity.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
