import { asc, eq } from "drizzle-orm";
import { lottery_record } from "@opencok/drizzle/schema/opencok_kingdom/lottery_record";
import { user_lottery } from "@opencok/drizzle/schema/opencok_kingdom/user_lottery";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readLottery(tx: MutationTransaction, owner: string)
{
    const [record] = await tx
        .select()
        .from(lottery_record)
        .where(eq(lottery_record.uid, owner))
        .for("update");
    const history = await tx
        .select()
        .from(user_lottery)
        .where(eq(user_lottery.uid, owner))
        .orderBy(asc(user_lottery.lotteryId))
        .limit(1025);

    if (history.length > 1024)
    {
        throw new Error("Lottery history bound exceeded");
    }

    return { record, history };
}

export async function writeLottery(
    tx: MutationTransaction,
    owner: string,
    write: { record: Row; history?: readonly Row[]; },
)
{
    const row = write.record;

    if (
        row.uid !== owner
        || ![1, 2].includes(num(row, "type"))
        || ![0, 1].includes(num(row, "superMode"))
    )
    {
        throw new Error("Foreign lottery record");
    }

    for (const key of ["step", "times1", "times2", "multiple", "times3", "times4", "boxTimes"])
    {
        if (!Number.isInteger(num(row, key)) || num(row, key) < 0 || num(row, key) > 2147483647)
        {
            throw new Error("Invalid lottery counter");
        }
    }

    for (
        const [key, limit] of [
            ["result", 100],
            ["lotteryId", 40],
            ["lotteryInfo1", 200],
            ["lotteryInfo2", 100],
        ] as const
    )
    {
        if (text(row, key).length > limit)
        {
            throw new Error("Invalid lottery projection");
        }
    }

    const value = {
        uid: owner,
        type: num(row, "type"),
        superMode: num(row, "superMode"),
        step: num(row, "step"),
        times1: num(row, "times1"),
        times2: num(row, "times2"),
        multiple: num(row, "multiple"),
        result: text(row, "result"),
        lotteryId: text(row, "lotteryId"),
        lotteryInfo1: text(row, "lotteryInfo1"),
        lotteryInfo2: text(row, "lotteryInfo2"),
        updateTime: long(row, "updateTime"),
        times3: num(row, "times3"),
        times4: num(row, "times4"),
        boxTimes: num(row, "boxTimes"),
    };
    await tx
        .insert(lottery_record)
        .values(value)
        .onConflictDoUpdate({ target: lottery_record.uid, set: value });

    for (const entry of write.history ?? [])
    {
        if (entry.uid !== owner)
        {
            throw new Error("Foreign lottery history");
        }

        const next = {
            uid: owner,
            lotteryId: text(entry, "lotteryId"),
            times: num(entry, "times"),
            updateTime: long(entry, "updateTime"),
        };
        await tx
            .insert(user_lottery)
            .values(next)
            .onConflictDoUpdate({ target: [user_lottery.uid, user_lottery.lotteryId], set: next });
    }
}
