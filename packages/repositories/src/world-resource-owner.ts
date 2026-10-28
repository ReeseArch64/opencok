import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { new_general_status } from "@opencok/drizzle/schema/opencok_kingdom/new_general_status";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { hero_office } from "@opencok/drizzle/schema/opencok_kingdom/hero_office";
import {
    profileColumns,
    buildingColumns,
    generalColumns,
    statusColumns,
    equipmentColumns,
    officeColumns,
} from "./world-resource-owner-columns";
import { readResourceNewGenerals } from "@opencok/hero/repositories/general-resource-owner";
import { nullableInteger } from "@opencok/repositories/world-resource-owner-values";
import { nullableText } from "@opencok/repositories/world-resource-owner-values";
import { rows } from "@opencok/repositories/world-resource-owner-values";
import { long } from "@opencok/repositories/world-resource-owner-values";
import { integer } from "@opencok/repositories/world-resource-owner-values";
import { text } from "@opencok/repositories/world-resource-owner-values";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";

import { asc, eq } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { readPlayerEffects } from "./power.ts";

type Reader = Pick<DatabaseClient<"kingdom">, "select">;

export async function readWorldResourceOwner(
    db: Reader,
    uid: string,
): Promise<WorldResourceOwnerSnapshot | undefined>
{
    if (!text(uid, 255) || !uid)
    {
        throw new Error("Invalid resource owner");
    }

    const profiles = await db
        .select(profileColumns)
        .from(userprofile)
        .where(eq(userprofile.uid, uid))
        .limit(2);

    if (profiles.length > 1)
    {
        throw new Error("Duplicate resource owner");
    }

    const profile = profiles[0];

    if (!profile)
    {
        return undefined;
    }

    if (
        profile.uid !== uid
        || !integer(profile.level)
        || !nullableInteger(profile.serverId)
        || !integer(profile.crossFightSrcServerId)
        || (profile.banTime !== null && !long(profile.banTime))
        || !nullableText(profile.appVersion, 40)
        || !nullableText(profile.allianceId, 40)
        || !nullableText(profile.pf, 40)
        || !nullableInteger(profile.civilizationType)
        || !nullableText(profile.decomposeSuitEffect, 100)
    )
    {
        throw new Error("Invalid resource owner profile");
    }

    const effects = await readPlayerEffects(db, profile, true);
    const buildings = await db
        .select(buildingColumns)
        .from(user_building)
        .where(eq(user_building.uid, uid))
        .orderBy(asc(user_building.uuid))
        .limit(4097);
    rows(
        buildings,
        uid,
        (row) => row.uuid as string,
        (row) =>
            text(row.uuid, 40)
            && row.uuid !== ""
            && integer(row.itemId)
            && integer(row.level)
            && nullableInteger(row.star),
    );
    const newGenerals = await readResourceNewGenerals(
        db,
        uid,
        profile.banTime === 9223372036854775807n,
    );

    return { effects, buildings, newGenerals };
}

export async function checkWorldResourceOwnerStore(db: Reader): Promise<void>
{
    await db.select(profileColumns).from(userprofile).limit(0);
    await db.select(buildingColumns).from(user_building).limit(0);
    await db.select(generalColumns).from(new_general).limit(0);
    await db.select(statusColumns).from(new_general_status).limit(0);
    await db.select(equipmentColumns).from(user_equip).limit(0);
    await db.select(officeColumns).from(hero_office).limit(0);
}
