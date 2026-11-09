"use client";

import { useSyncExternalStore } from "react";
import type { EditorSettings } from "@/components/code-editor/types";

type UseEditorSettingsReturn = {
  settings: EditorSettings;
  setFontSize: (fontSize: number) => void;
  setMinimapEnabled: (enabled: boolean) => void;
  setLineNumbersEnabled: (enabled: boolean) => void;
  setTabSize: (tabSize: 2 | 4) => void;
};

const STORAGE_KEYS = {
  fontSize: "algovision:editor-font-size",
  minimapEnabled: "algovision:editor-minimap",
  lineNumbersEnabled: "algovision:editor-line-numbers",
  tabSize: "algovision:editor-tab-size",
} as const;

const CHANGE_EVENT = "algovision:editor-settings-change";
const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 13,
  minimapEnabled: false,
  lineNumbersEnabled: true,
  tabSize: 4,
};
const DEFAULT_SNAPSHOT = "13:0:1:4";

function readSettings(): EditorSettings {
  const savedFontSize = Number(localStorage.getItem(STORAGE_KEYS.fontSize));
  return {
    fontSize:
      savedFontSize >= 11 && savedFontSize <= 20
        ? savedFontSize
        : DEFAULT_SETTINGS.fontSize,
    minimapEnabled:
      localStorage.getItem(STORAGE_KEYS.minimapEnabled) === "true",
    lineNumbersEnabled:
      localStorage.getItem(STORAGE_KEYS.lineNumbersEnabled) !== "false",
    tabSize: localStorage.getItem(STORAGE_KEYS.tabSize) === "2" ? 2 : 4,
  };
}

function serializeSettings(settings: EditorSettings): string {
  return [
    settings.fontSize,
    settings.minimapEnabled ? 1 : 0,
    settings.lineNumbersEnabled ? 1 : 0,
    settings.tabSize,
  ].join(":");
}

function getSnapshot(): string {
  if (typeof window === "undefined") {
    return DEFAULT_SNAPSHOT;
  }
  return serializeSettings(readSettings());
}

function getServerSnapshot(): string {
  return DEFAULT_SNAPSHOT;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function updateSettings(
  update: (settings: EditorSettings) => EditorSettings,
): void {
  const settings = update(readSettings());
  localStorage.setItem(STORAGE_KEYS.fontSize, String(settings.fontSize));
  localStorage.setItem(
    STORAGE_KEYS.minimapEnabled,
    String(settings.minimapEnabled),
  );
  localStorage.setItem(
    STORAGE_KEYS.lineNumbersEnabled,
    String(settings.lineNumbersEnabled),
  );
  localStorage.setItem(STORAGE_KEYS.tabSize, String(settings.tabSize));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parseSnapshot(snapshot: string): EditorSettings {
  const [fontSize, minimapEnabled, lineNumbersEnabled, tabSize] =
    snapshot.split(":").map(Number);
  return {
    fontSize,
    minimapEnabled: minimapEnabled === 1,
    lineNumbersEnabled: lineNumbersEnabled === 1,
    tabSize: tabSize === 2 ? 2 : 4,
  };
}

export function useEditorSettings(): UseEditorSettingsReturn {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return {
    settings: parseSnapshot(snapshot),
    setFontSize: (fontSize) =>
      updateSettings((settings) => ({ ...settings, fontSize })),
    setMinimapEnabled: (minimapEnabled) =>
      updateSettings((settings) => ({ ...settings, minimapEnabled })),
    setLineNumbersEnabled: (lineNumbersEnabled) =>
      updateSettings((settings) => ({ ...settings, lineNumbersEnabled })),
    setTabSize: (tabSize) =>
      updateSettings((settings) => ({ ...settings, tabSize })),
  };
}
