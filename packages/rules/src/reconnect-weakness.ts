import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaHashMapOrder } from "./java-hash-map-order.ts";
import { javaListSort } from "./java-list-sort.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const count = (row: Row, keys: readonly string[]) =>
  keys.reduce((sum, key) => (sum + int(row[key])) | 0, 0);

const nonnegative = (value: number) => Math.max(0, value | 0);

export interface ReconnectWeaknessPlan {
  weaknessTime: bigint;
  armies: readonly Row[];
  weakness: readonly Row[];
  inserted: readonly string[];
  weakened: number;
  dead: number;
  losses: readonly { armyId: string; weakened: number; dead: number }[];
}

export function reconnectWeaknessPlan(
  armies: readonly Row[],
  weakness: readonly Row[],
  elapsed: bigint,
  previous: bigint,
  capacity: number,
  rules: Rules,
): ReconnectWeaknessPlan {
  if (elapsed < 0n || previous < 0n) throw new Error("Invalid starvation interval");

  const rule = rules.items.get("week_info");

  if (!rule || rule.k1 === undefined || rule.k2 === undefined)
    throw new Error("Missing weakness rule");

  const interval = (int(rule.k1) * 1000) | 0;

  if (interval <= 0) throw new Error("Invalid weakness interval");

  const duration = javaDecimal(String(previous + elapsed), 64);
  const iterations = Number(BigInt.asIntN(32, duration / BigInt(interval)));
  const weaknessTime = duration % BigInt(interval);
  const ratio = Math.fround(Math.fround(int(rule.k2)) / 1000);
  const indexed = new Map(armies.map((row) => [String(row.armyId), { ...row }]));

  if (indexed.size !== armies.length) throw new Error("Duplicate weakness army");

  const active = javaListSort(
    javaHashMapOrder(indexed.keys()).flatMap((id) => {
      const row = indexed.get(id)!;
      const xml = rules.arms.get(id);

      return int(xml?.new_arms) === 0 ? [] : [row];
    }),
    (left, right) => {
      const difference = (count(left, ["free", "defence"]) - count(right, ["free", "defence"])) | 0;

      if (difference !== 0) return difference;

      const a = String(left.armyId),
        b = String(right.armyId);

      return a < b ? -1 : a > b ? 1 : 0;
    },
  );
  const beds = new Map(weakness.map((row) => [String(row.armyId), { ...row }]));

  if (beds.size !== weakness.length) throw new Error("Duplicate weakness record");

  let available =
    (int(capacity) - weakness.reduce((sum, row) => (sum + int(row.weakness)) | 0, 0)) | 0;
  const inserted: string[] = [];
  let weakened = 0;
  let dead = 0;
  const losses = new Map<string, { armyId: string; weakened: number; dead: number }>();

  for (let step = 0; step < iterations; step++) {
    let changed = false;

    for (const army of active) {
      const id = String(army.armyId);
      let bed = beds.get(id);

      if (!bed) {
        bed = {
          uid: army.uid ?? null,
          armyId: id,
          weakness: 0,
          marchWeakness: 0,
          heal: 0,
          finishTime: 0n,
        };
        beds.set(id, bed);
        inserted.push(id);
      }

      if (count(army, ["free", "defence", "pve", "march"]) <= 0) continue;

      const remove = (amount: number) => {
        const free = int(army.free),
          defence = int(army.defence);
        const removedFree = Math.min(Math.max(free, 0), Math.max(amount, 0));
        const removedDefence = Math.min(
          Math.max(defence, 0),
          Math.max(0, (amount - removedFree) | 0),
        );
        army.free = nonnegative(free - removedFree);

        if (removedDefence > 0) army.defence = nonnegative(defence - removedDefence);
      };
      let required = int(bed.marchWeakness);
      let present = count(army, ["free", "defence"]);

      if (required > 0 && present > 0) {
        required = Math.min(required, present);
        bed.marchWeakness = nonnegative(int(bed.marchWeakness) - required);
        remove(required);
        changed = true;
      } else required = 0;

      present = count(army, ["free", "defence"]);

      if (ratio > 0) {
        const living = Math.max(
          0,
          (count(army, ["free", "defence", "pve", "march"]) - int(bed.marchWeakness)) | 0,
        );
        let loss = Math.min(2147483647, Math.ceil(living * ratio));

        if (loss > 0) changed = true;

        if (loss > present) {
          bed.marchWeakness = nonnegative(int(bed.marchWeakness) + ((loss - present) | 0));
          loss = present;
        }

        remove(loss);
        required = (required + loss) | 0;
      }

      const kept = Math.min(Math.max(available, 0), required);
      bed.weakness = nonnegative(int(bed.weakness) + kept);
      available = (available - kept) | 0;
      weakened = (weakened + kept) | 0;
      dead = (dead + required - kept) | 0;

      if (required !== 0) {
        const loss = losses.get(id) ?? { armyId: id, weakened: 0, dead: 0 };
        loss.weakened = (loss.weakened + kept) | 0;
        loss.dead = (loss.dead + required - kept) | 0;
        losses.set(id, loss);
      }
    }

    if (!changed) break;
  }

  return {
    weaknessTime,
    armies: [...indexed.values()],
    weakness: [...beds.values()],
    inserted,
    weakened,
    dead,
    losses: [...losses.values()],
  };
}
