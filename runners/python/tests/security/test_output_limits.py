import pytest


def test_worker_rejects_protocol_output_over_the_configured_limit(
    run_production_worker,
):
    response = run_production_worker("output")

    assert response == {
        "resolved": False,
        "error": "Execution output exceeded the 10240-byte limit",
    }