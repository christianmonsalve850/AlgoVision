import pytest

from harness import run_submission


@pytest.mark.parametrize(
    ("inputs", "expected_output"),
    [
        ({"nums": [2, 7, 11, 15], "target": 9}, [0, 1]),
        ([[2, 7, 11, 15], 9], [0, 1]),
    ],
)
def test_grades_class_method_with_named_or_positional_inputs(
    inputs, expected_output, supabase_test_case
):
    test_case = {
        **supabase_test_case,
        "input": inputs,
        "expected_output": expected_output,
    }
    result = run_submission(
        source_code=(
            "class Solution:\n"
            "    def twoSum(self, nums, target):\n"
            "        for i in range(len(nums)):\n"
            "            for j in range(i + 1, len(nums)):\n"
            "                if nums[i] + nums[j] == target:\n"
            "                    return [i, j]\n"
            "        return []\n"
        ),
        test_cases=[test_case],
        class_name="Solution",
        function_name="twoSum",
    )

    assert result["verdict"] == "accepted"
    assert result["passed"] == 1
    assert result["total"] == 1
    assert result["results"][0]["actualOutput"] == expected_output


def test_returns_wrong_answer_when_output_does_not_match():
    result = run_submission(
        source_code="class Solution:\n    def solve(self, value):\n        return value + 1\n",
        test_cases=[{"input": {"value": 1}, "expected_output": 3}],
        class_name="Solution",
        function_name="solve",
    )

    assert result["verdict"] == "wrong_answer"
    assert result["passed"] == 0
    assert result["results"][0]["status"] == "failed"


def test_returns_runtime_error_when_submission_raises():
    result = run_submission(
        source_code=(
            "class Solution:\n"
            "    def solve(self, value):\n"
            "        raise RuntimeError('broken submission')\n"
        ),
        test_cases=[{"input": {"value": 1}, "expected_output": 1}],
        class_name="Solution",
        function_name="solve",
    )

    assert result["verdict"] == "runtime_error"
    assert result["results"][0]["status"] == "error"
    assert result["results"][0]["error"] == "broken submission"