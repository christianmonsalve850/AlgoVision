import { HeroActions } from "@/features/hero/components/hero-actions";

export default function Hero() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full max-w-5xl px-6 mx-auto text-center">
      
      {/* 1. The Main Headline */}
      <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground leading-[1.1] md:text-7xl mb-6">
        Learn Algorithms <br className="hidden md:inline" /> Through Visualization
      </h1>
      
      {/* 2. Subtitle */}
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl mb-10">
        Understand patterns, master interview questions, and build confidence through interactive learning.
      </p>
      
      {/* 3. Action Buttons */}
      <div className="w-full flex justify-center mb-20">
        <HeroActions />
      </div>
      
      {/* 4. Animated Scroll Indicator */}
      <svg
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground animate-bounce"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
      
    </main>
  );
}
