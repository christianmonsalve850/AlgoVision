"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/theme/theme-provider";

type MonacoCodeEditorProps = {
  defaultLanguage: string;
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  editorFontSize: number;
  minimapEnabled: boolean;
  lineNumbersEnabled: boolean;
  tabSize: number;
};

export function MonacoCodeEditor({
  defaultLanguage,
  language,
  value,
  onChange,
  editorFontSize,
  minimapEnabled,
  lineNumbersEnabled,
  tabSize
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
        minimap: { enabled: minimapEnabled },
        fontSize: editorFontSize,
        lineNumbers: lineNumbersEnabled ? "on" : "off",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        roundedSelection: false,
        renderLineHighlight: "all",
        padding: { top: 16, bottom: 16 },
        tabSize,
        fixedOverflowWidgets: true,
        smoothScrolling: true,
        cursorSmoothCaretAnimation: "on",
        wordWrap: "on",
      }}
      theme={`vs-${resolvedTheme}`}
    />
  );
}
