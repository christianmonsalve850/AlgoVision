'use client';

import { useState } from "react";

import { LessonSidebar } from "./lesson-sidebar";
import { LessonName } from "../types";
import { Lessons } from "./lessons";

export function LessonShell() {
  const [selectedLesson, setSelectedLesson] = useState<LessonName>("Recommended");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start bg-background px-6">
        <LessonSidebar selectedLesson={selectedLesson} onSelectLesson={setSelectedLesson} />
        <div className="w-full">
            <Lessons />
        </div>
    </main>
  );
}
