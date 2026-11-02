import { useState, useEffect, useRef } from "react";
import {
  UseAssessmentEditorOptions,
  UseAssessmentEditorReturn,
} from "@/features/interview/assessment/types";
import { Language } from "@/features/practice/problem-page/code-editor/types";

export function useAssessmentEditor({
  sessionId,
  problemId,
  starterCodeMap,
  defaultLanguage = "Python",
}: UseAssessmentEditorOptions): UseAssessmentEditorReturn {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [code, setCode] = useState(starterCodeMap[language] ?? "");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compositeKey = `session:${sessionId}:problem:${problemId}:${language}`;

  useEffect(() => {
    const loadCodeTimeout = window.setTimeout(() => {
      const savedCode = localStorage.getItem(compositeKey);

      setCode(savedCode ?? starterCodeMap[language] ?? "");
    }, 0);

    return () => window.clearTimeout(loadCodeTimeout);
  }, [compositeKey, language, starterCodeMap]);

  const handleReset = () => {
    const defaultCode = starterCodeMap[language] ?? "";
    setCode(defaultCode);
    localStorage.setItem(compositeKey, defaultCode);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const handleEditorChange = (value: string | undefined) => {
    const currentCode = value || "";
    setCode(currentCode);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for 400ms after last keystroke
    saveTimeoutRef.current = setTimeout(() => {
      if (currentCode) {
        localStorage.setItem(compositeKey, currentCode);
      }
    }, 400);
  };

  return {
    code,
    language,
    handleLanguageChange,
    handleReset,
    handleEditorChange,
  };
}
