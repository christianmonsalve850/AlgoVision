export type SupportedLanguage = "python";

export type TraceEventType =
  | "assignment"
  | "line"
  | "call"
  | "return"
  | "expression"
  | "exception";

export type VariableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | VariableValue[]
  | { [key: string]: VariableValue };

export type VariablesMap = Record<string, VariableValue>;

export interface TraceStep {
  step: number;
  event: TraceEventType;
  line: number;
  expression: string;
  function: string;
  call_depth: number;
  variables: VariablesMap;
  changedVariables: string[];
  target?: string | null;
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