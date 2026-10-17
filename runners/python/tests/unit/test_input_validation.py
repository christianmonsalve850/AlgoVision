import pytest

from harness import run_submission


@pytest.mark.parametrize(
    ("field", "value", "message"),
    [
        (
            "source_code",
            None,
            "sourceCode must be a string",
        ),
        (
            "test_cases",
            [],
            "testCases must be a non-empty array",
        ),
        (
            "class_name",
            "",
            "className must be a non-empty string",
        ),
        (
            "function_name",
            "",
            "functionName must be a non-empty string",
        ),
    ],
)
def test_rejects_invalid_execution_arguments(
    field, value, message, supabase_test_case
):
    kwargs = {
        "source_code": "class Solution: pass",
        "test_cases": [supabase_test_case],
        "class_name": "Solution",
        "function_name": "solve",
    }
    kwargs[field] = value

    with pytest.raises(ValueError, match=message):
        run_submission(**kwargs)


@pytest.mark.parametrize(
    ("test_case", "message"),
    [
        (None, r"testCases\[0\] must be an object"),
        (
            {
                "id": "case-1",
                "problem_id": "problem-1",
                "input": None,
                "expected_output": 1,
                "is_hidden": False,
                "order_index": 1,
            },
            r"testCases\[0\]\.input must be an object or array",
        ),
        (
            {
                "id": "case-1",
                "problem_id": "problem-1",
                "input": {},
                "is_hidden": False,
                "order_index": 1,
            },
            r"testCases\[0\] is missing expected_output/expectedOutput",
        ),
    ],
)
def test_rejects_malformed_test_cases(test_case, message):
    with pytest.raises(ValueError, match=message):
        run_submission(
            source_code="class Solution: pass",
            test_cases=[test_case],
            class_name="Solution",
            function_name="solve",
        )