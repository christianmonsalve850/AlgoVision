import {
  TraceStep,
  VariablesMap,
  VariableValue,
} from "@/lib/algovision-harness/src/runtime/types";

export function filterUserTrace(trace: TraceStep[]): TraceStep[] {
  const IGNORED_FUNCTIONS = new Set([
    "<module>",
    "__getattr__",
    "__init__",
    "attr",
    "importlib",
  ]);

  return trace.filter((step) => {
    if (IGNORED_FUNCTIONS.has(step.function)) {
      return false;
    }

    if (step.event === "exception") {
      return false;
    }

    return true;
  });
}

export function getDisplayVariables(
  variables: VariablesMap | null | undefined,
): [string, VariableValue][] {
  if (!variables) return [];

  return Object.entries(variables).filter(
    ([key]) => key !== "self" && !key.startsWith("__"),
  ) as [string, VariableValue][];
}
