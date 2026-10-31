export function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function matchesItem(item, { query = "", group = "", tier = "", status = "" } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const searchable = normalize(
    `${item.name} ${item.group} ${item.reference} ${item.tier ? `T${item.tier}` : ""}`,
  );
  return (
    terms.every((term) => searchable.includes(term)) &&
    (!group || item.group === group) &&
    (!tier || String(item.tier) === String(tier)) &&
    (!status || item.status === status)
  );
}
