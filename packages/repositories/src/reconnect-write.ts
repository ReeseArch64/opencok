import { ReconnectTaskRepository } from "@opencok/tasks/repositories/reconnect";
import { appendMutationRecords } from "./mutation.ts";
import { and, eq } from "drizzle-orm";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_glory_info } from "@opencok/drizzle/schema/opencok_kingdom/user_glory_info";
import { user_weakness_building } from "@opencok/drizzle/schema/opencok_kingdom/user_weakness_building";
import { resource_settlement } from "@opencok/drizzle/schema/opencok_kingdom/resource_settlement";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import { javaDecimal } from "@opencok/rules/java-integer";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority.ts";
import { readReconnectProgress } from "./reconnect-progress.ts";
import { insertSystemMail } from "./system-mail.ts";
import { readFriendshipMine } from "./reconnect-mine.ts";
import type { FriendshipMine } from "@opencok/contracts/reconnect";

type Transaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

const integer = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));

const long = (value: unknown) => javaDecimal(String(value ?? 0), 64);

const unique = (ids: readonly string[]) => {
    if (
        new Set(ids).size !== ids.length
        || ids.some((id) => !id || id.includes("\0") || !id.isWellFormed())
    )
    {
        throw new Error("Invalid reconnect changes");
    }
};

const updated = (rows: readonly unknown[]) => {
    if (rows.length !== 1)
    {
        throw new Error("Reconnect state changed");
    }
};

