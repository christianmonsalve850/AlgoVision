// lib/algovision-harness/src/languages/python/harness/templates/analyzer.ts
var ANALYZER_PYTHON_SCRIPT = `

class ExpressionCollector(ast.NodeVisitor):
    STATEMENT_TYPES = (ast.stmt, ast.ClassDef, ast.FunctionDef)

    def __init__(self, user_code):
        self.user_code = user_code
        self.expression_map = {
            index + 1: line.strip()
            for index, line in enumerate(user_code.splitlines())
        }
        self.line_types = {}

    def _collect_expression_text(self, node):
        if not isinstance(node, self.STATEMENT_TYPES) or not hasattr(node, "lineno"):
            return

        segment = ast.get_source_segment(self.user_code, node)
        if not segment:
            return

        first_line_of_segment = segment.splitlines()[0]
        self.expression_map[node.lineno] = first_line_of_segment

    def generic_visit(self, node):
        """
        Intercepts statements to populate the text expression map
        without breaking tree traversal.
        """
        self._collect_expression_text(node)
        super().generic_visit(node)

    def _resolve_target_name(self, node):
        if not node.targets:
            return None

        first_target = node.targets[0]
        if isinstance(first_target, ast.Name):
            return first_target.id

        if isinstance(first_target, ast.Subscript) and isinstance(first_target.value, ast.Name):
            return first_target.value.id

        return None

    def _record_line_type(self, lineno, line_type, target_name=None):
        metadata = {"type": line_type}
        if target_name is not None:
            metadata["target"] = target_name
        self.line_types[lineno] = metadata

    def visit_Assign(self, node):
        target_name = self._resolve_target_name(node)
        uses_subscript = any(isinstance(target, ast.Subscript) for target in node.targets)
        line_type = "mutation" if uses_subscript else "assignment"

        self._record_line_type(node.lineno, line_type, target_name)
        self.generic_visit(node)

    def visit_AugAssign(self, node):
        target_name = node.target.id if isinstance(node.target, ast.Name) else None
        self._record_line_type(node.lineno, "assignment", target_name)
        self.generic_visit(node)

    def visit_Return(self, node):
        self._record_line_type(node.lineno, "return")
        self.generic_visit(node)

    def visit_For(self, node):
        self._record_line_type(node.lineno, "loop")
        self.generic_visit(node)

    def visit_While(self, node):
        self._record_line_type(node.lineno, "loop")
        self.generic_visit(node)


class StaticAnalyzer:
    """
    Coordinator layer parsed internally by the Pyodide harness
    prior to starting runtime tracing passes.
    """
    @staticmethod
    def analyze(user_code: str):
        tree = ast.parse(user_code)
        collector = ExpressionCollector(user_code)
        collector.visit(tree)

        return {
            "expression_map": collector.expression_map,
            "line_metadata": collector.line_types
        }
`;

