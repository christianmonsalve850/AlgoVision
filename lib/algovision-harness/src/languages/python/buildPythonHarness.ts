import { ANALYZER_PYTHON_SCRIPT } from "./harness/templates/analyzer";
import { BOOTSTRAP_PYTHON_SCRIPT } from "./harness/templates/bootstrap";
import { TRACE_HELPERS_PYTHON_SCRIPT } from "./harness/templates/helpers";
import { SERIALIZER } from "./harness/templates/serializer";
import { SNAPSHOT_PYTHON_SCRIPT } from "./harness/templates/snapshot";
import { EXECUTION_CONTEXT_SCRIPT } from "../../execution-context";

export interface HarnessOptions {
    source: string;
    maxTraceSteps?: number;
    traceMode?: "function" | "program";
}

export function buildPythonHarness(options: HarnessOptions): string {
    const maxTraceSteps = options.maxTraceSteps ?? 1000;
    const traceMode = JSON.stringify(options.traceMode ?? "function");

    return `
import copy
from sys import settrace
import time
import dis
import ast
import json
import types
import sys

HARNESS_OPTIONS = {
    "max_trace_steps": ${maxTraceSteps},
    "trace_mode": ${traceMode},
}

${TRACE_HELPERS_PYTHON_SCRIPT}
${ANALYZER_PYTHON_SCRIPT}
${SERIALIZER}
${EXECUTION_CONTEXT_SCRIPT}
${SNAPSHOT_PYTHON_SCRIPT}
${BOOTSTRAP_PYTHON_SCRIPT}
`;
}