export async function persistReconnectProgress(
    tx: Transaction,
    state: ReconnectProgressState,
    write: ReconnectProgressWrite,
    authority: RealmAuthority,
    now: bigint,
): Promise<void>
{
    await fenceRealmTransaction(tx, authority);

    if (state.profile.serverId !== authority.kingdomId)
    {
        throw new Error("Invalid reconnect realm");
    }

    const uid = String(state.profile.uid);
    const resource = write.resource;
    const from = long(state.resource.lastUpdateTime);
    const until = now < from ? from : now;

    if (
        long(resource.lastUpdateTime) !== until
        || resource.starvingMillis < 0n
        || resource.starvingMillis > until - from
    )
    {
        throw new Error("Invalid reconnect checkpoint");
    }

    const foodBefore = long(state.resource.food),
        boundBefore = long(state.resource.foodbind);

    if (
        long(resource.food) < 0n
        || long(resource.foodbind) < 0n
        || resource.food > foodBefore
        || resource.foodbind > boundBefore
    )
    {
        throw new Error("Invalid reconnect resource debit");
    }

    for (
        const ids of [
            write.armies.map((row) => row.armyId),
            write.weakness.map((row) => row.armyId),
            write.troopChanges.map((row) => row.armyId),
            write.generalResets,
            write.skillResets,
            write.skillCooldownResets,
            write.buildingRefreshes.map((row) => row.uuid),
            write.mail.map((row) => row.uid),
        ]
    )
    {
        unique(ids);
    }

    const originalArmies = new Map(state.armies.map((row) => [String(row.armyId), row]));

    for (const army of write.armies)
    {
        const before = originalArmies.get(army.armyId);

        if (
            !before
            || integer(army.free) < 0
            || integer(army.defence) < 0
            || army.free > integer(before.free)
            || army.defence > integer(before.defence)
        )
        {
            throw new Error("Invalid reconnect troop debit");
        }

        const ledger = write.troopChanges.find((entry) => entry.armyId === army.armyId);

        if (
            !ledger
            || ledger.freeBefore !== integer(before.free)
            || ledger.defenceBefore !== integer(before.defence)
            || ledger.freeAfter !== army.free
            || ledger.defenceAfter !== army.defence
            || integer(ledger.weakened) < 0
            || integer(ledger.dead) < 0
            || ledger.weakened + ledger.dead
                !== ledger.freeBefore + ledger.defenceBefore - ledger.freeAfter
                    - ledger.defenceAfter
        )
        {
            throw new Error("Inconsistent reconnect troop ledger");
        }
    }

    if (write.troopChanges.length !== write.armies.length)
    {
        throw new Error("Unexpected reconnect troop ledger");
    }

    if (
        until === from
        && (write.armies.length || resource.food !== foodBefore
            || resource.foodbind !== boundBefore)
    )
    {
        throw new Error("Reconnect interval already settled");
    }

    authority.assertReady();

    if (until > from)
    {
        await appendMutationRecords(
            tx,
            authority,
            {
                owner: uid,
                requestId: `settlement:${from}:${until}`,
                command: "resource.settle",
                request: Buffer.from(JSON.stringify([uid, String(from), String(until)])),
            },
            {
                response: Buffer.from(
                    JSON.stringify([String(resource.food), String(resource.foodbind)]),
                ),
                postings: [
                    {
                        account: uid,
                        asset: "resource.food",
                        before: foodBefore,
                        after: resource.food,
                        reason: "reconnect.upkeep",
                    },
                    {
                        account: uid,
                        asset: "resource.foodbind",
                        before: boundBefore,
                        after: resource.foodbind,
                        reason: "reconnect.upkeep",
                    },
                ],
            },
            now,
        );
        await tx.insert(resource_settlement).values({
            uid,
            fromTime: from,
            toTime: until,
            ownerEpoch: authority.epoch,
            foodBefore,
            foodAfter: resource.food,
            boundBefore,
            boundAfter: resource.foodbind,
            starvingMillis: resource.starvingMillis,
            troopChanges: write.troopChanges,
        });
        updated(
            await tx
                .update(user_resource)
                .set({ food: resource.food, foodbind: resource.foodbind, lastUpdateTime: until })
                .where(and(eq(user_resource.uid, uid), eq(user_resource.lastUpdateTime, from)))
                .returning({ uid: user_resource.uid }),
        );
    }

    for (const army of write.armies)
    {
        updated(
            await tx
                .update(user_army)
                .set({ free: army.free, defence: army.defence })
                .where(and(eq(user_army.uid, uid), eq(user_army.armyId, army.armyId)))
                .returning({ id: user_army.armyId }),
        );
    }

    for (const row of write.weakness)
    {
        if (
            !originalArmies.has(row.armyId)
            || [row.weakness, row.marchWeakness, row.heal].some((value) => integer(value) < 0)
        )
        {
            throw new Error("Invalid reconnect weakness");
        }

        long(row.finishTime);
        const previous = state.weakness.find((entry) => entry.armyId === row.armyId);
        const loss = write.troopChanges.find((entry) => entry.armyId === row.armyId);

        if (row.weakness !== integer(previous?.weakness) + (loss?.weakened ?? 0))
        {
            throw new Error("Inconsistent weakness ledger");
        }

        if (
            previous
            && (integer(previous.heal) !== row.heal || long(previous.finishTime) !== row.finishTime)
        )
        {
            throw new Error("Reconnect cannot finish healing");
        }

        if (!previous && (row.heal !== 0 || row.finishTime !== 0n))
        {
            throw new Error("Reconnect cannot start healing");
        }

        if (previous)
        {
            updated(
                await tx
                    .update(user_weakness_building)
                    .set({ weakness: row.weakness, marchWeakness: row.marchWeakness })
                    .where(
                        and(
                            eq(user_weakness_building.uid, uid),
                            eq(user_weakness_building.armyId, row.armyId),
                        ),
                    )
                    .returning({ id: user_weakness_building.armyId }),
            );
        }
        else
        {
            await tx.insert(user_weakness_building).values({ uid, ...row });
        }
    }

    if (
        write.troopChanges.some(
            (entry) =>
                entry.weakened > 0 && !write.weakness.some((row) => row.armyId === entry.armyId),
        )
    )
    {
        throw new Error("Missing weakness ledger state");
    }

    if (write.weaknessTime !== undefined)
    {
        if (write.weaknessTime < 0n)
        {
            throw new Error("Invalid weakness checkpoint");
        }

        long(write.weaknessTime);

        if (state.glory)
        {
            updated(
                await tx
                    .update(user_glory_info)
                    .set({ weaknessTime: write.weaknessTime })
                    .where(eq(user_glory_info.uid, uid))
                    .returning({ uid: user_glory_info.uid }),
            );
        }
        else
        {
            await tx
                .insert(user_glory_info)
                .values({
                    uid,
                    strengthenCount: 0,
                    strengthenTime: 0n,
                    weaknessTime: write.weaknessTime,
                });
        }
    }

    await new ReconnectTaskRepository(tx, uid, { integer, unique, updated }).writeTasks(
        state.tasks,
        write.tasks,
    );

    for (const uuid of write.generalResets)
    {
        if (!state.generals.some((row) => row.uuid === uuid))
        {
            throw new Error("Unknown reconnect general");
        }

        updated(
            await tx
                .update(user_general)
                .set({ ability: null })
                .where(and(eq(user_general.uid, uid), eq(user_general.uuid, uuid)))
                .returning({ uuid: user_general.uuid }),
        );
    }

    for (const uuid of write.skillResets)
    {
        if (!state.skills.some((row) => row.uuid === uuid && integer(row.stat) === 2))
        {
            throw new Error("Invalid reconnect skill transition");
        }

        updated(
            await tx
                .update(user_skill)
                .set({ stat: 0 })
                .where(
                    and(
                        eq(user_skill.ownerId, uid),
                        eq(user_skill.uuid, uuid),
                        eq(user_skill.stat, 2),
                    ),
                )
                .returning({ uuid: user_skill.uuid }),
        );
    }

    for (const uuid of write.skillCooldownResets)
    {
        const skill = state.skills.find((row) => row.uuid === uuid);

        if (!skill || long(skill.endTime) > BigInt.asIntN(64, now + 5000n))
        {
            throw new Error("Reconnect skill cooldown is not due");
        }

        updated(
            await tx
                .update(user_skill)
                .set({ startTime: 9223372036854775807n, endTime: 9223372036854775807n })
                .where(and(eq(user_skill.ownerId, uid), eq(user_skill.uuid, uuid)))
                .returning({ uuid: user_skill.uuid }),
        );
    }

    for (const building of write.buildingRefreshes)
    {
        if (!state.buildings.some((row) => row.uuid === building.uuid))
        {
            throw new Error("Unknown reconnect building");
        }

        updated(
            await tx
                .update(user_building)
                .set({ refreshTime: long(building.refreshTime) })
                .where(and(eq(user_building.uid, uid), eq(user_building.uuid, building.uuid)))
                .returning({ uuid: user_building.uuid }),
        );
    }

    for (const message of write.mail)
    {
        await insertSystemMail(tx, message, uid, message.uid.slice(0, 32), now, message.itemIdFlag);
    }

    authority.assertReady();
}

