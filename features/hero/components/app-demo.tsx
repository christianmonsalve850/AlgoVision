import { HeroSectionRef } from "../types"

export function AppDemo({nextSectionRef} : HeroSectionRef) {
    return (
        <section 
            ref={nextSectionRef}
            className="flex flex-col items-center justify-center min-h-screen w-full max-w-5xl px-6 mx-auto text-center py-16"
        >
            <h2 className="max-w-4xl text-3xl font-bold tracking-tight md:text-4xl mb-4">
                See Algorithms in Action
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg mb-12">
                Watch code execute in real-time with synchronized visualizations. Every line of code corresponds
                to a visual change.
            </p>

            <div className="w-full min-h-120 bg-muted/40 border border-border/60 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6 shadow-xl backdrop-blur-sm">
                <div className="text-left flex flex-col bg-background border border-border/40 rounded-lg p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Code</h3>
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/60 bg-muted/10 rounded border border-dashed border-border/60">
                        placeholder
                    </div>
                </div>

                <div className="text-left flex flex-col bg-background border border-border/40 rounded-lg p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visualization</h3>
                    <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground/60 bg-muted/10 rounded border border-dashed border-border/60">
                        placeholder
                    </div>
                </div>
            </div>
        </section>
    )
}