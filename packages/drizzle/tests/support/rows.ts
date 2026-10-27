import type { ColumnContract, TableContract } from "./schema";

export type Row = Record<string, unknown>;

export function sampleValue(column: ColumnContract, variant: number): unknown {
  if (column.value === "boolean") return variant === 1;
  if (column.value === "json") return [{ id: `synthetic-${variant}`, amount: variant }];
  if (column.type === "uuid") return `00000000-0000-4000-8000-${String(variant).padStart(12, "0")}`;
  if (column.calendar) {
    if (column.calendar === "date") return `2020-01-0${variant}`;
    const precision = Number(column.calendar.match(/\((\d+)\)/)?.[1] ?? 0);
    return `2020-01-0${variant} 12:34:56${precision ? `.${"1".repeat(precision)}` : ""}`;
  }
  if (column.value === "bigint") return 9007199254740992n + BigInt(variant);
  if (column.value === "number")
    return /^(?:numeric|real|double)/.test(column.type) && !/,0\)/.test(column.type)
      ? variant + 0.25
      : variant;
  if (column.value === "buffer") {
    const buffer = Buffer.alloc(column.bytes ?? 6, variant);
    if (buffer.length > 1) buffer[1] = 255;
    if (buffer.length > 2) buffer[2] = 0;
    return buffer;
  }
  if (column.type.startsWith("numeric")) {
    const scale = Number(column.type.match(/,(\d+)\)/)?.[1] ?? 0);
    return `${variant}${scale ? `.${"25".padEnd(scale, "0").slice(0, scale)}` : ""}`;
  }
  const length = Number(column.type.match(/\((\d+)\)/)?.[1] ?? 128);
  return `${variant}-synthetic-'\\-á`.slice(0, length);
}

export function sampleRow(spec: TableContract, variant = 1): Row {
  const row = Object.fromEntries(
    spec.columns.map((column) => [column.property ?? column.name, sampleValue(column, variant)]),
  );
  if (spec.checks.some(([name]) => name === "question_match_settlement")) row.ended = 1;
  if (spec.checks.some(([name]) => name === "chat_relation_kind")) row.kind = "contact";
  if (spec.checks.some(([name]) => name === "user_mixed_info_box_gold_mode"))
    row.ordinaryBoxGold = (variant - 1) % 2;
  for (const key of spec.foreignKeys) for (const name of key.columns) row[name] = 9007199254740993n;
  if (spec.indexes.some((key) => key.name === "mail_chat_read_intent_PRIMARY")) {
    row.chatTypes = variant === 1 ? "1,20" : "2";
    row.action = "read";
  }
  if (spec.indexes.some((key) => key.name === "avatar_completion_PRIMARY")) {
    row.ownerUid = String(variant);
    row.hash = String(variant).repeat(64);
    row.picVer = variant;
    row.effects = "{}";
  }
  if (spec.indexes.some((key) => key.name === "avatar_version_update_PRIMARY")) {
    row.operationId = String(variant).repeat(32);
    row.ownerUid = String(variant);
    row.picVer = variant;
    row.effects = "{}";
  }
  if (spec.indexes.some((key) => key.name === "chat_avatar_profile_PRIMARY")) {
    row.owner_uid = String(variant);
    row.pic_ver = variant;
    row.committed_at = BigInt(variant);
  }
  if (spec.indexes.some((key) => key.name === "resource_settlement_uid_fromTime_toTime_pk")) {
    row.toTime = (row.fromTime as bigint) + 1n;
    row.troopChanges = [];
  }
  if (spec.indexes.some((key) => key.name === "nickname_change_PRIMARY")) {
    row.state = "prepared";
    row.notificationStage = 0;
    row.pendingEffects = 0;
    row.payment = "{}";
  }
  if (spec.indexes.some((key) => key.name === "character_provisioning_PRIMARY"))
    row.state = variant % 2;
  if (spec.indexes.some((key) => key.name === "expedition_period_PRIMARY")) {
    row.matchServerId = variant + 1;
    row.endTime = (row.startTime as bigint) + 1n;
  }
  if (spec.indexes.some((key) => key.name === "special_event_purchase_PRIMARY")) {
    row.periodStart = (row.reservedAt as bigint) - 1n;
    row.periodEnd = (row.reservedAt as bigint) + 100000n;
    row.state = (variant - 1) % 3;
    row.purchaseTime = row.state === 1 ? row.reservedAt : 0n;
    row.purchaseDay = (row.reservedAt as bigint) / 86400000n;
    row.deliveredAt = 0n;
    row.nextAttemptAt = 0n;
  }
  if (spec.indexes.some((key) => key.name === "world_march_checkpoint_PRIMARY"))
    row.status = (variant - 1) % 2;
  if (spec.indexes.some((key) => key.name === "timed_activity_PRIMARY")) row.status = 0;
  if (spec.indexes.some((key) => key.name === "building_production_PRIMARY"))
    row.remainder = BigInt(variant);
  if (spec.indexes.some((key) => key.name === "economy_posting_PRIMARY"))
    row.after = (row.before as bigint) + (row.delta as bigint);
  return row;
}

export function literalDefault(column: ColumnContract): unknown {
  if (column.default === null) return null;
  const value = column.default.startsWith("'")
    ? column.default.slice(1, -1).replaceAll("''", "'")
    : column.default;
  if (column.value === "bigint") return BigInt(value);
  if (column.value === "number") return Number(value);
  if (column.value === "buffer") return Buffer.from(value);
  if (column.type.startsWith("numeric")) {
    const scale = Number(column.type.match(/,(\d+)\)/)?.[1] ?? 0);
    const [integer, fraction = ""] = value.split(".");
    return `${integer}${scale ? `.${fraction.padEnd(scale, "0")}` : ""}`;
  }
  return value;
}
