// Compatibility entrypoint for the selected skill implementation.
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../skills/ceramic-cad-to-3d/scripts/clay-shrinkage.mjs';
export { calculateShrinkage, runCli } from '../skills/ceramic-cad-to-3d/scripts/clay-shrinkage.mjs';
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCli(process.argv.slice(2)).catch(error => {
    process.stderr.write('clay-shrinkage: ' + error.message + '\n');
    process.exitCode = 1;
  });
}
