import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { asc, eq } from "drizzle-orm";
import { text, num, long, type Row } from "@opencok/contracts/rows";

type TroopsTransaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export class TroopsRepository
{
    public constructor(private readonly tx: TroopsTransaction, private readonly owner: string)
    {}

    public async readArmies()
    {
        const { tx, owner } = this;

        return tx
            .select()
            .from(user_army)
            .where(eq(user_army.uid, owner))
            .orderBy(asc(user_army.armyId))
            .limit(1025);
    }

    public async writeArmiesValidated(rows: readonly Row[])
    {
        const { tx, owner } = this;

        for (const row of rows)
        {
            const value = {
                uid: owner,
                armyId: text(row, "armyId"),
                level: num(row, "level"),
                free: num(row, "free"),
                pve: num(row, "pve"),
                march: num(row, "march"),
                defence: num(row, "defence"),
                train: num(row, "train"),
                finishTime: long(row, "finishTime"),
                foodCostTime: long(row, "foodCostTime"),
            };
            await tx
                .insert(user_army)
                .values(value)
                .onConflictDoUpdate({
                    target: [user_army.uid, user_army.armyId],
                    set: value,
                });
        }
    }

    public async readHospital()
    {
        const { tx, owner } = this;

        return tx
            .select()
            .from(user_hospital)
            .where(eq(user_hospital.uid, owner))
            .orderBy(asc(user_hospital.armyId))
            .limit(1025);
    }

    public async writeHospitalValidated(rows: readonly Row[])
    {
        const { tx, owner } = this;

        for (const row of rows)
        {
            const value = {
                uid: owner,
                armyId: text(row, "armyId"),
                dead: num(row, "dead"),
                heal: num(row, "heal"),
                finishTime: long(row, "finishTime"),
            };
            await tx
                .insert(user_hospital)
                .values(value)
                .onConflictDoUpdate({
                    target: [user_hospital.uid, user_hospital.armyId],
                    set: value,
                });
        }
    }

    public async readForts()
    {
        const { tx, owner } = this;

        return tx
            .select()
            .from(user_wall)
            .where(eq(user_wall.uid, owner))
            .orderBy(asc(user_wall.armyId))
            .limit(1025);
    }

    public async writeFortsValidated(rows: readonly Row[])
    {
        const { tx, owner } = this;

        for (const row of rows)
        {
            const value = {
                uid: owner,
                armyId: text(row, "armyId"),
                num: num(row, "num"),
                build: num(row, "build"),
                level: num(row, "level"),
                finishTime: long(row, "finishTime"),
            };
            await tx
                .insert(user_wall)
                .values(value)
                .onConflictDoUpdate({
                    target: [user_wall.uid, user_wall.armyId],
                    set: value,
                });
        }
    }
}
