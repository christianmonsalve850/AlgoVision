import { ChartColumn } from "lucide-react";

export default function PerformanceOverview() {
  return (
    <div className="flex flex-col border border-border w-full rounded-lg p-6 gap-6">
      <div className="flex gap-2">
        <ChartColumn className="text-orange-600" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Performance Overview
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-semibold">
            Total Sessions
          </span>
          <span className="text-3xl font-semibold">5</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-semibold">
            Average Score
          </span>
          <span className="text-3xl font-semibold text-orange-600">72%</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-semibold">
            Pass Rate
          </span>
          <span className="text-3xl font-semibold text-emerald-500">60%</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground font-semibold">
            Current Streak
          </span>
          <span className="text-3xl font-semibold text-yellow-500">2</span>
        </div>
      </div>
    </div>
  );
}
