from harness import run_single_test, run_submission
from runner import run_once


def test_single_test_returns_only_one_case_result():
    result = run_single_test(
        source_code=(
            "class Solution:\n"
            "    def solve(self, value):\n"
            "        return value + 1\n"
        ),
        test_case={"input": {"value": 41}, "expectedOutput": 42},
        class_name="Solution",
        function_name="solve",
    )

    assert result == {
        "status": "passed",
        "correct": True,
        "actualOutput": 42,
        "stdout": "",
    }


def test_single_test_reports_incorrect_output_without_suite_grade():
    result = run_once(
        {
            "operation": "test",
            "sourceCode": "class Solution:\n    def solve(self):\n        return 41\n",
            "testCase": {"input": {}, "expectedOutput": 42},
            "className": "Solution",
            "functionName": "solve",
        }
    )

    assert result == {
        "status": "failed",
        "correct": False,
        "actualOutput": 41,
        "stdout": "",
    }


def test_single_test_reports_runtime_errors_without_trace_data():
    result = run_single_test(
        source_code="class Solution:\n    def solve(self):\n        raise ValueError('bad input')\n",
        test_case={"input": {}, "expectedOutput": 42},
        class_name="Solution",
        function_name="solve",
    )

    assert result == {
        "status": "error",
        "correct": False,
        "stdout": "",
        "error": "bad input",
        "errorType": "ValueError",
    }


def test_returns_expected_result_shape_and_preserves_database_case_id(
    supabase_test_case,
):
    test_case = {
        **supabase_test_case,
        "input": {},
        "expected_output": 42,
    }
    result = run_submission(
        source_code="class Solution:\n    def solve(self):\n        return 42\n",
        test_cases=[test_case],
        class_name="Solution",
        function_name="solve",
    )

    assert set(result) == {"status", "verdict", "passed", "total", "results"}
    assert result["status"] == "completed"
    assert result["verdict"] == "accepted"
    assert result["passed"] == 1
    assert result["total"] == 1
    assert result["results"] == [
        {
            "testCaseId": supabase_test_case["id"],
            "status": "passed",
            "passed": True,
            "actualOutput": 42,
            "expectedOutput": 42,
            "stdout": "",
        }
    ]


def test_captures_submission_stdout_in_result(supabase_test_case):
    test_case = {
        **supabase_test_case,
        "input": [],
        "expected_output": True,
    }
    result = run_submission(
        source_code=(
            "class Solution:\n"
            "    def solve(self):\n"
            "        print('submission output')\n"
            "        return True\n"
        ),
        test_cases=[test_case],
        class_name="Solution",
        function_name="solve",
    )

    assert result["results"][0]["stdout"] == "submission output\n"