import { validateReleaseConfig } from '../lib/release-config.mjs';

const result = validateReleaseConfig(process.env);
if (!result.ok) {
  console.error(JSON.stringify({ release_config: 'invalid', missing: result.missing, invalid: result.invalid }));
  process.exit(1);
}

console.log(JSON.stringify({ release_config: 'valid' }));
