'use client';

import LearnHeader from "./learn-header";
import { LessonListItem, LessonCategory } from "../types";
import ContinueLearning from "./continue-learning";
import { LessonSearch } from "./lesson-search";
import { useState, useMemo } from "react";
import { LessonRow } from "./lesson-row";


type LessonsProps = {
    selectedCategory: LessonCategory,
    lessons: LessonListItem[]
}

export function Lessons({ selectedCategory, lessons }: LessonsProps) {

    const [search, setSearch] = useState("")

    const filteredLessons = useMemo(() => {
        const query = search.trim().toLowerCase()
        
        return lessons
            .filter((lesson) => {
                const matchesCategory =
                    selectedCategory === "All"
                        ? true
                        : lesson.category === selectedCategory
                        || selectedCategory === "Recommended" && lesson.is_recommended;

                const matchesSearch = query.length === 0 || lesson.title.toLowerCase().includes(query);

                return matchesCategory && matchesSearch
            })
    }, [search, selectedCategory, lessons])

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
            <div className="mb-6 px-1">
                <LearnHeader />
                <ContinueLearning lessons={lessons} />
                <h3 className="mt-1 text-lg font-semibold text-foreground">{selectedCategory}</h3>
            </div>

            <div className="mb-4">
                <LessonSearch
                    search={search}
                    onSearchChange={setSearch}
                />
            </div>


            <div className="flex flex-col gap-2.5">
                {filteredLessons.map((lesson) => (
                    <LessonRow key={lesson.id} lesson={lesson} />
                ))}
            </div>

        </div>
    )
}
