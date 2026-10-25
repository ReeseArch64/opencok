import { randomInt, randomUUID } from "node:crypto";
import type {
  CampaignAction,
  CampaignClause,
  CampaignVariable,
} from "@opencok/contracts/local-campaign";
import { num, long, text } from "@opencok/contracts/rows";
import { sfs, encode, type Fields } from "@opencok/messages/sfs";
import {
  campaignFailure,
  campaignNumber,
  campaignMath,
  campaignCompare,
  campaignTimestamp,
  campaignRefresh,
} from "@opencok/rules/local-campaign";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { temporaryEffect } from "@opencok/rules/player-effects";
import { grantNativeProgressionReward, pinProgressionReward } from "./progression-rewards";
import type { CityProgressionContext } from "./city-progression";

export class CampaignPlanner {
  private operations = 0;
  private windowEnd: bigint | undefined;
  private readonly ephemeral = new Map<string, bigint>();
  constructor(
    readonly context: CityProgressionContext,
    readonly attributes: Readonly<Record<string, string | number | bigint>> = {},
  ) {}
  private variable(reference: string): CampaignVariable {
    const match = reference.match(/^([PSCIG])?\$(?:long_)?([A-Za-z0-9_-]+)$/);
    if (!match) campaignFailure();
    const key = `long_${match[2]}`;
    const variable = match[1]
      ? this.context.rules.advanced.campaignVariables?.get(`${match[1]}$${key}`)
      : [...(this.context.rules.advanced.campaignVariables?.values() ?? [])].find(
          (v) => v.id === key,
        );
    if (!variable || !variable.id.startsWith("long_3th_")) campaignFailure();
    return variable;
  }
  private row(variable: CampaignVariable) {
    const type = variable.scope === "P" ? 1 : variable.scope === "S" ? 2 : 0;
    if (!type) return undefined;
    const uid = type === 1 ? this.context.owner : String(this.context.rules.kingdomId);
    const row = [
      ...(this.context.write.campaignVariables ?? []),
      ...(this.context.state.campaignVariables ?? []),
    ].find((row) => num(row, "type") === type && row.uid === uid && row.key === variable.id);
    if (
      row &&
      campaignRefresh(
        long(row, "refreshtime"),
        this.context.now,
        variable.refreshType ?? 0,
        variable.refreshInterval ?? 0,
      )
    ) {
      if (type === 1) this.set(variable, campaignNumber(variable.initialValue ?? 0));
      return undefined;
    }
    return row;
  }
  private set(variable: CampaignVariable, value: bigint) {
    if (variable.scope === "C") {
      this.ephemeral.set(variable.id, value);
      return;
    }
    if (variable.scope !== "P") campaignFailure();
    const before = [
      ...(this.context.write.campaignVariables ?? []),
      ...(this.context.state.campaignVariables ?? []),
    ].find(
      (row) => num(row, "type") === 1 && row.uid === this.context.owner && row.key === variable.id,
    );
    const refresh =
      before &&
      !campaignRefresh(
        long(before, "refreshtime"),
        this.context.now,
        variable.refreshType ?? 0,
        variable.refreshInterval ?? 0,
      )
        ? long(before, "refreshtime")
        : this.context.now;
    this.context.write.campaignVariables = [
      ...(this.context.write.campaignVariables ?? []).filter((row) => row.key !== variable.id),
      {
        type: 1,
        uid: this.context.owner,
        key: variable.id,
        value: String(value),
        refreshtime: refresh,
      },
    ];
  }
  value(reference: string): bigint {
    if (!reference.includes("$")) return campaignNumber(reference);
    const attribute = reference.replace(/^\$/, "");
    if (Object.hasOwn(this.attributes, attribute))
      return campaignNumber(this.attributes[attribute]);
    const variable = this.variable(reference);
    if (variable.scope === "C")
      return this.ephemeral.get(variable.id) ?? campaignNumber(variable.initialValue ?? 0);
    const row = this.row(variable);
    return campaignNumber(row ? text(row, "value") : (variable.initialValue ?? 0));
  }
  declaration(reference: string) {
    return this.variable(reference);
  }
  refreshedAt(reference: string) {
    const variable = this.variable(reference);
    return long(this.row(variable) ?? { refreshtime: this.context.now }, "refreshtime");
  }
  write(reference: string, value: bigint) {
    this.set(this.variable(reference), value);
  }
  private check(clause: CampaignClause, depth = 0): boolean {
    if (depth > 32 || ++this.operations > 8192) campaignFailure();
    const parts = (clause.parameters ?? "").split(";");
    const nested = clause.conditions ?? [];
    switch (clause.code) {
      case 7:
        if (parts.length !== 3) campaignFailure();
        return campaignCompare(this.value(parts[0]!), parts[1]!, this.value(parts[2]!));
      case 9: {
        const start = campaignTimestamp(parts[0]),
          end = campaignTimestamp(parts[1]);
        const active =
          start !== undefined &&
          end !== undefined &&
          this.context.now > start &&
          this.context.now < end;
        if (active) this.windowEnd = end;
        return active;
      }
      case 13:
        return campaignCompare(
          BigInt(
            this.context.state.buildings.reduce(
              (level, row) =>
                num(row, "itemId") === 400000 ? Math.max(level, num(row, "level")) : level,
              0,
            ),
          ),
          parts[0]!,
          this.value(parts[1]!),
        );
      case 32:
        return (
          (clause.parameters ?? "").toLowerCase() === "all" ||
          (clause.parameters ?? "").split("-").includes(String(this.context.rules.kingdomId))
        );
      case 51:
        return nested.length > 0 && nested.every((c) => this.check(c, depth + 1));
      case 52:
        return nested.some((c) => this.check(c, depth + 1));
      case 53:
        if (nested.length !== 1) campaignFailure();
        return !this.check(nested[0]!, depth + 1);
      default:
        return campaignFailure();
    }
  }
  private push(type: number, params: Fields) {
    if (!this.context.economy.push) campaignFailure();
    this.context.economy.push(
      "push.server.action",
      encode({ type: sfs.int(type), params: sfs.object(params) }),
    );
  }
  private action(action: CampaignAction, depth = 0): void {
    if (depth > 32 || ++this.operations > 8192) campaignFailure();
    const parts = (action.parameters ?? "").split(";");
    switch (action.code) {
      case 13:
      case 41: {
        if (!action.branch || !action.branch.conditions.length) campaignFailure();
        const selected = action.branch.conditions.every((c) => this.check(c, depth + 1))
          ? action.branch.onMatch
          : action.branch.otherwise;
        for (const child of selected) this.action(child, depth + 1);
        return;
      }
      case 21:
        if (!action.actions) campaignFailure();
        for (const child of action.actions) this.action(child, depth + 1);
        return;
      case 9:
        if (parts.length !== 3) campaignFailure();
        this.write(
          parts[0]!,
          campaignMath(this.value(parts[0]!), parts[1]!, this.value(parts[2]!)),
        );
        return;
      case 24:
        if (parts.length !== 2) campaignFailure();
        this.write(parts[0]!, this.value(parts[1]!));
        return;
      case 27:
      case 30:
      case 42:
        return;
      case 48: {
        for (const reward of (action.parameters ?? "").split(",").filter(Boolean))
          this.push(12, {
            reward_list: sfs.array(
              grantNativeProgressionReward(
                this.context,
                pinProgressionReward(this.context, reward),
              ),
            ),
          });
        return;
      }
      case 4: {
        const template = this.context.rules.mail.get(action.parameters ?? "");
        const contents = javaMailBytes(template?.message);
        if (!template || !contents) campaignFailure();
        const reward = template.reward
          ? template.reward.includes(",")
            ? template.reward
            : pinProgressionReward(this.context, template.reward)
          : null;
        const quests = (this.context.write.quests ??= {});
        quests.mail = [
          ...(quests.mail ?? []),
          {
            uid: randomUUID().replaceAll("-", "") + "00",
            owner: this.context.owner,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: reward,
            rewardStatus: reward ? 0 : 1,
            reply: 0,
            createTime: this.context.now,
          },
        ];
        return;
      }
      case 33: {
        if (this.attributes.uid !== this.context.owner) campaignFailure();
        const id = parts[0];
        if (!id) campaignFailure();
        const states = this.context.write.states ?? this.context.state.effects.states;
        const plan = temporaryEffect(
          states,
          this.context.rules,
          this.context.owner,
          id,
          this.context.now,
          1,
          randomInt,
        );
        if (this.windowEnd !== undefined || parts[1])
          for (const row of plan.states)
            row.endTime = this.windowEnd ?? this.context.now + campaignNumber(parts[1]) * 1000n;
        this.context.write.states = [
          ...states.filter(
            (row) =>
              !plan.deleted.includes(num(row, "stateId")) &&
              !plan.states.some((next) => next.stateId === row.stateId),
          ),
          ...plan.states,
        ];
        this.context.write.deletedStates = [
          ...(this.context.write.deletedStates ?? []),
          ...plan.deleted,
        ];
        return;
      }
      case 29: {
        const keys = parts.slice(0, -2);
        if (!keys.length || keys.length > 128) campaignFailure();
        this.push(16, {
          version: sfs.string("0.2"),
          detail: sfs.bool(false),
          vars: sfs.object(
            Object.fromEntries(keys.map((key) => [key, sfs.string(String(this.value(key)))])),
          ),
          type: sfs.int(Number(parts.at(-2))),
          command: sfs.string(parts.at(-1) ?? ""),
        });
        return;
      }
      default:
        return campaignFailure();
    }
  }
  event(code: number, selector = "") {
    for (const rule of this.context.rules.advanced.campaignRules ?? []) {
      if (
        (rule.state ?? 0) < 2 ||
        rule.openType !== 2 ||
        !rule.events.some(
          (event) => event.code === code && (!event.parameters || event.parameters === selector),
        )
      )
        continue;
      if (!rule.conditions.every((condition) => this.check(condition))) continue;
      for (const action of rule.actions) this.action(action);
    }
  }
}
function nextRefresh(planner: CampaignPlanner, key: string) {
  const variable = planner.declaration(key),
    at = planner.refreshedAt(key),
    interval = BigInt(variable.refreshInterval ?? 0),
    type = variable.refreshType ?? 0;
  if (type === 0) return -1n;
  if (type === 1) return at + interval * 60000n;
  if (type === 2) return at + interval * 3600000n;
  if (type === 3) return (at / 86400000n + interval) * 86400000n;
  if (type === 4) return (((at / 86400000n + 3n) / 7n) * 7n - 3n + interval * 7n) * 86400000n;
  const date = new Date(Number(at));
  if (type === 5) return BigInt(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  if (type === 6) return BigInt(Date.UTC(date.getUTCFullYear() + 1, 0, 1));
  return campaignFailure();
}
export function campaignVariableFields(planner: CampaignPlanner, keys: readonly string[]): Fields {
  if (!keys.length || keys.length > 128) campaignFailure();
  return {
    refreshTimes: sfs.string(keys.map((key) => `${key}=${nextRefresh(planner, key)}`).join(";")),
    refreshType: sfs.string(
      keys.map((key) => `${key}=${planner.declaration(key).refreshType ?? 0}`).join(";"),
    ),
    refreshInterval: sfs.string(
      keys.map((key) => `${key}=${planner.declaration(key).refreshInterval ?? 0}`).join(";"),
    ),
    keys: sfs.string(keys.join(";")),
    version: sfs.string("0.1"),
    values: sfs.string(keys.map((key) => `${key}=${planner.value(key)}`).join(";")),
  };
}
export function refreshCampaignGrants(context: CityProgressionContext) {
  let count = 0;
  for (;;) {
    const grants = context.economy.takeItemGrants?.() ?? [];
    if (!grants.length) return;
    for (const grant of grants) {
      if (++count > 128) campaignFailure();
      new CampaignPlanner(context, { key_itemId: grant.itemId, key_itemNum: grant.count }).event(
        40,
        grant.itemId,
      );
    }
  }
}
export function recordCampaignUse(context: CityProgressionContext, itemId: string, count: number) {
  new CampaignPlanner(context, { key_itemId: itemId, key_itemNum: count }).event(54, itemId);
}
