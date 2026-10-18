import json
import os
import subprocess
import sys
from pathlib import Path

import pytest


RUNNER_DIR = Path(__file__).resolve().parents[2]
RUNNER_SCRIPT = RUNNER_DIR / "runner.py"


def _request(request_id, payload):
    return json.dumps({"requestId": request_id, "payload": payload})


def _payload(source_code):
    return {
        "operation": "grade",
        "sourceCode": source_code,
        "className": "Solution",
        "functionName": "solve",
        "testCases": [
            {
                "id": "lifecycle-case",
                "problem_id": "828d67e0-8a62-44a9-a0cd-dd5cebce7491",
                "input": {},
                "expected_output": True,
                "is_hidden": False,
                "order_index": 1,
            }
        ],
    }


def test_worker_processes_multiple_jobs_without_leaking_submission_state():
    first_payload = _payload(
        "import builtins\n"
        "builtins._algovision_worker_test_value = True\n"
        "class Solution:\n"
        "    def solve(self):\n"
        "        return True\n"
    )
    second_payload = _payload(
        "import builtins\n"
        "class Solution:\n"
        "    def solve(self):\n"
        "        return not hasattr(builtins, '_algovision_worker_test_value')\n"
    )
    input_lines = "\n".join(
        [
            _request("lifecycle-1", first_payload),
            _request("lifecycle-2", second_payload),
            "",
        ]
    )

    completed = subprocess.run(
        [sys.executable, str(RUNNER_SCRIPT)],
        input=input_lines,
        capture_output=True,
        text=True,
        timeout=15,
        check=False,
        cwd=RUNNER_DIR,
        env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
    )

    assert completed.returncode == 0, completed.stderr
    messages = [json.loads(line) for line in completed.stdout.splitlines()]
    assert messages[0] == {"ready": True}
    assert [message["requestId"] for message in messages[1:]] == [
        "lifecycle-1",
        "lifecycle-2",
    ]
    assert all(message["result"]["verdict"] == "accepted" for message in messages[1:])
    assert all(message["result"]["passed"] == 1 for message in messages[1:])