import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateShrinkage } from './clay-shrinkage.mjs';

const base = {
  schemaVersion: 1,
  targetFiredMm: { maxDiameter: 140, opening: [40, 50] },
  shrinkage: { totalPercent: 12.5, source: 'example test bar' },
};

test('final dimensions are inverted from wet-to-final shrinkage', () => {
  const result = calculateShrinkage(base);
  assert.equal(result.wetBuildMm.maxDiameter, 160);
  assert.deepEqual(result.wetBuildMm.opening, [45.714, 57.143]);
  assert.equal(result.shrinkage.wetToFinalMultiplier, 1.143);
});

test('drying and firing percentages compound rather than add', () => {
  const result = calculateShrinkage({
    ...base,
    shrinkage: { dryingPercent: 6, firingPercent: 7, source: 'example staged test bar' },
  });
  assert.equal(result.shrinkage.totalPercent, 12.58);
  assert.equal(result.wetBuildMm.maxDiameter, 160.146);
  assert.equal(result.boneDryMm.maxDiameter, 150.538);
});

test('measured test bar lengths can supply the shrinkage rate', () => {
  const result = calculateShrinkage({
    ...base,
    shrinkage: {
      testBarMm: { wet: 100, boneDry: 94, finalFired: 87.5 },
      source: 'own test bar, final glaze firing',
    },
  });
  assert.equal(result.shrinkage.totalPercent, 12.5);
  assert.equal(result.shrinkage.dryingPercent, 6);
  assert.equal(result.shrinkage.firingPercent, 6.915);
  assert.equal(result.wetBuildMm.maxDiameter, 160);
  assert.equal(result.boneDryMm.maxDiameter, 150.4);
});

test('rates, source and dimension ranges must be explicit and valid', () => {
  assert.throws(() => calculateShrinkage({ ...base, shrinkage: { totalPercent: 12.5 } }), /source/);
  assert.throws(() => calculateShrinkage({ ...base, shrinkage: { totalPercent: 100, source: 'test' } }), /less than 100/);
  assert.throws(() => calculateShrinkage({ ...base, targetFiredMm: { opening: [50, 40] } }), /minimum exceeds maximum/);
  assert.throws(() => calculateShrinkage({ ...base, shrinkage: { dryingPercent: 6, source: 'test' } }), /Both dryingPercent/);
});
