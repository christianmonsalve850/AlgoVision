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
        iconClass: "size-5 stroke-3 text-emerald-700 dark:text-emerald-400",
        badgeClass: "rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1",
        labelClass: "text-emerald-700 dark:text-emerald-400 font-semibold",
    },
    Partial: {
        icon: CircleAlert,
        iconClass: "size-5 stroke-3 text-amber-700 dark:text-amber-400",
        badgeClass: "rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1",
        labelClass: "text-amber-700 dark:text-amber-400 font-semibold",
    },
    Failed: {
        icon: XCircle,
        iconClass: "size-5 stroke-3 text-red-700 dark:text-red-400",
        badgeClass: "rounded-full bg-red-500/10 dark:bg-red-500/20 px-3 py-1",
        labelClass: "text-red-700 dark:text-red-400 font-semibold",
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