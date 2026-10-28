import type {
    WorldPointDetailSnapshot,
    WorldSpecialDetailSnapshot,
} from "@opencok/contracts/world-point-detail";
import type { GameServices } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
import { javaDecimal } from "@opencok/rules/java-integer";
import { resourceRemaining } from "@opencok/rules/world-resource-detail";
import { mailBlank } from "@opencok/rules/mail";
import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { territorySoldierCapacity } from "./world-territory-capacity.ts";

const territoryTypes = [14, 18, 20, 21, 23, 46, 47];

function int(value: unknown): number
{
    if (value == null)
    {
        return 0;
    }

    if (
        typeof value !== "number"
        || !Number.isInteger(value)
        || value < -2147483648
        || value > 2147483647
    )
    {
        throw new Error("Invalid specialized world integer");
    }

    return value;
}

function long(value: unknown, sentinel = false): bigint
{
    if (value == null)
    {
        return 0n;
    }

    if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value)
    {
        throw new Error("Invalid specialized world time");
    }

    return sentinel && value === 9223372036854775807n ? 0n : value;
}

function text(value: unknown): string
{
    if (value == null)
    {
        return "";
    }

    if (
        typeof value !== "string"
        || value.length > 32767
        || !value.isWellFormed()
        || value.includes("\0")
    )
    {
        throw new Error("Invalid specialized world text");
    }

    return value;
}

function picture(profile: Row | undefined): Fields
{
    return {
        pic: sfs.string(text(profile?.pic)),
        picVer: sfs.int(int(profile?.picVer)),
        picfraId: sfs.int(int(profile?.picfraId)),
    };
}

function realState(point: Row, row: Row, marches: readonly Row[], rules: Rules): number
{
    const occupied = !mailBlank(text(point.ownerId));
    const active = row.active === 1;
    const stat = int(row.stat);

    if (stat < 0 || stat > 10)
    {
        throw new Error("Unknown territory state");
    }

    let value = 0;

    if (stat === 0 || stat === 1)
    {
        value = stat === 1 && occupied ? 0 : 1;
    }
    else if (stat === 2)
    {
        value = occupied ? (active ? 5 : 0) : active ? 4 : 1;
    }
    else if (stat === 3)
    {
        value = occupied ? 2 : 3;
    }
    else if (stat === 10)
    {
        value = occupied && marches.length ? 0 : 1;
    }
    else if (stat === 4)
    {
        value = occupied ? 6 : 1;

        if (!occupied && active)
        {
            const category = new Map([
                [14, 0],
                [23, 1],
                [21, 2],
                [46, 4],
                [47, 5],
            ]).get(int(row.type));
            const config = category === undefined
                ? undefined
                : rules.world.allianceBuildings?.find(
                    (entry) =>
                        entry.type !== undefined
                        && entry.level !== undefined
                        && Number(javaDecimal(entry.type, 32)) === category
                        && Number(javaDecimal(entry.level, 32))
                            === (int(row.level) <= 0 ? 1 : (int(row.level) + 1) | 0),
                );
            value = !config || Number(javaDecimal(config.building_value, 32)) > int(row.curDef)
                ? 4
                : 1;
        }
    }

    if ([21, 23].includes(int(row.type)))
    {
        value = value === 4 ? 1 : value === 5 ? 0 : value;
    }

    return value;
}

function bossFields(state: WorldSpecialDetailSnapshot, observer: string): Fields
{
    const row = state.boss;

    if (!row || row.status === 0 || row.status === 3)
    {
        return {};
    }

    const ranks = [...state.ranks].sort((a, b) => (int(b.score) - int(a.score)) | 0);
    const index = ranks.findIndex((rank) => rank.uid === observer);
    const reward = row.status === 2
        && ((row.reward === 1 && row.killuser === observer)
            || (index >= 0 && index < 999 && ranks[index]!.reward === 1));
    const data: Fields = {};

    for (const key of ["point", "level", "maxhp", "hp"])
    {
        data[key] = sfs.int(int(row[key]));
    }

    data.id = sfs.int(int(row.bossid));
    data.type = { type: Type.Byte, value: int(row.type) };
    data.hurt = sfs.int(0);
    data.starttime = sfs.long(long(row.starttime));
    data.endtime = sfs.long(long(row.endtime));
    data.state = { type: Type.Short, value: int(row.status) };
    data.firerange = sfs.int(row.status === 1 ? int(row.firerange) : 0);
    data.firespeed = sfs.int(row.status === 1 ? int(row.firespeed) : 0);
    data.reward = sfs.int(reward ? 1 : 0);

    return { data: sfs.object(data) };
}

