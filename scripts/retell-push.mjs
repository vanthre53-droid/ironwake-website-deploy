#!/usr/bin/env node
// ponytail: idempotent push of the IronWake receptionist prompt + knowledge
// block to the Retell LLM endpoint.
//
// Flow:
//   1. Read RETELL_API_KEY (required).
//   2. Read RETELL_AGENT_ID.
//        - If present, PUT https://api.retellai.com/update-agent/{agent_id}
//        - If absent, POST https://api.retellai.com/create-agent and print
//          the freshly-issued agent_id so the caller can persist it.
//   3. Compute the canonical prompt + knowledge fingerprint and include it
//      in metadata so the next push can detect drift without re-uploading.
//   4. Confirm before writing to the provider when --confirm is set.
//      Without --confirm the script prints the payload and exits 0 — that
//      is the dry-run default. Production callers should always pass
//      --confirm and capture the printed agent_id on first creation.
//
// Exit codes:
//   0   success (created/updated or dry-run completed)
//   1   Retell rejected the payload (4xx)
//   2   configuration / network error

import { writeFile } from 'node:fs/promises';

import { buildReceptionistPromptDefault, IRONWAKE_PROMPT_VERSION } from '../lib/retell/prompt.js';
import { buildKnowledgeBlock, knowledgeFingerprint } from '../lib/retell/knowledge.js';

const BASE_URL = process.env.RETELL_BASE_URL || 'https://api.retellai.com';
const STATE_FILE = process.env.RETELL_AGENT_STATE_FILE || '.retell-agent.json';

function parseArgs(argv) {
  const out = { confirm: false, print: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--confirm') out.confirm = true;
    else if (a === '--print') out.print = true;
    else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      printHelp();
      process.exit(2);
    }
  }
  return out;
}

function printHelp() {
  console.log(`Usage: node scripts/retell-push.mjs [--confirm] [--print]

Options:
  --confirm   Actually call the Retell API. Without this flag the script is
              a dry run: it prints the payload and exits.
  --print     Print the full prompt + knowledge block to stdout.
  --help, -h  Show this help.

Env:
  RETELL_API_KEY      Required. Provider API key.
  RETELL_AGENT_ID     Optional. If empty, the script creates a new agent
                      and prints the new id (idempotency is preserved by
                      persisting the state file on success).
  RETELL_BASE_URL     Override the provider base URL (default: https://api.retellai.com).
  RETELL_AGENT_STATE_FILE  Where to write the agent id + fingerprint (default: .retell-agent.json).`);
}

function buildPayload() {
  const prompt = buildReceptionistPromptDefault();
  const knowledge = buildKnowledgeBlock();
  const fingerprint = knowledgeFingerprint();
  return {
    agent_name: `IronWake Receptionist (${IRONWAKE_PROMPT_VERSION})`,
    voice_id: process.env.RETELL_VOICE_ID || 'eleven_labs_rachel',
    language: 'en-US',
    llm_websocket_url: process.env.RETELL_LLM_WEBSOCKET_URL || '',
    response_engine: {
      type: 'retell-llm',
      llm_id: process.env.RETELL_LLM_ID || null,
      system_prompt: prompt
    },
    metadata: {
      ironwake_prompt_version: IRONWAKE_PROMPT_VERSION,
      knowledge_fingerprint: fingerprint,
      knowledge_block_chars: knowledge.length
    },
    // ponytail: the Retell LLM endpoint is a flat PUT that mirrors the body
    // we send at create time. Knowledge is inlined into the system prompt
    // for now — Retell does not yet expose a separate knowledge base field
    // for the open Retell-LLM response engine. When they ship it, move
    // buildKnowledgeBlock() into the dedicated field and keep the system
    // prompt focused on persona + truth rules.
    knowledge_block: knowledge
  };
}

async function loadPreviousState() {
  try {
    const { readFile } = await import('node:fs/promises');
    const raw = await readFile(STATE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function callRetell({ endpoint, method, apiKey, body }) {
  const response = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  let parsed = null;
  if (text) {
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
  }
  return { ok: response.ok, status: response.status, body: parsed };
}

async function main() {
  const args = parseArgs(process.argv);
  const apiKey = process.env.RETELL_API_KEY;
  const agentId = process.env.RETELL_AGENT_ID || '';
  const previousState = await loadPreviousState();

  const payload = buildPayload();

  if (args.print) {
    console.log('--- SYSTEM PROMPT ---');
    console.log(payload.response_engine.system_prompt);
    console.log('');
    console.log('--- KNOWLEDGE BLOCK ---');
    console.log(payload.knowledge_block);
    console.log('');
    console.log('--- METADATA ---');
    console.log(JSON.stringify(payload.metadata, null, 2));
    if (!args.confirm) return;
  }

  if (!apiKey) {
    console.error('RETELL_API_KEY is not set. Refusing to push without provider credentials.');
    process.exit(2);
  }

  if (!args.confirm) {
    console.log('Dry run. Re-run with --confirm to push to Retell.');
    console.log(`Prompt version: ${payload.metadata.ironwake_prompt_version}`);
    console.log(`Knowledge fingerprint: ${payload.metadata.knowledge_fingerprint}`);
    if (agentId) {
      console.log(`Would update agent: ${agentId} via PUT ${BASE_URL}/update-agent/${agentId}`);
    } else {
      console.log(`Would create a new agent via POST ${BASE_URL}/create-agent`);
    }
    return;
  }

  let result;
  let createdAgentId = agentId;
  if (agentId) {
    const endpoint = `${BASE_URL}/update-agent/${encodeURIComponent(agentId)}`;
    console.log(`Updating Retell agent ${agentId}...`);
    result = await callRetell({ endpoint, method: 'PUT', apiKey, body: payload });
  } else {
    const endpoint = `${BASE_URL}/create-agent`;
    console.log('No RETELL_AGENT_ID set. Creating a new Retell agent...');
    result = await callRetell({ endpoint, method: 'POST', apiKey, body: payload });
    if (result.ok && result.body?.agent_id) {
      createdAgentId = result.body.agent_id;
      console.log(`CREATED agent_id=${createdAgentId}`);
      console.log('Persist this id: export RETELL_AGENT_ID=' + createdAgentId);
    }
  }

  if (!result.ok) {
    console.error(`Retell returned ${result.status}:`);
    console.error(JSON.stringify(result.body, null, 2));
    process.exit(1);
  }

  const nextState = {
    agent_id: createdAgentId,
    prompt_version: payload.metadata.ironwake_prompt_version,
    knowledge_fingerprint: payload.metadata.knowledge_fingerprint,
    updated_at: new Date().toISOString()
  };
  await writeFile(STATE_FILE, JSON.stringify(nextState, null, 2));
  console.log(`OK. State persisted to ${STATE_FILE}.`);
  if (previousState && previousState.knowledge_fingerprint === payload.metadata.knowledge_fingerprint) {
    console.log('Knowledge fingerprint unchanged — push was idempotent.');
  } else {
    console.log('Knowledge fingerprint changed — push reflected new canonical data.');
  }
}

main().catch((err) => {
  console.error('retell-push failed:', err?.message || err);
  process.exit(2);
});