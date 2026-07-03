import { RefObject } from "react";

type DownArrowProps = {
    nextSectionRef: RefObject<HTMLHeadingElement | null>;
}

export function DownArrow({ nextSectionRef }: DownArrowProps) {

    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    return (
        <button 
          onClick={handleScroll}
          aria-label="Scroll down to content"
          className="group focus:outline-none mb-10"
        >
          <svg
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="cursor-pointer text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:scale-110 animate-bounce"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
    )
}