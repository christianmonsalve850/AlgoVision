

"use client";

import { useState } from "react";
import { Braces } from "lucide-react";
import type { TestcaseTabProps } from "@/features/interview/assessment/types";

export default function TestcaseTab({
  functionParameters,
  functionParameterDefaults,
  onRunTestCase,
  onTestCaseChange,
  isRunning,
}: TestcaseTabProps) {
  const [inputValues, setInputValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      functionParameters.map((parameter) => [
        parameter,
        JSON.stringify(functionParameterDefaults[parameter]) ?? "null",
      ]),
    ),
  );
  const [expectedOutput, setExpectedOutput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateInput = (parameter: string, value: string) => {
    setInputValues((currentValues) => ({
      ...currentValues,
      [parameter]: value,
    }));
    setValidationError(null);
    onTestCaseChange();
  };

  const updateExpectedOutput = (value: string) => {
    setExpectedOutput(value);
    setValidationError(null);
    onTestCaseChange();
  };

  const runTestCase = () => {
    try {
      const input = Object.fromEntries(
        functionParameters.map((parameter) => [
          parameter,
          JSON.parse(inputValues[parameter] ?? "null") as unknown,
        ]),
      );
      const parsedExpectedOutput = JSON.parse(expectedOutput) as unknown;
      setValidationError(null);
      onRunTestCase(input, parsedExpectedOutput);
    } catch (error) {
      setValidationError(
        error instanceof SyntaxError
          ? "Enter valid JSON for each argument and the expected output."
          : "Could not read the test case.",
      );
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-y-auto">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Custom test case
          </div>
          <h2 className="mt-0.5 text-sm font-semibold tracking-tight">
            Set function parameters
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] text-muted-foreground">
          {functionParameters.length}{" "}
          {functionParameters.length === 1 ? "parameter" : "parameters"}
        </span>
      </div>

      <div className="flex shrink-0 flex-col rounded-lg border border-border bg-muted/15">
        <div className="flex shrink-0 items-center gap-2 border-b border-border/70 bg-muted/30 px-3 py-1.5">
          <Braces className="size-3.5 text-emerald-500" aria-hidden="true" />
          <span className="text-xs font-medium text-foreground">Arguments</span>
          <span className="ml-auto font-mono text-[10px] text-muted-foreground">
            enter each value as JSON
          </span>
        </div>

        <div className="grid gap-2 p-2 sm:grid-cols-2">
          {functionParameters.length > 0 ? (
            functionParameters.map((parameter, index) => (
              <div key={`${parameter}-${index}`} className="space-y-1">
                <label
                  htmlFor={`custom-testcase-parameter-${index}`}
                  className="font-mono text-xs font-medium text-muted-foreground"
                >
                  {parameter}
                </label>
                <input
                  id={`custom-testcase-parameter-${index}`}
                  type="text"
                  aria-label={`Value for ${parameter}`}
                  value={inputValues[parameter] ?? "null"}
                  onChange={(event) =>
                    updateInput(parameter, event.currentTarget.value)
                  }
                  disabled={isRunning}
                  className="h-8 w-full rounded-md border border-border bg-background/80 px-2.5 font-mono text-xs text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                />
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              This function has no parameters.
            </p>
          )}
        </div>
        <div className="border-t border-border/70 p-3">
          <label
            htmlFor="custom-testcase-expected-output"
            className="mb-1.5 block font-mono text-xs font-medium text-muted-foreground"
          >
            Expected output
          </label>
          <textarea
            id="custom-testcase-expected-output"
            aria-label="Expected output"
            value={expectedOutput}
            onChange={(event) => updateExpectedOutput(event.currentTarget.value)}
            disabled={isRunning}
            placeholder='Enter expected output as JSON, e.g. 42'
            rows={1}
            className="w-full resize-y rounded-md border border-border bg-background/80 px-2.5 py-1.5 font-mono text-xs text-foreground outline-none transition-colors focus-visible:border-emerald-500/60 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
          />
        </div>
      </div>
      {validationError && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {validationError}
        </p>
      )}
      <button
        type="button"
        disabled={isRunning}
        onClick={runTestCase}
        className="mt-2 self-start rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRunning ? "Running..." : "Run code"}
      </button>
    </div>
  );
}