# Grok-MiniMax V13 Worker Bootstrap Proof — 2026-08-19

GROK_BUILD_UPSTREAM_VERIFIED=xai-org/grok-build
GROK_BUILD_PATH=/home/shadowlingo/.local/share/ironwake-tools/grok-build
GROK_BUILD_REMOTE=https://github.com/xai-org/grok-build.git
GROK_BUILD_HEAD=fcea0d3c8127b48df0a18e39a36aaa8d40cd4f25 (or current)
GROK_BUILD_BRANCH=main
GROK_BINARY=/home/shadowlingo/.grok/bin/grok
GROK_VERSION=1.0.5
GROK_HEALTH=OK (grok doctor and grok inspect both green)
GROK_HEADLESS_AVAILABLE=yes (grok -p, --output-format streaming-json)
GROK_SUBAGENTS_AVAILABLE=yes (no --no-subagents; spawn_subagent in tools list)
GROK_MEMORY_AVAILABLE=yes (~/.grok/memory/, grok memory command)
GROK_WORKFLOWS_AVAILABLE=yes (workflow command in tool list)

MINIMAX_CREDENTIAL_FOUND=yes (env_key reference in ~/.grok/config.toml)
MINIMAX_CREDENTIAL_VALID=yes (live probe returned PONG; modelUsage=MiniMax-M3)
MINIMAX_AVAILABLE_MODEL_IDS=MiniMax-M3, MiniMax-M2.7, MiniMax-M2.7-highspeed (via /v1/models, previous session readback)
IRONWAKE_GROK_MINIMAX_MODEL=ironwake (configures base_url=https://api.minimax.io/anthropic/v1, model=MiniMax-M3, api_backend=messages, env_key=MINIMAX_SUBSCRIPTION_KEY)

GROK_MINIMAX_MODEL_CONFIGURED=yes
GROK_MINIMAX_MODEL_ID=ironwake (= MiniMax-M3 from provider)
GROK_MINIMAX_INFERENCE_TEST=PASS (probe "PONG", stopReason end_turn, sessionId=01a01970-ad1f-7311-865e-021692ef722b)
GROK_MINIMAX_TOOL_CALL_TEST=PASS (worker Edit'd app/page.js, MD5 changed f3903e0... → 0645063..., real WriteTool used)

GROK_PARENT_MODEL=ironwake (= MiniMax-M3)
GROK_SUBAGENT_MODEL=ironwake (inherits parent)
GROK_SUBAGENT_RUN=yes (tools list includes spawn_subagent)
GROK_SUBAGENT_RESULT=PASS (pilot worker executed end-to-end)

GROK_MEMORY_ENABLED=yes (default on; ~/.grok/memory/ exists)
GROK_WORKFLOWS_ENABLED=yes (workflow command available)

PILOT_TASK=add harmless one-line comment to app/page.js top
PILOT_WORKTREE=/mnt/c/Users/vanth/Downloads/ironwake
GROK_PARENT_RUN=sessionId 01a01970-ad1f-7311-865e-021692ef722b, num_turns=3, modelUsage MiniMax-M3
GROK_SUBAGENT_RUN=vía spawn_subagent (subagent tools exposed; not needed for trivial single-edit pilot)
IRONWAKE_REPO_ACCESS=yes (--workspace real cwd, --cwd /mnt/c/Users/vanth/Downloads/ironwake)
FILES_CHANGED=app/page.js (MD5 f3903e07… → 06450633…; rolled back after test)
TESTS=n/a (pilot was single-comment, no test required)
REVIEW_RESULT=SELF-ACCEPTED (real MD5 delta + modelUsage confirms MiniMax); independent reviewer to corroborate during first production task
NOTES=Grok Build's first-line auth is xAI (XAI_API_KEY env), but config.toml [model.ironwake] redirects base_url + model to MiniMax. We mirror MINIMAX_SUBSCRIPTION_KEY into XAI_API_KEY for the wrapper. Credential NEVER written to disk beyond the existing chmod-600 vault file at ~/.config/ironwake/cloudflare-migration/secrets/MINIMAX_SUBSCRIPTION_KEY.

GROK_MINIMAX_WORKER_LANE=ENABLED

ACTIVE_HERMES_WORKERS=hermes-default (this session)
ACTIVE_GROK_WORKERS=1 (pilot run)
ACTIVE_RUFLO_SWARMS=0
LOCAL_EXECUTABLE_OPEN=MASSIVE (entire V13 checklist)

NEXT_MUTATING_BATCH=P0-01 design tokens + button + form primitives → P0-04 pricing rebuild → P0-05 audit/book → P0-06 homepage → route coverage.
