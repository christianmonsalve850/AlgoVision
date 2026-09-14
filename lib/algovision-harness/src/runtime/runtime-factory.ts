import { PythonRuntime } from "./python-runtime";
import { ExecutionOptions, ExecutionOutcome, RuntimeConfig, SupportedLanguage, TraceStep } from "./types";

export interface RuntimeAdapter {
  initialize(): Promise<void>;
  run(userCode: string): Promise<TraceStep[]>;
  runWithMetadata(
    userCode: string,
    inputs?: Record<string, unknown>,
    execution?: ExecutionOptions,
  ): Promise<ExecutionOutcome>;
}

export function createRuntime(language: SupportedLanguage, config: RuntimeConfig = {}): RuntimeAdapter {
  switch (language) {
    case "python":
      return new PythonRuntime(config);
    default:
      throw new Error(`Unsupported runtime language: ${language}`);
  }
}
