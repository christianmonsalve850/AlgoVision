import type { Difficulty, InterviewResult, Session } from "@/features/interview/types";
import { CircleAlert, CircleCheck, XCircle, type LucideIcon } from "lucide-react";

const difficultyClasses: Record<Difficulty, string> = {
    Easy: "text-difficulty-easy-foreground font-semibold",
    Medium: "text-difficulty-medium-foreground font-semibold",
    Hard: "text-difficulty-hard-foreground font-semibold",
};

const resultStyles: Record<
    InterviewResult,
    { icon: LucideIcon; iconClass: string; badgeClass: string; labelClass: string }
> = {
    Passed: {
        icon: CircleCheck,
        iconClass: "size-5 stroke-3 text-emerald-500",
        badgeClass: "rounded-full bg-emerald-500/20 px-3 py-1",
        labelClass: "text-emerald-500 font-semibold",
    },
    Partial: {
        icon: CircleAlert,
        iconClass: "size-5 stroke-3 text-orange-600",
        badgeClass: "rounded-full bg-orange-600/20 px-3 py-1",
        labelClass: "text-orange-600 font-semibold",
    },
    Failed: {
        icon: XCircle,
        iconClass: "size-5 stroke-3 text-yellow-500",
        badgeClass: "rounded-full bg-yellow-500/20 px-3 py-1",
        labelClass: "text-yellow-500 font-semibold",
    },
};

export default function SessionItem({
    difficulty,
    duration,
    date,
    problemsSolved,
    score,
    result,
} : Session) {
    const { icon: ResultIcon, iconClass, badgeClass, labelClass } = resultStyles[result];

    return(
        <div className="flex items-center justify-between p-5 bg-muted rounded-lg">
            <div className="flex gap-3 items-center">
                <ResultIcon className={iconClass} />
                <div className="flex flex-col">
                    <div className="">
                        <span className={difficultyClasses[difficulty]}>{difficulty}</span>
                        <span className="font-medium text-muted-foreground"> · {duration}m · {date.toLocaleString('en-US', { month: 'short' })} {date.getDate()}</span>
                    </div>
                    <div className="">
                        <span className="font-medium text-muted-foreground">{problemsSolved}/2 problems solved · Score {score}%</span>
                    </div>
                </div>
            </div>
            <div className={badgeClass}>
                <span className={labelClass}>{result}</span>
            </div>
        </div>
    );
}