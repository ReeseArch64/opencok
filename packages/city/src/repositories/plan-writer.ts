import { activity_minstrel } from "@opencok/drizzle/schema/opencok_kingdom/activity_minstrel";
import { user_civilization_science } from "@opencok/drizzle/schema/opencok_kingdom/user_civilization_science";
import { and, eq, inArray } from "drizzle-orm";
import { user_science } from "@opencok/drizzle/schema/opencok_kingdom/user_science";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import { num, long } from "@opencok/contracts/rows";
import type { CityPersistenceSession } from "../contracts/persistence-session";
import { validateCityWrite } from "../validations/write";
import { CityMechanicWriter } from "./mechanic-writer";
import { CityAggregateWriter } from "./aggregate-writer";

export class CityPlanWriter
{
    private readonly mechanics: CityMechanicWriter;
    private readonly aggregate: CityAggregateWriter;

    public constructor(private readonly session: CityPersistenceSession)
    {
        this.mechanics = new CityMechanicWriter(session);
        this.aggregate = new CityAggregateWriter(session);
    }

    public readonly update: CityProgressionStore["update"] = async (write, economy) => {
        const session = this.session;
        const { tx, owner, now, boundary } = session;
        validateCityWrite(write, owner);
        const persist = async () => {
            for (const row of write.civilizationSciences ?? [])
            {
                if (row.userID !== owner)
                {
                    throw new Error("Foreign civilization science write");
                }

                const value = {
                    userID: owner,
                    baseItemID: num(row, "baseItemID"),
                    level: num(row, "level"),
                };
                await tx
                    .insert(user_civilization_science)
                    .values(value)
                    .onConflictDoUpdate({
                        target: [
                            user_civilization_science.baseItemID,
                            user_civilization_science.userID,
                        ],
                        set: { level: value.level },
                    });
            }

            if (write.minstrel)
            {
                const row = write.minstrel;

                if (row.uid !== owner || ![0, 1].includes(num(row, "type")))
                {
                    throw new Error("Foreign minstrel write");
                }

                const value = {
                    uid: owner,
                    type: num(row, "type"),
                    listen: num(row, "listen"),
                    listentime: long(row, "listentime"),
                    share: num(row, "share"),
                    sharetime: long(row, "sharetime"),
                    reward: num(row, "reward"),
                    rewardtime: long(row, "rewardtime"),
                    resettime: long(row, "resettime"),
                };
                await tx
                    .insert(activity_minstrel)
                    .values(value)
                    .onConflictDoUpdate({
                        target: [activity_minstrel.uid, activity_minstrel.type],
                        set: value,
                    });
            }

            await this.mechanics.persist(write);
            await this.aggregate.persist(write);
        };
        const scienceBefore = write.sciences?.length
            ? await tx
                .select({ itemId: user_science.itemId, level: user_science.level })
                .from(user_science)
                .where(eq(user_science.uid, owner))
            : [];
        const changedScience = write.sciences?.some(
            (row) =>
                num(row, "level")
                    !== (scienceBefore.find((before) => before.itemId === row.itemId)?.level
                        ?? 0),
        );

        if (
            write.luckyDay
            || write.generalRoster
            || write.equipment?.length
            || write.deletedEquipment?.length
            || write.equipmentSelection !== undefined
            || write.vip
            || write.states?.length
            || write.deletedStates?.length
            || write.generals?.length
            || write.buildings?.length
            || changedScience
            || write.civilizationSciences?.length
            || write.dragons
            || write.profile
            || write.deletedBuildings?.length
        )
        {
            await boundary(tx, owner, now, persist, write.deletedBuildings ?? [], economy);
        }
        else
        {
            await persist();
        }

        if (write.deletedBuildings?.length)
        {
            await tx
                .delete(building_production)
                .where(
                    and(
                        eq(building_production.ownerId, owner),
                        inArray(building_production.buildingId, [...write.deletedBuildings]),
                    ),
                );
        }
    };
}
