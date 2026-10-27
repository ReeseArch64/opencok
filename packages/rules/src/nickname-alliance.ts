import type {
  NicknameAllianceTask,
  NicknameAlliancePlan,
} from "@opencok/contracts/nickname-change";
import type { Rules } from "./game.ts";
import { worldActivityRealmEnabled } from "./availability.ts";
import { javaDecimal } from "./java-integer.ts";

const ids = new Set([
  "00000",
  "00001",
  "46600",
  "46601",
  "46602",
  "46603",
  "46604",
  "46605",
  "46606",
  "46607",
  "46608",
  "46609",
  "46610",
]);

export function nicknameAllianceTask(
  tasks: readonly NicknameAllianceTask[],
  rules: Pick<Rules, "items" | "configuration">,
  kingdomId: number,
  now: number,
): NicknameAlliancePlan {
  if (!Number.isSafeInteger(now) || now < 0 || tasks.length > ids.size)
    throw new Error("Invalid nickname alliance state");

  const rows = new Map<string, { id: string; num: bigint; state: number }>();

  for (const task of tasks) {
    const state = task.state ?? 0,
      num = task.num ?? 0n;

    if (
      !ids.has(task.id) ||
      rows.has(task.id) ||
      !Number.isInteger(state) ||
      state < -2147483648 ||
      state > 2147483647 ||
      typeof num !== "bigint" ||
      BigInt.asIntN(64, num) !== num
    )
      throw new Error("Invalid nickname alliance task");

    rows.set(task.id, { id: task.id, num, state });
  }

  const empty: NicknameAlliancePlan = { updates: [], complete: false };
  const init = rows.get("00000");

  if (init?.state === 1) return empty;

  if (!worldActivityRealmEnabled(rules.items.get("function_on6")?.k12, kingdomId)) return empty;

  const task = rows.get("46608");

  if (!task) return empty;

  if (!init) throw new Error("Missing nickname alliance lifecycle");

  const config = rules.configuration.allianceTeleport?.get("46608");

  if (!config) throw new Error("Missing nickname alliance catalog");

  const enabled = javaDecimal(config.function_on, 32) !== 0n;

  if (enabled) {
    javaDecimal(config.para1, 32);

    if (task.state === 1) return empty;
  }

  const updates = [{ ...task, state: 1 }];
  rows.set(task.id, updates[0]!);
  const remaining = [...rows.values()].filter((row) => row.id !== "00000");

  if (remaining.every((row) => row.state === 1 || row.id === "46609")) {
    const timer = rows.get("46609");

    if (!timer) throw new Error("Missing nickname alliance timer");

    if (timer.num === 0n) updates.push({ ...timer, num: BigInt(now) });
  }

  const complete = remaining.every((row) => row.state === 1);

  if (complete) updates.push({ ...init, state: 1 });

  return { updates, complete };
}

export function nicknameAllianceReward(id: string, rules: Pick<Rules, "reconnect">): string {
  const row = rules.reconnect.rewards?.get(id);

  if (
    !row ||
    row.islink !== "0" ||
    Object.keys(row).some((key) => !["id", "islink", "rate", "item", "num", "circle"].includes(key))
  )
    throw new Error("Unsupported nickname alliance reward");

  const rate = javaDecimal(row.rate, 32),
    item = javaDecimal(row.item, 32),
    count = javaDecimal(row.num, 32),
    circles = javaDecimal(row.circle, 32);

  if (rate <= 0n || item < 50n || item >= 1000000n || count < 0n || circles !== 1n)
    throw new Error("Invalid nickname alliance reward");

  return `goods,${item},${count}`;
}
