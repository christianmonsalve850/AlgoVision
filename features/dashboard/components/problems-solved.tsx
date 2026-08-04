import { Progress } from "@/components/ui/progress";
import { CircleCheckBig } from "lucide-react";

export default function ProblemsSolved() {
  const current = 45;
  const total = 100;
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-xl border border-border bg-muted/50 p-3.5 text-primary">
          <CircleCheckBig className="h-7 w-7" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Problems Solved
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-card-foreground">
              {current}
            </span>
            <span className="text-xs text-muted-foreground">
              / {total}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Overall Progress</span>
          <span>{percentage}%</span>
        </div>
        <Progress value={percentage} />
        <p className="text-xs text-muted-foreground">
          <strong className="font-semibold text-foreground">{current}</strong> of{" "}
          <strong className="font-semibold text-foreground">{total}</strong> problems completed
        </p>
      </div>
    </div>
  );
}