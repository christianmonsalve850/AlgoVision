// runtime/PythonRuntime.ts

import { BrowserRuntime } from "./browser-runtime";
import { ExecutionOutcome, RuntimeConfig, SupportedLanguage, TraceStep } from "./types";
import type { PyodideInterface } from "pyodide";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/";
const PYODIDE_MODULE_URL = `${PYODIDE_INDEX_URL}pyodide.mjs`;

async function loadBrowserPyodide() {
  const { loadPyodide } = await import(/* webpackIgnore: true */ PYODIDE_MODULE_URL) as Pick<
    typeof import("pyodide"),
    "loadPyodide"
  >;

  return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
}

export class PythonRuntime {
  private browserRuntime: BrowserRuntime | null = null;
  private pyodideInstance: PyodideInterface | null = null;
  private readonly config: RuntimeConfig;
  private readonly language: SupportedLanguage;

  constructor(config: RuntimeConfig = {}) {
    this.config = config;
    this.language = config.language ?? "python";
  }

  /**
   * Initializes the Pyodide WebAssembly layer and boots up the harness.
   */
  public async initialize(): Promise<void> {
    try {
      this.pyodideInstance = await loadBrowserPyodide();

      if (!this.pyodideInstance) {
        throw new Error("Failed to load pyodide.");
      }

      if (this.config.onStdout) {
        this.pyodideInstance.setStdout({ batched: this.config.onStdout });
      }
      if (this.config.onStderr) {
        this.pyodideInstance.setStderr({ batched: this.config.onStderr });
      }

      this.browserRuntime = new BrowserRuntime(this.pyodideInstance, this.language);
      await this.browserRuntime.initializeHarness();
    } catch (error) {
      console.error("Failed to boot Python WebAssembly Environment:", error);
      throw new Error("Initialization failed");
    }
  }

  /**
   * High-level execution gateway called directly by the React code visualization canvas.
   * Takes a raw code block string and provides a language-agnostic step timeline array.
   */
  public async run(userCode: string): Promise<TraceStep[]> {
    return (await this.runWithMetadata(userCode)).trace;
  }

  public async runWithMetadata(userCode: string): Promise<ExecutionOutcome> {
    if (!this.browserRuntime) {
      throw new Error("Runtime has not been initialized. Call .initialize() first.");
    }

    return this.browserRuntime.executeTraceWithMetadata(userCode);
  }
}
