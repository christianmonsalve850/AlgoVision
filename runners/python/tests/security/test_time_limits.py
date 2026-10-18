import pytest


def test_worker_terminates_execution_after_the_configured_time_limit(
    run_production_worker,
):
    response = run_production_worker("timeout")

    assert response == {
        "resolved": False,
        "error": "Execution timed out after 3000 ms",
    }


def test_worker_terminates_a_real_python_infinite_loop(run_production_worker):
    response = run_production_worker(
        "real-docker",
        payload={
            "operation": "grade",
            "executionId": "infinite-loop-security-test",
            "sourceCode": (
                "class Solution:\n"
                "    def inspect(self):\n"
                "        while True:\n"
                "            pass\n"
            ),
            "testCases": [
                {
                    "id": "infinite-loop-case",
                    "problem_id": "828d67e0-8a62-44a9-a0cd-dd5cebce7491",
                    "input": {},
                    "expected_output": None,
                    "is_hidden": False,
                    "order_index": 1,
                }
            ],
            "className": "Solution",
            "functionName": "inspect",
        },
    )

    assert response == {
        "resolved": False,
        "error": "Execution timed out after 3000 ms",
    }