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
  name: string;
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
  name: string;
  type: "hashmap";
  props: {
    entries: Array<{ key: string; value: VariableValue }>;
    pointers?: Pointer[];
    highlightedKeys?: string[];
  };
}

export interface TreeVisualizerConfig {
  name: string;
  type: "tree";
  props: {
    rootKey: string;
    nodes?: VariableValue;
    highlightNodes?: string[];
    pointers?: Pointer[];
  };
}

export interface GraphVisualizerConfig {
  name: string;
  type: "graph";
  props: {
    nodes?: Array<{ id: string; label?: string }>;
    edges?: Array<{ from: string; to: string }>;
    highlightedNodes?: string[];
    pointers?: Pointer[];
  };
}

export interface UnknownVisualizerConfig {
  name: string;
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

export interface RenderedVisualizer {
  name: string;
  type: VisualizerType;
  visualization: ReactNode;
}

export interface ExpressionPointersResult {
  pointers: Pointer[];
  highlightedIndices: number[];
}

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

export function parsePythonIndices(
  expression: string, 
  varName?: string
): { variables: string[]; literals: number[] } {
  if (!expression) return { variables: [], literals: [] };

  // Captures both variable names (group 1) AND integer literals (group 2)
  const pattern = varName
    ? new RegExp(
        `${varName}\\s*\\[\\s*(?:([a-zA-Za-z_][a-zA-Z0-9_]*)|(\\d+))\\s*\\]`,
        "g"
      )
    : /\[\s*(?:([a-zA-Za-z_][a-zA-Z0-9_]*)|(\d+))\s*\]/g;

  const variables: string[] = [];
  const literals: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(expression)) !== null) {
    if (match[1]) {
      variables.push(match[1]); // Variable pointer (e.g. 'left', 'r')
    } else if (match[2]) {
      literals.push(parseInt(match[2], 10)); // Literal index (e.g. 0, 1)
    }
  }

  return {
    variables: Array.from(new Set(variables)),
    literals: Array.from(new Set(literals)),
  };
}

export function expressionPointers(
  currentStep: TraceStep,
  varName: string
): ExpressionPointersResult {
  if (!currentStep?.expression) {
    return { pointers: [], highlightedIndices: [] };
  }

  const { variables, literals } = parsePythonIndices(
    currentStep.expression,
    varName
  );

  const pointers: Pointer[] = variables
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

  const pointerIndices = pointers.map((p) => p.index);
  const highlightedIndices = Array.from(
    new Set([...pointerIndices, ...literals])
  );

  return {
    pointers,
    highlightedIndices,
  };
}

export function getVisualizers(currentStep: TraceStep): VisualizerConfig[] {
  const displayVars = getDisplayVariables(currentStep.variables);
  const visualizers: VisualizerConfig[] = [];

  // 1. Array Visualizers
  const arrayCandidates = displayVars.filter(
    ([, v]) => Array.isArray(v) && v.every((el) => typeof el === "number"),
  );

  if (arrayCandidates.length > 0) {
  arrayCandidates.forEach(([varName, varValue]) => {
    // Destructure both properties directly from expressionPointers
    const { pointers, highlightedIndices } = expressionPointers(
      currentStep,
      varName
    );
    
    visualizers.push({
      name: varName,
      type: "array",
      props: {
        data: varValue as number[],
        pointers,
        keepPointers: true,
        highlightedIndices, // Now includes literal indices as well as pointer locations
      },
    });
  });
}

  // 2. Hashmap Visualizers
  const objectCandidates = displayVars.filter(
    ([, v]) => v !== null && typeof v === "object" && !Array.isArray(v),
  );

  if (objectCandidates.length > 0) {
    const pointers = undefined;

    objectCandidates.forEach(([varName, varValue]) => {
      visualizers.push({
        name: varName,
        type: "hashmap",
        props: {
          entries: Object.entries(
            varValue as Record<string, VariableValue>,
          ).map(([key, value]) => ({ key, value })),
          pointers,
          highlightedKeys: [],
        },
      });
    });
  }

  // 3. Tree Visualizer
  const expression = (currentStep.expression ?? "").toLowerCase();
  if (/(\b(root|left|right|parent|child|node|tree)\b)/.test(expression)) {
    const pointers = undefined;
    visualizers.push({
      name: displayVars[0]?.[0] ?? "tree",
      type: "tree",
      props: {
        rootKey: displayVars[0]?.[0] ?? "root",
        nodes: displayVars[0]?.[1],
        highlightNodes: [],
        pointers,
      },
    });
  }

  // 4. Graph Visualizer
  if (/(\b(graph|adj|neighbors|edges|vertex|vertices|node)\b)/.test(expression)) {
    const pointers = undefined;
    visualizers.push({
      name: "graph",
      type: "graph",
      props: {
        nodes: [],
        edges: [],
        highlightedNodes: [],
        pointers,
      },
    });
  }

  // Fallback if no matching structure was inferred
  if (visualizers.length === 0) {
    visualizers.push({
      name: "unknown",
      type: "unknown",
      props: {
        message: "Unable to infer a visualizer for this trace step.",
      },
    });
  }

  return visualizers;
}

export function returnVisualizer(currentStep: TraceStep): RenderedVisualizer[] {
  const visualizers: VisualizerConfig[] = getVisualizers(currentStep);

  return visualizers
    .map((visualizer): RenderedVisualizer | null => {
      switch (visualizer.type) {
        case "array":
          return {
            name: visualizer.name,
            type: visualizer.type,
            visualization: React.createElement(ArrayVisualizer, visualizer.props),
          };
        case "hashmap":
        case "tree":
        case "graph":
        case "unknown":
        default:
          return null;
      }
    })
    .filter((v): v is RenderedVisualizer => v !== null);
}
