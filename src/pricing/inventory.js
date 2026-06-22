// Returns the set of option ids that should be DISABLED because the combination
// of (current inventory-relevant selections + that option) has no matching
// inventory with stock. Mirrors the server's subset match
// (inventories_subset_match_strategy): an inventory matches a selection when it
// contains every selected option; an option is available if any matching
// inventory has quantity > 0.
//
// Scope: pass the container's selections (independent fields use the top-level
// selections; a group uses its own + independent). Only options that appear in
// at least one inventory unit are inventory-tracked; all others are always
// available. Direct product inventories only (no shared inventory groups).
export function resolveUnavailableOptionIds(rules, selections) {
  const unavailable = new Set();
  const units = rules.inventoryUnits || [];
  if (units.length === 0) return unavailable;

  const allFields = [...rules.fields, ...rules.groupFields];

  const canonical = new Map();
  for (const f of allFields) {
    for (const o of f.options) {
      canonical.set(o.id, o.id);
      if (o.originalId != null) canonical.set(o.originalId, o.id);
    }
  }
  const canon = (id) => (canonical.has(id) ? canonical.get(id) : id);

  const unitSets = units.map((u) => ({
    quantity: u.quantity,
    optionIds: new Set(u.optionIds.map(canon)),
  }));
  const inventoryOptionIds = new Set();
  for (const u of unitSets) {
    for (const id of u.optionIds) inventoryOptionIds.add(id);
  }

  const selectedByField = new Map();
  const addSelections = (fieldValues) => {
    for (const key of Object.keys(fieldValues)) {
      const fieldId = Number(key);
      const sel = fieldValues[fieldId];
      if (!sel || !sel.selectedOptionIds) continue;
      const set = selectedByField.get(fieldId) || new Set();
      for (const oid of sel.selectedOptionIds) {
        const c = canon(oid);
        if (inventoryOptionIds.has(c)) set.add(c);
      }
      selectedByField.set(fieldId, set);
    }
  };
  addSelections(selections.fieldValues || {});
  for (const group of selections.groups || []) addSelections(group.fieldValues || {});

  const hasGroups = Boolean(selections.groups && selections.groups.length > 0);
  const fieldsToConsider = hasGroups ? allFields : rules.fields;

  for (const f of fieldsToConsider) {
    for (const o of f.options) {
      const candidate = canon(o.id);
      if (!inventoryOptionIds.has(candidate)) continue;
      const filter = [candidate];
      for (const [fieldId, set] of selectedByField) {
        if (fieldId === f.id) continue;
        for (const sid of set) filter.push(sid);
      }
      const available = unitSets.some(
        (u) => u.quantity > 0 && filter.every((id) => u.optionIds.has(id))
      );
      if (!available) unavailable.add(o.id);
    }
  }
  return unavailable;
}
