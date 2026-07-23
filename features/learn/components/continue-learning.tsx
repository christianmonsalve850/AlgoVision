import { Progress } from "@/components/ui/progress"
import { Play } from "lucide-react"
import { ArrowLeftRight } from "lucide-react"


export default function ContinueLearning() {
    return (
        <div className="border border-border w-90 p-6 flex-col rounded-xl">
            <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center border-2 border-sky-500/80 rounded-3xl p-1 mr-2 text-sky-500/80">
                    <Play strokeWidth={5} className="w-full h-full"/>
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    Continue Learning
                </h3>
            </div>
            
            <div className="border border-border mt-5 rounded-xl p-4 flex-col">
                <div className="flex items-stretch gap-3">
                    <div className="flex items-center justify-center bg-sky-500/10 border border-border p-2 rounded-lg text-sky-500/80">
                        <ArrowLeftRight className="w-full h-full" />
                    </div>
                    <div className="flex-col">
                        <h3 className="text-lg font-semibold text-foreground">
                            Two Pointers
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Array & Strings
                        </p>
                    </div>
                </div>
                <div className="flex flex-col mt-4 gap-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <p className="text-muted-foreground">
                            Progress
                        </p>
                        <span className="text-sky-500/80 font-semibold tabular-nums">
                            65%
                        </span> 
                    </div>
                    <div>
                        <Progress value={65} />
                    </div>
                </div>
            </div>
        </div>
    )
}