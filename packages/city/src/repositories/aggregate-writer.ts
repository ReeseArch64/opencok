import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { and, eq, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_building_exp } from "@opencok/drizzle/schema/opencok_kingdom/user_building_exp";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import { text, num, long } from "@opencok/contracts/rows";
import type { CityPersistenceSession } from "../contracts/persistence-session";

export class CityAggregateWriter
{
    public constructor(private readonly session: CityPersistenceSession)
    {}

    public readonly persist = async (write: CityProgressionWrite) => {
        const session = this.session;
        const { tx, owner, now, writers } = session;
        for (const row of write.buildings ?? [])
        {
            const value = {
                uuid: text(row, "uuid"),
                uid: owner,
                itemId: num(row, "itemId"),
                pos: num(row, "pos"),
                level: num(row, "level"),
                opType: num(row, "opType"),
                star: num(row, "star"),
                progress: num(row, "progress"),
                reward: num(row, "reward"),
                refreshTime: long(row, "refreshTime"),
                updateTime: long(row, "updateTime"),
                effectTime: long(row, "effectTime"),
                putId: text(row, "putId"),
                unlockFlag: num(row, "unlockFlag"),
                costUnlockTimes: num(row, "costUnlockTimes"),
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

        for (const row of write.skills ?? [])
        {
            if (row.ownerId !== owner || !/^6[0-9]{5}$/.test(text(row, "skillId")))
            {
                throw new Error("Invalid research skill owner");
            }

            const value = {
                uuid: text(row, "uuid"),
                ownerId: owner,
                skillId: text(row, "skillId"),
                stat: num(row, "stat"),
                startTime: long(row, "startTime"),
                endTime: long(row, "endTime"),
                actTime: long(row, "actTime"),
                param1: num(row, "param1"),
                param2: num(row, "param2"),
            };
            const [existing] = await tx
                .select({ ownerId: user_skill.ownerId })
                .from(user_skill)
                .where(eq(user_skill.uuid, value.uuid));

            if (existing && existing.ownerId !== owner)
            {
                throw new Error("Foreign research skill");
            }

            await tx
                .insert(user_skill)
                .values(value)
                .onConflictDoUpdate({
                    target: user_skill.uuid,
                    set: value,
                    setWhere: eq(user_skill.ownerId, owner),
                });
        }

        for (const row of write.sciences ?? [])
        {
            const value = {
                uid: owner,
                itemId: text(row, "itemId"),
                level: num(row, "level"),
                cd: long(row, "cd"),
            };
            await tx
                .insert(user_science)
                .values(value)
                .onConflictDoUpdate({
                    target: [user_science.uid, user_science.itemId],
                    set: value,
                });
        }

        for (const row of write.armies ?? [])
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

        for (const row of write.hospital ?? [])
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

        for (const row of write.forts ?? [])
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

        for (const row of write.queues ?? [])
        {
            if (text(row, "ownerId") !== owner)
            {
                throw new Error("Foreign queue");
            }

            const [existing] = await tx
                .select({ uuid: queue.uuid })
                .from(queue)
                .where(
                    and(
                        eq(queue.ownerId, owner),
                        eq(queue.type, num(row, "type")),
                        eq(queue.qid, 1),
                    ),
                );

            if (!existing)
            {
                await tx.insert(queue).values({
                    uuid: text(row, "uuid"),
                    ownerId: owner,
                    qid: 1,
                    type: num(row, "type"),
                    itemId: "",
                    startTime: long(row, "startTime"),
                    endTime: long(row, "endTime"),
                    updateTime: long(row, "updateTime"),
                    totalTime: 0n,
                    isHelped: 0,
                    para: 0,
                });
            }
        }

        if (write.profile)
        {
            await tx.update(userprofile).set(write.profile).where(
                eq(userprofile.uid, owner),
            );

            if (write.legacyGeneralLevel !== undefined)
            {
                await tx
                    .update(user_general)
                    .set({ level: write.legacyGeneralLevel })
                    .where(eq(user_general.uid, owner));
            }
        }

        if (write.generalRoster)
        {
            await writers.writeGeneralRoster(tx, owner, write.generalRoster, now);
        }

        if (write.statistics)
        {
            await tx
                .insert(playerinfo)
                .values({ uid: owner, ...write.statistics })
                .onConflictDoUpdate({ target: playerinfo.uid, set: write.statistics });
        }

        if (write.buildingExperience)
        {
            await tx
                .insert(user_building_exp)
                .values({ uid: owner, ...write.buildingExperience })
                .onConflictDoUpdate({
                    target: user_building_exp.uid,
                    set: write.buildingExperience,
                });
        }

        if (write.deletedBuildings?.length)
        {
            await tx
                .update(new_general)
                .set({ buildingUuid: "", state: 1 })
                .where(
                    and(
                        eq(new_general.uid, owner),
                        eq(new_general.state, 2),
                        inArray(new_general.buildingUuid, [...write.deletedBuildings]),
                    ),
                );
            await tx
                .delete(user_building)
                .where(
                    and(
                        eq(user_building.uid, owner),
                        inArray(user_building.uuid, [...write.deletedBuildings]),
                    ),
                );
        }
    };
}
