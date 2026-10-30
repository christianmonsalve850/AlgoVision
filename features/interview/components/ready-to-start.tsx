import { ReadyToStartProps } from "@/features/interview/types";
import { CirclePlay } from "lucide-react";

export default function ReadyToStart({
  difficulty,
  duration,
}: ReadyToStartProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg p-6 bg-muted">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Ready to Start?
        </h2>
        <p className="text-sm text-muted-foreground">
          {difficulty} difficulty · {duration} mintues
        </p>
      </div>
      <button className="flex gap-2 items-center justify-center text-background bg-foreground rounded-lg p-4 hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all duration-150 font-semibold">
        <CirclePlay />
        <span>Start Assessment</span>
      </button>
    </div>
  );
}
