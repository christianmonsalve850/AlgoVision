import sys
import json

from harness import run_submission

def main():
    try:
        # Read the JSON payload piped from the API via stdin
        raw_input = sys.stdin.read()
        if not raw_input:
            raise ValueError("Empty input received")

        payload = json.loads(raw_input)

        source_code = payload.get("sourceCode")
        test_cases = payload.get("testCases")
        class_name = payload.get("className")
        function_name = payload.get("functionName")

        result = run_submission(
            source_code=source_code,
            test_cases=test_cases,
            class_name=class_name,
            function_name=function_name,
        )
        print(json.dumps(result))
    except Exception as e:
        error_response = {
            "status": "failed",
            "verdict": "internal_error",
            "error": str(e),
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()