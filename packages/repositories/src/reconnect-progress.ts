import { alliance_science_upgrade } from "@opencok/drizzle/schema/opencok_kingdom/alliance_science_upgrade";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { and, asc, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { user_glory_info } from "@opencok/drizzle/schema/opencok_kingdom/user_glory_info";
import { user_weakness_building } from "@opencok/drizzle/schema/opencok_kingdom/user_weakness_building";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { user_knight_title } from "@opencok/drizzle/schema/opencok_kingdom/user_knight_title";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import type { ReconnectProgressState } from "@opencok/contracts/reconnect";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { readPlayerEffects } from "./power.ts";
import { readResourceNewGenerals } from "@opencok/hero/repositories/general-resource-owner";
import { readReconnectMarches } from "./reconnect-marches.ts";

type Transaction = Parameters<Parameters<DatabaseClient<"kingdom">["transaction"]>[0]>[0];

export async function readReconnectProgress(
    tx: Transaction,
    uid: string,
    kingdomId: number,
    now: bigint,
): Promise<ReconnectProgressState>
{
    if (!uid.trim() || uid.length > 40 || !uid.isWellFormed() || uid.includes("\0"))
    {
        throw new GameError(errors.invalid);
    }

    const profile = (
        await tx
            .select({
                uid: userprofile.uid,
                serverId: userprofile.serverId,
                banFlag: userprofile.banFlag,
                banTime: userprofile.banTime,
                gold: userprofile.gold,
                paidGold: userprofile.paidGold,
                paidSpecialGold: userprofile.paidSpecialGold,
                dmmGold: userprofile.dmmGold,
                dmmPaidGold: userprofile.dmmPaidGold,
                dmmPaidSpecialGold: userprofile.dmmPaidSpecialGold,
                level: userprofile.level,
                pf: userprofile.pf,
                allianceId: userprofile.allianceId,
                decomposeSuitEffect: userprofile.decomposesuiteffect,
                civilizationType: userprofile.civilizationType,
                openedPos: userprofile.openedPos,
                payTotal: userprofile.payTotal,
                appVersion: userprofile.appVersion,
                name: userprofile.name,
                exp: userprofile.exp,
                deviceUuid: userprofile.deviceUuid,
                country: userprofile.country,
                skillMaterial: userprofile.skillMaterial,
                allianceBuildScore: userprofile.allianceBuildScore,
                civilizationSorce: userprofile.civilizationSorce,
                payTotalDollar: userprofile.payTotalDollar,
                pic: userprofile.pic,
                guideStep: userprofile.guideStep,
                chNameCount: userprofile.chNameCount,
                picVer: userprofile.picVer,
                picfraId: userprofile.picfraId,
                gmFlag: userprofile.gmFlag,
                crossFightSrcServerId: userprofile.crossFightSrcServerId,
                crystal: userprofile.crystal,
                crystalGold: userprofile.crystalGold,
                regTime: userprofile.regTime,
                neutralScore: userprofile.neutralScore,
                csmodBalance: userprofile.csmodBalance,
            })
            .from(userprofile)
            .where(eq(userprofile.uid, uid))
            .limit(1)
            .for("update")
    )[0];

    if (!profile)
    {
        throw new GameError(errors.missing);
    }

    if (
        profile.uid !== uid
        || profile.serverId !== kingdomId
        || (profile.banFlag ?? 0) !== 0
        || (profile.banTime ?? 0n) > now
    )
    {
        throw new GameError(errors.invalid);
    }

    const resource = (
        await tx.select().from(user_resource).where(eq(user_resource.uid, uid)).limit(1).for(
            "update",
        )
    )[0];

    if (!resource)
    {
        throw new GameError(errors.missing);
    }

    if (resource.uid !== uid)
    {
        throw new GameError(errors.invalid);
    }

    const world = (
        await tx
            .select({
                uid: user_world.uid,
                worldId: user_world.worldId,
                pointId: user_world.pointId,
                cityDefValue: worldpoint.cityDefValue,
                gridType: worldpoint.gridType,
                fireTime: worldpoint.fireTime,
                lastCityDefTime: user_world.lastCityDefTime,
                attMonsterStamina: user_world.attMonsterStamina,
                lastStaminaTime: user_world.lastStaminaTime,
                resSearchCount: user_world.resSearchCount,
            })
            .from(user_world)
            .innerJoin(
                worldpoint,
                and(
                    eq(worldpoint.id, user_world.pointId),
                    eq(worldpoint.worldId, user_world.worldId),
                ),
            )
            .where(eq(user_world.uid, uid))
            .limit(1)
    )[0];

    if (world && world.uid !== uid)
    {
        throw new GameError(errors.invalid);
    }

    const effects = await readPlayerEffects(tx, profile, true);
    const newGenerals = await readResourceNewGenerals(tx, uid, false);
    const marches = await readReconnectMarches(tx, uid);
    const armies = await tx
        .select()
        .from(user_army)
        .where(eq(user_army.uid, uid))
        .orderBy(asc(user_army.armyId))
        .limit(32768);
    const generals = await tx
        .select({
            uuid: user_general.uuid,
            generalId: user_general.generalId,
            level: user_general.level,
            status: user_general.status,
            ability: user_general.ability,
            abilityIndex: user_general.abilityIndex,
        })
        .from(user_general)
        .where(eq(user_general.uid, uid))
        .orderBy(asc(user_general.uuid))
        .limit(32768);
    const skills = await tx
        .select()
        .from(user_skill)
        .where(eq(user_skill.ownerId, uid))
        .orderBy(asc(user_skill.endTime), asc(user_skill.uuid))
        .limit(32768);
    const buildings = await tx
        .select()
        .from(user_building)
        .where(eq(user_building.uid, uid))
        .orderBy(asc(user_building.uuid))
        .limit(32768);
    const equipment = await tx
        .select({
            uuid: user_equip.uuid,
            itemId: user_equip.itemId,
            cost: user_equip.cost,
            on: user_equip.on,
        })
        .from(user_equip)
        .where(eq(user_equip.uid, uid))
        .orderBy(asc(user_equip.uuid))
        .limit(32768);
    const queues = await tx
        .select()
        .from(queue)
        .where(eq(queue.ownerId, uid))
        .orderBy(asc(queue.uuid))
        .limit(32768);
    const tasks = await tx
        .select()
        .from(user_task)
        .where(eq(user_task.uid, uid))
        .orderBy(asc(user_task.id))
        .limit(32768);
    const playerInfo = (
        await tx.select().from(playerinfo).where(eq(playerinfo.uid, uid)).limit(1)
    )[0];
    const registrations = await tx
        .select({ platform: stat_reg.pf, type: stat_reg.type })
        .from(stat_reg)
        .where(eq(stat_reg.uid, uid))
        .orderBy(asc(stat_reg.type))
        .limit(32768);
    const registration = registrations.find((row) => row.type === 2) ?? registrations[0];
    const civilizationCastle = (
        await tx
            .select({ status: civilization_castle.status })
            .from(civilization_castle)
            .where(eq(civilization_castle.uid, uid))
            .limit(1)
    )[0];
    const glory = (
        await tx.select().from(user_glory_info).where(eq(user_glory_info.uid, uid)).limit(1)
    )[0];
    const weakness = await tx
        .select()
        .from(user_weakness_building)
        .where(eq(user_weakness_building.uid, uid))
        .orderBy(asc(user_weakness_building.armyId))
        .limit(32768);
    const hospital = await tx
        .select()
        .from(user_hospital)
        .where(eq(user_hospital.uid, uid))
        .orderBy(asc(user_hospital.armyId))
        .limit(1025);

    if (hospital.length > 1024)
    {
        throw new Error("Hospital aggregate exceeds bound");
    }

    const walls = await tx
        .select()
        .from(user_wall)
        .where(eq(user_wall.uid, uid))
        .orderBy(asc(user_wall.armyId))
        .limit(32768);
    const knight = (
        await tx.select().from(user_knight_title).where(eq(user_knight_title.uid, uid)).limit(1)
    )[0];
    const items = await tx
        .select()
        .from(user_item)
        .where(eq(user_item.ownerId, uid))
        .orderBy(asc(user_item.itemId))
        .limit(32768);

    if (
        [
            armies,
            generals,
            skills,
            buildings,
            equipment,
            queues,
            tasks,
            weakness,
            registrations,
            walls,
            items,
        ].some((rows) => rows.length > 32767)
    )
    {
        throw new GameError(errors.unsupported, "reconnect");
    }

    return {
        allianceResearch: profile.allianceId
            ? await tx
                .select()
                .from(alliance_science_upgrade)
                .where(eq(alliance_science_upgrade.allianceId, profile.allianceId))
            : [],
        profile,
        world,
        newGenerals,
        marches,
        resource,
        effects,
        armies,
        generals,
        skills,
        buildings,
        equipment,
        queues,
        tasks,
        playerInfo,
        registrationPlatform: registration?.platform ?? null,
        civilizationCastle,
        glory,
        weakness,
        hospital,
        walls,
        knight,
        items,
    };
}