export async function executeReconnectProgress<T>(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    uid: string,
    now: bigint,
    plan: (state: ReconnectProgressState) => Promise<{ write: ReconnectProgressWrite; result: T; }>,
    mine?: { binding: string | null; initial: () => FriendshipMine; },
): Promise<T>
{
    const execute = () =>
        db.transaction(
            async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const state = await readReconnectProgress(tx, uid, authority.kingdomId, now);

                if (mine)
                {
                    state.mine = await readFriendshipMine(tx, uid, mine.binding, mine.initial);
                }

                const freeze = (value: unknown): void => {
                    if (!value || typeof value !== "object" || Buffer.isBuffer(value))
                    {
                        return;
                    }

                    for (const child of Object.values(value))
                    {
                        freeze(child);
                    }

                    Object.freeze(value);
                };
                freeze(state);
                const planned = await plan(state);
                await persistReconnectProgress(tx, state, planned.write, authority, now);

                return planned.result;
            },
            { isolationLevel: "repeatable read" },
        );

    for (let attempt = 0;; attempt++)
    {
        try
        {
            return await execute();
        }
        catch (error)
        {
            let cause: unknown = error;
            let retryable = false;

            for (let depth = 0; depth < 4 && cause && typeof cause === "object"; depth++)
            {
                if ("code" in cause && (cause.code === "40001" || cause.code === "40P01"))
                {
                    retryable = true;
                    break;
                }

                cause = "cause" in cause ? cause.cause : undefined;
            }

            if (!retryable || attempt >= 2)
            {
                throw error;
            }

            authority.assertReady();
        }
    }
}
