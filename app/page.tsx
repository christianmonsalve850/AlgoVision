'use client'

import { useRef } from "react";
import { HeroIntro } from "@/features/hero/components/hero-intro";
import { AppDemo } from "@/features/hero/components/app-demo";
import { Mastery } from "@/features/hero/components/mastery";
import { Journey } from "@/features/hero/components/journey";
import { HeroFooter } from "@/features/hero/components/hero-footer";
import { HeroBottom } from "@/features/hero/components/hero-bottom";

export default function Hero() {
  const nextSectionRef = useRef<HTMLHeadingElement>(null);

  return (
    <main>
      <div className="flex flex-col items-center justify-center w-full max-w-5xl px-6 mx-auto text-center mt-4">

        <HeroIntro nextSectionRef={nextSectionRef} />

        <AppDemo nextSectionRef={nextSectionRef} />

        <Mastery />

        <Journey /> 

        <HeroBottom />
      </div>

      <HeroFooter />
    </main>
  );
}
