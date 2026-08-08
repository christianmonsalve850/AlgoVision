// languages/python/harness/templates/snapshot.py.ts

export const SNAPSHOT_PYTHON_SCRIPT = `

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