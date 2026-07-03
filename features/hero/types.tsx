import type { RefObject } from "react"
import type { LucideIcon } from "lucide-react";

export type HeroSectionRef = {
    nextSectionRef: RefObject<HTMLHeadingElement | null>;
}

export type MasteryCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
}