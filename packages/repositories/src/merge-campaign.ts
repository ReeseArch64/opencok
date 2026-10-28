import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { trigger_timmer } from "@opencok/drizzle/schema/opencok_kingdom/trigger_timmer";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import {
    currentMergeEffects,
    decodeMergeEffects,
    mergeTimerEligible,
    mergeTimers,
    overlayMergeEffects,
} from "@opencok/rules/merge-campaign";
import type { CampaignRule } from "@opencok/contracts/local-campaign";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { appendMutationRecords, type MutationTransaction } from "./mutation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

const snapshotKey = "realm.merge.effects";

export const mergeCampaignActor = "realm.merge.campaign";

export function createMergeCampaignStore(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    rules: readonly CampaignRule[],
)
{
    const timers = mergeTimers(rules);

    if (new Set(timers.map((timer) => timer.name)).size !== timers.length)
    {
        throw new Error("Duplicate merge campaign timer");
    }

    const where = and(
        eq(trigger_var.type, 2),
        eq(trigger_var.uid, String(authority.kingdomId)),
        eq(trigger_var.key, snapshotKey),
    );
    const read = async (tx: MutationTransaction) => {
        const [server] = await tx
            .select({ mergeAt: server_info.lastMergeMillis })
            .from(server_info)
            .where(eq(server_info.uid, "server"))
            .for("share");
        const [row] = await tx
            .select({ value: trigger_var.value })
            .from(trigger_var)
            .where(where)
            .for("share");
        const snapshot = decodeMergeEffects(row?.value);
        const source = server?.mergeAt ?? 0n;

        return {
            snapshot,
            mergeAt: source > 0n && source <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(source) : 0,
        };
    };

    return {
        async refresh(at?: number)
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await tx.execute(sql`select pg_advisory_xact_lock(728216, ${authority.kingdomId})`);
                const now = at ?? Date.now();

                if (
                    !Number.isSafeInteger(now) || now <= 0 || now > Number.MAX_SAFE_INTEGER - 600000
                )
                {
                    throw new Error("Invalid merge campaign clock");
                }

                const { snapshot, mergeAt } = await read(tx);
                const before = JSON.stringify(snapshot);

                for (const timer of timers)
                {
                    if (!mergeTimerEligible(timer, mergeAt, now))
                    {
                        continue;
                    }

                    const [saved] = await tx
                        .select()
                        .from(trigger_timmer)
                        .where(eq(trigger_timmer.timmer_name, timer.name))
                        .for("update");

                    if (saved && saved.last_exec_millis < 0n)
                    {
                        throw new Error("Invalid merge campaign timer clock");
                    }

                    if (saved && BigInt(now) - saved.last_exec_millis < BigInt(timer.interval))
                    {
                        continue;
                    }

                    if (saved && (saved.count < 0 || saved.count >= 2147483647))
                    {
                        throw new Error("Invalid merge campaign timer count");
                    }

                    for (const effect of timer.effects)
                    {
                        snapshot.effects = snapshot.effects.filter((existing) =>
                            existing.id !== effect.id
                        );
                        snapshot.effects.push({
                            id: effect.id,
                            sourceMergeAt: mergeAt,
                            start: now,
                            end: now + effect.duration,
                            value: effect.value,
                        });
                    }

                    await tx
                        .insert(trigger_timmer)
                        .values({
                            timmer_name: timer.name,
                            count: (saved?.count ?? 0) + 1,
                            last_exec_millis: BigInt(now),
                        })
                        .onConflictDoUpdate({
                            target: trigger_timmer.timmer_name,
                            set: { count: (saved?.count ?? 0) + 1, last_exec_millis: BigInt(now) },
                        });
                }

                snapshot.effects.sort((a, b) => a.id - b.id);
                snapshot.notified = currentMergeEffects(snapshot, mergeAt, now).map((effect) =>
                    effect.id
                );
                const value = JSON.stringify(snapshot);

                if (before === value)
                {
                    return false;
                }

                decodeMergeEffects(value);
                await tx
                    .insert(trigger_var)
                    .values({
                        type: 2,
                        uid: String(authority.kingdomId),
                        key: snapshotKey,
                        value,
                        refreshtime: BigInt(now),
                    })
                    .onConflictDoUpdate({
                        target: [trigger_var.type, trigger_var.uid, trigger_var.key],
                        set: { value, refreshtime: BigInt(now) },
                    });
                await appendMutationRecords(
                    tx,
                    authority,
                    {
                        owner: mergeCampaignActor,
                        requestId: randomUUID(),
                        command: "merge.campaign.refresh",
                        request: Buffer.from(value),
                    },
                    {
                        response: Buffer.alloc(0),
                        events: [{
                            id: "board",
                            type: "merge.campaign.board",
                            payload: Buffer.from("1"),
                        }],
                    },
                    BigInt(now),
                );
                authority.assertReady();

                return true;
            });
        },
        async current(now?: number, transaction?: MutationTransaction)
        {
            const current = async (tx: MutationTransaction) => {
                await fenceRealmTransaction(tx, authority);
                const { snapshot, mergeAt } = await read(tx);
                authority.assertReady();

                return currentMergeEffects(snapshot, mergeAt, now ?? Date.now());
            };

            return transaction ? current(transaction) : db.transaction(current);
        },
        async overlay(
            cached: ReadonlyMap<string, string>,
            now?: number,
            transaction?: MutationTransaction,
        )
        {
            return overlayMergeEffects(cached, await this.current(now, transaction));
        },
    };
}
