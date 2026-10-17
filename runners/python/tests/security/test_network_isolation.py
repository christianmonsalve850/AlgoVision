import pytest


def test_container_cannot_open_external_network_connection(run_sandbox):
    output = run_sandbox(
        "import socket\n"
        "class Solution:\n"
        "    def inspect(self):\n"
        "        try:\n"
        "            with socket.create_connection(('1.1.1.1', 80), timeout=2):\n"
        "                return True\n"
        "        except OSError:\n"
        "            return False\n",
        False,
    )

    assert output is False