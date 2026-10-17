import pytest


def test_production_worker_starts_container_with_security_restrictions(
    run_production_worker,
):
    response = run_production_worker("success")
    args = response["dockerRunArgs"][0]

    assert args[0:2] == ["run", "--rm"]
    assert args[args.index("--memory") + 1] == "128m"
    assert args[args.index("--memory-swap") + 1] == "128m"
    assert args[args.index("--cpus") + 1] == "0.5"
    assert args[args.index("--pids-limit") + 1] == "64"
    assert args[args.index("--network") + 1] == "none"
    assert "--read-only" in args
    assert args[args.index("--cap-drop") + 1] == "ALL"
    assert "--security-opt=no-new-privileges" in args
    assert args[-1] == "algovision-python-runner:dev"


def test_container_runs_as_unprivileged_user_without_capabilities_or_privilege_escalation(
    run_sandbox,
):
    output = run_sandbox(
        "import ctypes\n"
        "import os\n"
        "class Solution:\n"
        "    def inspect(self):\n"
        "        with open('/proc/self/status') as status:\n"
        "            capabilities = next(\n"
        "                line.split()[1] for line in status if line.startswith('CapEff:')\n"
        "            )\n"
        "        no_new_privileges = ctypes.CDLL(None).prctl(39, 0, 0, 0, 0)\n"
        "        return {\n"
        "            'uid': os.geteuid(),\n"
        "            'gid': os.getegid(),\n"
        "            'capabilities': capabilities,\n"
        "            'no_new_privileges': no_new_privileges,\n"
        "        }\n",
        {
            "uid": 65532,
            "gid": 65532,
            "capabilities": "0000000000000000",
            "no_new_privileges": 1,
        },
    )

    assert output == {
        "uid": 65532,
        "gid": 65532,
        "capabilities": "0000000000000000",
        "no_new_privileges": 1,
    }