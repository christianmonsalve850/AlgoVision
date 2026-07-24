'use client'

import { LessonName } from "../types";
import { LessonSidebarItem } from "./lesson-sidebar-item";
import { lessonCategoryItems } from "../data/lesson-category-items";

type LessonSidebarProps = {
    selectedLesson: LessonName;
    onSelectLesson: (lesson: LessonName) => void;
};

export function LessonSidebar({ selectedLesson, onSelectLesson }: LessonSidebarProps) {

    return (
        <aside className="w-66 shrink-0 border-r border-border bg-background p-4 flex h-[calc(100vh-4rem)] flex-col gap-4">
            <div className="px-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Curriculum
                </span>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                {lessonCategoryItems.map((item) => (
                    <LessonSidebarItem
                        key={item.name}
                        item={item}
                        selected={item.name === selectedLesson}
                        onSelect={onSelectLesson}
                    />
                ))}
            </div>
        </aside>
    );
}
