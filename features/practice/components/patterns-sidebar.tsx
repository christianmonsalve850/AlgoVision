'use client'

import { patternItems } from "@/features/practice/data/pattern-items";
import { PatternName } from "../types/pattern-types";
import { PatternSidebarItem } from "@/features/practice/components/pattern-sidebar-item";

type PatternSidebarProps = {
    selectedPattern: PatternName;
    onSelectPattern: (pattern: PatternName) => void;
};

export function PatternSidebar({ selectedPattern, onSelectPattern }: PatternSidebarProps) {

    return (
        <aside className="max-w-66 shrink-0 border-r border-border bg-background p-4 flex h-[calc(100vh-4rem)] flex-col gap-4">
            <div className="px-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Patterns
                </span>
            </div>

            <div className="flex flex-col gap-1 overflow-y-auto pr-1">
                {patternItems.map((item) => (
                    <PatternSidebarItem
                        key={item.name}
                        item={item}
                        selected={item.name === selectedPattern}
                        onSelect={onSelectPattern}
                    />
                ))}
            </div>
        </aside>
    );
}
