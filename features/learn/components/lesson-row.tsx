import Link from "next/link"

import type { LessonListItem } from "../types"
import { Progress } from "@/components/ui/progress"
import { lessonCategoryItems } from "../data/lesson-category-items"

type LessonRowProps = {
    lesson: LessonListItem,
}

export function LessonRow({ lesson }: LessonRowProps) {

  return (
    <Link
      href={`/example`}
      className="group grid grid-cols-12 items-center gap-4 rounded-xl border border-border bg-background px-4 py-3.5 text-sm font-medium shadow-sm transition-all duration-200 hover:border-border hover:bg-muted"
    >
      <div className="col-span-6 flex min-w-0 items-center gap-3">
        <span className="truncate font-semibold text-foreground transition-colors group-hover:text-foreground">
          {lesson.title}
        </span>
      </div>

      <div className="col-span-3 flex justify-center">

      </div>

      <div className="col-span-3 flex justify-end">
        <Progress value={lesson.progress} />
      </div>
    </Link>
  )
}
