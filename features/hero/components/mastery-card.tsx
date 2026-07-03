import type { MasteryCardProps } from "../types"

export function MasteryCard({ icon: Icon, title, description } : MasteryCardProps) {
    return (
        <div className="flex flex-col text-left bg-background border border-border rounded-lg p-6">
            <div className="flex items-center justify-center bg-muted w-12 h-12 rounded-lg mb-4">
                <Icon className="w-6 h-6 text-foreground"/>
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-3">
                { title }
            </h3>
            <p className="text-base text-muted-foreground/60">
                { description }
            </p>
        </div>
    )
}