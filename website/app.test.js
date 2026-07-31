import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const source = fs.readFileSync(path.join(directory, 'app.js'), 'utf8');
assert.match(source, /Prototype only — no request was sent or stored\./);
assert.match(source, /window\.addEventListener\('hashchange', render\)/);
assert.match(source, /name="consent" type="checkbox" required/);
assert.match(source, /function signalRail\(\)/);
assert.match(fs.readFileSync(path.join(directory, 'index.html'), 'utf8'), /class="skip-link"/);
assert.match(fs.readFileSync(path.join(directory, 'styles.css'), 'utf8'), /prefers-reduced-motion/);
console.log('PASS website/app.js guards');
