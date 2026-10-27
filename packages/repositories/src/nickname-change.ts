import { captureCostFact } from "./continued-cost-facts";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { drizzle } from "drizzle-orm/node-postgres";
import { cross_throne_king_info as throne } from "@opencok/drizzle/schema/opencok_kingdom/cross_throne_king_info";
import { createHash } from "node:crypto";
import { and, asc, eq, sql } from "drizzle-orm";
import type { createDatabases } from "@opencok/drizzle";
import { nickname_change } from "@opencok/drizzle/schema/opencok_kingdom/nickname_change";
import { nickname_change_receipt } from "@opencok/drizzle/schema/opencok_global/nickname_change_receipt";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import type {
  NicknameChangeConfiguration,
  NicknameChangeRecord,
  NicknameChangeStore,
  NicknameNotificationDelivery,
  NicknameNotificationPublisher,
  NicknameNotification,
} from "@opencok/contracts/nickname-change";
import type { Row } from "@opencok/contracts/rows";
import {
  nicknameGoldDebit,
  nicknameGoldRefund,
  nicknameItemDebit,
  type NicknameGoldBalances,
} from "@opencok/rules/nickname-change";
import { javaDecimal } from "@opencok/rules/java-integer";
import { nicknameTrim } from "@opencok/rules/nickname";
import { mysqlUtf8UnicodeKey } from "@opencok/rules/mysql-unicode";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { DependencyError } from "@opencok/errors/dependency";
import { withAvailableNickname, withNicknameLock } from "./nickname-lock.ts";
import { writeNicknameGlobal, nicknameAccountUid } from "./nickname-global.ts";
import { readSharedUserProfile } from "./shared-user.ts";
import { user_alliance_task } from "@opencok/drizzle/schema/opencok_kingdom/user_alliance_task";
import { insertSystemMail } from "./system-mail.ts";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";

const balanceKeys = [
  "gold",
  "paidGold",
  "paidSpecialGold",
  "dmmGold",
  "dmmPaidGold",
  "dmmPaidSpecialGold",
] as const;

type BalanceKey = (typeof balanceKeys)[number];

type ItemPayment = {
  version: 1;
  kind: "item";
  uuid: string;
  value: number | null;
  vanishTime: string | null;
  before: number;
  after: number;
  refund?: { before: number | null; after: number };
};

type GoldPayment = {
  pendingEvent?: { id: string; type: string; payload: string };
  version: 1;
  kind: "gold";
  platform: string | null;
  price: string;
  before: Record<BalanceKey, string>;
  after: Record<BalanceKey, string>;
  refund?: {
    price: string;
    ratio: string;
    delta: string;
    before: Record<BalanceKey, string>;
    after: Record<BalanceKey, string>;
  };
};

type Payment = ItemPayment | GoldPayment;

type Databases = ReturnType<typeof createDatabases>;

type Realm = ReturnType<Databases["getKingdom"]>["db"];

type Transaction = Parameters<Parameters<Realm["transaction"]>[0]>[0];

function invalid(): never {
  throw new DependencyError("nickname change state");
}

function integer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  );
}

function identifier(value: unknown, limit: number): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= limit &&
    !value.includes("\0") &&
    value.isWellFormed()
  );
}

function key(owner: string, operationId: string): void {
  if (
    !identifier(owner, 40) ||
    !nicknameTrim(owner) ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(operationId)
  )
    return invalid();

  mysqlUtf8UnicodeKey(owner);
}

function time(now: number): bigint {
  if (!Number.isSafeInteger(now) || now < 0) return invalid();

  return BigInt(now);
}

function balances(profile: Row): NicknameGoldBalances {
  return Object.fromEntries(
    balanceKeys.map((name) => {
      const value = profile[name] ?? 0n;

      if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();

      return [name, value];
    }),
  ) as unknown as NicknameGoldBalances;
}

const serializeBalances = (value: NicknameGoldBalances) =>
  Object.fromEntries(balanceKeys.map((name) => [name, String(value[name])])) as Record<
    BalanceKey,
    string
  >;

function restoredBalances(value: unknown): NicknameGoldBalances {
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();

  const values = value as Record<string, unknown>;

  return Object.fromEntries(
    balanceKeys.map((name) => [name, javaDecimal(values[name], 64)]),
  ) as unknown as NicknameGoldBalances;
}

