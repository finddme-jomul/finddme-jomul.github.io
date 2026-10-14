/**
 * Convert target final-fired dimensions to wet forming dimensions.
 *
 * Shrinkage is measured relative to the size at the beginning of each stage.
 * This tool does not infer a rate from the clay's colour or generic type.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function rate(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value >= 100) {
    throw new Error(`${name} must be a finite percentage from 0 to less than 100`);
  }
  return value / 100;
}

function positive(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive finite number of millimetres`);
  }
  return value;
}

function rounded(value) {
  return Number(value.toFixed(3));
}

function mapDimension(value, name, transform) {
  if (Array.isArray(value)) {
    if (value.length !== 2) throw new Error(`${name} range must have exactly [min, max]`);
    const min = positive(value[0], `${name}[0]`);
    const max = positive(value[1], `${name}[1]`);
    if (min > max) throw new Error(`${name} range minimum exceeds maximum`);
    return [rounded(transform(min)), rounded(transform(max))];
  }
  return rounded(transform(positive(value, name)));
}

export function calculateShrinkage(spec) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
    throw new Error('Input must be a JSON object');
  }
  if (spec.schemaVersion !== 1) throw new Error('schemaVersion must be 1');
  const target = spec.targetFiredMm;
  if (!target || typeof target !== 'object' || Array.isArray(target) || !Object.keys(target).length) {
    throw new Error('targetFiredMm must contain at least one dimension');
  }
  const shrink = spec.shrinkage;
  if (!shrink || typeof shrink !== 'object' || Array.isArray(shrink)) {
    throw new Error('shrinkage is required; clay colour is not a shrinkage rate');
  }
  if (typeof shrink.source !== 'string' || !shrink.source.trim()) {
    throw new Error('shrinkage.source must identify a measured value or manufacturer specification');
  }
  const hasTotal = shrink.totalPercent !== undefined;
  const hasStages = shrink.dryingPercent !== undefined || shrink.firingPercent !== undefined;
  const hasBar = shrink.testBarMm !== undefined;
  if (Number(hasTotal) + Number(hasStages) + Number(hasBar) !== 1) {
    throw new Error('Provide exactly one: totalPercent, dryingPercent plus firingPercent, or testBarMm');
  }
  let total, dry, firing;
  if (hasTotal) {
    total = rate(shrink.totalPercent, 'shrinkage.totalPercent');
  } else if (hasStages) {
    if (shrink.dryingPercent === undefined || shrink.firingPercent === undefined) {
      throw new Error('Both dryingPercent and firingPercent are required');
    }
    dry = rate(shrink.dryingPercent, 'shrinkage.dryingPercent');
    firing = rate(shrink.firingPercent, 'shrinkage.firingPercent');
    total = 1 - (1 - dry) * (1 - firing);
  } else {
    const bar = shrink.testBarMm;
    if (!bar || typeof bar !== 'object' || Array.isArray(bar)) {
      throw new Error('shrinkage.testBarMm must be an object');
    }
    const wet = positive(bar.wet, 'testBarMm.wet');
    const finalFired = positive(bar.finalFired, 'testBarMm.finalFired');
    if (finalFired > wet) throw new Error('testBarMm.finalFired exceeds wet length');
    total = 1 - finalFired / wet;
    if (bar.boneDry !== undefined) {
      const boneDry = positive(bar.boneDry, 'testBarMm.boneDry');
      if (boneDry > wet || boneDry < finalFired) {
        throw new Error('testBarMm.boneDry must be between finalFired and wet');
      }
      dry = 1 - boneDry / wet;
      firing = 1 - finalFired / boneDry;
    }
  }
  const factor = 1 / (1 - total);
  const wetBuildMm = {};
  const boneDryMm = {};
  const targetFiredMm = {};
  for (const [name, value] of Object.entries(target)) {
    if (!name.trim()) throw new Error('Dimension names cannot be empty');
    // Validation happens in mapDimension; preserve exact input dimensions in output.
    mapDimension(value, name, x => x);
    targetFiredMm[name] = value;
    wetBuildMm[name] = mapDimension(value, name, x => x * factor);
    if (firing !== undefined) boneDryMm[name] = mapDimension(value, name, x => x / (1 - firing));
  }
  return {
    schemaVersion: 1,
    project: spec.project ?? null,
    clayBody: spec.clayBody ?? null,
    firing: spec.firing ?? null,
    shrinkage: {
      source: shrink.source.trim(),
      totalPercent: rounded(total * 100),
      ...(dry !== undefined ? {
        dryingPercent: rounded(dry * 100),
        firingPercent: rounded(firing * 100),
      } : {}),
      ...(hasBar ? { testBarMm: shrink.testBarMm } : {}),
      wetToFinalMultiplier: rounded(factor),
    },
    targetFiredMm,
    ...(spec.dimensionSources ? { dimensionSources: spec.dimensionSources } : {}),
    ...(firing !== undefined ? { boneDryMm } : {}),
    wetBuildMm,
    note: 'Wet dimensions are estimates from linear shrinkage; confirm with a test bar for this clay and firing schedule. Glaze thickness, warping and nonuniform shrinkage are not modelled.',
  };
}

export async function runCli(argv) {
  if (argv.length !== 2 && argv.length !== 4) {
    throw new Error('Usage: node scripts/clay-shrinkage.mjs --input SPEC.json [--output RESULT.json]');
  }
  if (argv[0] !== '--input' || (argv.length === 4 && argv[2] !== '--output')) {
    throw new Error('Usage: node scripts/clay-shrinkage.mjs --input SPEC.json [--output RESULT.json]');
  }
  const input = JSON.parse(await readFile(resolve(argv[1]), 'utf8'));
  const output = JSON.stringify(calculateShrinkage(input), null, 2) + '\n';
  if (argv.length === 4) await writeFile(resolve(argv[3]), output);
  else process.stdout.write(output);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runCli(process.argv.slice(2)).catch(error => {
    process.stderr.write(`clay-shrinkage: ${error.message}\n`);
    process.exitCode = 1;
  });
}
