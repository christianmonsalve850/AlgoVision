import json
import subprocess
import sys
from pathlib import Path

from harness import MAX_USER_OUTPUT_BYTES, run_trace, run_traces
from runner import run_once


RUNNER_SCRIPT = Path(__file__).resolve().parents[2] / "runner.py"


def test_run_trace_records_python_execution_events():
    result = run_trace(
        source_code=(
            "class Solution:\n"
            "    def sum_values(self, values):\n"
            "        total = 0\n"
            "        for value in values:\n"
            "            total += value\n"
            "        return total\n"
        ),
        inputs={"values": [2, 3]},
        class_name="Solution",
        function_name="sum_values",
    )

    assert result["success"] is True
    assert result["actualOutput"] == 5
    assert result["duration"] >= 0
    assert result["trace"]
    assert any(step["event"] == "call" for step in result["trace"])
    assert any(step["event"] == "loop" for step in result["trace"])
    assert any(step["event"] == "return" for step in result["trace"])
    assert all("changedVariables" in step for step in result["trace"])


def test_return_statement_is_recorded_only_as_a_return_event():
    source_code = (
        "class Solution:\n"
        "    def twoSum(self, nums, target):\n"
        "        seen = {}\n"
        "        for i, num in enumerate(nums):\n"
        "            complement = target - num\n"
        "            if complement in seen:\n"
        "                return [seen[complement], i]\n"
        "            seen[num] = i\n"
    )
    result = run_trace(
        source_code=source_code,
        inputs={"nums": [2, 7], "target": 9},
        class_name="Solution",
        function_name="twoSum",
    )

    return_steps = [
        step for step in result["trace"] if step["expression"].startswith("return ")
    ]
    assert len(return_steps) == 1
    assert return_steps[0]["event"] == "return"
    assert return_steps[0]["return_value"] == [0, 1]


def test_run_traces_returns_a_separate_trace_for_each_test_case():
    results = run_traces(
        source_code=(
            "class Solution:\n"
            "    def double(self, value):\n"
            "        return value * 2\n"
        ),
        test_cases=[
            {"id": "visible-1", "input": {"value": 2}},
            {"id": "visible-2", "input": {"value": 5}},
        ],
        class_name="Solution",
        function_name="double",
    )

    assert [result["testCaseId"] for result in results] == [
        "visible-1",
        "visible-2",
    ]
    assert [result["actualOutput"] for result in results] == [4, 10]
    assert all(result["success"] and result["trace"] for result in results)


def test_run_traces_allows_no_visible_test_cases():
    assert run_traces(
        source_code="class Solution: pass",
        test_cases=[],
        class_name="Solution",
        function_name="solve",
    ) == []


def test_runner_dispatches_trace_operation_to_trace_results():
    result = run_once(
        {
            "operation": "trace",
            "sourceCode": (
                "class Solution:\n"
                "    def solve(self, value):\n"
                "        return value + 1\n"
            ),
            "className": "Solution",
            "functionName": "solve",
            "testCases": [{"id": "trace-case", "input": {"value": 1}}],
        }
    )

    assert isinstance(result, list)
    assert result[0]["testCaseId"] == "trace-case"
    assert result[0]["actualOutput"] == 2
    assert "verdict" not in result[0]


def test_trace_protocol_preserves_responses_over_ten_kilobytes():
    payload = {
        "operation": "trace",
        "sourceCode": (
            "class Solution:\n"
            "    def solve(self, values):\n"
            "        return len(values)\n"
        ),
        "className": "Solution",
        "functionName": "solve",
        "testCases": [
            {"id": "large-trace", "input": {"values": list(range(2000))}}
        ],
    }
    request = {"requestId": "large-trace", "payload": payload}
    completed = subprocess.run(
        [sys.executable, str(RUNNER_SCRIPT)],
        input=f"{json.dumps(request)}\n",
        capture_output=True,
        text=True,
        timeout=15,
        check=False,
    )

    assert completed.returncode == 0, completed.stderr
    messages = [json.loads(line) for line in completed.stdout.splitlines()]
    assert messages[0] == {"ready": True}
    response = messages[1]
    assert response["requestId"] == "large-trace"
    assert len(json.dumps(response).encode("utf-8")) > MAX_USER_OUTPUT_BYTES
    assert response["result"][0]["success"] is True
    assert len(response["result"][0]["trace"]) > 0
    assert "traceTruncated" not in response["result"][0]


def test_trace_limits_submitted_code_stdout_not_trace_size():
    result = run_trace(
        source_code=(
            "class Solution:\n"
            "    def solve(self):\n"
            f"        print('x' * {MAX_USER_OUTPUT_BYTES + 1})\n"
            "        return 1\n"
        ),
        inputs={},
        class_name="Solution",
        function_name="solve",
    )

    assert result["success"] is False
    assert result["error"] == (
        f"User output exceeded the {MAX_USER_OUTPUT_BYTES}-byte limit"
    )
    assert result["errorDetails"]["type"] == "UserOutputLimitExceeded"


def test_trace_recorder_keeps_state_isolated_between_executions():
    source_code = (
        "class Solution:\n"
        "    def get_value(self):\n"
        "        value = 1\n"
        "        return value\n"
    )

    first = run_trace(source_code, {}, "Solution", "get_value")
    second = run_trace(source_code, {}, "Solution", "get_value")

    assert [step["step"] for step in first["trace"]] == [
        step["step"] for step in second["trace"]
    ]
    assert first["trace"] == second["trace"]


def test_run_trace_handles_none_return_value():
    result = run_trace(
        "class Solution:\n"
        "    def solve(self):\n"
        "        return\n",
        {},
        "Solution",
        "solve",
    )

    assert result["actualOutput"] is None
    assert result["trace"]


def test_run_trace_returns_trace_when_submission_raises():
    result = run_trace(
        "class Solution:\n"
        "    def solve(self):\n"
        "        raise ValueError('bad input')\n",
        {},
        "Solution",
        "solve",
    )

    assert result["success"] is False
    assert result["error"] == "bad input"
    assert result["errorDetails"]["type"] == "ValueError"
    assert any(step["event"] == "exception" for step in result["trace"])


def test_run_trace_reports_syntax_errors_without_starting_a_trace():
    result = run_trace(
        "class Solution\n"
        "    pass\n",
        {},
        "Solution",
        "solve",
    )

    assert result["success"] is False
    assert result["errorDetails"]["type"] == "SyntaxError"
    assert result["trace"] == []
