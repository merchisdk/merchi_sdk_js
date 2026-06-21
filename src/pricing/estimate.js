import { applyDiscount } from './discount.js';
import { roundHalfEven } from './round.js';
import { resolveVisibleFields } from './visibility.js';

function unitPriceAt(rules, qty) {
  let unitPrice = applyDiscount(rules.product.unitPrice, qty, rules.product.discountGroup);
  const mop = rules.product.minimumPrice;
  if (qty > 0 && mop && unitPrice * qty < mop) {
    unitPrice = mop / qty;
  }
  return unitPrice;
}

function variationSetupCost(source, totalQty) {
  let cost = source.variationCost;
  if (source.variationCostDiscountGroup) {
    cost = applyDiscount(cost, totalQty, source.variationCostDiscountGroup);
  }
  return roundHalfEven(cost, 3);
}

function variationUnitCosts(source, groupQuantities) {
  const uc = source.variationUnitCost;
  const group = source.variationUnitCostDiscountGroup;
  let list;
  if (group) {
    if (group.groupRestricted) {
      list = groupQuantities.map((q) => applyDiscount(uc, q, group));
    } else {
      const total = groupQuantities.reduce((a, b) => a + b, 0);
      const discounted = applyDiscount(uc, total, group);
      list = groupQuantities.map(() => discounted);
    }
  } else {
    list = groupQuantities.map(() => uc);
  }
  return list.map((c) => roundHalfEven(c, 3));
}

function isEmpty(field, sel) {
  if (!sel) return true;
  if (field.isSelectable) {
    return !sel.selectedOptionIds || sel.selectedOptionIds.length === 0;
  }
  return (
    sel.value === undefined ||
    sel.value === null ||
    sel.value === '' ||
    sel.value === 0
  );
}

function costFactor(field, sel, groupQuantities) {
  const n = groupQuantities.length;
  if (isEmpty(field, sel)) {
    return { setup: 0, unitList: new Array(n).fill(0) };
  }
  const totalQty = groupQuantities.reduce((a, b) => a + b, 0);
  if (field.isSelectable) {
    let setup = 0;
    const unitList = new Array(n).fill(0);
    const optById = new Map();
    for (const o of field.options) {
      optById.set(o.id, o);
      if (o.originalId != null) optById.set(o.originalId, o);
    }
    for (const optId of sel.selectedOptionIds) {
      const opt = optById.get(optId);
      if (!opt) continue;
      setup += variationSetupCost(opt, totalQty);
      const ucs = variationUnitCosts(opt, groupQuantities);
      for (let i = 0; i < n; i++) unitList[i] += ucs[i];
    }
    return { setup, unitList };
  }
  return {
    setup: variationSetupCost(field, totalQty),
    unitList: variationUnitCosts(field, groupQuantities),
  };
}

export function estimateQuote(rules, selections) {
  if (rules.unsupported) {
    return { unsupported: rules.unsupported };
  }

  const groupCosts = [];
  let cost = 0;
  let costPerUnit;
  let groupQuantities;

  // Mirror the server: the group-vs-single branch keys off whether the *job*
  // actually has variation groups, not the product's capability.
  const groups = selections.groups || [];
  if (groups.length > 0) {
    groupQuantities = groups.map((g) => g.quantity || 0);
    const totalQty = groupQuantities.reduce((a, b) => a + b, 0);
    const restricted = Boolean(
      rules.product.discountGroup && rules.product.discountGroup.groupRestricted
    );
    const baseUnitPrice = unitPriceAt(rules, totalQty);
    const perGroupCpu = [];

    for (const group of groups) {
      const gQty = group.quantity || 0;
      const cpu = restricted ? unitPriceAt(rules, gQty) : baseUnitPrice;
      perGroupCpu.push(cpu);
      // A zero-qty group contributes exactly 0 (no field costs).
      if (!gQty) {
        groupCosts.push(0);
        continue;
      }
      // Per-group field visibility is scoped to that group's selections plus
      // the independent selections.
      const groupVisible = resolveVisibleFields(rules, {
        fieldValues: selections.fieldValues,
        groups: [group],
      });
      let groupVariationCost = 0;
      for (const field of rules.groupFields) {
        if (!groupVisible.has(field.id)) continue;
        const { setup, unitList } = costFactor(field, group.fieldValues[field.id], [gQty]);
        groupVariationCost += setup + unitList[0] * gQty;
      }
      const groupCost = gQty * cpu + groupVariationCost;
      groupCosts.push(groupCost);
      cost += groupCost;
    }

    costPerUnit =
      totalQty > 0
        ? perGroupCpu.reduce((acc, cpu, i) => acc + cpu * groupQuantities[i], 0) / totalQty
        : baseUnitPrice;

    // Independent field visibility is scoped to independent selections only.
    const independentVisible = resolveVisibleFields(rules, {
      quantity: selections.quantity,
      fieldValues: selections.fieldValues,
    });
    for (const field of rules.fields) {
      if (!independentVisible.has(field.id)) continue;
      const { setup, unitList } = costFactor(field, selections.fieldValues[field.id], groupQuantities);
      const unitTotal = unitList.reduce((acc, uc, i) => acc + uc * groupQuantities[i], 0);
      cost += setup + unitTotal;
    }
  } else {
    const qty = selections.quantity || 0;
    groupQuantities = [qty];
    costPerUnit = unitPriceAt(rules, qty);
    cost = costPerUnit * qty;
    const visible = resolveVisibleFields(rules, selections);
    for (const field of rules.fields) {
      if (!visible.has(field.id)) continue;
      const { setup, unitList } = costFactor(field, selections.fieldValues[field.id], groupQuantities);
      cost += setup + unitList[0] * qty;
    }
  }

  // Tax is derived from the UNROUNDED cost, then cost/tax rounded independently.
  const unroundedCost = cost;
  const roundedCost = roundHalfEven(unroundedCost, 2);
  const unroundedTax = (unroundedCost * rules.taxPercent) / 100;
  const taxAmount = roundHalfEven(unroundedTax, 2);
  return {
    costPerUnit: roundHalfEven(costPerUnit, 3),
    cost: roundedCost,
    taxAmount,
    totalCost: roundHalfEven(unroundedCost + unroundedTax, 3),
    groupCosts: groupCosts.map((c) => roundHalfEven(c, 3)),
    currency: rules.currency,
  };
}
