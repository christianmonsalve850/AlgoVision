import copy
import sys
from types import FrameType, TracebackType
from typing import Any

from tracing.analyzer import StaticAnalyzer


class TraceRecorder:
    def __init__(self, source_code: str, max_steps: int = 1000) -> None:
        analysis = StaticAnalyzer.analyze(source_code)
        self.expression_map: dict[int, str] = analysis["expression_map"]
        self.line_metadata: dict[int, dict[str, Any]] = analysis["line_metadata"]
        self.source_lines = source_code.splitlines()
        self.max_steps = max_steps
        self.trace: list[dict[str, Any]] = []
        self.call_depth = 0
        self._previous_trace = None

    def __enter__(self) -> "TraceRecorder":
        self._previous_trace = sys.gettrace()
        sys.settrace(self._trace)
        return self

    def __exit__(
        self,
        exception_type: type[BaseException] | None,
        exception: BaseException | None,
        traceback: TracebackType | None,
    ) -> bool:
        sys.settrace(self._previous_trace)
        return False

    def _trace(
        self,
        frame: FrameType,
        event: str,
        argument: Any,
    ):
        if frame.f_code.co_filename != "<user_code>":
            return None

        if len(self.trace) >= self.max_steps:
            sys.settrace(None)
            return None

        line_number = frame.f_lineno
        expression = self.expression_map.get(
            line_number,
            self.source_lines[line_number - 1].strip()
            if 0 < line_number <= len(self.source_lines)
            else "",
        )

        if self._should_skip_class_definition(frame, event, expression):
            return self._trace

        variables = self._capture_variables(frame)
        self._sync_last_step_variables(variables)

        if event == "line":
            self._record_line_event(frame, expression, variables)
        elif event == "call":
            if expression or frame.f_code.co_name != "<module>":
                self.call_depth += 1
                self._emit_event("call", frame, expression, variables)
        elif event == "return":
            if frame.f_code.co_name != "<module>":
                self._emit_event(
                    "return",
                    frame,
                    expression,
                    variables,
                    {"return_value": self._copy_variable_value(argument)},
                )
            self.call_depth = max(0, self.call_depth - 1)
        elif event == "exception":
            exception_class, exception, _ = argument
            self._emit_event(
                "exception",
                frame,
                expression,
                variables,
                {
                    "exception": {
                        "type": exception_class.__name__,
                        "message": str(exception),
                    }
                },
            )

        return self._trace

    def _record_line_event(
        self,
        frame: FrameType,
        expression: str,
        variables: dict[str, Any],
    ) -> None:
        metadata = self.line_metadata.get(frame.f_lineno)
        line_type = metadata.get("type") if metadata else None

        if line_type in {"assignment", "mutation", "loop"}:
            extra_payload = (
                {"target": metadata.get("target")}
                if line_type in {"assignment", "mutation"}
                else None
            )
            self._emit_event(
                line_type,
                frame,
                expression,
                variables,
                extra_payload,
            )
            return

        if (
            not expression
            or expression.startswith("#")
            or self._looks_like_assignment(expression)
            or self._is_duplicate_line_event(frame, variables)
        ):
            return

        if not expression.startswith("def "):
            self._emit_event("line", frame, expression, variables)

    def _emit_event(
        self,
        event_type: str,
        frame: FrameType,
        expression: str,
        variables: dict[str, Any],
        extra_payload: dict[str, Any] | None = None,
    ) -> None:
        step = {
            "step": len(self.trace) + 1,
            "event": event_type,
            "line": frame.f_lineno - 1,
            "expression": expression,
            "function": frame.f_code.co_name,
            "call_depth": self.call_depth,
            "variables": variables,
            "changedVariables": [],
        }
        if extra_payload:
            step.update(extra_payload)
        self.trace.append(step)

    def _sync_last_step_variables(self, variables: dict[str, Any]) -> None:
        if not self.trace:
            return

        previous_step = self.trace[-1]
        previous_variables = previous_step["variables"]
        changed_variables = [
            name
            for name, value in variables.items()
            if name != "self" and previous_variables.get(name) != value
        ]
        previous_step["variables"] = variables
        previous_step["changedVariables"] = changed_variables

    def _is_duplicate_line_event(
        self,
        frame: FrameType,
        variables: dict[str, Any],
    ) -> bool:
        if not self.trace:
            return False

        last_step = self.trace[-1]
        return (
            last_step["event"] == "line"
            and last_step["function"] == frame.f_code.co_name
            and last_step["line"] == frame.f_lineno - 1
            and last_step["variables"] == variables
        )

    @staticmethod
    def _looks_like_assignment(expression: str) -> bool:
        stripped = expression.strip()
        if stripped.startswith(
            (
                "if ",
                "for ",
                "while ",
                "return ",
                "class ",
                "def ",
                "elif ",
                "try:",
                "except",
                "with ",
            )
        ):
            return False
        if any(token in stripped for token in ("==", "!=", "<=", ">=", " is ", " in ")):
            return False
        return "=" in stripped

    @staticmethod
    def _should_skip_class_definition(
        frame: FrameType,
        event: str,
        expression: str,
    ) -> bool:
        if not expression.strip().startswith("class "):
            return False
        return event == "line" or (
            event == "call" and frame.f_code.co_name != "<module>"
        )

    @classmethod
    def _capture_variables(cls, frame: FrameType) -> dict[str, Any]:
        variables = {}
        for name, value in dict(frame.f_locals).items():
            if name.startswith("__"):
                continue
            if "Proxy" in type(value).__name__ or "frame" in type(value).__name__:
                continue
            variables[name] = cls._copy_variable_value(value)
        return variables

    @staticmethod
    def _copy_variable_value(value: Any) -> Any:
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
