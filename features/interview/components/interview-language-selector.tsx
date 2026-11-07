"use client";

import { ChevronDown } from "lucide-react";
import {
  isSupportedLanguage,
  supportedLanguages,
} from "@/features/code-editor/languages";
import type { SupportedLanguage } from "@/features/code-editor/languages";

type InterviewLanguageSelectorProps = {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
};

export default function InterviewLanguageSelector({
  language,
  onLanguageChange,
}: InterviewLanguageSelectorProps) {
  return (
    <label className="relative inline-flex w-fit items-center">
      <span className="sr-only">Programming language</span>
      <select
        value={language}
        onChange={(event) => {
          if (isSupportedLanguage(event.target.value)) {
            onLanguageChange(event.target.value);
          }
        }}
        className="appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-9 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        {supportedLanguages.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-4 text-muted-foreground"
      />
    </label>
  );
}