// lib/algovision-harness/src/languages/python/harness/templates/bootstrap.ts
var BOOTSTRAP_PYTHON_SCRIPT = `

analyzer_output = StaticAnalyzer.analyze(user_code)

expression_map = analyzer_output.get("expression_map")
line_metadata = analyzer_output.get("line_metadata")


def build_event_payload(event_type, metadata):
    if event_type in {"assignment", "mutation"} and metadata:
        return {"target": metadata.get("target")}
    return None


def emit_specialized_event(event_type, frame, expression, variables, metadata=None):
    emit_event(event_type, frame, expression, variables, build_event_payload(event_type, metadata))


LINE_EVENT_HANDLERS = {
    "assignment": lambda frame, expression, variables, metadata: emit_specialized_event("assignment", frame, expression, variables, metadata),
    "mutation": lambda frame, expression, variables, metadata: emit_specialized_event("mutation", frame, expression, variables, metadata),
    "loop": lambda frame, expression, variables, metadata: emit_specialized_event("loop", frame, expression, variables, metadata),
}


def is_duplicate_line_event(func_name, line_offset, variables):
    if not context.trace:
        return False

    last_step = context.trace[-1]
    return (
        last_step["event"] == "line"
        and last_step["function"] == func_name
        and last_step["line"] == line_offset
        and last_step["variables"] == variables
    )


def sync_last_step_variables(current_variables):
    if context.last_emitted_step is None:
        return

    previous_state = context.last_emitted_step.get("variables", {})
    changed = [
        var_name
        for var_name, current_value in current_variables.items()
        if (var_name not in previous_state or previous_state[var_name] != current_value) and var_name != "self"
    ]

    context.last_emitted_step["variables"] = current_variables
    context.last_emitted_step["changedVariables"] = changed


def emit_event(event_type, frame, expression, variables, extra_payload=None):
    """
    Unified event producer for AlgoVision.
    Converts raw Python frame data into clean visualizer timeline steps.
    """

    line_no = frame.f_lineno
    func_name = frame.f_code.co_name
    line_offset = get_line_offset(line_no)

    context.step_count += 1

    step_data = {
        "step": context.step_count,
        "event": event_type,  # "line" | "assignment" | "mutation" | "call" | "return" | "exception"
        "line": line_offset,
        "expression": expression,
        "function": func_name,
        "call_depth": context.call_depth,
        "variables": variables,
    }

    if extra_payload:
        step_data.update(extra_payload)

    context.trace.append(step_data)
    context.last_emitted_step = step_data


def handle_line_event(frame, expression, variables):
    """
    Processes line-level execution milestones to capture control flow tracking.
    """

    code = frame.f_code
    func_name = code.co_name
    line_no = frame.f_lineno
    line_offset = get_line_offset(line_no)

    # 1. Strict Filter: Skip empty evaluations and comment blocks
    if not expression or expression.startswith("#"):
        return

    if looks_like_assignment(expression):
        return

    # 2. Deduplicate consecutive identical line triggers
    # (Prevents loop expressions from stuttering before their iterations kick off)
    if is_duplicate_line_event(func_name, line_offset, variables):
        return

    # 3. Record the control flow milestone
    emit_event("line", frame, expression, variables)


def tracer(frame, event, arg=None):
    if context.step_count >= HARNESS_OPTIONS["max_trace_steps"]:
        return "Error Message"
    
    frame.f_trace_opcodes = True

    line_no = frame.f_lineno
    expression = expression_map.get(line_no, "")
    line_offset = get_line_offset(line_no)

    if should_skip_class_definition_event(frame, event, expression):
        return tracer

    current_variables = capture_variables(frame)
    sync_last_step_variables(current_variables)

    if event == "line":
        metadata = line_metadata.get(line_offset)

        if metadata:
            line_type = metadata.get("type")
            handler = LINE_EVENT_HANDLERS.get(line_type)

            if handler:
                handler(frame, expression, current_variables, metadata)
                return tracer

        elif expression and not expression.startswith(("#", "def ")):
            # Fallback for plain control flow lines (ifs, elifs, etc.)
            handle_line_event(frame, expression, current_variables)

    elif event == "call":
        if expression or frame.f_code.co_name != "<module>":
            context.call_depth += 1
            emit_event("call", frame, expression, current_variables)

    elif event == "return":
        if frame.f_code.co_name != "<module>" and arg:
            emit_event("return", frame, expression, current_variables, {
                "return_value": copy.deepcopy(arg)  # arg contains the return value
            })
        context.call_depth = max(0, context.call_depth - 1)

    elif event == "exception":
        exc_class, exc_instance, _ = arg

        # Emit a clean exception payload
        emit_event("exception", frame, expression, current_variables, {
            "exception": {
                "type": exc_class.__name__,
                "message": str(exc_instance)
            }
        })

    return tracer


settrace(tracer)

duration_ms = None

try:
    start_cpu = time.perf_counter()
    exec(compiled, context.execution_namespace)
    end_cpu = time.perf_counter()
    duration_ms = (end_cpu - start_cpu) * 1000
except Exception as e:
    # This catches fatal execution or syntax crashes that stop the machine completely
    fatal_error_payload = {
        "success": False,
        "error": {
            "type": e.__class__.__name__,
            "message": str(e)
        }
    }
finally:
    settrace(None)

trace_result = json.dumps(context.trace, default=json_advanced_serializer, indent=4)
trace_result, duration_ms
`;