export async function specialWorldFields(
    snapshot: WorldPointDetailSnapshot,
    observer: string,
    rules: Rules,
    now: number,
    services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
): Promise<Fields>
{
    const point = snapshot.point!;
    const type = int(point.pointType);

    if (!territoryTypes.includes(type) && (snapshot.remote || ![49, 50].includes(type)))
    {
        return {};
    }

    const state = snapshot.special;

    if (!state)
    {
        throw new Error("Missing specialized world snapshot");
    }

    if ([49, 50].includes(type))
    {
        return mailBlank(text(point.ownerId)) && mailBlank(text(point.ownerName))
            ? bossFields(state, observer)
            : {};
    }

    const output: Fields = {};

    if (type === 46 && !snapshot.remote)
    {
        output.flag = sfs.string(text(state.observerBanner));
    }

    const row = state.territory;

    if (!row)
    {
        return output;
    }

    if (row.pointId !== point.id || row.atWorldId !== point.worldId || row.type !== type)
    {
        throw new Error("Foreign territory projection");
    }

    const body: Fields = {
        uid: sfs.string(text(row.uid)),
        allianceId: sfs.string(text(row.allianceId)),
        allianceName: sfs.string(text(row.allianceName)),
    };

    for (const key of ["pointId", "type", "resType"])
    {
        if (row[key] != null)
        {
            body[key] = sfs.int(int(row[key]));
        }
    }

    for (const key of ["allianceAbbr", "name", "pic"])
    {
        if (!mailBlank(text(row[key])))
        {
            body[key] = sfs.string(text(row[key]));
        }
    }

    if (row.flag != null)
    {
        body.flag = sfs.string(text(row.flag));
    }

    body.level = sfs.int(int(row.level) <= 0 ? 1 : (int(row.level) + 1) | 0);
    const speed = row.buildingSpd ?? 0;

    if (typeof speed !== "number" || !Number.isFinite(speed))
    {
        throw new Error("Invalid territory building speed");
    }

    body.buildingSpd = sfs.double(speed);
    body.active = sfs.int(int(row.active));

    for (const key of ["activateTime", "updateTime", "startTime"])
    {
        body[key] = sfs.long(long(row[key], true));
    }

    body.lastUpdateTime = sfs.long(long(row.lastUpdateTime));
    body.curDef = sfs.int(int(row.curDef));
    body.maxDef = sfs.int(int(row.maxDef));
    body.count = sfs.int(int(row.num));

    if (type === 46)
    {
        body.banner = sfs.string(text(state.banner));
    }

    const occupied = !mailBlank(text(point.ownerId));

    if (type === 21 && row.active === 1)
    {
        const kills: Value[] = [];

        for (const entry of state.kills)
        {
            const raw = decodeLegacyJsonObject(entry.content);
            const dead: Fields = {};
            let visible = true;

            for (const [key, value] of Object.entries(raw))
            {
                if (value.type !== Type.Int)
                {
                    throw new Error("Invalid turret casualty count");
                }

                if (key !== "deadPower")
                {
                    if ((value.value as number) <= 0)
                    {
                        visible = false;
                        break;
                    }

                    dead[key] = value;
                }
            }

            if (visible)
            {
                kills.push(
                    sfs.object({
                        uid: sfs.string(entry.uid),
                        name: sfs.string(text(entry.profile?.name)),
                        ...picture(entry.profile),
                        dead: sfs.object(dead),
                    }),
                );
            }
        }

        body.kill = sfs.array(kills);
    }
    else if (occupied)
    {
        if (state.ownerProfile && state.ownerProfile.uid !== point.ownerId)
        {
            throw new Error("Foreign territory owner profile");
        }

        const allianceId = state.ownerProfile?.allianceId ?? point.allianceId;
        const owner: Fields = {
            uid: sfs.string(text(point.ownerId)),
            name: sfs.string(text(state.ownerProfile?.name)),
            allianceId: sfs.string(text(allianceId)),
        };

        if (state.ownerProfile)
        {
            Object.assign(owner, picture(state.ownerProfile));
        }

        if (state.ownerAlliance && !mailBlank(text(state.ownerAlliance.abbr)))
        {
            owner.abbr = sfs.string(text(state.ownerAlliance.abbr));
        }

        if (state.team)
        {
            owner.team = sfs.bool(true);
        }

        body.owner = sfs.object(owner);
    }

    body.stat = sfs.int(realState(point, row, state.marches, rules));

    if (type === 18)
    {
        const remaining = resourceRemaining(int(point.resInitValue), int(point.resCostValue));
        body.q = sfs.int(Math.min(remaining, 0));
        body.tq = sfs.int(remaining);
        output.q = body.q;
        output.tq = body.tq;
    }

    if (type === 23)
    {
        body.resourceList = sfs.array(
            state.resources.map(({ row: resource, profile }) => {
                if (resource.uid !== profile.uid || resource.allianceId !== row.allianceId)
                {
                    throw new Error("Foreign warehouse resource");
                }

                const item: Fields = {
                    uid: sfs.string(text(resource.uid)),
                    allianceId: sfs.string(text(resource.allianceId)),
                    name: sfs.string(text(profile.name)),
                    ...picture(profile),
                };

                for (const key of ["wood", "stone", "iron", "food"])
                {
                    item[key] = sfs.long(long(resource[key]) < 0n ? 0n : long(resource[key]));
                }

                item.silver = sfs.long(long(resource.silver));
                item.lastUpdateTime = sfs.long(long(resource.lastUpdateTime));

                return sfs.object(item);
            }),
        );
    }

    output.territory = sfs.object(body);
    let soldiers = 0,
        capacity = 0;

    for (const march of state.marches)
    {
        if (march.targetId !== point.id || march.worldId !== point.worldId || march.state !== 1)
        {
            throw new Error("Foreign territory defense");
        }

        if (!snapshot.remote && march.ownerUid === observer)
        {
            output.marchUuid = sfs.string(text(march.uuid));
        }

        if (occupied && [14, 20, 21, 46, 47].includes(type))
        {
            if (type !== 21 && !mailBlank(text(point.ownerMarchUUid)))
            {
                output.ownerMarchUuid = sfs.string(text(point.ownerMarchUUid));
            }

            if (!Buffer.isBuffer(march.armyInfo))
            {
                throw new Error("Missing territory defense army");
            }

            const army = decodeWorldResourceArmy(march.armyInfo);

            if (!army || army.owner !== march.ownerUid || !army.soldiers)
            {
                throw new Error("Foreign territory defense army");
            }

            for (const soldier of army.soldiers)
            {
                soldiers = (soldiers + ((soldier.total - soldier.dead) | 0)) | 0;
            }

            if (march.ownerUid === point.ownerId)
            {
                if (!state.ownerEffects || state.ownerEffects.effects.profile.uid !== point.ownerId)
                {
                    throw new Error("Missing territory owner capacity");
                }

                capacity = await territorySoldierCapacity(
                    state.ownerEffects,
                    rules,
                    snapshot.kingdomId,
                    now,
                    services,
                );
            }
        }
    }

    if ([14, 20, 21, 46, 47].includes(type))
    {
        output.alreadySoldier = sfs.int(soldiers);
        output.maxSoldier = sfs.int(capacity);
    }

    if (!snapshot.remote && [14, 46, 47].includes(type))
    {
        Object.assign(output, {
            speed: body.buildingSpd,
            maxDef: body.maxDef,
            curDef: body.curDef,
            stat: body.stat,
            updateTime: body.updateTime,
            startTime: body.startTime,
        });
    }

    return output;
}
