import contextlib
import io
from collections.abc import Mapping
from typing import Any


def _same_json_value(actual: Any, expected: Any) -> bool:
    if isinstance(actual, bool) or isinstance(expected, bool):
        return type(actual) is type(expected) and actual == expected

    if isinstance(actual, (int, float)) and isinstance(expected, (int, float)):
        return actual == expected

    if isinstance(actual, list) and isinstance(expected, list):
        return len(actual) == len(expected) and all(
            _same_json_value(a, e) for a, e in zip(actual, expected)
        )

    if isinstance(actual, dict) and isinstance(expected, dict):
        return actual.keys() == expected.keys() and all(
            _same_json_value(actual[key], expected[key]) for key in actual
        )

    return type(actual) is type(expected) and actual == expected


def run_submission(
    source_code: str,
    test_cases: list[dict[str, Any]],
    class_name: str,
    function_name: str,
) -> dict[str, Any]:
    """Execute a class-based Python solution against named or positional inputs."""
    # Check that inputs are valid
    if not isinstance(source_code, str):
        raise ValueError("sourceCode must be a string")
    if not isinstance(test_cases, list) or not test_cases:
        raise ValueError("testCases must be a non-empty array")
    if not isinstance(class_name, str) or not class_name:
        raise ValueError("className must be a non-empty string")
    if not isinstance(function_name, str) or not function_name:
        raise ValueError("functionName must be a non-empty string")

    prepared_cases = []
    for index, test_case in enumerate(test_cases):
        if not isinstance(test_case, Mapping):
            raise ValueError(f"testCases[{index}] must be an object")

        inputs = test_case.get("input")
        if not isinstance(inputs, (dict, list)):
            raise ValueError(f"testCases[{index}].input must be an object or array")

        if "expected_output" in test_case:
            expected_output = test_case["expected_output"]
        elif "expectedOutput" in test_case:
            expected_output = test_case["expectedOutput"]
        else:
            raise ValueError(
                f"testCases[{index}] is missing expected_output/expectedOutput"
            )

        prepared_cases.append(
            (test_case.get("id", str(index)), inputs, expected_output)
        )

    try:
        compiled_code = compile(source_code, "<submission>", "exec")
        compile_error = None
    except Exception as error:
        compiled_code = None
        compile_error = error

    # Run code and compare output to expected output
    results = []
    for test_case_id, inputs, expected_output in prepared_cases:
        captured_stdout = io.StringIO()
        try:
            if compile_error is not None:
                raise compile_error

            namespace: dict[str, Any] = {"__name__": "__submission__"}
            with contextlib.redirect_stdout(captured_stdout):
                exec(compiled_code, namespace)

                solution_class = namespace[class_name]
                if not isinstance(solution_class, type):
                    raise TypeError(f"{class_name} is not a class")

                solution = solution_class()
                function = getattr(solution, function_name)
                if not callable(function):
                    raise TypeError(f"{class_name}.{function_name} is not callable")

                actual_output = (
                    function(**inputs)
                    if isinstance(inputs, dict)
                    else function(*inputs)
                )

            passed = _same_json_value(actual_output, expected_output)
            result = {
                "testCaseId": test_case_id,
                "status": "passed" if passed else "failed",
                "passed": passed,
                "actualOutput": actual_output,
                "expectedOutput": expected_output,
                "stdout": captured_stdout.getvalue(),
            }
        except Exception as error:
            result = {
                "testCaseId": test_case_id,
                "status": "error",
                "passed": False,
                "actualOutput": None,
                "expectedOutput": expected_output,
                "error": str(error),
                "errorType": type(error).__name__,
                "stdout": captured_stdout.getvalue(),
            }

        results.append(result)

    if any(result["status"] == "error" for result in results):
        verdict = "runtime_error"
    elif all(result["passed"] for result in results):
        verdict = "accepted"
    else:
        verdict = "wrong_answer"

    return {
        "status": "completed",
        "verdict": verdict,
        "passed": sum(result["passed"] for result in results),
        "total": len(results),
        "results": results,
    }
