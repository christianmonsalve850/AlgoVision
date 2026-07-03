import { ArrowRight } from "lucide-react"

export function Journey() {
    return (
        <section className="flex flex-col justify-center items-center">
            <h2 className="max-w-4xl text-3xl tracking-tight md:text-4xl mb-12 font-bold">
                Your Learning Journey
            </h2>
            <div className="w-full max-w-5xl mx-auto px-6 py-12 flex justify-center items-start gap-4 md:gap-8 mb-20">
  
                <div className="flex flex-col items-center text-center group">
                    <div className="flex justify-center items-center w-20 h-20 md:w-24 md:h-24 bg-foreground text-background rounded-full text-xl md:text-2xl shadow-md transition-transform group-hover:scale-105 duration-300 mb-6">
                        1
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-2">
                        Learn
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        Master algorithmic patterns through interactive visualizations and guided lessons.
                    </p>
                </div>
                
                <div className="pt-7 md:pt-9 flex items-center justify-center shrink-0">
                    <ArrowRight className="text-muted-foreground/40 animate-pulse animation-duration-[3s]" size={28} />
                </div>
                
                <div className="flex flex-col items-center text-center group">
                    <div className="flex justify-center items-center w-20 h-20 md:w-24 md:h-24 bg-foreground text-background rounded-full text-xl md:text-2xl shadow-md transition-transform group-hover:scale-105 duration-300 mb-6">
                        2
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-2">
                        Practice
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        Apply your knowledge with coding challenges and real-time visual feedback.
                    </p>
                </div>
                
                <div className="pt-7 md:pt-9 flex items-center justify-center shrink-0">
                    <ArrowRight className="text-muted-foreground/40 animate-pulse animation-duration-[3s]" size={28} />
                </div>
                
                <div className="flex flex-col items-center text-center group">
                    <div className="flex justify-center items-center w-20 h-20 md:w-24 md:h-24 bg-foreground text-background rounded-full text-xl md:text-2xl shadow-md transition-transform group-hover:scale-105 duration-300 mb-6">
                        3
                    </div>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-2">
                        Interview
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                        Build confidence with mock interviews and performance analytics.
                    </p>
                </div>

            </div>
        </section>
    )
}