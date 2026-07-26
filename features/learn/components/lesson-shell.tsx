'use client';

import { useState } from "react";

import { LessonSidebar } from "./lesson-sidebar";
import type { LessonCategory, LessonListItem } from "../types";
import { Lessons } from "./lessons";

type LessonShellProps = {
  lessons: LessonListItem[]
}

export function LessonShell({ lessons } : LessonShellProps) {
  const [selectedLesson, setSelectedLesson] = useState<LessonCategory>("Recommended");

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-start bg-background px-6">
        <LessonSidebar selectedLesson={selectedLesson} onSelectLesson={setSelectedLesson} />
        <div className="w-full">
            <Lessons selectedCategory={selectedLesson} lessons={lessons} />
        </div>
    </main>
  );
}
