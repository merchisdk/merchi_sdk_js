function collectSelectedOptionIds(selections) {
  const ids = [];
  const addFrom = (fieldValues) => {
    for (const key of Object.keys(fieldValues)) {
      const sel = fieldValues[Number(key)];
      if (sel && sel.selectedOptionIds) ids.push(...sel.selectedOptionIds);
    }
  };
  addFrom(selections.fieldValues || {});
  for (const group of selections.groups || []) addFrom(group.fieldValues || {});
  return ids;
}

// Shared machinery for field- and option-level conditional visibility. Mirrors
// the server's `check_selected_by_fullfilled` recursion: a `selectedBy` list is
// fulfilled when any of its trigger option ids is currently selected AND that
// selecting option is itself fulfilled (its own `selectedBy` and its owning
// field's `selectedBy`), with a `checked` accumulator to break cycles.
function buildResolver(rules, selections) {
  const allFields = [...rules.fields, ...rules.groupFields];
  const optionsById = new Map();
  const fieldByOptionId = new Map();
  for (const f of allFields) {
    for (const o of f.options) {
      optionsById.set(o.id, o);
      fieldByOptionId.set(o.id, f);
      if (o.originalId != null) {
        optionsById.set(o.originalId, o);
        fieldByOptionId.set(o.originalId, f);
      }
    }
  }

  const selectedOptionIds = collectSelectedOptionIds(selections);

  const sameOption = (a, b) => {
    const oa = optionsById.get(a);
    return oa != null && oa === optionsById.get(b);
  };

  const isFulfilled = (selectedBy, checked) => {
    if (!selectedBy || selectedBy.length === 0) return true;
    for (const triggerId of selectedBy) {
      for (const selId of selectedOptionIds) {
        if (!sameOption(triggerId, selId)) continue;
        if (checked.includes(selId)) return true;
        const opt = optionsById.get(selId);
        const field = fieldByOptionId.get(selId);
        const nextChecked = [...checked, selId];
        if (
          isFulfilled(opt.selectedBy, nextChecked) &&
          isFulfilled(field.selectedBy, nextChecked)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Group fields only materialise as variations when the job actually has
  // groups (mirrors the server: a non-group job exposes no group fields).
  const hasGroups = Boolean(selections.groups && selections.groups.length > 0);
  const fieldsToConsider = hasGroups ? allFields : rules.fields;

  return { allFields, fieldsToConsider, isFulfilled };
}

export function resolveVisibleFields(rules, selections) {
  const { fieldsToConsider, isFulfilled } = buildResolver(rules, selections);
  const visible = new Set();
  for (const f of fieldsToConsider) {
    if (isFulfilled(f.selectedBy, [])) visible.add(f.id);
  }
  return visible;
}

// Option ids whose own `selectedBy` is fulfilled (i.e. options that should be
// visible/selectable). Mirrors the server's per-option
// `isVisible = check_selected_by_fullfilled(option.selected_by)`.
export function resolveVisibleOptionIds(rules, selections) {
  const { fieldsToConsider, isFulfilled } = buildResolver(rules, selections);
  const visible = new Set();
  for (const f of fieldsToConsider) {
    for (const o of f.options) {
      if (isFulfilled(o.selectedBy, [])) visible.add(o.id);
    }
  }
  return visible;
}
