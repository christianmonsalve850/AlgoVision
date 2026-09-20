import {
  buildPythonHarness,
  HarnessOptions,
} from "../languages/python/buildPythonHarness";

import {
  ExecutionOptions,
  ExecutionOutcome,
  SupportedLanguage,
  TraceStep,
} from "./types";
import { PyodideInterface } from "pyodide";

export type HarnessLanguage = SupportedLanguage;

export class BrowserRuntime {
  private readonly pyodide: PyodideInterface;
  private readonly language: HarnessLanguage;
  private isInitialized = false;

  constructor(
    pyodideInstance: PyodideInterface,
    language: HarnessLanguage = "python",
  ) {
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
    return outcome.trace ?? [];
  }

  public async executeTraceWithMetadata(
    userCode: string,
    inputs: Record<string, unknown> = {},
    execution: ExecutionOptions = {},
  ): Promise<ExecutionOutcome> {
    try {
      const harnessOptions: HarnessOptions = {
        source: userCode,
        maxTraceSteps: 1000,
        traceMode: "function",
      };

      const locals = this.pyodide.toPy({
        user_code: userCode,
        test_inputs_json: JSON.stringify(inputs),
        execution_options_json: JSON.stringify(execution),
      });

      const harness = buildPythonHarness(harnessOptions);
      const [rawTraceResult, durationMs] = await this.pyodide.runPythonAsync(
        harness,
        { globals: locals },
      );

      const resolvedDuration =
        typeof durationMs === "number"
          ? durationMs
          : typeof durationMs === "string"
            ? Number(durationMs)
            : undefined;

      return {
        success: true,
        trace: this.parseTraceResult(rawTraceResult),
        duration: resolvedDuration,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorDetails = this.createErrorDetails(error, errorMessage, userCode);

      return {
        success: false,
        trace: [],
        error: errorMessage,
        errorDetails,
      };
    }
  }

  private createErrorDetails(
    error: unknown,
    errorMessage: string,
    userCode: string,
  ) {
    const errorName =
      error instanceof Error && error.name
        ? error.name
        : /SyntaxError/i.test(errorMessage)
          ? "SyntaxError"
          : "ExecutionError";
    const userCodeFrame = errorMessage.match(
      /File ["']<user_code>["'], line (\d+)(?:[^\n]*\n)?([^\n]*)/i,
    );
    const lineMatch = errorMessage.match(/(?:line|lineno)\s*[:=]?\s*(\d+)/i);
    const line = userCodeFrame
      ? Number(userCodeFrame[1])
      : lineMatch
        ? Number(lineMatch[1])
        : null;
    const code = line ? userCode.split("\n")[line - 1]?.trim() ?? null : null;
    const typeMatch = errorMessage.match(/\b([A-Za-z]+Error)\s*:\s*([\s\S]*?)(?:\n|$)/);
    const type = typeMatch?.[1] ?? errorName;
    const message = typeMatch?.[2]?.trim() || errorMessage.split("\n").at(-1)?.trim() || errorMessage;

    return {
      type,
      line,
      code: code ?? userCodeFrame?.[2]?.trim() ?? null,
      message,
    };
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
