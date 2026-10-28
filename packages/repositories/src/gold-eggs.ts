import { createHash } from "node:crypto";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { gold_eggs } from "@opencok/drizzle/schema/opencok_kingdom/gold_eggs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { trigger_timmer } from "@opencok/drizzle/schema/opencok_kingdom/trigger_timmer";
import type {
    GoldEggsBoard,
    GoldEggsCalendar,
    GoldEggsPeriod,
    GoldEggsReader,
    GoldEggsStanding,
    GoldEggsRuntimeStore,
    GoldEggsWrite,
} from "@opencok/contracts/gold-eggs";
import { goldEggsPeriodId, goldEggsPrizes, goldEggsSort } from "@opencok/rules/gold-eggs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { text, type Row } from "@opencok/contracts/rows";
import { appendMutationRecords, type MutationTransaction } from "./mutation";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

type Realm = DatabaseClient<"kingdom">;

const prefix = "gold.eggs.period.v1.",
    ownerKey = "gold.eggs.owner.v1";

const key = (mode: string, period: GoldEggsPeriod) =>
    `gold.eggs.${mode}.v1.${goldEggsPeriodId(period)}`;

function json(value: unknown)
{
    return JSON.stringify(
        { version: 1, ...(value as object) },
        (_, value: unknown) => typeof value === "bigint" ? String(value) : value,
    );
}

function object(raw: string | undefined, maximum = 262144): Row | undefined
{
    if (raw === undefined)
    {
        return;
    }

    if (Buffer.byteLength(raw) > maximum)
    {
        throw new Error("Gold eggs snapshot bound exceeded");
    }

    const row = JSON.parse(raw) as Row;

    if (!row || row.version !== 1)
    {
        throw new Error("Invalid gold eggs snapshot version");
    }

    return row;
}

function period(row: Row): GoldEggsPeriod
{
    const value = { start: cityAmount(row.start), end: cityAmount(row.end) };
    goldEggsPeriodId(value);

    return value;
}

function calendar(raw: string | undefined, realm: number): GoldEggsCalendar | undefined
{
    const row = object(raw, 32768);

    if (!row)
    {
        return;
    }

    const limits = (value: unknown) => {
        if (!Array.isArray(value) || value.length > 150)
        {
            throw new Error("Invalid gold eggs prizes");
        }

        return goldEggsPrizes(
            value
                .map(
                    (entry: Row) =>
                        `${cityInteger(entry.first, 1, 150)}-${cityInteger(entry.last, 1, 150)};${
                            text(entry, "reward")
                        }`,
                )
                .join("|"),
        );
    };

    if (
        row.kingdomId !== realm
        || typeof row.admitted !== "boolean"
        || typeof row.global !== "boolean"
    )
    {
        throw new Error("Foreign gold eggs calendar");
    }

    return {
        ...period(row),
        kingdomId: realm,
        admitted: row.admitted,
        global: row.global,
        localLimit: cityInteger(row.localLimit ?? 150, 1, 150),
        globalLimit: cityInteger(row.globalLimit ?? 150, 1, 150),
        localPrizes: limits(row.localPrizes),
        globalPrizes: limits(row.globalPrizes),
        localTemplate: String(cityInteger(row.localTemplate, 1)),
        globalTemplate: String(cityInteger(row.globalTemplate, 1)),
    };
}

function board(
    raw: string | undefined,
    expected: GoldEggsPeriod,
    realm?: number,
): GoldEggsBoard | undefined
{
    const row = object(raw);

    if (!row)
    {
        return;
    }

    const saved = period(row);

    if (
        goldEggsPeriodId(saved) !== goldEggsPeriodId(expected)
        || !Array.isArray(row.rows)
        || row.rows.length > 150
    )
    {
        throw new Error("Invalid gold eggs frozen board");
    }

    const rows: GoldEggsStanding[] = row.rows.map((input: Row) => {
        const uid = text(input, "uid"),
            name = text(input, "name"),
            pic = text(input, "pic");

        if (!uid || uid.length > 40 || name.length > 255 || pic.length > 255)
        {
            throw new Error("Invalid gold eggs standing identity");
        }

        const value = {
            uid,
            kingdomId: cityInteger(input.kingdomId, 1),
            score: cityAmount(input.score),
            createdAt: cityAmount(input.createdAt),
            name,
            pic,
            picVer: cityInteger(input.picVer),
            picfraId: cityInteger(input.picfraId),
        };

        if (value.createdAt < saved.start || value.createdAt > saved.end)
        {
            throw new Error("Foreign gold eggs standing period");
        }

        return value;
    });

    if (
        (realm !== undefined && rows.some((row) => row.kingdomId !== realm))
        || new Set(rows.map((row) => `${row.kingdomId}:${row.uid}`)).size !== rows.length
    )
    {
        throw new Error("Duplicate gold eggs standing");
    }

    const finalizedAt = cityAmount(row.finalizedAt);

    if (finalizedAt <= saved.end)
    {
        throw new Error("Premature gold eggs finalization");
    }

    return { ...saved, finalizedAt, rows };
}

