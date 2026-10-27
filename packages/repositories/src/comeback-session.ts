import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import {
  comebackDeviceId,
  comebackSessionKey,
  decodeComebackSession,
  encodeComebackSession,
} from "@opencok/rules/comeback";
import { long, text, type Row } from "@opencok/contracts/rows";
import type { ComebackSession } from "@opencok/contracts/comeback";
import type { MutationResult } from "@opencok/contracts/mutation";
import { createMutationExecutor, type MutationTransaction } from "./mutation";
import type { RealmAuthority } from "./realm-authority";
import type { Database } from "./game";

const maximum = (...values: bigint[]) =>
  values.reduce((left, right) => (left > right ? left : right), 0n);

export async function lockComebackDevice(tx: MutationTransaction, profile: Row) {
  const key = createHash("sha256").update(comebackDeviceId(profile)).digest("hex");
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${`comeback:${key}`},0))`);
}

export async function readComebackSession(tx: MutationTransaction, owner: string) {
  const [row] = await tx
    .select({ value: sql<string>`left(${trigger_var.value},2049)` })
    .from(trigger_var)
    .where(
      and(
        eq(trigger_var.type, 1),
        eq(trigger_var.uid, owner),
        eq(trigger_var.key, comebackSessionKey),
      ),
    );

  return decodeComebackSession(row?.value);
}

export async function writeComebackSession(
  tx: MutationTransaction,
  owner: string,
  state: ComebackSession,
  now: bigint,
) {
  const value = encodeComebackSession(state);
  await tx
    .insert(trigger_var)
    .values({ type: 1, uid: owner, key: comebackSessionKey, value, refreshtime: now })
    .onConflictDoUpdate({
      target: [trigger_var.type, trigger_var.uid, trigger_var.key],
      set: { value, refreshtime: now },
    });
}

export function createComebackSessions(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  afterOpen?: (tx: MutationTransaction, owner: string, now: bigint) => Promise<MutationResult>,
) {
  const run = async (
    owner: string,
    sessionId: string,
    captured: number,
    kind: "open" | "close" | "observe",
  ) => {
    if (
      !Number.isSafeInteger(captured) ||
      captured <= 0 ||
      !sessionId ||
      sessionId.length > 64 ||
      !sessionId.isWellFormed() ||
      sessionId.includes("\0")
    )
      throw new Error("Invalid comeback session");

    const now = BigInt(captured),
      suffix = kind === "observe" ? `${sessionId}:${now / 60000n}` : sessionId;
    const execute = createMutationExecutor(db, authority, () => captured);
    await execute(
      {
        owner,
        requestId: `comeback.${kind}:${suffix}`,
        command: `comeback.session.${kind}`,
        request: Buffer.from(sessionId),
        expiresAt: now + 86400000n,
      },
      async (tx) => {
        const [profile] = await tx.select().from(userprofile).where(eq(userprofile.uid, owner));

        if (!profile) throw new Error("Missing comeback session owner");

        await lockComebackDevice(tx, profile);
        const saved = await readComebackSession(tx, owner);

        if (saved && now < saved.openedAt) throw new Error("Reversed comeback session clock");

        if (kind !== "open") {
          if (!saved || saved.sessionId !== sessionId || saved.closedAt > 0n)
            return { response: Buffer.alloc(0) };

          const observed = maximum(now, saved.observedAt);
          await writeComebackSession(
            tx,
            owner,
            { ...saved, observedAt: observed, closedAt: kind === "close" ? observed : 0n },
            now,
          );
          await tx
            .update(userprofile)
            .set({
              lastOnlineTime: maximum(long(profile, "lastOnlineTime"), observed),
              ...(kind === "close" ? { offLineTime: observed } : {}),
            })
            .where(eq(userprofile.uid, owner));

          return { response: Buffer.alloc(0) };
        }

        const [history] = await tx
          .select({ id: command_receipt.requestId })
          .from(command_receipt)
          .where(
            and(
              eq(command_receipt.kingdomId, authority.kingdomId),
              eq(command_receipt.ownerUid, owner),
            ),
          )
          .limit(1);
        const previous = saved
          ? maximum(long(profile, "lastOnlineTime"), saved.observedAt)
          : history
            ? now
            : long(profile, "lastOnlineTime");
        let devicePrevious = now;
        const rawDevice = text(profile, "deviceId"),
          device = rawDevice.trim() ? rawDevice : "";

        if (device) {
          const actors = await tx
            .select({
              uid: userprofile.uid,
              realm: userprofile.serverId,
              at: userprofile.lastOnlineTime,
              cross: userprofile.crossFightSrcServerId,
              metadata: sql<string | null>`left(${trigger_var.value},2049)`,
              history: sql<boolean>`exists(select 1 from ${command_receipt} receipt where receipt."kingdomId"=${authority.kingdomId} and receipt."ownerUid"=${userprofile.uid})`,
            })
            .from(userprofile)
            .leftJoin(
              trigger_var,
              and(
                eq(trigger_var.type, 1),
                eq(trigger_var.uid, userprofile.uid),
                eq(trigger_var.key, comebackSessionKey),
              ),
            )
            .where(eq(userprofile.deviceId, device))
            .limit(257);

          if (actors.length > 256) throw new Error("Comeback device aggregate exceeds bound");

          let latest = 0n,
            unknown = false;

          for (const actor of actors) {
            const session = decodeComebackSession(actor.metadata ?? undefined);

            if (
              (actor.history && !session) ||
              actor.realm !== authority.kingdomId ||
              (actor.cross ?? 0) > 0
            )
              unknown = true;

            latest = maximum(latest, actor.at ?? 0n, session?.observedAt ?? 0n);
          }

          devicePrevious = unknown || latest === 0n ? now : latest;
        }

        await writeComebackSession(
          tx,
          owner,
          {
            sessionId,
            openedAt: now,
            previousOnlineAt: previous,
            devicePreviousOnlineAt: devicePrevious,
            observedAt: now,
            closedAt: 0n,
          },
          now,
        );
        await tx
          .update(userprofile)
          .set({ lastOnlineTime: maximum(long(profile, "lastOnlineTime"), now) })
          .where(eq(userprofile.uid, owner));

        return afterOpen ? afterOpen(tx, owner, now) : { response: Buffer.alloc(0) };
      },
    );
  };

  return {
    open: (owner: string, id: string, now: number) => run(owner, id, now, "open"),
    close: (owner: string, id: string, now: number) => run(owner, id, now, "close"),
    observe: (owner: string, id: string, now: number) => run(owner, id, now, "observe"),
  };
}
