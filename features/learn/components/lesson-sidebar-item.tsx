'use client';

import clsx from "clsx";

import type { LessonCategory, LessonCategoryItem } from "../types";

type LessonSidebarItemProps = {
  item: LessonCategoryItem;
  selected: boolean;
  onSelect: (lesson: LessonCategory) => void;
};

export function LessonSidebarItem({ item, selected, onSelect }: LessonSidebarItemProps) {
  const { name, meta } = item;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(name)}
      className={clsx(
        "group flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-medium transition-all duration-200",
        selected
          ? "border-border bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span
        className={clsx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border transition-transform group-hover:scale-105 p-1",
          meta.bg,
          meta.color
        )}
      >
        {meta.icon}
      </span>

      <span className="truncate">{name}</span>
    </button>
  );
}
