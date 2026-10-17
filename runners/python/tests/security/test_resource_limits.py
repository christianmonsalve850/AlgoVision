import pytest


def test_container_enforces_memory_cpu_and_process_limits(run_sandbox):
    output = run_sandbox(
        "from pathlib import Path\n"
        "class Solution:\n"
        "    def inspect(self):\n"
        "        cgroup = Path('/sys/fs/cgroup')\n"
        "        memory_limit = (cgroup / 'memory.max').read_text().strip()\n"
        "        cpu_quota, cpu_period = (cgroup / 'cpu.max').read_text().split()\n"
        "        process_limit = (cgroup / 'pids.max').read_text().strip()\n"
        "        return {\n"
        "            'memory': int(memory_limit),\n"
        "            'cpu_quota': int(cpu_quota),\n"
        "            'cpu_period': int(cpu_period),\n"
        "            'processes': int(process_limit),\n"
        "        }\n",
        {
            "memory": 128 * 1024 * 1024,
            "cpu_quota": 50_000,
            "cpu_period": 100_000,
            "processes": 64,
        },
    )

    assert output == {
        "memory": 128 * 1024 * 1024,
        "cpu_quota": 50_000,
        "cpu_period": 100_000,
        "processes": 64,
    }