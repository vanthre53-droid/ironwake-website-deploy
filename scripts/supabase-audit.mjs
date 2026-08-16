#!/usr/bin/env node
// ponytail: static Supabase audit. Walks every migration in
// supabase/migrations/ and reports:
//   - every CREATE TABLE and whether ENABLE ROW LEVEL SECURITY follows
//   - every CREATE FUNCTION and whether SET search_path = ... (or a
//     search_path lock) is configured
//   - every GRANT to anon / authenticated / service_role
//   - every CREATE VIEW and whether security_invoker is set
//
// Pure static — does not need DB access. Pair with the live pg_tables /
// pg_proc introspection done in scripts/supabase-introspect.mjs when
// SUPABASE_DB_URL is available.

import fs from 'node:fs';
import path from 'node:path';

const MIG_DIR = path.join(process.cwd(), 'supabase', 'migrations');

function readAllMigrations() {
  if (!fs.existsSync(MIG_DIR)) return [];
  return fs.readdirSync(MIG_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => ({ file: f, sql: fs.readFileSync(path.join(MIG_DIR, f), 'utf8') }));
}

function stripComments(sql) {
  return sql.replace(/--[^\n]*\n/g, '\n').replace(/\/\*[\s\S]*?\*\//g, '');
}

function auditTablesAndViews(sql) {
  const clean = stripComments(sql);
  const tables = [...clean.matchAll(/create\s+table(?:\s+if\s+not\s+exists)?\s+(?:public\.)?["']?([\w]+)["']?/gi)].map((m) => m[1]);
  const views = [...clean.matchAll(/create\s+or\s+replace\s+view(?:\s+public\.)?["']?([\w]+)["']?/gi)].map((m) => m[1]);
  const rls = [...clean.matchAll(/alter\s+table\s+(?:public\.)?["']?([\w]+)["']?\s+enable\s+row\s+level\s+security/gi)].map((m) => m[1]);
  const invoker = [...clean.matchAll(/alter\s+view\s+(?:public\.)?["']?([\w]+)["']?\s+set\s+\(security_invoker\s*=\s*true\)/gi)].map((m) => m[1]);
  return { tables, views, rls, invoker };
}

function auditFunctions(sql) {
  const clean = stripComments(sql);
  const fns = [...clean.matchAll(/create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?["']?([\w]+)["']?\s*\(/gi)].map((m) => m[1]);
  const locked = [...clean.matchAll(/function\s+(?:public\.)?["']?([\w]+)["']?\s*\([^)]*\)[^;]*?SET\s+search_path\s*=\s*([\w, "'\.]+)/gi)].map((m) => ({ name: m[1], path: m[2] }));
  return { fns, locked };
}

function auditGrants(sql) {
  const clean = stripComments(sql);
  const anon = [...clean.matchAll(/grant\s+([\w, \t]+)\s+on\s+(table|view|function|sequence)\s+(?:public\.)?["']?([\w]+)["']?\s+to\s+(?:anon|authenticated|service_role)/gi)].map((m) => ({
    priv: m[1].trim(),
    kind: m[2],
    name: m[3],
    to: m[4],
  }));
  return anon;
}

function main() {
  const findings = { tables: [], views: [], functions: [], grants: [] };
  const migrations = readAllMigrations();
  for (const m of migrations) {
    const t = auditTablesAndViews(m.sql);
    const f = auditFunctions(m.sql);
    const g = auditGrants(m.sql);
    findings.tables.push({ file: m.file, ...t });
    findings.functions.push({ file: m.file, ...f });
    findings.grants.push({ file: m.file, grants: g });
  }

  // Aggregate
  const allTables = new Set();
  const allRls = new Set();
  const allViews = new Set();
  const allInvokers = new Set();
  const allFns = new Set();
  const lockedFns = new Set();
  for (const t of findings.tables) {
    t.tables.forEach((x) => allTables.add(x));
    t.rls.forEach((x) => allRls.add(x));
    t.views.forEach((x) => allViews.add(x));
    t.invoker.forEach((x) => allInvokers.add(x));
  }
  for (const f of findings.functions) {
    f.fns.forEach((x) => allFns.add(x));
    f.locked.forEach((x) => lockedFns.add(x.name));
  }

  const tablesWithoutRls = [...allTables].filter((t) => !allRls.has(t));
  const viewsWithoutInvoker = [...allViews].filter((v) => !allInvokers.has(v));
  const fnsWithoutSearchPath = [...allFns].filter((f) => !lockedFns.has(f));

  const report = {
    migrations: migrations.length,
    tableCount: allTables.size,
    rlsCount: allRls.size,
    viewCount: allViews.size,
    invokerCount: allInvokers.size,
    functionCount: allFns.size,
    lockedFunctionCount: lockedFns.size,
    tablesWithoutRls,
    viewsWithoutInvoker,
    fnsWithoutSearchPath,
    grantsByFile: findings.grants.map((g) => ({ file: g.file, count: g.grants.length })),
  };
  console.log(JSON.stringify(report, null, 2));
  process.exit(tablesWithoutRls.length || viewsWithoutInvoker.length || fnsWithoutSearchPath.length ? 1 : 0);
}

main();