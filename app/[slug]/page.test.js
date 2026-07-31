import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('remaining draft routes stay truthful and gate publication', async () => {
  const source = await readFile(new URL('./page.js', import.meta.url), 'utf8');
  assert.match(source, /Privacy is a draft gate/);
  assert.match(source, /Terms are a review gate/);
  assert.match(source, /generateStaticParams/);
  assert.match(source, /generateMetadata/);
  assert.doesNotMatch(source, /dynamicParams\s*=/);
  assert.match(source, /if \(!page\) notFound\(\)/);
  assert.doesNotMatch(source, /\n\s*(about|systems|work|process):/, 'those slugs now have dedicated routes and must not be duplicated here');
});
