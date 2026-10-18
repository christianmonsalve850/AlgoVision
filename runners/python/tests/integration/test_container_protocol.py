import json
import shutil
import subprocess
from pathlib import Path

import pytest


RUNNER_DIR = Path(__file__).resolve().parents[2]
IMAGE_NAME = "algovision-python-runner:integration-test"
MAX_OUTPUT_BYTES = 10 * 1024


def _docker_available():
    if shutil.which("docker") is None:
        return False

    try:
        result = subprocess.run(
            ["docker", "info"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return False
    return result.returncode == 0


def test_container_ready_and_request_response_protocol():
    if not _docker_available():
        pytest.skip("Docker daemon is not available")

    build = subprocess.run(
        ["docker", "build", "-t", IMAGE_NAME, "."],
        cwd=RUNNER_DIR,
        capture_output=True,
        text=True,
        timeout=180,
        check=False,
    )
    assert build.returncode == 0, build.stderr

    payload = {
        "operation": "grade",
        "sourceCode": (
            "class Solution:\n"
            "    def twoSum(self, nums, target):\n"
            "        for i, value in enumerate(nums):\n"
            "            complement = target - value\n"
            "            if complement in nums[i + 1:]:\n"
            "                return [i, nums.index(complement, i + 1)]\n"
            "        return []\n"
        ),
        "className": "Solution",
        "functionName": "twoSum",
        "testCases": [
            {
                "id": "container-two-sum",
                "problem_id": "828d67e0-8a62-44a9-a0cd-dd5cebce7491",
                "input": {"nums": [2, 7, 11, 15], "target": 9},
                "expected_output": [0, 1],
                "is_hidden": False,
                "order_index": 1,
            }
        ],
    }
    requests = [
        {"requestId": "container-request-1", "payload": payload},
        {"requestId": "container-request-2", "payload": payload},
    ]
    stdin = "".join(f"{json.dumps(request)}\n" for request in requests)

    completed = subprocess.run(
        [
            "docker",
            "run",
            "--rm",
            "--memory",
            "128m",
            "--memory-swap",
            "128m",
            "--cpus",
            "0.5",
            "--pids-limit",
            "64",
            "--network",
            "none",
            "--read-only",
            "--cap-drop",
            "ALL",
            "--security-opt=no-new-privileges",
            "-i",
            IMAGE_NAME,
        ],
        input=stdin,
        capture_output=True,
        text=True,
        timeout=30,
        check=False,
    )

    assert completed.returncode == 0, completed.stderr
    messages = [json.loads(line) for line in completed.stdout.splitlines()]
    assert messages[0] == {"ready": True}
    assert [message["requestId"] for message in messages[1:]] == [
        "container-request-1",
        "container-request-2",
    ]
    for message in messages[1:]:
        assert message["result"]["verdict"] == "accepted"
        assert message["result"]["passed"] == 1
        assert message["result"]["total"] == 1
        assert len(json.dumps(message).encode("utf-8")) <= MAX_OUTPUT_BYTES