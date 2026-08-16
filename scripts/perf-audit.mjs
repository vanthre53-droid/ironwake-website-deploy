// ponytail: performance audit. Scans the repo for Core Web Vitals anti-patterns.
// Goals §10 Core Web Vitals:
//   - <img> tags missing explicit width/height (CLS risk)
//   - external font CDN imports (fonts.googleapis.com / fonts.gstatic.com)
//   - heavy deps imported in client components without lazy() or dynamic()
//   - next/image should be used instead of raw <img> wherever possible
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = '/mnt/c/Users/vanth/Downloads/ironwake';
const SEARCH_DIRS = ['app', 'components', 'lib'];
const EXTS = ['.js', '.jsx', '.tsx', '.ts'];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.open-next') continue;
      walk(p, acc);
    } else if (EXTS.some(e => entry.name.endsWith(e))) {
      acc.push(p);
    }
  }
  return acc;
}

const files = SEARCH_DIRS.flatMap(d => walk(join(ROOT, d)));

const issues = [];
const warnings = [];

// 1. <img> missing width and height
const imgRegex = /<img\b[^>]*>/gi;
const widthRe = /\bwidth\s*=/i;
const heightRe = /\bheight\s*=/i;
const nextImageRe = /from\s+['"]next\/image['"]/;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const isClient = /^['"]use client['"]/m.test(src);
  const usesNextImage = nextImageRe.test(src);

  for (const match of src.matchAll(imgRegex)) {
    const tag = match[0];
    if (!usesNextImage && !widthRe.test(tag)) {
      issues.push({ file: relative(ROOT, file), tag: tag.slice(0, 80), issue: 'img-missing-width' });
    }
    if (!usesNextImage && !heightRe.test(tag)) {
      issues.push({ file: relative(ROOT, file), tag: tag.slice(0, 80), issue: 'img-missing-height' });
    }
  }

  // 2. external font CDN
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(src)) {
    issues.push({ file: relative(ROOT, file), issue: 'external-font-cdn' });
  }

  // 3. heavy client-side dep
  if (isClient) {
    if (/from\s+['"]lodash['"]|from\s+['"]lodash-es['"]|from\s+['"]moment['"]/.test(src)) {
      warnings.push({ file: relative(ROOT, file), issue: 'heavy-client-dep' });
    }
  }
}

const summary = {
  scannedAt: new Date().toISOString(),
  filesScanned: files.length,
  issueCount: issues.length,
  warningCount: warnings.length,
  issues,
  warnings,
};
console.log(JSON.stringify(summary, null, 2));
process.exit(issues.length === 0 ? 0 : 1);
