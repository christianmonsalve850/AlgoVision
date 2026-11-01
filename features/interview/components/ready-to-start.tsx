

import { ReadyToStartProps } from "@/features/interview/types";
import { CirclePlay } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReadyToStart({
  difficulties,
  duration,
} : ReadyToStartProps) {
  const router = useRouter();
  const difficultyLabel =
    difficulties.length === 0 ? "Random difficulty" : difficulties.join(" + ");

  const startAssessment = () => {
    const searchParams = new URLSearchParams({ duration: String(duration) });

    if (difficulties.length === 0) {
      searchParams.set("difficulty", "Random");
    } else {
      difficulties.forEach((difficulty) =>
        searchParams.append("difficulty", difficulty),
      );
    }

    router.replace(`/interview/1?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg p-6 bg-muted">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Ready to Start?
        </h2>
        <p className="text-sm text-muted-foreground">
          {difficultyLabel} · {duration} minutes
        </p>
      </div>
      <button 
        className="flex gap-2 items-center justify-center text-background bg-foreground rounded-lg p-4 hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all duration-150 font-semibold"
        onClick={startAssessment}
      >
        <CirclePlay />
        <span>Start Assessment</span>
      </button>
    </div>
  );
}
