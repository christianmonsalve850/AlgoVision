'use client';

import { useMemo } from "react";
import Editor from "@monaco-editor/react";
import { ChevronDown, FileCode2 } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { languageOptions } from "../constants/languages";
import type { Language, ProblemCodeEditorProps } from "../types";

export function ProblemCodeEditor({
  language,
  code,
  onLanguageChange,
  onCodeChange,
}: ProblemCodeEditorProps) {
  const { resolvedTheme } = useTheme();

  const activeLanguage = useMemo(
    () => languageOptions.find((option) => option.value === language) ?? languageOptions[0],
    [language]
  );

  const handleLanguageChange = (nextLanguage: Language) => {
    onLanguageChange(nextLanguage);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <FileCode2 className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{activeLanguage.fileName}</p>
            <p className="text-xs text-muted-foreground">Solution file</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">Language</span>
            <select
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value as Language)}
              className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-sm text-foreground outline-none transition-colors hover:bg-muted"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </label>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-muted/20">
        <div className="flex items-center justify-between border-b border-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{language}</span>
          <span>Monaco editor</span>
        </div>

        <div className="min-h-0 flex-1 p-3">
          <div className="h-full overflow-hidden rounded-lg border border-border bg-background">
            <Editor
              height="100%"
              defaultLanguage="python"
              language={activeLanguage.extension}
              value={code}
              onChange={onCodeChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                roundedSelection: false,
                renderLineHighlight: "all",
                padding: { top: 16, bottom: 16 },
                tabSize: 4,
                fixedOverflowWidgets: true,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                wordWrap: "on",
              }}
              theme={`vs-${resolvedTheme}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
