import { buildPythonHarness, HarnessOptions } from "../languages/python/buildPythonHarness";

import { ExecutionOutcome, SupportedLanguage, TraceStep } from "./types";
import { PyodideInterface } from "pyodide";

export type HarnessLanguage = SupportedLanguage;

export class BrowserRuntime {
  private readonly pyodide: PyodideInterface;
  private readonly language: HarnessLanguage;
  private isInitialized = false;

  constructor(pyodideInstance: PyodideInterface, language: HarnessLanguage = "python") {
    this.pyodide = pyodideInstance;
    this.language = language;
  }

  /**
   * Loads the modular Python engine scripts into the Pyodide environment.
   * This prepares the environment once per session or initialization boundary.
   */
  public async initializeHarness(): Promise<void> {
    if (this.isInitialized) return;

    this.isInitialized = true;
  }

  /**
   * Executes a piece of code, producing an entirely isolated, fresh trace timeline.
   */
  public async executeTrace(userCode: string): Promise<TraceStep[]> {
    if (!this.isInitialized) {
      await this.initializeHarness();
    }

    switch (this.language) {
      case "python":
        return this.executePythonTrace(userCode);
      default:
        throw new Error(`Unsupported runtime language: ${this.language}`);
    }
  }

  public async executePythonTrace(userCode: string): Promise<TraceStep[]> {
    const outcome = await this.executeTraceWithMetadata(userCode);
    return outcome.trace;
  }

  public async executeTraceWithMetadata(userCode: string): Promise<ExecutionOutcome> {
    try {
      const harnessOptions: HarnessOptions = {
        source: userCode,
        maxTraceSteps: 1000,
        traceMode: "function",
      };

      const locals = this.pyodide.toPy({
        user_code: userCode,
      });

      const harness = buildPythonHarness(harnessOptions);
      const [rawTraceResult, durationMs] = await this.pyodide.runPythonAsync(harness, { globals: locals });

      const resolvedDuration = typeof durationMs === "number"
        ? durationMs
        : typeof durationMs === "string"
          ? Number(durationMs)
          : undefined;

      return {
        trace: this.parseTraceResult(rawTraceResult),
        duration: resolvedDuration,
      };
    } catch (error) {
      console.error("Runtime Tracing Error: ", error);
      throw error;
    }
  }

  private parseTraceResult(rawTraceResult: unknown): TraceStep[] {
    if (typeof rawTraceResult === "string") {
      try {
        return this.parseTraceResult(JSON.parse(rawTraceResult));
      } catch {
        return [];
      }
    }

    if (Array.isArray(rawTraceResult)) {
      return rawTraceResult as TraceStep[];
    }

    return [];
  }
}