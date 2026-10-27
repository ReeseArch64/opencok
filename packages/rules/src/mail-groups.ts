import type {
  MailGroupEntry,
  MailGroupKey,
  MailGroupQuery,
  MailListEntry,
} from "@opencok/contracts/mail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { mailBlank } from "./mail.ts";

export interface MailGroupRule {
  kind: "sender" | "type" | "uid";
  field: "chats" | "collect" | "monster" | "detail";
  types: readonly number[];
}

const singleTypes = [2, 11, 12, 17, 25, 26, 27, 28, 29, 33, 34] as const;

function int(value: number): boolean {
  return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
}

function identifier(value: string): boolean {
  return (
    typeof value === "string" && value.length <= 40 && !value.includes("\0") && value.isWellFormed()
  );
}

function invalid(): never {
  throw new GameError(errors.invalid, "mail");
}

export function mailGroupQuery(
  type: number,
  begin: number,
  limit: number,
  now: number,
): MailGroupQuery {
  if (
    (type !== 10 && type !== 1000) ||
    !int(begin) ||
    begin < 0 ||
    !int(limit) ||
    limit < 0 ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    return invalid();

  return { moderation: type === 10, begin, limit, now };
}

export function mailGroupRule(type: number): MailGroupRule | undefined {
  if (singleTypes.some((candidate) => candidate === type))
    return { kind: "uid", field: "detail", types: singleTypes };

  switch (type) {
    case 100:
      return { kind: "sender", field: "chats", types: [20, 21, 22] };
    case 500:
      return { kind: "sender", field: "chats", types: [23, 24] };
    case 200:
      return { kind: "type", field: "collect", types: [5] };
    case 300:
      return { kind: "type", field: "monster", types: [18] };
    case 400:
      return { kind: "type", field: "collect", types: [10] };
    default:
      return undefined;
  }
}

export function mailGroupContains(
  group: MailGroupKey,
  entry: Pick<MailListEntry, "uid" | "type" | "fromUser">,
): boolean {
  const rule = mailGroupRule(group.groupType);

  if (!rule?.types.includes(entry.type)) return false;

  if (rule.kind === "sender") return group.groupIndex === entry.fromUser;

  if (rule.kind === "uid") return group.groupIndex === entry.uid;

  return true;
}

export function mailGroupSenders(groups: readonly MailGroupKey[]): string[] {
  return [
    ...new Set(
      groups
        .filter(
          (group) =>
            mailGroupRule(group.groupType)?.kind === "sender" && !mailBlank(group.groupIndex),
        )
        .map((group) => group.groupIndex),
    ),
  ];
}

export function mailGroupWindow(
  owner: string,
  query: MailGroupQuery,
  groups: readonly MailGroupEntry[],
): readonly MailGroupEntry[] {
  if (typeof query.moderation !== "boolean") return invalid();

  mailGroupQuery(query.moderation ? 10 : 1000, query.begin, query.limit, query.now);

  if (
    !identifier(owner) ||
    mailBlank(owner) ||
    groups.length > Math.min(1000, query.limit) ||
    new Set(groups.map((group) => JSON.stringify([group.groupType, group.groupIndex]))).size !==
      groups.length ||
    groups.some(
      (group, index) =>
        group.uid !== owner ||
        !int(group.groupType) ||
        (query.moderation ? group.groupType !== 500 : group.groupType >= 500) ||
        !identifier(group.groupIndex) ||
        typeof group.updateTime !== "bigint" ||
        group.updateTime < -9223372036854775808n ||
        group.updateTime > 9223372036854775807n ||
        (index > 0 && group.updateTime > groups[index - 1]!.updateTime),
    )
  )
    return invalid();

  return groups.slice(0, 7);
}
