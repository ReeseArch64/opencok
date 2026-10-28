import { and, asc, eq, sql } from "drizzle-orm";
import { question_match } from "@opencok/drizzle/schema/opencok_kingdom/question_match";
import { user_olympic_bet } from "@opencok/drizzle/schema/opencok_kingdom/user_olympic_bet";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { reconcileOlympicQuestions } from "@opencok/rules/olympic";
import { text, type Row } from "@opencok/contracts/rows";
import type { OlympicState, OlympicWrite } from "@opencok/contracts/olympic";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";
import type { MutationTransaction } from "./mutation";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export async function readOlympic(tx: MutationTransaction, owner: string): Promise<OlympicState>
{
    await tx.execute(sql`set local lock_timeout='1s'`);
    await tx.execute(sql`select pg_advisory_xact_lock(728219,1)`);
    const questions = await tx
            .select()
            .from(question_match)
            .orderBy(asc(question_match.id))
            .limit(1025)
            .for("update"),
        bets = await tx
            .select()
            .from(user_olympic_bet)
            .where(eq(user_olympic_bet.uid, owner))
            .orderBy(asc(user_olympic_bet.uuid))
            .limit(4097)
            .for("update");

    if (questions.length > 1024 || bets.length > 4096)
    {
        throw new Error("Olympic aggregate exceeds bound");
    }

    return {
        questions,
        bets,
        async winningStake(id, result)
        {
            const [sum] = await tx
                .select({ total: sql<string>`coalesce(sum(${user_olympic_bet.betNum}),0)::text` })
                .from(user_olympic_bet)
                .where(
                    and(
                        eq(user_olympic_bet.questionId, id),
                        eq(user_olympic_bet.betCountry, result),
                    ),
                );

            return cityAmount(sum?.total ?? 0);
        },
    };
}

export async function writeOlympic(tx: MutationTransaction, owner: string, write: OlympicWrite)
{
    if ((write.questions?.length ?? 0) > 1024 || (write.bets?.length ?? 0) > 4096)
    {
        throw new Error("Olympic write exceeds bound");
    }

    for (const row of write.questions ?? [])
    {
        const id = text(row, "id"),
            result = text(row, "result"),
            value = {
                id,
                result,
                startBetTime: cityAmount(row.startBetTime),
                startTime: cityAmount(row.startTime),
                ended: cityInteger(row.ended, 0, 1),
                betNum: cityAmount(row.betNum),
                winningBetNum: row.winningBetNum === null ? null : cityAmount(row.winningBetNum),
                rewardPool: row.rewardPool === null ? null : cityAmount(row.rewardPool),
                tax: row.tax === null ? null : cityInteger(row.tax, 0, 50),
                rewardLimit: row.rewardLimit === null ? null : cityInteger(row.rewardLimit),
            };

        if (!id || id.length > 40 || result.length > 10 || value.startBetTime >= value.startTime)
        {
            throw new Error("Invalid Olympic question write");
        }

        await tx
            .insert(question_match)
            .values(value)
            .onConflictDoUpdate({ target: question_match.id, set: value });
    }

    for (const row of write.bets ?? [])
    {
        const uuid = text(row, "uuid"),
            questionId = text(row, "questionId"),
            betCountry = text(row, "betCountry"),
            result = text(row, "result");

        if (
            row.uid !== owner
            || !uuid
            || uuid.length > 40
            || !questionId
            || questionId.length > 40
            || !betCountry
            || betCountry.length > 10
            || result.length > 10
        )
        {
            throw new Error("Invalid Olympic bet owner");
        }

        const type = cityInteger(row.resourceType, 0, 5);

        if (type === 4)
        {
            throw new Error("Invalid Olympic resource");
        }

        const [saved] = await tx
            .select({ uid: user_olympic_bet.uid })
            .from(user_olympic_bet)
            .where(eq(user_olympic_bet.uuid, uuid));

        if (saved && saved.uid !== owner)
        {
            throw new Error("Foreign Olympic bet");
        }

        const value = {
            uuid,
            uid: owner,
            questionId,
            resourceType: type,
            betNum: cityInteger(row.betNum, 1),
            betCountry,
            result,
            ended: cityInteger(row.ended, 0, 1),
            rewarded: cityInteger(row.rewarded, 0, 1),
            reward: cityInteger(row.reward),
        };
        await tx
            .insert(user_olympic_bet)
            .values(value)
            .onConflictDoUpdate({ target: user_olympic_bet.uuid, set: value });
    }
}

export function createOlympicScheduleStore(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
)
{
    return {
        async reconcile(definitions: readonly Row[], enabled: boolean, now: bigint)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const state = await readOlympic(tx, "");
                await writeOlympic(tx, "", {
                    questions: await reconcileOlympicQuestions(
                        state.questions,
                        definitions,
                        enabled,
                        now,
                        state.winningStake,
                    ),
                });
            });
        },
    };
}

export async function pendingOlympicSettlements(db: DatabaseClient<"kingdom">, after?: string)
{
    return db
        .select({
            owner: user_olympic_bet.uid,
            ids: sql<
                string[]
            >`(array_agg(${user_olympic_bet.uuid} order by ${user_olympic_bet.uuid}))[1:64]`,
        })
        .from(user_olympic_bet)
        .innerJoin(question_match, eq(question_match.id, user_olympic_bet.questionId))
        .where(
            and(
                eq(user_olympic_bet.rewarded, 0),
                eq(question_match.ended, 1),
                after ? sql`${user_olympic_bet.uid}>${after}` : undefined,
            ),
        )
        .groupBy(user_olympic_bet.uid)
        .orderBy(asc(user_olympic_bet.uid))
        .limit(64);
}
