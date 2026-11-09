"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { ShieldCheck, X, Minus, Plus, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

interface SettingsModalProps {
  open: boolean;
  minimapEnabled: boolean;
  onMinimapChange: (enabled: boolean) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineNumbersEnabled: boolean;
  onLineNumbersChange: (enabled: boolean) => void;
  tabSize: 2 | 4;
  onTabSizeChange: (size: 2 | 4) => void;
  onClose: () => void;
}

export default function SettingsModal({
  open,
  fontSize=14,
  onFontSizeChange,
  minimapEnabled=false,
  onMinimapChange,
  lineNumbersEnabled=true,
  onLineNumbersChange,
  tabSize,
  onTabSizeChange,
  onClose,
}: SettingsModalProps) {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-75 grid place-items-center bg-black/45 p-4 backdrop-blur-xs"
      onMouseDown={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.16 }}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="mb-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Workspace
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              Assessment settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md hover:bg-muted"
            aria-label="Close settings"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-7 p-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Editor font size</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  Adjust code readability
                </div>
              </div>
              <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs font-semibold">
                {fontSize}px
              </span>
            </div>
            <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2">
              <button
                onClick={() => onFontSizeChange(Math.max(11, fontSize - 1))}
                disabled={fontSize <= 11}
                className="grid size-10 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-35"
                aria-label="Decrease editor font size"
              >
                <Minus className="size-4" />
              </button>
              <input
                type="range"
                min="11"
                max="20"
                step="1"
                value={fontSize}
                onChange={(event) => onFontSizeChange(Number(event.target.value))}
                className="h-1.5 w-full cursor-pointer accent-violet-600"
                aria-label="Editor font size"
              />
              <button
                onClick={() => onFontSizeChange(Math.min(20, fontSize + 1))}
                disabled={fontSize >= 20}
                className="grid size-10 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-35"
                aria-label="Increase editor font size"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <div className="text-sm font-semibold">Appearance</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Choose how the workspace looks
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => {
                const active = theme === value;
                return (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={theme === value}
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-xs font-semibold transition-colors ${
                      active
                        ? "border-violet-500 bg-violet-500/8 text-violet-700 dark:text-violet-300"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <div className="text-sm font-semibold">Editor layout</div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Control navigation and indentation
              </div>
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {[
                {
                  label: "Minimap",
                  description: "Show a compact code overview",
                  enabled: minimapEnabled,
                  onChange: onMinimapChange,
                },
                {
                  label: "Line numbers",
                  description: "Display numbers in the editor gutter",
                  enabled: lineNumbersEnabled,
                  onChange: onLineNumbersChange,
                },
              ].map((setting) => (
                <div
                  key={setting.label}
                  className="flex items-center justify-between gap-4 bg-background/60 px-3.5 py-3"
                >
                  <div>
                    <div className="text-xs font-semibold">{setting.label}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {setting.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={setting.enabled}
                    onClick={() => setting.onChange(!setting.enabled)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      setting.enabled ? "bg-violet-600" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
                        setting.enabled ? "translate-x-0" : "-translate-x-5"
                      }`}
                    />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-background/60 px-3.5 py-3">
                <div>
                  <div className="text-xs font-semibold">Tab size</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    Spaces inserted per indentation level
                  </div>
                </div>
                <div className="flex rounded-md bg-muted p-0.5">
                  {([2, 4] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => onTabSizeChange(size)}
                      className={`min-w-9 rounded px-2 py-1 font-mono text-xs font-semibold transition-colors ${
                        tabSize === size
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-muted/70 p-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-500" />
            <p className="text-xs leading-5 text-muted-foreground">
              Display preferences are saved on this device and do not affect
              your assessment score.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
