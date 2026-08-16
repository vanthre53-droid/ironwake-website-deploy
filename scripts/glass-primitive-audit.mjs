// ponytail: glass-primitive audit. Asserts:
//   - .glass primitive exists in globals.css with backdrop-filter
//   - .glass--strong, .glass--subtle, .glass--dark variants exist
//   - prefers-reduced-motion / reduced-transparency fallback exists
//   - at least one JSX usage applies the glass class
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const cssPath = join(ROOT, 'app/globals.css');
const issues = [];
const css = readFileSync(cssPath, 'utf8');

function checkClass(name, re) {
  if (!re.test(css)) issues.push({ kind: 'glass-missing', name });
}

checkClass('.glass', /\.glass\s*\{/);
checkClass('.glass--subtle', /\.glass--subtle\s*\{/);
checkClass('.glass--strong', /\.glass--strong\s*\{/);
checkClass('.glass--dark', /\.glass--dark\s*\{/);

if (!/backdrop-filter/.test(css)) issues.push({ kind: 'glass-no-backdrop-filter' });

if (!/prefers-reduced-(motion|transparency)/.test(css)) issues.push({ kind: 'glass-no-reduced-fallback' });

// Check at least one JSX usage
function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
const jsx = walk(join(ROOT, 'app'));
const hasUsage = jsx.some(f => /\bclass[Nn]ame=["'][^"']*\bglass\b/.test(readFileSync(f, 'utf8')));
if (!hasUsage) issues.push({ kind: 'glass-no-jsx-usage' });

const summary = {
  scannedAt: new Date().toISOString(),
  cssBytes: statSync(cssPath).size,
  jsxFilesScanned: jsx.length,
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
