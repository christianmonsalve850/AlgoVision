from harness import run_submission


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