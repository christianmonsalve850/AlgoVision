import { useState, useEffect, useRef } from "react";
import {
  UseCodeEditorOptions,
  UseCodeEditorReturn,
} from "@/features/practice/problem-page/types";
import { Language } from "@/features/practice/problem-page/code-editor/types";

export function useCodeEditor({
  problemId,
  starterCodeMap,
  defaultLanguage = "Python",
}: UseCodeEditorOptions): UseCodeEditorReturn {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [code, setCode] = useState(starterCodeMap[language] ?? "");

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const compositeKey = `problem:${problemId}:${language}`;

  useEffect(() => {
    const savedCode = localStorage.getItem(compositeKey);

    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(starterCodeMap[language] || "");
    }
  }, [problemId, language]);

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