export function nicknameChangePayment(record: NicknameChangeRecord): Payment {
  if (typeof record.payment !== "string" || Buffer.byteLength(record.payment) > 8192)
    return invalid();

  const data: unknown = JSON.parse(record.payment);

  if (!data || typeof data !== "object" || Array.isArray(data)) return invalid();

  const value = data as Record<string, unknown>;

  if (value.version !== 1) return invalid();

  if (value.kind === "item") {
    if (
      !identifier(value.uuid, 40) ||
      !integer(value.before) ||
      value.before < 1 ||
      !integer(value.after) ||
      value.after !== value.before - 1 ||
      (value.value !== null && !integer(value.value)) ||
      (value.vanishTime !== null && typeof value.vanishTime !== "string")
    )
      return invalid();

    if (value.vanishTime !== null) javaDecimal(value.vanishTime, 64);

    if (record.responseGold !== null) return invalid();

    if (value.refund !== undefined) {
      if (record.state !== "refunded" || !value.refund || typeof value.refund !== "object")
        return invalid();

      const refund = value.refund as Record<string, unknown>;

      if (
        (refund.before !== null && !integer(refund.before)) ||
        !integer(refund.after) ||
        refund.after !== (refund.before === null ? 1 : (Number(refund.before) + 1) | 0)
      )
        return invalid();
    }

    return value as ItemPayment;
  }

  if (
    value.kind !== "gold" ||
    (value.platform !== null &&
      (typeof value.platform !== "string" || value.platform.length > 255)) ||
    typeof value.price !== "string"
  )
    return invalid();

  if (value.pendingEvent !== undefined) {
    const event = value.pendingEvent as GoldPayment["pendingEvent"];

    if (
      !event ||
      typeof event !== "object" ||
      !identifier(event.id, 40) ||
      !identifier(event.type, 128) ||
      typeof event.payload !== "string" ||
      event.payload.length > 6000 ||
      Buffer.from(event.payload, "base64").toString("base64") !== event.payload
    )
      return invalid();
  }

  const before = restoredBalances(value.before),
    after = restoredBalances(value.after);
  const expected = nicknameGoldDebit(before, value.platform as string | null, value.price);

  if (
    record.responseGold !== expected.gold ||
    balanceKeys.some((name) => after[name] !== expected.balances[name])
  )
    return invalid();

  if (value.refund !== undefined) {
    if (record.state !== "refunded" || !value.refund || typeof value.refund !== "object")
      return invalid();

    const refund = value.refund as Record<string, unknown>;

    if (typeof refund.ratio !== "string" || typeof refund.price !== "string") return invalid();

    const ratio = Number(refund.ratio);

    if (String(ratio) !== refund.ratio) return invalid();

    const refunded = nicknameGoldRefund(
      restoredBalances(refund.before),
      value.platform as string | null,
      refund.price,
      () => ratio,
    );
    const final = restoredBalances(refund.after);

    if (
      String(refunded.delta) !== refund.delta ||
      balanceKeys.some((name) => final[name] !== refunded.balances[name])
    )
      return invalid();
  } else if (record.state === "refunded") return invalid();

  return value as GoldPayment;
}

function validateRecord(record: NicknameChangeRecord, owner: string, operationId: string): void {
  if (
    record.ownerUid !== owner ||
    record.operationId !== operationId ||
    !["prepared", "committed", "refunded"].includes(record.state) ||
    !identifier(record.newName, 200) ||
    typeof record.previousName !== "string" ||
    record.previousName.length > 255 ||
    typeof record.createdAt !== "bigint" ||
    record.createdAt < 0n ||
    typeof record.updatedAt !== "bigint" ||
    record.updatedAt < record.createdAt ||
    !integer(record.pendingEffects) ||
    record.pendingEffects < 0 ||
    record.pendingEffects > 31 ||
    !integer(record.notificationStage) ||
    record.notificationStage < 0 ||
    record.notificationStage > 2 ||
    (record.state !== "refunded" && record.notificationStage > 1) ||
    (record.state === "prepared" && record.pendingEffects !== 0)
  )
    return invalid();

  nicknameChangePayment(record);
}

async function owner(tx: Transaction, uid: string) {
  const [profile] = await tx
    .select({
      uid: userprofile.uid,
      serverId: userprofile.serverId,
      name: userprofile.name,
      pic: userprofile.pic,
      picVer: userprofile.picVer,
      appVersion: userprofile.appVersion,
      pf: userprofile.pf,
      banFlag: userprofile.banFlag,
      banTime: userprofile.banTime,
      chNameCount: userprofile.chNameCount,
      gold: userprofile.gold,
      paidGold: userprofile.paidGold,
      paidSpecialGold: userprofile.paidSpecialGold,
      dmmGold: userprofile.dmmGold,
      dmmPaidGold: userprofile.dmmPaidGold,
      dmmPaidSpecialGold: userprofile.dmmPaidSpecialGold,
    })
    .from(userprofile)
    .where(eq(userprofile.uid, uid))
    .limit(1)
    .for("update");

  return profile;
}

