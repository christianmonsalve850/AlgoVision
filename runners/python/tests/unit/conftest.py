import pytest


@pytest.fixture
def supabase_test_case():
    return {
        "id": "7cfe388e-b898-404d-bce5-e89d48f9d4df",
        "problem_id": "828d67e0-8a62-44a9-a0cd-dd5cebce7491",
        "input": {"nums": [2, 7, 11, 15], "target": 9},
        "expected_output": [0, 1],
        "is_hidden": False,
        "order_index": 1,
    }
