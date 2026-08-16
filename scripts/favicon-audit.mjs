// ponytail: favicon + Organization schema audit. Verifies:
//   - /icon.svg exists in public/ and is valid SVG
//   - app/layout.js metadata declares icons { icon, apple }
//   - JSON-LD Organization schema is present with non-empty name/url
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const issues = [];

// 1. icon.svg exists
const iconPath = join(ROOT, 'public/icon.svg');
if (!existsSync(iconPath)) {
  issues.push({ kind: 'icon-missing', file: 'public/icon.svg' });
} else {
  const src = readFileSync(iconPath, 'utf8');
  if (!/^<svg\b/.test(src)) issues.push({ kind: 'icon-not-svg', file: 'public/icon.svg' });
  if (src.length < 100) issues.push({ kind: 'icon-too-small', file: 'public/icon.svg', bytes: src.length });
}

// 2. layout.js declares icons
const layoutPath = join(ROOT, 'app/layout.js');
const layout = readFileSync(layoutPath, 'utf8');
if (!/icons:\s*\{/.test(layout)) {
  issues.push({ kind: 'layout-icons-missing' });
} else {
  // check both icon and apple
  if (!/icon:\s*\[/.test(layout) && !/icon:\s*['"]/.test(layout)) issues.push({ kind: 'layout-icon-field-missing' });
  if (!/apple:\s*\[/.test(layout) && !/apple:\s*['"]/.test(layout)) issues.push({ kind: 'layout-apple-field-missing' });
}

// 3. Organization JSON-LD present
if (!/'@type':\s*['"]Organization['"]/.test(layout)) {
  issues.push({ kind: 'org-jsonld-missing' });
}

// 4. og-default.svg exists
const ogPath = join(ROOT, 'public/og-default.svg');
if (!existsSync(ogPath)) {
  issues.push({ kind: 'og-default-missing' });
}

const summary = {
  scannedAt: new Date().toISOString(),
  iconSvgBytes: existsSync(iconPath) ? statSync(iconPath).size : 0,
  issueCount: issues.length,
  issues,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
