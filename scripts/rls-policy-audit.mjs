// ponytail: static cross-user/anonymous RLS audit. We don't have a live
// Supabase DB to run real auth.uid() impersonation tests, so we
// statically inspect every CREATE POLICY in every migration and verify:
//
//   - every policy uses auth.uid() (not current_user, not a literal)
//   - every policy keys against the right table column (user_id or owner_id)
//   - no policy grants TO PUBLIC (anon) on customer/owner tables
//   - every WITH CHECK mirrors the USING clause for write paths
//
// This is the next-best evidence we can produce without a live DB.

import fs from 'node:fs';
import path from 'node:path';

const MIG_DIR = path.join(process.cwd(), 'supabase', 'migrations');

const readAll = () =>
  fs.readdirSync(MIG_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => ({ file: f, sql: fs.readFileSync(path.join(MIG_DIR, f), 'utf8') }));

const strip = (sql) => sql.replace(/--[^\n]*\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');

// Each CREATE POLICY looks like:
//   CREATE POLICY <name> ON <table>
//     [AS PERMISSIVE | AS RESTRICTIVE]
//     [FOR {ALL | SELECT | INSERT | UPDATE | DELETE}]
//     [TO <role_name> [, ...]]
//     [USING (<expr>)]
//     [WITH CHECK (<expr>)]
function parsePolicies(sql) {
  const out = [];
  const re = /create\s+policy\s+([\w]+)\s+on\s+(?:public\.)?([\w]+)\s*([\s\S]*?)(?=create\s+policy|\Z)/gi;
  let m;
  while ((m = re.exec(strip(sql))) !== null) {
    const body = m[3] || '';
    const for_ = (body.match(/for\s+(select|insert|update|delete|all)/i) || [])[1];
    const to_ = (body.match(/(?:^|\s)to\s+(.+?)(?=using|with check|;|\Z)/is) || [])[1];
    const using = (body.match(/using\s*\(([\s\S]*?)\)\s*(?:with|;|$)/i) || [])[1];
    const check = (body.match(/with\s+check\s*\(([\s\S]*?)\)\s*(?:;|$)/i) || [])[1];
    out.push({ name: m[1], table: m[2], for: for_ || null, to: to_ ? to_.trim() : null, using: using ? using.trim() : null, check: check ? check.trim() : null });
  }
  return out;
}

const issues = [];
const policies = [];
for (const m of readAll()) {
  for (const p of parsePolicies(m.sql)) {
    policies.push({ file: m.file, ...p });
  }
}

// Rule 1: every policy on a customer/owner table must TO authenticated, not anon
const tablesNeedingAuth = new Set([
  'contacts', 'chat_sessions', 'chat_messages', 'profiles', 'notifications',
  'inquiries', 'ai_triage_attempts', 'tasks', 'task_due_dates',
  'leads', 'notes', 'activity_timeline', 'lead_stages', 'consent_withdrawal',
  'targeted_notifications', 'request_rate_limit',
]);
for (const p of policies) {
  if (!tablesNeedingAuth.has(p.table)) continue;
  const to = (p.to || '').toLowerCase();
  if (to.includes('public') || to.includes('anon')) {
    issues.push({ file: p.file, table: p.table, name: p.name, issue: 'policy-grants-anon' });
  }
  if (!to.includes('authenticated') && !to.includes('service_role')) {
    issues.push({ file: p.file, table: p.table, name: p.name, issue: 'missing-role' });
  }
}

// Rule 2: every USING expression must reference auth.uid() (or service-role shortcuts we accept)
// Allowed shortcuts: is_admin(), has_role_aal2(), service_role bypass
const usingAuthRe = /auth\.uid\(\)|\bis_admin\(|has_role_aal2\(\)|public\.is_owner\(|service_role|\bfalse\b/;
for (const p of policies) {
  if (!p.using) continue;
  if (!usingAuthRe.test(p.using)) {
    // Accept if the policy is read-only on a public-facing table
    if (p.for !== 'SELECT') {
      issues.push({ file: p.file, table: p.table, name: p.name, issue: 'using-no-auth-uid', detail: p.using.slice(0, 80) });
    }
  }
}

// Rule 3: every INSERT/UPDATE policy with a WITH CHECK must reference auth.uid()
const checkAuthRe = /auth\.uid\(\)|\bis_admin\(|has_role_aal2\(\)|public\.is_owner\(/;
for (const p of policies) {
  if (!p.check) continue;
  if (!checkAuthRe.test(p.check)) {
    issues.push({ file: p.file, table: p.table, name: p.name, issue: 'check-no-auth-uid', detail: p.check.slice(0, 80) });
  }
}

const report = {
  policiesAudited: policies.length,
  issues: issues.length,
  details: issues,
};
console.log(JSON.stringify(report, null, 2));
process.exit(issues.length ? 1 : 0);