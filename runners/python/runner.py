import json
import subprocess
import sys
from typing import Any

from harness import run_submission


def run_once(payload: dict[str, Any]) -> dict[str, Any]:
    return run_submission(
        source_code=payload.get("sourceCode"),
        test_cases=payload.get("testCases"),
        class_name=payload.get("className"),
        function_name=payload.get("functionName"),
    )


def execute_once() -> int:
    try:
        payload = json.loads(sys.stdin.read())
        result = run_once(payload)
        print(json.dumps(result))
        return 0
    except Exception as error:
        print(json.dumps({
            "status": "failed",
            "verdict": "internal_error",
            "error": str(error),
        }))
        return 1


def run_worker() -> None:
    print(json.dumps({"ready": True}), flush=True)

    for line in sys.stdin:
        request_id = None
        try:
            request = json.loads(line)
            request_id = request["requestId"]
            payload = request["payload"]
            completed = subprocess.run(
                [sys.executable, __file__, "--execute-once"],
                input=json.dumps(payload),
                capture_output=True,
                text=True,
                check=False,
            )

            if completed.returncode != 0:
                try:
                    error_result = json.loads(completed.stdout)
                    error = error_result.get("error", "Execution failed")
                except (json.JSONDecodeError, AttributeError):
                    error = completed.stderr or completed.stdout or "Execution failed"
                response = {"requestId": request_id, "error": error}
            else:
                response = {
                    "requestId": request_id,
                    "result": json.loads(completed.stdout),
                }
        except Exception as error:
            response = {"requestId": request_id, "error": str(error)}

        print(json.dumps(response), flush=True)


if __name__ == "__main__":
    if sys.argv[1:] == ["--execute-once"]:
        sys.exit(execute_once())
    run_worker()