// lib/algovision-harness/src/languages/python/harness/templates/helpers.ts
var TRACE_HELPERS_PYTHON_SCRIPT = `

ASSIGNMENT_PREFIXES = ("if ", "for ", "while ", "return ", "class ", "def ", "elif ", "try:", "except", "with ")
COMPARISON_TOKENS = ("==", "!=", "<=", ">=", " is ", " in ")


def looks_like_assignment(expression):
    if not expression:
        return False

    stripped = expression.strip()
    if stripped.startswith(ASSIGNMENT_PREFIXES):
        return False

    if any(token in stripped for token in COMPARISON_TOKENS):
        return False

    return "=" in stripped


def get_line_offset(line_no):
    if context.first_line is None:
        context.first_line = line_no
    return line_no - context.first_line


def should_skip_class_definition_event(frame, event, expression):
    if not expression:
        return False

    stripped = expression.strip()
    if not stripped.startswith("class "):
        return False

    if event == "line":
        return True

    if event == "call" and frame.f_code.co_name != "<module>":
        return True

    return False
`;

// lib/algovision-harness/src/languages/python/harness/templates/serializer.ts
var SERIALIZER = `

def json_advanced_serializer(obj):
    if hasattr(obj, "__qualname__"):
        return {
            "__type__": "callable",
            "name": obj.__qualname__,
            "module": getattr(obj, "__module__", None),
        }

    if hasattr(obj, "__dict__"):
        return {
            "__class__": obj.__class__.__name__,
            "__module__": obj.__class__.__module__,
            "data": obj.__dict__,
        }

    return serialize_fallback_value(obj)


def serialize_fallback_value(obj):
    try:
        return str(obj)
    except Exception:
        return "<Unserializable>"
`;

// lib/algovision-harness/src/languages/python/harness/templates/snapshot.ts
var SNAPSHOT_PYTHON_SCRIPT = `

def is_internal_variable(name, value):
    if name.startswith("__"):
        return True

    value_type_name = type(value).__name__
    return "Proxy" in value_type_name or "frame" in value_type_name


def copy_variable_value(value):
    try:
        return copy.deepcopy(value)
    except Exception:
        try:
            if isinstance(value, dict):
                return dict(value)
            if isinstance(value, list):
                return list(value)
            if isinstance(value, set):
                return set(value)
            return copy.copy(value)
        except Exception:
            return str(value)


def capture_variables(frame):
    """
    Safely captures and deep-copies the current frame's local variables,
    filtering out internal Python noise and frames.
    """
    variables = {}
    locals_copy = dict(frame.f_locals)

    for variable_name, value in locals_copy.items():
        if is_internal_variable(variable_name, value):
            continue

        variables[variable_name] = copy_variable_value(value)

    return variables


def register_code(code):
    context.instruction_maps[code] = {
        instr.offset: instr
        for instr in dis.get_instructions(code)
    }

    for nested_code in code.co_consts:
        if hasattr(nested_code, "co_code"):
            register_code(nested_code)

compiled = compile(user_code, "<user_code>", "exec")
register_code(compiled)
`;

// lib/algovision-harness/src/execution-context.ts
var EXECUTION_CONTEXT_SCRIPT = `
class ExecutionContext:
    """
    Natively tracks the chronological state of the runner timeline
    without relying on unstable global pollution hooks.
    """
    def __init__(self):
        self.trace = []
        self.first_line = None
        self.execution_namespace = {}
        self.step_count = 0
        self.call_depth = 0
        self.last_emitted_step = None
        self.instruction_maps = {}

        
context = ExecutionContext()
`;

