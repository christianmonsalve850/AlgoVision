import { DownArrow } from "./down-arrow"
import { HeroActions } from "./hero-actions"
import { HeroSectionRef } from "../types"

export function HeroIntro({ nextSectionRef }: HeroSectionRef) {

    return (
        <section className="relative flex flex-col items-center justify-center h-screen w-full max-w-5xl px-6 mx-auto text-center">
        
            <h1 className="max-w-4xl text-5xl font-bold tracking-tight leading-[1.1] md:text-7xl mb-6">
                Learn Algorithms <br className="hidden md:inline" /> Through Visualization
            </h1>
            
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl mb-10">
                Understand patterns, master interview questions, and build confidence through interactive learning.
            </p>
            
            <div className="w-full flex justify-center mb-16">
                <HeroActions />
            </div>
            
            <DownArrow nextSectionRef={nextSectionRef} />
    
        </section>
    )
}