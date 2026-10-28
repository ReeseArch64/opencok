import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_building_exp } from "@opencok/drizzle/schema/opencok_kingdom/user_building_exp";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { UpdateBuildingDto } from "../dtos/update-building.dto";
import type { UpdateBuildingExperienceDto } from "../dtos/update-building-experience.dto";

type BuildingTransaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export class BuildingRepository
{
    public constructor(private readonly tx: BuildingTransaction, private readonly owner: string)
    {}

    public async readExperience()
    {
        const { tx, owner } = this;

        return tx
            .select()
            .from(user_building_exp)
            .where(eq(user_building_exp.uid, owner));
    }

    public async read()
    {
        const { tx, owner } = this;

        return tx
            .select()
            .from(user_building)
            .where(eq(user_building.uid, owner))
            .orderBy(asc(user_building.uuid))
            .limit(257);
    }

    public async write(input: UpdateBuildingDto)
    {
        const { tx, owner } = this;

        const value = {
            uuid: input.uuid,
            uid: owner,
            itemId: input.itemId,
            pos: input.pos,
            level: input.level,
            opType: input.opType,
            star: input.star,
            progress: input.progress,
            reward: input.reward,
            refreshTime: input.refreshTime,
            updateTime: input.updateTime,
            effectTime: input.effectTime,
            putId: input.putId,
            unlockFlag: input.unlockFlag,
            costUnlockTimes: input.costUnlockTimes,
        };
        const [existing] = await tx
            .select({ uid: user_building.uid })
            .from(user_building)
            .where(eq(user_building.uuid, value.uuid));

        if (existing && existing.uid !== owner)
        {
            throw new Error("Foreign building");
        }

        await tx
            .insert(user_building)
            .values(value)
            .onConflictDoUpdate({
                target: user_building.uuid,
                set: value,
                setWhere: eq(user_building.uid, owner),
            });
    }

    public async writeExperience(input: UpdateBuildingExperienceDto)
    {
        const { tx, owner } = this;

        await tx
            .insert(user_building_exp)
            .values({ uid: owner, ...input })
            .onConflictDoUpdate({
                target: user_building_exp.uid,
                set: input,
            });
    }

    public async delete(ids: readonly string[])
    {
        const { tx, owner } = this;

        await tx
            .delete(user_building)
            .where(
                and(
                    eq(user_building.uid, owner),
                    inArray(user_building.uuid, [...ids]),
                ),
            );
    }
}
