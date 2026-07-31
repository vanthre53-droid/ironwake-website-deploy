#!/usr/bin/env bash
set -uo pipefail
command -v python3 >/dev/null || { echo "python3 required"; exit 1; }
python3 - <<'PY'
import sys,yaml
fail=0
for f in ["state/PROJECT_STATE.yaml","state/SEALED_TASK_QUEUE.yaml",
          "state/SEALED_REMEDIATION_QUEUE.yaml","ironwake.execution.yaml"]:
    try:
        yaml.safe_load(open(f)); print("OK   yaml",f)
    except Exception as e:
        print("FAIL yaml",f,e); fail=1
s=yaml.safe_load(open("state/PROJECT_STATE.yaml"))
for k in ["active_stage","required_role","next_exact_action","harness","gates","workstream_status"]:
    if k not in s: print("FAIL missing key:",k); fail=1
    else: print("OK   key",k)
ws=s.get("workstream_status",{})
missing=[f"W{i:02d}" for i in range(23) if f"W{i:02d}" not in ws]
print("FAIL missing workstreams:",missing) if missing else print("OK   W00-W22 all present")
if missing: fail=1
print("---"); print("STATE:", "PASS" if not fail else "FAIL")
sys.exit(fail)
PY
