import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { FolderOpen } from "lucide-react";

export default async function CategoryMastery() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: categoryCompletion, error: categoryCompletionError } =
    await supabase
      .from("category_completion_rates")
      .select("category, completion_percentage")
      .eq("user_id", user?.id);

  if (categoryCompletion && categoryCompletion.length < 1) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-card/50 p-8 text-center min-h-[220px]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FolderOpen className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            No Categories Started
          </p>
          <p className="text-xs text-muted-foreground">
            Start completing lessons to track your topic progress here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Category Mastery
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Breakdown of topic progress
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          {categoryCompletion?.length || 0} {categoryCompletion?.length == 1 ? "Category" : "Categories"}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {categoryCompletion?.map((category) => {
          const percentage = Math.round(category.completion_percentage ?? 0);

          return (
            <div
              key={category.category}
              className="group flex flex-col gap-2 rounded-lg p-2.5 -mx-2.5 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                  {category.category}
                </span>
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  {percentage}%
                </span>
              </div>

              <Progress value={percentage} barHeight="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