// lib/algovision-harness/src/languages/python/buildPythonHarness.ts
function buildPythonHarness(options) {
  const maxTraceSteps = options.maxTraceSteps ?? 1e3;
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

// lib/algovision-harness/src/runtime/browser-runtime.ts
var BrowserRuntime = class {
  constructor(pyodideInstance, language = "python") {
    this.isInitialized = false;
    this.pyodide = pyodideInstance;
    this.language = language;
  }
  /**
   * Loads the modular Python engine scripts into the Pyodide environment.
   * This prepares the environment once per session or initialization boundary.
   */
  async initializeHarness() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }
  /**
   * Executes a piece of code, producing an entirely isolated, fresh trace timeline.
   */
  async executeTrace(userCode) {
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
  async executePythonTrace(userCode) {
    const outcome = await this.executeTraceWithMetadata(userCode);
    return outcome.trace;
  }
  async executeTraceWithMetadata(userCode) {
    try {
      const harnessOptions = {
        source: userCode,
        maxTraceSteps: 1e3,
        traceMode: "function"
      };
      const locals = this.pyodide.toPy({
        user_code: userCode
      });
      const harness = buildPythonHarness(harnessOptions);
      const [rawTraceResult, durationMs] = await this.pyodide.runPythonAsync(harness, { globals: locals });
      const resolvedDuration = typeof durationMs === "number" ? durationMs : typeof durationMs === "string" ? Number(durationMs) : void 0;
      return {
        trace: this.parseTraceResult(rawTraceResult),
        duration: resolvedDuration
      };
    } catch (error) {
      console.error("Runtime Tracing Error: ", error);
      throw error;
    }
  }
  parseTraceResult(rawTraceResult) {
    if (typeof rawTraceResult === "string") {
      try {
        return this.parseTraceResult(JSON.parse(rawTraceResult));
      } catch {
        return [];
      }
    }
    if (Array.isArray(rawTraceResult)) {
      return rawTraceResult;
    }
    return [];
  }
};

// lib/algovision-harness/src/runtime/python-runtime.ts
var PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/";
var PYODIDE_MODULE_URL = `${PYODIDE_INDEX_URL}pyodide.mjs`;
async function loadBrowserPyodide() {
  const { loadPyodide } = await import(
    /* webpackIgnore: true */
    PYODIDE_MODULE_URL
  );
  return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
}
var PythonRuntime = class {
  constructor(config = {}) {
    this.browserRuntime = null;
    this.pyodideInstance = null;
    this.config = config;
    this.language = config.language ?? "python";
  }
  /**
   * Initializes the Pyodide WebAssembly layer and boots up the harness.
   */
  async initialize() {
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
  async run(userCode) {
    return (await this.runWithMetadata(userCode)).trace;
  }
  async runWithMetadata(userCode) {
    if (!this.browserRuntime) {
      throw new Error("Runtime has not been initialized. Call .initialize() first.");
    }
    return this.browserRuntime.executeTraceWithMetadata(userCode);
  }
};

// lib/algovision-harness/src/runtime/runtime-factory.ts
function createRuntime(language, config = {}) {
  switch (language) {
    case "python":
      return new PythonRuntime(config);
    default:
      throw new Error(`Unsupported runtime language: ${language}`);
  }
}

// lib/algovision-harness/src/runtime/messages.ts
function createWorkerSuccessResponse(trace = [], duration) {
  return {
    type: "SUCCESS",
    trace,
    duration
  };
}
function createWorkerErrorResponse(error) {
  return {
    type: "ERROR",
    error
  };
}

// lib/algovision-harness/src/worker/worker.ts
var runtime = createRuntime("python");
self.onmessage = async (event) => {
  const message = event.data;
  switch (message.type) {
    case "INITIALIZE":
      try {
        await runtime.initialize();
        self.postMessage({ type: "INITIALIZED" });
      } catch (err) {
        self.postMessage(createWorkerErrorResponse(err.message || "Failed to boot WebAssembly compilation context."));
      }
      break;
    case "RUN":
      try {
        const executionResult = await runtime.runWithMetadata(String(message.userCode));
        self.postMessage(createWorkerSuccessResponse(executionResult.trace, executionResult.duration));
      } catch (err) {
        self.postMessage(createWorkerErrorResponse(err.message || "Runtime execution tracking exception."));
      }
      break;
  }
};
