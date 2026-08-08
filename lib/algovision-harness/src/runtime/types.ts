export type SupportedLanguage = "python";

export interface TraceStep {
  step: number;
  event: string;
  line: number;
  expression: string;
  function: string;
  call_depth: number;
  variables: Record<string, any>;
  changedVariables: string[];
  target?: string;
  return_value?: any;
}

export interface ExecutionOutcome {
  trace: TraceStep[];
  duration?: number;
}

export interface RuntimeConfig {
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
  language?: SupportedLanguage;
}