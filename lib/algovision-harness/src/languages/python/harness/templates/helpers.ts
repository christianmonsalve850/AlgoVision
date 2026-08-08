// languages/python/harness/templates/helpers.py.ts

export const TRACE_HELPERS_PYTHON_SCRIPT = `

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