async function lock(tx: MutationTransaction, realm: number)
{
    await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`gold-eggs:${realm}`},0))`,
    );
}

async function read(
    tx: MutationTransaction,
    scope: number,
    uid: string,
    name: string,
    maximum = 262144,
)
{
    const [row] = await tx
        .select({ value: sql<string>`left(${trigger_var.value},${maximum + 1})` })
        .from(trigger_var)
        .where(
            and(eq(trigger_var.type, scope), eq(trigger_var.uid, uid), eq(trigger_var.key, name)),
        );

    return row?.value;
}

async function save(
    tx: MutationTransaction,
    scope: number,
    uid: string,
    name: string,
    value: string,
    now: bigint,
)
{
    if (name.length > 200 || Buffer.byteLength(value) > 262144)
    {
        throw new Error("Gold eggs persistence bound exceeded");
    }

    await tx
        .insert(trigger_var)
        .values({ type: scope, uid, key: name, value, refreshtime: now })
        .onConflictDoUpdate({
            target: [trigger_var.type, trigger_var.uid, trigger_var.key],
            set: { value, refreshtime: now },
        });
}

async function header(tx: MutationTransaction, realm: number, value: GoldEggsPeriod)
{
    return calendar(await read(tx, 2, String(realm), key("period", value), 32768), realm);
}

export async function readGoldEggsRows(
    tx: Pick<MutationTransaction, "select">,
    realm: number,
    value: GoldEggsPeriod,
    now = BigInt(Date.now()),
    maximum = 150,
)
{
    const rows = await tx
        .select({
            uid: gold_eggs.uid,
            score: gold_eggs.score,
            createdAt: gold_eggs.createtime,
            name: userprofile.name,
            pic: userprofile.pic,
            picVer: userprofile.picVer,
            picfraId: userprofile.picfraId,
        })
        .from(gold_eggs)
        .innerJoin(userprofile, eq(userprofile.uid, gold_eggs.uid))
        .where(
            and(
                eq(userprofile.serverId, realm),
                sql`coalesce(${userprofile.crossFightSrcServerId},-1)<=0`,
                sql`coalesce(${userprofile.banFlag},0)=0`,
                gte(gold_eggs.createtime, value.start),
                lte(gold_eggs.createtime, value.end < now ? value.end : now),
                sql`coalesce(${userprofile.banTime},0)<=${now}`,
                gte(gold_eggs.score, 0n),
            ),
        )
        .orderBy(desc(gold_eggs.score), sql`${gold_eggs.uid} collate "C"`)
        .limit(cityInteger(maximum, 1, 150));

    return rows.map((row): GoldEggsStanding => ({
        uid: row.uid,
        kingdomId: realm,
        score: row.score,
        createdAt: row.createdAt,
        name: row.name,
        pic: row.pic ?? "",
        picVer: row.picVer ?? 0,
        picfraId: row.picfraId ?? 0,
    }));
}

async function freezeLocal(
    tx: MutationTransaction,
    realm: number,
    value: GoldEggsCalendar,
    now: bigint,
)
{
    if (now <= value.end || (await read(tx, 2, String(realm), key("local", value))) !== undefined)
    {
        return false;
    }

    const rows = value.admitted
        ? await readGoldEggsRows(tx, realm, value, now, value.localLimit)
        : [];
    await save(
        tx,
        2,
        String(realm),
        key("local", value),
        json({ ...value, finalizedAt: now, rows }),
        now,
    );

    return true;
}

async function admit(tx: MutationTransaction, realm: number, value: GoldEggsCalendar, now: bigint)
{
    if (value.kingdomId !== realm || now < value.start)
    {
        return false;
    }

    const old = await header(tx, realm, value);

    if (old)
    {
        if (value.admitted && value.global && !old.global)
        {
            await save(
                tx,
                2,
                String(realm),
                key("period", value),
                json({ ...old, global: true }),
                now,
            );

            return true;
        }

        return false;
    }

    await save(tx, 2, String(realm), key("period", value), json(value), now);

    return true;
}

export function goldEggsReader(
    tx: MutationTransaction,
    owner: string,
    realm: number,
    now: bigint,
): GoldEggsReader
{
    return {
        async prepare(value)
        {
            await lock(tx, realm);
            const owned = object(await read(tx, 1, owner, ownerKey, 1024), 1024);

            if (owned)
            {
                const previous = await header(tx, realm, period(owned));

                if (previous)
                {
                    await freezeLocal(tx, realm, previous, now);
                }
            }

            if ((await read(tx, 2, String(realm), key("local", value))) !== undefined)
            {
                throw new Error("Gold eggs period already finalized");
            }

            const [record] = await tx
                .select()
                .from(gold_eggs)
                .where(eq(gold_eggs.uid, owner))
                .for("update");

            if (record && !owned && record.createtime < value.start)
            {
                const matches = await tx
                    .select({ value: sql<string>`left(${trigger_var.value},32769)` })
                    .from(trigger_var)
                    .where(
                        and(
                            eq(trigger_var.type, 2),
                            eq(trigger_var.uid, String(realm)),
                            sql`${trigger_var.key} like ${`${prefix}%`}`,
                            sql`(${trigger_var.value}::jsonb->>'start')::bigint<=${record.createtime}`,
                            sql`(${trigger_var.value}::jsonb->>'end')::bigint>=${record.createtime}`,
                        ),
                    )
                    .limit(2);

                if (matches.length > 1)
                {
                    throw new Error("Ambiguous imported gold eggs period");
                }

                if (matches[0])
                {
                    await freezeLocal(tx, realm, calendar(matches[0].value, realm)!, now);
                }
            }

            await admit(tx, realm, value, now);

            if (!record)
            {
                return;
            }

            if (record.createtime > now)
            {
                throw new Error("Future gold eggs actor clock");
            }

            if (owned && goldEggsPeriodId(period(owned)) !== goldEggsPeriodId(value))
            {
                return;
            }

            if (record.createtime < value.start || record.createtime > value.end)
            {
                return;
            }

            return record;
        },
        async ranking(value)
        {
            const frozen = board(
                await read(tx, 2, String(realm), key("local", value)),
                value,
                realm,
            );
            const saved = await header(tx, realm, value);

            return frozen?.rows
                ?? readGoldEggsRows(tx, realm, value, now, saved?.localLimit ?? 150);
        },
        async award(value, global)
        {
            await lock(tx, realm);
            const admitted = await header(tx, realm, value),
                mode = global ? "global" : "local";

            if (
                !admitted?.admitted
                || now <= value.end
                || (global && !admitted.global)
                || (await read(tx, 1, owner, key(`award.${mode}`, value), 128)) !== undefined
            )
            {
                return;
            }

            const frozen = board(
                await read(tx, 2, String(realm), key(mode, value)),
                value,
                global ? undefined : realm,
            );

            if (!frozen || frozen.finalizedAt > now)
            {
                return;
            }

            const rank =
                frozen.rows.findIndex((row) => row.uid === owner && row.kingdomId === realm) + 1;
            const prize = (global ? admitted.globalPrizes : admitted.localPrizes).find(
                (prize) => rank >= prize.first && rank <= prize.last,
            );

            if (!rank || !prize)
            {
                return;
            }

            return {
                rank,
                reward: prize.reward,
                template: global ? admitted.globalTemplate : admitted.localTemplate,
            };
        },
    };
}

export async function writeGoldEggs(
    tx: MutationTransaction,
    owner: string,
    write: GoldEggsWrite,
    now: bigint,
)
{
    if (write.record)
    {
        const row = write.record;

        if (
            row.uid !== owner
            || !write.period
            || text(row, "statelist").length > 1024
            || text(row, "score_reward").length > 512
        )
        {
            throw new Error("Invalid owned gold eggs write");
        }

        const value = {
            uid: owner,
            flushfreetimes: cityInteger(row.flushfreetimes ?? 0),
            flushtime: cityAmount(row.flushtime ?? 0),
            flushcount: cityInteger(row.flushcount ?? 0),
            statelist: text(row, "statelist"),
            freetimes: cityInteger(row.freetimes ?? 0),
            everydaytime: cityAmount(row.everydaytime ?? 0),
            multiple: cityInteger(row.multiple ?? 1, 1, 10000),
            score: cityAmount(row.score ?? 0),
            score_reward: text(row, "score_reward"),
            ranking: cityInteger(row.ranking ?? 0),
            createtime: cityAmount(row.createtime),
        };

        if (
            value.createtime < write.period.start
            || value.createtime > write.period.end
            || value.createtime > now
            || value.everydaytime > now
            || value.flushtime > now
        )
        {
            throw new Error("Foreign gold eggs period write");
        }

        await tx
            .insert(gold_eggs)
            .values(value)
            .onConflictDoUpdate({ target: gold_eggs.uid, set: value });
        await save(tx, 1, owner, ownerKey, json(write.period), now);
    }

    if (write.award)
    {
        await save(
            tx,
            1,
            owner,
            key(`award.${write.award.global ? "global" : "local"}`, write.award.period),
            "1",
            now,
        );
    }
}

async function page(tx: MutationTransaction, realm: number, cursor?: string)
{
    const rows = await tx
        .select({ key: trigger_var.key, value: sql<string>`left(${trigger_var.value},32769)` })
        .from(trigger_var)
        .where(
            and(
                eq(trigger_var.type, 2),
                eq(trigger_var.uid, String(realm)),
                sql`${trigger_var.key} like ${`${prefix}%`}`,
                cursor ? sql`${trigger_var.key} collate "C">${cursor} collate "C"` : undefined,
            ),
        )
        .orderBy(sql`${trigger_var.key} collate "C"`)
        .limit(8);

    return rows.map((row) => ({ key: row.key, value: calendar(row.value, realm)! }));
}

export function createGoldEggsRuntimeStore(
    db: Realm,
    authority: RealmAuthority,
): GoldEggsRuntimeStore
{
    let awardOffset = 0,
        advanceCursor: string | undefined,
        pendingCursor: string | undefined,
        periodCursor: string | undefined;
    const receipt = async (tx: MutationTransaction, changes: readonly string[], now: bigint) => {
        if (!changes.length)
        {
            return;
        }

        const requestId = `gold-eggs-runtime:${
            createHash("sha256").update(changes.join("|")).digest("hex")
        }`;
        await appendMutationRecords(
            tx,
            authority,
            {
                owner: `gold-eggs:${authority.kingdomId}`,
                requestId,
                command: "goldeggs.runtime",
                request: Buffer.from(changes.join("|")),
            },
            { response: Buffer.alloc(0) },
            now,
        );
    };

    return {
        async advance(value, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await lock(tx, authority.kingdomId);
                const [timer] = await tx
                    .select()
                    .from(trigger_timmer)
                    .where(eq(trigger_timmer.timmer_name, "runtime.goldEggs"));

                if (timer && timer.last_exec_millis > now)
                {
                    throw new Error("Reversed gold eggs runtime clock");
                }

                if (timer && now - timer.last_exec_millis < 3600000n)
                {
                    return;
                }

                const changed: string[] = [];

                if (value && (await admit(tx, authority.kingdomId, value, now)))
                {
                    changed.push(`admit:${goldEggsPeriodId(value)}`);
                }

                const rows = await page(tx, authority.kingdomId, advanceCursor);
                advanceCursor = rows.length === 8 ? rows.at(-1)!.key : undefined;

                for (const row of rows)
                {
                    if (await freezeLocal(tx, authority.kingdomId, row.value, now))
                    {
                        changed.push(`local:${goldEggsPeriodId(row.value)}`);
                    }
                }

                await tx
                    .insert(trigger_timmer)
                    .values({
                        timmer_name: "runtime.goldEggs",
                        count: (timer?.count ?? 0) + 1,
                        last_exec_millis: now,
                    })
                    .onConflictDoUpdate({
                        target: trigger_timmer.timmer_name,
                        set: { count: (timer?.count ?? 0) + 1, last_exec_millis: now },
                    });
                changed.push(`timer:${now}`);
                await receipt(tx, changed, now);
            });
        },
        periods()
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const rows = await page(tx, authority.kingdomId, periodCursor);
                periodCursor = rows.length === 8 ? rows.at(-1)!.key : undefined;

                return rows.map((row) => row.value);
            });
        },
        async finalizeGlobal(value, rows, now)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await lock(tx, authority.kingdomId);
                const saved = await header(tx, authority.kingdomId, value),
                    local = board(
                        await read(tx, 2, String(authority.kingdomId), key("local", value)),
                        value,
                        authority.kingdomId,
                    );

                if (
                    !saved?.global
                    || !local
                    || now < local.finalizedAt + 3600000n
                    || (await read(tx, 2, String(authority.kingdomId), key("global", value)))
                        !== undefined
                )
                {
                    return;
                }

                const sorted = goldEggsSort(rows, saved.globalLimit);

                for (const row of sorted.filter((row) => row.kingdomId === authority.kingdomId))
                {
                    if (
                        !local.rows.some(
                            (owned) =>
                                owned.uid === row.uid
                                && owned.score === row.score
                                && owned.createdAt === row.createdAt,
                        )
                    )
                    {
                        throw new Error("Unverified owned global gold eggs score");
                    }
                }

                board(json({ ...value, finalizedAt: now, rows: sorted }), value);
                await save(
                    tx,
                    2,
                    String(authority.kingdomId),
                    key("global", value),
                    json({ ...value, finalizedAt: now, rows: sorted }),
                    now,
                );
                await receipt(tx, [`global:${goldEggsPeriodId(value)}`], now);
            });
        },
        pending()
        {
            return db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const headers = await page(tx, authority.kingdomId, pendingCursor);
                pendingCursor = headers.length === 8 ? headers.at(-1)!.key : undefined;
                const result: { owner: string; period: GoldEggsPeriod; global: boolean; }[] = [];

                for (const { value } of headers)
                {
                    for (const global of [false, true])
                    {
                        if (!value.admitted || (global && !value.global))
                        {
                            continue;
                        }

                        const mode = global ? "global" : "local",
                            frozen = board(
                                await read(tx, 2, String(authority.kingdomId), key(mode, value)),
                                value,
                                global ? undefined : authority.kingdomId,
                            );

                        if (!frozen)
                        {
                            continue;
                        }

                        const eligible = frozen.rows.filter(
                            (row, index) =>
                                row.kingdomId === authority.kingdomId
                                && (global ? value.globalPrizes : value.localPrizes).some(
                                    (prize) => index + 1 >= prize.first && index + 1 <= prize.last,
                                ),
                        );

                        if (!eligible.length)
                        {
                            continue;
                        }

                        const done = await tx
                            .select({ uid: trigger_var.uid })
                            .from(trigger_var)
                            .where(
                                and(
                                    eq(trigger_var.type, 1),
                                    eq(trigger_var.key, key(`award.${mode}`, value)),
                                    inArray(
                                        trigger_var.uid,
                                        eligible.map((row) => row.uid),
                                    ),
                                ),
                            );
                        const finished = new Set(done.map((row) => row.uid));

                        for (const row of eligible)
                        {
                            if (!finished.has(row.uid))
                            {
                                result.push({
                                    owner: row.uid,
                                    period: { start: value.start, end: value.end },
                                    global,
                                });
                            }
                        }
                    }
                }

                if (!result.length)
                {
                    return [];
                }

                const selected = [...result.slice(awardOffset), ...result.slice(0, awardOffset)]
                    .slice(
                        0,
                        32,
                    );
                awardOffset = (awardOffset + 32) % result.length;

                return selected;
            });
        },
    };
}

export function createGoldEggsRanks(
    realms: readonly { kingdomId: number; db: Realm; eligible: boolean | (() => boolean); }[],
    now = Date.now,
)
{
    if (
        !realms.length
        || realms.length > 2
        || new Set(realms.map((row) => row.kingdomId)).size !== realms.length
    )
    {
        throw new Error("Invalid gold eggs ranking realms");
    }

    const collect = async (value: GoldEggsPeriod, final: boolean) => {
        const rows: GoldEggsStanding[] = [];

        for (const realm of realms)
        {
            const eligible = typeof realm.eligible === "function"
                ? realm.eligible()
                : realm.eligible;
            const selected = await realm.db.transaction(
                async (tx) => {
                    const meta = await header(tx, realm.kingdomId, value);

                    if (!meta)
                    {
                        return final && eligible ? undefined : [];
                    }

                    if (!meta.global)
                    {
                        return [];
                    }

                    const frozen = board(
                        await read(tx, 2, String(realm.kingdomId), key("local", value)),
                        value,
                        realm.kingdomId,
                    );

                    if (final)
                    {
                        return frozen && frozen.finalizedAt + 3600000n <= BigInt(now())
                            ? frozen.rows
                            : undefined;
                    }

                    return (
                        frozen?.rows
                            ?? (meta.admitted
                                ? readGoldEggsRows(
                                    tx,
                                    realm.kingdomId,
                                    value,
                                    BigInt(now()),
                                    meta.localLimit,
                                )
                                : [])
                    );
                },
                { isolationLevel: "repeatable read", accessMode: "read only" },
            );

            if (selected === undefined)
            {
                return;
            }

            rows.push(...selected);
        }

        return goldEggsSort(rows);
    };

    return {
        live: async (value: GoldEggsPeriod) => (await collect(value, false)) ?? [],
        final: (value: GoldEggsPeriod) => collect(value, true),
    };
}
