import React, { ReactNode } from "react";
import {
  TraceStep,
  VariablesMap,
  VariableValue,
} from "@/lib/algovision-harness/src/runtime/types";

import { Pointer } from "@/features/practice/problem-page/visualization/components/visualizers/array-visualizer";
import { ArrayVisualizer } from "@/features/practice/problem-page/visualization/components/visualizers/array-visualizer";
export type VisualizerType = "array" | "hashmap" | "tree" | "graph" | "unknown";

export interface ArrayVisualizerConfig {
  type: "array";
  props: {
    data: number[];
    pointers?: Pointer[];
    keepPointers?: boolean;
    highlightedIndices?: number[];
    mode?: "cells" | "bars";
    maxBarHeight?: number;
  };
}

export interface HashMapVisualizerConfig {
  type: "hashmap";
  props: {
    entries: Array<{ key: string; value: VariableValue }>;
    pointers?: Pointer[];
    highlightedKeys?: string[];
  };
}

export interface TreeVisualizerConfig {
  type: "tree";
  props: {
    rootKey: string;
    nodes?: VariableValue;
    highlightNodes?: string[];
    pointers?: Pointer[];
  };
}

export interface GraphVisualizerConfig {
  type: "graph";
  props: {
    nodes?: Array<{ id: string; label?: string }>;
    edges?: Array<{ from: string; to: string }>;
    highlightedNodes?: string[];
    pointers?: Pointer[];
  };
}

export interface UnknownVisualizerConfig {
  type: "unknown";
  props: {
    message: string;
  };
}

export type VisualizerConfig =
  | ArrayVisualizerConfig
  | HashMapVisualizerConfig
  | TreeVisualizerConfig
  | GraphVisualizerConfig
  | UnknownVisualizerConfig;

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

export function formatValue(value: VariableValue): string {
  if (value === null) return "null";

  if (Array.isArray(value)) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export function getTypeLabel(value: VariableValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

export function getDisplayVariables(
  variables: VariablesMap | null | undefined,
): [string, VariableValue][] {
  if (!variables) return [];

  return Object.entries(variables).filter(
    ([key]) => key !== "self" && !key.startsWith("__"),
  ) as [string, VariableValue][];
}

export function arrayVariable(currentStep: TraceStep) {
  if (!currentStep) return null;
  const entries = getDisplayVariables(currentStep.variables);
  const found = entries.find(
    ([, v]) =>
      Array.isArray(v) && v.every((el) => typeof el === "number"),
  );
  if (!found) return null;
  return { name: found[0], data: found[1] as number[] };
}

export function parsePythonIndeces(expression: string) {
  if (!expression) return [];

  // Matches variable names inside square brackets: [ left ], [ i ], [ right ]
  const indexRegex = /\[\s*([a-zA-Za-z_][a-zA-Z0-9_]*)\s*\]/g;
  const indices: string[] = [];

  let match: RegExpExecArray | null;
  while ((match = indexRegex.exec(expression)) !== null) {
    if (match[1]) {
      indices.push(match[1]);
    }
  }

  return Array.from(new Set(indices));
}

export function expressionPointers(currentStep: TraceStep): Pointer[] {
  if (!currentStep?.expression) return [];

  return parsePythonIndeces(currentStep.expression)
    .map((name) => {
      const value = currentStep.variables?.[name];
      if (typeof value !== "number" || Number.isNaN(value)) {
        return null;
      }

      return {
        name,
        index: value,
      };
    })
    .filter((pointer): pointer is Pointer => pointer !== null);
}

export function getVisualizer(currentStep: TraceStep): VisualizerConfig {
  const displayVars = getDisplayVariables(currentStep.variables);

  const arrayCandidate = displayVars.find(
    ([, v]) =>
      Array.isArray(v) && v.every((el) => typeof el === "number"),
  );

  if (arrayCandidate) {
    const pointers = expressionPointers(currentStep);
    const highlightedIndices = pointers.map((pointer) => pointer.index);    

    return {
      type: "array",
      props: {
        data: arrayCandidate[1] as number[],
        pointers,
        keepPointers: true,
        highlightedIndices: highlightedIndices,
      },
    };
  }

  const objectCandidate = displayVars.find(
    ([, v]) =>
      v !== null && typeof v === "object" && !Array.isArray(v),
  );

  if (objectCandidate) {
    const pointers = expressionPointers(currentStep);
    return {
      type: "hashmap",
      props: {
        entries: Object.entries(objectCandidate[1] as {
          [key: string]: VariableValue;
        }).map(([key, value]) => ({ key, value })),
        pointers,
        highlightedKeys: [],
      },
    };
  }

  const expression = (currentStep.expression ?? "").toLowerCase();
  if (/(\b(root|left|right|parent|child|node|tree)\b)/.test(expression)) {
    const pointers = expressionPointers(currentStep);
    return {
      type: "tree",
      props: {
        rootKey: displayVars[0]?.[0] ?? "root",
        nodes: displayVars[0]?.[1],
        highlightNodes: [],
        pointers,
      },
    };
  }

  if (/(\b(graph|adj|neighbors|edges|vertex|vertices|node)\b)/.test(expression)) {
    const pointers = expressionPointers(currentStep);
    return {
      type: "graph",
      props: {
        nodes: [],
        edges: [],
        highlightedNodes: [],
        pointers,
      },
    };
  }

  return {
    type: "unknown",
    props: {
      message: "Unable to infer a visualizer for this trace step.",
    },
  };
}

export function returnVisualizer(currentStep: TraceStep): ReactNode {
  const visualizer = getVisualizer(currentStep);

  switch (visualizer.type) {
    case "array":
      return React.createElement(ArrayVisualizer, visualizer.props);
    case "hashmap":
      return null; // TODO: add HashMapVisualizer component later
    case "tree":
      return null; // TODO: add TreeVisualizer component later
    case "graph":
      return null; // TODO: add GraphVisualizer component later
    case "unknown":
    default:
      return null;
  }
}
