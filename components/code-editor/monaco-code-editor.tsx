"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme/theme-provider";

type MonacoCodeEditorProps = {
  defaultLanguage: string;
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
};

export function MonacoCodeEditor({
  defaultLanguage,
  language,
  value,
  onChange,
}: MonacoCodeEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Editor
      height="100%"
      defaultLanguage={defaultLanguage}
      language={language}
      value={value}
      onChange={onChange}
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
  );
}
