// languages/python/harness/templates/bootstrap.py.ts

export const BOOTSTRAP_PYTHON_SCRIPT = `

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
