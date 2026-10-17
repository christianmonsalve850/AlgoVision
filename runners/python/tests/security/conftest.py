import json
import shutil
import subprocess
from pathlib import Path

import pytest


RUNNER_DIR = Path(__file__).resolve().parents[2]
REPOSITORY_ROOT = RUNNER_DIR.parents[1]
DOCKER_RUNNER_TEST_HARNESS = (
    REPOSITORY_ROOT / "tests/shared/docker_runner_worker_harness.cjs"
)
IMAGE_NAME = "algovision-python-runner:security-test"
MAX_OUTPUT_BYTES = 10 * 1024


def _build_sandbox_image():
    if shutil.which("docker") is None:
        pytest.skip("Docker is not installed")

    try:
        info = subprocess.run(
            ["docker", "info"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except subprocess.TimeoutExpired:
        pytest.skip("Docker daemon is not responding")

    if info.returncode != 0:
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
    return IMAGE_NAME


@pytest.fixture(scope="session")
def sandbox_image():
    return _build_sandbox_image()


@pytest.fixture
def run_sandbox(sandbox_image):
    def run(source_code, expected_output):
        payload = {
            "sourceCode": source_code,
            "className": "Solution",
            "functionName": "inspect",
            "testCases": [
                {
                    "id": "security-test-case",
                    "problem_id": "828d67e0-8a62-44a9-a0cd-dd5cebce7491",
                    "input": {},
                    "expected_output": expected_output,
                    "is_hidden": False,
                    "order_index": 1,
                }
            ],
        }
        request = {"requestId": "security-request", "payload": payload}
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
                sandbox_image,
            ],
            input=f"{json.dumps(request)}\n",
            capture_output=True,
            text=True,
            timeout=20,
            check=False,
        )

        assert completed.returncode == 0, completed.stderr
        messages = [
            json.loads(line)
            for line in completed.stdout.splitlines()
        ]
        assert messages[0] == {"ready": True}
        assert messages[1]["requestId"] == "security-request"
        assert "result" in messages[1], messages[1]
        result = messages[1]["result"]
        assert result["verdict"] == "accepted", result
        assert result["passed"] == 1, result
        return result["results"][0]["actualOutput"]

    return run


@pytest.fixture
def run_production_worker():
    def run(simulation, payload=None):
        node = shutil.which("node")
        if node is None:
            pytest.skip("Node.js is required to test Docker worker limits")

        if simulation == "real-docker":
            _build_sandbox_image()

        options = {
            "simulation": simulation,
            "maxOutputBytes": MAX_OUTPUT_BYTES,
            "runnerPath": str(REPOSITORY_ROOT / "lib/docker-runner/docker-runner.ts"),
            "exportName": "executePython",
            "imageName": IMAGE_NAME,
            "payload": payload
            or {
                "executionId": "security-test",
                "sourceCode": "",
                "testCases": [],
                "className": "Solution",
                "functionName": "solve",
            },
        }
        completed = subprocess.run(
            [node, str(DOCKER_RUNNER_TEST_HARNESS)],
            input=json.dumps(options),
            capture_output=True,
            text=True,
            timeout=45 if simulation == "real-docker" else 15,
            cwd=REPOSITORY_ROOT,
            check=False,
        )

        assert completed.returncode == 0, completed.stderr
        return json.loads(completed.stdout)

    return run
