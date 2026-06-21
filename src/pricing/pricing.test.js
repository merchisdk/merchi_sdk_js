import test from 'node:test';
import assert from 'node:assert/strict';
import { roundHalfEven } from './round.js';
import { applyDiscount } from './discount.js';
import { resolveUnavailableOptionIds } from './inventory.js';
import { estimateQuote } from './estimate.js';

test('roundHalfEven: decimal half-even', () => {
  assert.equal(roundHalfEven(0.5, 0), 0);
  assert.equal(roundHalfEven(1.5, 0), 2);
  assert.equal(roundHalfEven(2.5, 0), 2);
  assert.equal(roundHalfEven(2.675, 2), 2.68);
  assert.equal(roundHalfEven(12.3456, 3), 12.346);
  assert.equal(roundHalfEven(Infinity, 2), Infinity);
});

test('applyDiscount: highest applicable tier', () => {
  const group = {
    groupRestricted: false,
    discounts: [
      { lowerLimit: 100, amount: 5 },
      { lowerLimit: 500, amount: 12 },
    ],
  };
  assert.equal(applyDiscount(10, 50, null), 10);
  assert.equal(applyDiscount(10, 50, group), 10);
  assert.equal(applyDiscount(10, 100, group), 9.5);
  assert.equal(applyDiscount(10, 500, group), 8.8);
});

test('estimateQuote: simple linear price + tax', () => {
  const rules = {
    currency: 'AUD',
    taxPercent: 10,
    product: { unitPrice: 10, minimumPrice: null, discountGroup: null },
    fields: [],
    groupFields: [],
    hasGroups: false,
  };
  const r = estimateQuote(rules, { quantity: 5, fieldValues: {} });
  assert.equal(r.cost, 50);
  assert.equal(r.taxAmount, 5);
  assert.equal(r.totalCost, 55);
});

test('resolveUnavailableOptionIds: 25mm makes Blue unavailable', () => {
  const opt = (id) => ({
    id, originalId: id, position: id, default: false,
    variationCost: 0, variationUnitCost: 0,
    variationCostDiscountGroup: null, variationUnitCostDiscountGroup: null,
    selectedBy: [],
  });
  const f = (id, options) => ({
    id, originalId: id, position: 0, fieldType: 2, independent: false,
    isSelectable: true, selectedBy: [],
    variationCost: 0, variationUnitCost: 0,
    variationCostDiscountGroup: null, variationUnitCostDiscountGroup: null,
    options: options.map(opt),
  });
  const rules = {
    currency: 'AUD', taxPercent: 0,
    product: { unitPrice: 0, minimumPrice: null, discountGroup: null },
    fields: [], hasGroups: true, needsInventory: true,
    groupFields: [f(800, [801, 802]), f(810, [811, 813])],
    inventoryUnits: [
      { optionIds: [801, 813], quantity: 5 }, // 24mm-Blue ok
      { optionIds: [802, 811], quantity: 7 }, // 25mm-Red ok
      { optionIds: [802, 813], quantity: 0 }, // 25mm-Blue OUT
    ],
  };
  const u = resolveUnavailableOptionIds(rules, {
    fieldValues: {},
    groups: [{ quantity: 1, fieldValues: { 800: { selectedOptionIds: [802] } } }],
  });
  assert.equal(u.has(813), true);
  assert.equal(u.has(811), false);
});