async function operation(tx: Transaction, uid: string, operationId: string) {
  const [record] = await tx
    .select()
    .from(nickname_change)
    .where(eq(nickname_change.operationId, operationId))
    .limit(1)
    .for("update");

  if (record) validateRecord(record, uid, operationId);

  return record;
}

export function createNicknameChangeStore(
  databases: Pick<Databases, "getKingdom" | "global">,
  kingdomId: number,
  configuration: NicknameChangeConfiguration,
  notifications?: NicknameNotificationDelivery,
): NicknameChangeStore {
  if (
    !integer(kingdomId) ||
    kingdomId < 1 ||
    typeof configuration.itemType !== "function" ||
    typeof configuration.price !== "function" ||
    typeof configuration.refundRatio !== "function"
  )
    return invalid();

  if (
    notifications &&
    (typeof notifications.publish !== "function" ||
      typeof notifications.report !== "function" ||
      !integer(notifications.timeoutMs) ||
      notifications.timeoutMs < 100 ||
      notifications.timeoutMs > 30000)
  )
    return invalid();

  const db = databases.getKingdom(kingdomId).db;
  const find = async (uid: string, operationId: string) => {
    key(uid, operationId);

    return db.transaction(
      async (tx) => {
        const profile = await owner(tx, uid);

        if (!profile) return undefined;

        if (profile.serverId !== kingdomId) return invalid();

        return operation(tx, uid, operationId);
      },
      { isolationLevel: "read committed", accessMode: "read write" },
    );
  };
  const deliverNotifications = async (
    uid: string,
    operationId: string,
    publish: NicknameNotificationPublisher,
    timeoutMs: number,
  ): Promise<boolean> => {
    key(uid, operationId);

    if (
      typeof publish !== "function" ||
      !integer(timeoutMs) ||
      timeoutMs < 100 ||
      timeoutMs > 30000
    )
      return invalid();

    return db.transaction(
      async (tx) => {
        const profile = await owner(tx, uid);

        if (!profile || profile.uid !== uid || profile.serverId !== kingdomId) return invalid();

        const record = await operation(tx, uid, operationId);

        if (!record) return false;

        const stage = record.state === "refunded" ? 2 : 1;

        if (record.notificationStage >= stage) return false;

        const payment = nicknameChangePayment(record);
        let snapshot: NicknameNotification;

        if (payment.kind === "gold")
          snapshot = {
            kind: "gold",
            stage: stage === 2 ? "refund" : "debit",
            platform: payment.platform,
            balances: balances(profile),
          };
        else {
          const [item] = await tx
            .select()
            .from(user_item)
            .where(eq(user_item.uuid, payment.uuid))
            .limit(1)
            .for("update");

          if (item && (item.ownerId !== uid || item.itemId !== "200021")) return invalid();

          snapshot = {
            kind: "item",
            stage: stage === 2 ? "refund" : "debit",
            item: {
              uuid: payment.uuid,
              count: item?.count ?? 0,
              vanishTime: item?.vanishTime ?? 0n,
            },
          };
        }

        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;
        let delivered: boolean;

        try {
          delivered = await Promise.race([
            Promise.resolve().then(() => publish(uid, Object.freeze(snapshot), controller.signal)),
            new Promise<never>((_, reject) => {
              timer = setTimeout(() => {
                controller.abort();
                reject(new Error("Nickname notification deadline"));
              }, timeoutMs);
            }),
          ]);
          controller.signal.throwIfAborted();
        } finally {
          clearTimeout(timer);
          controller.abort();
        }

        if (typeof delivered !== "boolean") return invalid();

        if (!delivered) return false;

        const changed = await tx
          .update(nickname_change)
          .set({ notificationStage: stage, pendingEffects: record.pendingEffects & ~16 })
          .where(
            and(
              eq(nickname_change.operationId, operationId),
              eq(nickname_change.notificationStage, record.notificationStage),
              eq(nickname_change.pendingEffects, record.pendingEffects),
            ),
          )
          .returning({ id: nickname_change.operationId });

        if (changed.length !== 1 || changed[0]!.id !== operationId) return invalid();

        return true;
      },
      { isolationLevel: "read committed", accessMode: "read write" },
    );
  };
  const notify = async (uid: string, operationId: string) => {
    if (!notifications) return;

    try {
      await deliverNotifications(uid, operationId, notifications.publish, notifications.timeoutMs);
    } catch {
      try {
        notifications.report();
      } catch {}
    }
  };
  const deliveredResult = async (record: NicknameChangeRecord) => {
    if (!notifications) return record;

    await notify(record.ownerUid, record.operationId);
    const current = await find(record.ownerUid, record.operationId);

    if (!current) return invalid();

    return current;
  };
  const prepare = async (uid: string, operationId: string, name: string, now: number) => {
    const requestedAt = time(now);

    return db.transaction(
      async (tx) => {
        const profile = await owner(tx, uid);

        if (!profile) throw new GameError(errors.missing);

        if (
          profile.uid !== uid ||
          profile.serverId !== kingdomId ||
          (profile.banFlag ?? 0) !== 0 ||
          (profile.banTime ?? 0n) > requestedAt
        )
          throw new GameError(errors.invalid);

        const prior = await operation(tx, uid, operationId);

        if (prior) {
          if (prior.newName !== name) return invalid();

          throw new DependencyError("nickname operation already prepared");
        }

        const pending = await tx
          .select({ id: nickname_change.operationId })
          .from(nickname_change)
          .where(and(eq(nickname_change.ownerUid, uid), eq(nickname_change.state, "prepared")))
          .limit(1);

        if (pending.length) throw new DependencyError("nickname owner operation pending");

        const backlog = await tx
          .select({ count: sql<string>`count(*)::text` })
          .from(nickname_change)
          .where(
            and(eq(nickname_change.ownerUid, uid), sql`${nickname_change.pendingEffects} > 0`),
          );

        if (
          backlog.length !== 1 ||
          !/^(0|[1-9]\d*)$/.test(backlog[0]!.count) ||
          BigInt(backlog[0]!.count) >= 1000n
        )
          throw new DependencyError("nickname effect capacity");

        const [item] = await tx
          .select()
          .from(user_item)
          .where(and(eq(user_item.ownerId, uid), eq(user_item.itemId, "200021")))
          .orderBy(asc(user_item.uuid))
          .limit(1)
          .for("update");
        let payment: Payment,
          responseGold: bigint | null = null;
        let goldChange: Partial<NicknameGoldBalances> = {};
        let count: number;

        try {
          count = nicknameItemDebit(item?.count, configuration.itemType());
        } catch (error) {
          if (!(error instanceof GameError)) throw error;

          const before = balances(profile);
          const price = configuration.price();
          const change = nicknameGoldDebit(before, profile.pf, price);
          const keys = change.pool === "dmm" ? balanceKeys.slice(3) : balanceKeys.slice(0, 3);
          goldChange = Object.fromEntries(keys.map((name) => [name, change.balances[name]]));
          payment = {
            version: 1,
            kind: "gold",
            platform: profile.pf,
            price: String(javaDecimal(price, 32)),
            before: serializeBalances(before),
            after: serializeBalances(change.balances),
          };
          responseGold = change.gold;
          count = -1;
        }

        if (count >= 0) {
          if (!item || item.ownerId !== uid || item.itemId !== "200021") return invalid();

          payment = {
            version: 1,
            kind: "item",
            uuid: item.uuid,
            value: item.value,
            vanishTime: item.vanishTime === null ? null : String(item.vanishTime),
            before: item.count,
            after: count,
          };
          const changed = await tx
            .update(user_item)
            .set({ count })
            .where(
              and(
                eq(user_item.uuid, item.uuid),
                eq(user_item.ownerId, uid),
                eq(user_item.count, item.count),
              ),
            )
            .returning({ id: user_item.uuid });

          if (changed.length !== 1 || changed[0]!.id !== item.uuid) return invalid();
        }

        const counter = Number(javaDecimal(profile.chNameCount ?? "0", 32));
        const updated = await tx
          .update(userprofile)
          .set({ ...goldChange, chNameCount: String((counter + 1) | 0) })
          .where(eq(userprofile.uid, uid))
          .returning({ uid: userprofile.uid });

        if (updated.length !== 1 || updated[0]!.uid !== uid) return invalid();

        if (payment!.kind === "gold" && configuration.confirmedSpending) {
          const paid = payment! as GoldPayment;
          const buildings = await tx
            .select()
            .from(user_building)
            .where(eq(user_building.uid, uid))
            .limit(257);

          if (buildings.length > 256) return invalid();

          const postings = balanceKeys
            .filter((key) => paid.before[key] !== paid.after[key])
            .map((key) => ({
              account: uid,
              asset: `profile.${key}`,
              before: BigInt(paid.before[key]),
              after: BigInt(paid.after[key]),
              reason: "user.modify.nickName",
            }));
          const event = configuration.confirmedSpending(
            profile,
            buildings,
            postings,
            Number(requestedAt),
          );

          if (event)
            paid.pendingEvent = {
              id: event.id,
              type: event.type,
              payload: Buffer.from(event.payload).toString("base64"),
            };
        }

        const record: NicknameChangeRecord = {
          operationId,
          ownerUid: uid,
          newName: name,
          previousName: profile.name,
          state: "prepared",
          payment: JSON.stringify(payment!),
          responseGold,
          failureCode: null,
          pendingEffects: 0,
          notificationStage: 0,
          createdAt: requestedAt,
          updatedAt: requestedAt,
        };
        validateRecord(record, uid, operationId);
        await tx.insert(nickname_change).values(record);

        return record;
      },
      { isolationLevel: "read committed", accessMode: "read write" },
    );
  };
  const finish = async (
    uid: string,
    operationId: string,
    now: number,
    committed: boolean,
    failureCode: string,
  ) =>
    db.transaction(
      async (tx) => {
        const profile = await owner(tx, uid);

        if (!profile || profile.uid !== uid || profile.serverId !== kingdomId) return invalid();

        const record = await operation(tx, uid, operationId);

        if (!record) return invalid();

        if (record.state !== "prepared") return record;

        const payment = nicknameChangePayment(record);
        let nextPayment: Payment = payment;

        if (committed) {
          await tx
            .update(userprofile)
            .set({ name: record.newName })
            .where(eq(userprofile.uid, uid));
          await tx
            .update(worldpoint)
            .set({ ownerName: record.newName })
            .where(eq(worldpoint.ownerId, uid));
        } else if (payment.kind === "item") {
          const [item] = await tx
            .select()
            .from(user_item)
            .where(eq(user_item.uuid, payment.uuid))
            .limit(1)
            .for("update");

          if (item && (item.ownerId !== uid || item.itemId !== "200021")) return invalid();

          nextPayment = {
            ...payment,
            refund: { before: item?.count ?? null, after: item ? (item.count + 1) | 0 : 1 },
          };

          if (item)
            await tx
              .update(user_item)
              .set({ count: (item.count + 1) | 0 })
              .where(and(eq(user_item.uuid, item.uuid), eq(user_item.ownerId, uid)));
          else
            await tx.insert(user_item).values({
              uuid: payment.uuid,
              ownerId: uid,
              itemId: "200021",
              count: 1,
              value: payment.value,
              vanishTime: payment.vanishTime === null ? null : BigInt(payment.vanishTime),
            });
        } else {
          const price = String(javaDecimal(configuration.price(), 32));
          let ratio = 1;

          if (payment.platform === "cn1") ratio = await configuration.refundRatio(profile);

          const before = balances(profile);
          const change = nicknameGoldRefund(before, payment.platform, price, () => ratio);
          const free = change.pool === "dmm" ? "dmmGold" : "gold";
          await tx
            .update(userprofile)
            .set({ [free]: change.balances[free] })
            .where(eq(userprofile.uid, uid));
          nextPayment = {
            ...payment,
            refund: {
              price: String(javaDecimal(price, 32)),
              delta: String(change.delta),
              ratio: String(ratio),
              before: serializeBalances(before),
              after: serializeBalances(change.balances),
            },
          };
        }

        const timestamp = time(now);
        const values = {
          state: committed ? "committed" : "refunded",
          payment: JSON.stringify(nextPayment),
          failureCode: committed ? null : failureCode,
          pendingEffects: committed ? (record.notificationStage === 1 ? 15 : 31) : 16,
          updatedAt: timestamp < record.updatedAt ? record.updatedAt : timestamp,
        };
        const [updated] = await tx
          .update(nickname_change)
          .set(values)
          .where(
            and(
              eq(nickname_change.operationId, operationId),
              eq(nickname_change.state, "prepared"),
            ),
          )
          .returning();

        if (!updated) return invalid();

        validateRecord(updated, uid, operationId);

        if (committed && payment.kind === "gold" && payment.pendingEvent) {
          const event = payment.pendingEvent;
          await tx.insert(mutation_outbox).values({
            kingdomId,
            ownerUid: uid,
            requestId: `nickname:${operationId}`,
            eventId: event.id,
            eventType: event.type,
            payload: Buffer.from(event.payload, "base64"),
            createdAt: record.createdAt,
            publishedAt: 0n,
          });

          if (event.type === "continuedcost.spend")
            await captureCostFact(
              tx,
              {
                kingdomId,
                ownerUid: uid,
                requestId: `nickname:${operationId}`,
                eventId: event.id,
                payload: Buffer.from(event.payload, "base64"),
              },
              record.createdAt,
              balanceKeys
                .filter((key) => payment.before[key] !== payment.after[key])
                .map((key) => ({
                  accountUid: uid,
                  asset: `profile.${key}`,
                  before: BigInt(payment.before[key]),
                  after: BigInt(payment.after[key]),
                })),
            );
        }

        return updated;
      },
      { isolationLevel: "read committed", accessMode: "read write" },
    );
  const recover = async (
    uid: string,
    operationId: string,
    now: number,
    failureCode = "E100179",
  ) => {
    key(uid, operationId);
    time(now);
    const record = await find(uid, operationId);

    if (!record) return invalid();

    if (record.state !== "prepared") return deliveredResult(record);

    let terminal: NicknameChangeRecord;

    try {
      terminal = await withNicknameLock(databases.global.db, record.newName, async (tx) => {
        const [receipt] = await tx
          .select()
          .from(nickname_change_receipt)
          .where(eq(nickname_change_receipt.operationId, operationId))
          .limit(1);

        if (
          receipt &&
          (receipt.ownerUid !== uid ||
            receipt.kingdomId !== kingdomId ||
            receipt.newName !== record.newName)
        )
          return invalid();

        return finish(uid, operationId, now, Boolean(receipt), failureCode);
      });
    } catch (error) {
      const completed = await find(uid, operationId);

      if (completed && completed.state !== "prepared") terminal = completed;
      else throw error;
    }

    return deliveredResult(terminal);
  };

  return {
    find,
    recover,
    deliverNotifications,
    async deliverAlliance(uid, operationId, now, plan) {
      key(uid, operationId);
      const createdAt = time(now);

      if (typeof plan !== "function") return invalid();

      return db.transaction(
        async (tx) => {
          const profile = await owner(tx, uid);

          if (!profile || profile.uid !== uid || profile.serverId !== kingdomId) return invalid();

          const record = await operation(tx, uid, operationId);

          if (!record || record.state !== "committed" || !(record.pendingEffects & 1)) return false;

          const tasks = await tx
            .select()
            .from(user_alliance_task)
            .where(eq(user_alliance_task.uid, uid))
            .limit(14)
            .for("update");
          const stem = createHash("sha256")
            .update(`nickname-alliance\n${uid}\n${operationId}`)
            .digest("hex")
            .slice(0, 32);
          const result = plan(Object.freeze(tasks.map((row) => Object.freeze({ ...row }))), stem);

          if (
            !Array.isArray(result.updates) ||
            result.updates.length > 3 ||
            typeof result.complete !== "boolean" ||
            (result.mail !== null && !result.complete)
          )
            return invalid();

          const seen = new Set<string>();

          for (const update of result.updates) {
            const before = tasks.find((task) => task.id === update.id);

            if (!before || seen.has(update.id) || !["46608", "46609", "00000"].includes(update.id))
              return invalid();

            seen.add(update.id);
            const timer = update.id === "46609";

            if (
              timer
                ? update.state !== (before.state ?? 0) ||
                  (before.num ?? 0n) !== 0n ||
                  update.num !== createdAt
                : update.state !== 1 || update.num !== (before.num ?? 0n)
            )
              return invalid();

            const changed = await tx
              .update(user_alliance_task)
              .set({ state: update.state, num: update.num })
              .where(and(eq(user_alliance_task.uid, uid), eq(user_alliance_task.id, update.id)))
              .returning({ id: user_alliance_task.id });

            if (changed.length !== 1 || changed[0]!.id !== update.id) return invalid();
          }

          if (result.complete !== seen.has("00000")) return invalid();

          if (result.mail !== null) await insertSystemMail(tx, result.mail, uid, stem, createdAt);

          const changed = await tx
            .update(nickname_change)
            .set({ pendingEffects: record.pendingEffects & ~1 })
            .where(
              and(
                eq(nickname_change.operationId, operationId),
                eq(nickname_change.pendingEffects, record.pendingEffects),
              ),
            )
            .returning({ id: nickname_change.operationId });

          if (changed.length !== 1 || changed[0]!.id !== operationId) return invalid();

          return true;
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
    async nextPending(after) {
      const rows = await db
        .select({ owner: nickname_change.ownerUid, operationId: nickname_change.operationId })
        .from(nickname_change)
        .where(
          and(
            sql`(${nickname_change.state} = 'prepared' or ${nickname_change.pendingEffects} > 0)`,
            after
              ? sql`(${nickname_change.ownerUid}, ${nickname_change.operationId}) > (${after.owner}, ${after.operationId}::uuid)`
              : undefined,
          ),
        )
        .orderBy(asc(nickname_change.ownerUid), asc(nickname_change.operationId))
        .limit(1);

      return rows[0];
    },
    async deliverThrone(uid, operationId, now) {
      key(uid, operationId);
      time(now);
      const connection = await databases.global.db.$client.connect();

      try {
        return await db.transaction(async (tx) => {
          const profile = await owner(tx, uid);

          if (!profile || profile.serverId !== kingdomId) return invalid();

          const record = await operation(tx, uid, operationId);

          if (!record || record.state !== "committed" || !(record.pendingEffects & 4)) return false;

          const updated = await drizzle(connection).transaction(async (global) => {
            const canonical = await nicknameAccountUid(
              global as Parameters<typeof nicknameAccountUid>[0],
              uid,
            );
            const account = await global.execute<{ name: string; server: string }>(
              sql`select "gameUserName" as name, server from opencok_global.account_new where "gameUid"=${canonical}`,
            );

            if (
              account.rows.length !== 1 ||
              account.rows[0]!.name !== profile.name ||
              account.rows[0]!.server !== String(kingdomId)
            )
              return invalid();

            const result = await global.execute<{
              version: number;
              king_type: number;
              config_type: number;
            }>(sql`
              update opencok_global.cross_throne_king_info k
              set name=${profile.name}, pic=${profile.pic}, pic_ver=${profile.picVer ?? 0}
              where k.uid=${uid} and k.king_type in (1,2)
              and not exists (select 1 from opencok_global.cross_throne_king_info later where later.config_type=k.config_type and later.king_type=k.king_type and later.version>k.version)
              returning version, king_type, config_type`);

            if (result.rows.length > 1000) return invalid();

            return result.rows;
          });

          for (const row of updated)
            await tx
              .update(throne)
              .set({ name: profile.name, pic: profile.pic, pic_ver: profile.picVer ?? 0 })
              .where(
                and(
                  eq(throne.uid, uid),
                  eq(throne.version, row.version),
                  eq(throne.king_type, row.king_type),
                  eq(throne.config_type, row.config_type),
                ),
              );

          await tx
            .update(nickname_change)
            .set({ pendingEffects: record.pendingEffects & ~4 })
            .where(eq(nickname_change.operationId, operationId));

          return true;
        });
      } finally {
        connection.release();
      }
    },
    async deliverSharedUser(uid, operationId, now, project, publish, timeoutMs) {
      key(uid, operationId);
      time(now);

      if (
        typeof project !== "function" ||
        typeof publish !== "function" ||
        !integer(timeoutMs) ||
        timeoutMs < 100 ||
        timeoutMs > 30000
      )
        return invalid();

      return databases.global.db.transaction(
        async (global) =>
          db.transaction(
            async (tx) => {
              const profile = await owner(tx, uid);

              if (!profile || profile.uid !== uid || profile.serverId !== kingdomId)
                return invalid();

              const record = await operation(tx, uid, operationId);

              if (!record || record.state !== "committed" || !(record.pendingEffects & 8))
                return false;

              const row = await readSharedUserProfile(tx, uid, kingdomId);
              const canonical = await nicknameAccountUid(global, uid);
              const [account] = await global
                .select({ server: account_new.server, name: account_new.gameUserName })
                .from(account_new)
                .where(eq(account_new.gameUid, canonical))
                .limit(1);

              if (!account || account.server !== String(kingdomId) || account.name !== row.name)
                return invalid();

              const allocation = await global.execute<{ version: string }>(
                sql`select nextval('opencok_global.shared_user_publication_seq'::regclass)::text as version`,
              );

              if (
                allocation.rows.length !== 1 ||
                !/^[1-9]\d{0,18}$/.test(allocation.rows[0]!.version)
              )
                return invalid();

              const version = BigInt(allocation.rows[0]!.version);

              if (version > 9223372036854775807n) return invalid();

              const update = Object.freeze({
                ...project(Object.freeze(row), kingdomId, version, now),
              });

              if (
                update.owner !== uid ||
                update.kingdomId !== kingdomId ||
                update.version !== version ||
                update.updatedAt !== String(BigInt(now) / 1000n) ||
                typeof update.body !== "string" ||
                Buffer.byteLength(update.body) > 65535 ||
                !update.body.isWellFormed()
              )
                return invalid();

              const controller = new AbortController();
              let timer: ReturnType<typeof setTimeout> | undefined;

              try {
                await Promise.race([
                  Promise.resolve().then(() => publish(update, controller.signal)),
                  new Promise<never>((_, reject) => {
                    timer = setTimeout(() => {
                      controller.abort();
                      reject(new Error("Shared user publication deadline"));
                    }, timeoutMs);
                  }),
                ]);
                controller.signal.throwIfAborted();
              } finally {
                clearTimeout(timer);
                controller.abort();
              }

              const changed = await tx
                .update(nickname_change)
                .set({ pendingEffects: record.pendingEffects & ~8 })
                .where(
                  and(
                    eq(nickname_change.operationId, operationId),
                    eq(nickname_change.pendingEffects, record.pendingEffects),
                  ),
                )
                .returning({ id: nickname_change.operationId });

              if (changed.length !== 1 || changed[0]!.id !== operationId) return invalid();

              return true;
            },
            { isolationLevel: "read committed", accessMode: "read write" },
          ),
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
    async deliverChat(uid, operationId, publish, timeoutMs) {
      key(uid, operationId);

      if (
        typeof publish !== "function" ||
        !integer(timeoutMs) ||
        timeoutMs < 100 ||
        timeoutMs > 30000
      )
        return invalid();

      return db.transaction(
        async (tx) => {
          const profile = await owner(tx, uid);

          if (!profile || profile.uid !== uid || profile.serverId !== kingdomId) return invalid();

          const record = await operation(tx, uid, operationId);

          if (!record || record.state !== "committed" || !(record.pendingEffects & 2)) return false;

          const controller = new AbortController();
          let timer: ReturnType<typeof setTimeout> | undefined;

          try {
            await Promise.race([
              Promise.resolve().then(() =>
                publish(Object.freeze({ owner: uid, kingdomId, operationId }), controller.signal),
              ),
              new Promise<never>((_, reject) => {
                timer = setTimeout(() => {
                  controller.abort();
                  reject(new Error("Chat nickname deadline"));
                }, timeoutMs);
              }),
            ]);
            controller.signal.throwIfAborted();
          } finally {
            clearTimeout(timer);
            controller.abort();
          }

          const changed = await tx
            .update(nickname_change)
            .set({ pendingEffects: record.pendingEffects & ~2 })
            .where(
              and(
                eq(nickname_change.operationId, operationId),
                eq(nickname_change.pendingEffects, record.pendingEffects),
              ),
            )
            .returning({ id: nickname_change.operationId });

          if (changed.length !== 1 || changed[0]!.id !== operationId) return invalid();

          return true;
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
    async change(uid, operationId, name, now) {
      key(uid, operationId);
      time(now);

      if (!identifier(name, 200) || nicknameTrim(name) !== name) return invalid();

      mysqlUtf8UnicodeKey(name);
      const prior = await find(uid, operationId);

      if (prior) {
        if (prior.newName !== name) return invalid();

        return recover(uid, operationId, now);
      }

      try {
        await withAvailableNickname(databases.global.db, name, async (tx) => {
          await prepare(uid, operationId, name, now);
          await notify(uid, operationId);
          await writeNicknameGlobal(tx, uid, name);

          try {
            await tx.insert(nickname_change_receipt).values({
              operationId,
              ownerUid: uid,
              kingdomId,
              newName: name,
              committedAt: time(now),
            });
          } catch {
            throw new GameError("E100179");
          }
        });
      } catch (error) {
        const pending = await find(uid, operationId);

        if (!pending) throw error;

        if (pending.newName !== name) return invalid();

        return recover(uid, operationId, now, error instanceof GameError ? error.code : "E100179");
      }

      return recover(uid, operationId, now);
    },
  };
}

export async function checkNicknameChangeStore(
  databases: Pick<ReturnType<typeof createDatabases>, "global" | "getKingdom">,
  kingdomId: number,
): Promise<void> {
  const db = databases.getKingdom(kingdomId).db;
  await db.select().from(nickname_change).limit(0);
  await db.select().from(throne).limit(0);
  await databases.global.db.select().from(nickname_change_receipt).limit(0);
  await databases.global.db.execute(
    sql`select uuid,version,king_type,config_type,uid,name,pic,pic_ver from opencok_global.cross_throne_king_info limit 0`,
  );
}
