import { invalidEffect as invalid } from "./power-values.ts";

function hash(key: string | number): number {
  let value = typeof key === "number" ? key : 0;
  if (typeof key === "string")
    for (let index = 0; index < key.length; index++)
      value = (Math.imul(value, 31) + key.charCodeAt(index)) | 0;
  return (value ^ (value >>> 16)) >>> 0;
}

export function hashOrder<T extends string | number>(keys: Iterable<T>): T[] {
  const unique: T[] = [];
  const seen = new Set<T>();
  let capacity = 16;
  for (const key of keys) {
    if (seen.has(key)) continue;
    if (unique.length >= 4096) return invalid();
    const bucket = hash(key) & (capacity - 1);
    const collisions = unique.filter((other) => (hash(other) & (capacity - 1)) === bucket).length;
    if (collisions >= 8) {
      if (capacity >= 64) return invalid();
      capacity *= 2;
    }
    unique.push(key);
    seen.add(key);
    if (unique.length > capacity * 0.75) capacity *= 2;
  }
  return unique.sort((a, b) => (hash(a) & (capacity - 1)) - (hash(b) & (capacity - 1)));
}
