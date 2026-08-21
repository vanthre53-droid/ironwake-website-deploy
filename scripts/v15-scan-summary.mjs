// scripts/v15-scan-summary.mjs — read the scan JSON and print a summary.
import { readFileSync } from 'node:fs';
const j = JSON.parse(readFileSync('.ironwake/board/v15-contradiction-scan.json', 'utf8'));
console.log('SCAN_SUMMARY scanned=' + j.scanned + ' findings=' + j.findings.length);
const byKind = {};
for (const f of j.findings) byKind[f.kind] = (byKind[f.kind] || 0) + 1;
console.log('BY_KIND:', JSON.stringify(byKind, null, 2));
const sorted = j.findings.slice().sort((a, b) => (b.severity || 0) - (a.severity || 0));
console.log('TOP 20 FINDINGS:');
for (const f of sorted.slice(0, 20)) {
  console.log('  [' + (f.severity || 0) + '] ' + f.kind + ' -> ' + f.path.replace(process.cwd() + '/', '') + ':' + f.line);
  console.log('    phrase: ' + JSON.stringify((f.snippet || f.match || '').slice(0, 160)));
}
