import pytest


def test_container_root_filesystem_is_read_only(run_sandbox):
    output = run_sandbox(
        "class Solution:\n"
        "    def inspect(self):\n"
        "        writable = []\n"
        "        for path in ('/app/security-test', '/tmp/security-test'):\n"
        "            try:\n"
        "                with open(path, 'w') as output:\n"
        "                    output.write('unexpected write')\n"
        "                writable.append(True)\n"
        "            except OSError:\n"
        "                writable.append(False)\n"
        "        return writable\n",
        [False, False],
    )

    assert output == [False, False]


def test_submission_cannot_read_protected_system_file(run_sandbox):
    output = run_sandbox(
        "class Solution:\n"
        "    def inspect(self):\n"
        "        try:\n"
        "            with open('/etc/shadow') as protected_file:\n"
        "                protected_file.read()\n"
        "            return True\n"
        "        except OSError:\n"
        "            return False\n",
        False,
    )

    assert output is False