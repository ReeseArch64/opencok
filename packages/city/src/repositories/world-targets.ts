import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { and, asc, eq, inArray } from "drizzle-orm";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import type { CityPersistenceSession } from "../contracts/persistence-session";

export class CityWorldTargets
{
    public constructor(private readonly session: CityPersistenceSession)
    {}

    public readonly birthPoint: NonNullable<CityProgressionStore["birthPoint"]> = async (
        rules,
        mode,
    ) => {
        const session = this.session;
        const { tx, owner, birth } = session;

        if (!birth)
        {
            throw new Error("Missing world birth authority");
        }

        if (mode !== "random")
        {
            const [existing] = await tx
                .select({ id: worldpoint.id })
                .from(worldpoint)
                .where(
                    and(
                        eq(worldpoint.worldId, 0),
                        eq(worldpoint.ownerId, owner),
                        eq(worldpoint.pointType, 1),
                    ),
                )
                .limit(1)
                .for("update");

            if (existing)
            {
                throw new Error("Resident city already exists");
            }
        }

        return birth(rules, mode);
    };

    public readonly treasurePoints: NonNullable<CityProgressionStore["treasurePoints"]> = async (
        ids,
    ) => {
        const session = this.session;
        const { tx, mapSize } = session;

        if (
            ids.length > 4096
            || ids.some((id) => !Number.isInteger(id) || id < 1 || id > mapSize * mapSize)
        )
        {
            throw new Error("Invalid treasure target query");
        }

        if (!ids.length)
        {
            return [];
        }

        return tx
            .select()
            .from(worldpoint)
            .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, [...ids])))
            .orderBy(asc(worldpoint.id))
            .for("update");
    };
}
