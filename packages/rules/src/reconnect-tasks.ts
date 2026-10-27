import type { ReconnectTask, ReconnectTaskPlan } from "@opencok/contracts/reconnect";
import type { RewardRandom } from "@opencok/contracts/rewards";
import type { Row } from "@opencok/contracts/rows";
import type { Rule } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaIntHashMapOrder } from "./java-hash-map-order.ts";
import { mailBlank } from "./mail.ts";

const integer = (value: unknown) => Number(javaDecimal(String(value), 32));

const parts = (value: string | undefined) => value?.split("|").filter(Boolean) ?? [];

export interface ReconnectTaskContext {
  platform: string;
  registrationPlatform: string | null;
  chinaPlatform: boolean;
  level: number;
  castleLevel: number;
  containsBuildings: (requirements: readonly string[]) => boolean;
  initialCount: (rule: Rule) => number;
  random: RewardRandom;
}

function ordered(tasks: readonly ReconnectTask[]): ReconnectTask[] {
  const groups = new Map<number, ReconnectTask[]>();

  for (const task of tasks.filter((task) => task.accepted)) {
    const group = groups.get(task.trigger) ?? [];
    group.push(task);
    groups.set(task.trigger, group);
  }

  return [
    ...javaIntHashMapOrder(groups.keys()).flatMap((key) => groups.get(key)!),
    ...tasks.filter((task) => !task.accepted && task.state === 1),
    ...tasks.filter((task) => !task.accepted && task.state === 2),
  ];
}

export function reconnectTaskPlan(
  rows: readonly Row[],
  declarations: readonly Rule[],
  context: ReconnectTaskContext,
): ReconnectTaskPlan {
  if (rows.length > 32767 || declarations.length > 32767) throw new Error("Oversized task catalog");

  const catalog = new Map(declarations.map((rule) => [rule.id, rule]));
  const allowed = (rule: Rule) => mailBlank(rule.operator) || !context.chinaPlatform;
  const restore = (
    id: string,
    num: number,
    state: number,
    type: number,
    rule: Rule,
  ): ReconnectTask => ({
    id,
    num,
    state,
    type,
    accepted: state === 0,
    trigger: rule.type2 === undefined ? -1 : integer(rule.type2),
    phase: rule.phase === undefined ? 0 : integer(rule.phase),
    predecessor: rule.pre,
    reward: rule.reward,
  });
  const tasks: ReconnectTask[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (typeof row.id !== "string" || row.id.endsWith("_ban") || seen.has(row.id))
      throw new Error("Invalid reconnect task");

    seen.add(row.id);
    const rule = catalog.get(row.id);

    if (!rule || !allowed(rule)) continue;

    const state = integer(row.state);

    if (state < 0 || state > 2) throw new Error("Invalid task state");

    if (
      state === 0 &&
      (rule.type2 === undefined ||
        (rule.accept3 !== undefined && context.containsBuildings([rule.accept3])))
    )
      continue;

    tasks.push(restore(row.id, integer(row.num), state, integer(row.type), rule));
  }

  const inserts: ReconnectTask[] = [];
  const updates = new Map<string, ReconnectTask>();
  const pushes: { command: string; tasks: ReconnectTask[] }[] = [];
  const predecessor = (id: string | undefined) =>
    id === undefined || tasks.some((task) => task.id === id && !task.accepted);
  const discover = () => {
    const existing = new Set(tasks.map((task) => task.id));
    const ordinary: ReconnectTask[] = [];
    const cross: ReconnectTask[] = [];

    for (const rule of declarations) {
      const id = rule.id;

      if (typeof id !== "string" || id.length > 255) throw new Error("Invalid task ID");

      if (
        existing.has(id) ||
        !allowed(rule) ||
        (rule.accept3 !== undefined && context.containsBuildings([rule.accept3]))
      )
        continue;

      const trigger = integer(rule.type2);

      if (trigger === 34 && context.registrationPlatform?.toLowerCase() !== "facebook") continue;

      if (
        rule.accept1 === undefined ||
        context.level < integer(rule.accept1) ||
        rule.accept2 === undefined ||
        !context.containsBuildings(parts(rule.accept2))
      )
        continue;

      const type = integer(rule.type1);

      if (type === 1) {
        if (!predecessor(rule.pre)) continue;
      } else if (type === 3) {
        const phase = integer(rule.phase);
        const previous = (phase - 1) | 0;

        if (previous > 0 && !tasks.some((task) => !task.accepted && task.phase === previous))
          continue;

        if (phase <= 0 || tasks.some((task) => task.accepted && task.phase === phase)) continue;

        if (context.castleLevel < integer(rule.min) || context.castleLevel > integer(rule.max))
          continue;
      } else continue;

      const count = integer(context.initialCount(rule));
      const state = !mailBlank(rule.para2) && count >= integer(rule.para2) ? 1 : 0;
      const task = restore(id, count, state, type, rule);
      task.accepted = true;

      if (type === 1) ordinary.push(task);
      else cross.push(task);
    }

    if (cross.length) {
      const index = context.random(cross.length);

      if (!Number.isInteger(index) || index < 0 || index >= cross.length)
        throw new Error("Invalid task selection");

      ordinary.push(cross[index]!);
    }

    if (ordinary.length) {
      if (tasks.length + ordinary.length > 32767) throw new Error("Oversized reconnect tasks");

      tasks.push(...ordinary);
      inserts.push(...ordinary);
      pushes.push({ command: "push.task.new", tasks: ordinary.map((task) => ({ ...task })) });
    }
  };
  const trigger = (kind: number, matchingKey: number | null, count: number) => {
    discover();
    const changed: ReconnectTask[] = [];

    for (const task of tasks) {
      if (!task.accepted || task.trigger !== kind) continue;

      const rule = catalog.get(task.id)!;
      const previous = task.num;

      if (
        rule.para1 === undefined ||
        (matchingKey !== null && matchingKey === integer(rule.para1))
      ) {
        task.num = rule.add === undefined ? count : (task.num + count) | 0;
      }

      const maximum = parts(rule.para2).reduce((sum, value) => (sum + integer(value)) | 0, 0);

      if (task.num >= maximum) {
        task.state = 1;
        task.accepted = false;
      } else if (task.num === previous) continue;

      updates.set(task.id, task);
      changed.push(task);
    }

    for (const [type, command] of [
      [1, "push.task.complete"],
      [3, "push.ckf.task.complete"],
    ] as const) {
      const selected = changed.filter(
        (task) => task.type === type && predecessor(task.predecessor),
      );

      if (selected.length)
        pushes.push({
          command,
          tasks: (type === 3
            ? changed.filter((task) => [1, 3].includes(task.type) && predecessor(task.predecessor))
            : selected
          ).map((task) => ({ ...task })),
        });
    }
  };

  if (context.platform.toLowerCase() !== "facebook") {
    trigger(34, 1, 1);
    trigger(4, null, tasks.filter((task) => !task.accepted).length);
  }

  return { tasks: ordered(tasks), inserts, updates: [...updates.values()], pushes };
}

export function visibleReconnectTasks(tasks: readonly ReconnectTask[]): ReconnectTask[] {
  const completed = new Set(tasks.filter((task) => !task.accepted).map((task) => task.id));

  return tasks.filter(
    (task) =>
      task.state !== 2 &&
      (task.type === 3 || task.predecessor === undefined || completed.has(task.predecessor)),
  );
}
