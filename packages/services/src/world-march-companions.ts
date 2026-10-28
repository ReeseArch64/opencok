import { sfs, str, encode, decode, type Fields } from "@opencok/messages/sfs";
import { num, text, type Row } from "@opencok/contracts/rows";
import { decodeWorldMarchArmy, type SavedMarchArmy } from "@opencok/messages/world-resource-army";
import {
    dragonDefinition,
    dragonFeature,
    dragonJson,
    emptyDragonTravel,
} from "@opencok/rules/dragon-progression";
import { generalMarch, generalMarchReturn } from "@opencok/hero/rules/general-assignments";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { reconnectMarchDragon } from "@opencok/mappings/reconnect-marches";
import { reconnectMarchGeneral } from "@opencok/hero/mappings/reconnect-march-general";
import { ownedGeneral, writeGeneral, generalChanges } from "@opencok/hero/services/generals";
import type { CityProgressionContext } from "./city-progression-context.ts";

function dragonChange(context: CityProgressionContext, uuid: string, marching: boolean)
{
    const write = (context.write.worldMutation ??= {});
    const body = encode({ uuid: sfs.string(uuid), inMarch: sfs.byte(marching ? 1 : 0) });
    write.companionPushes = [
        ...(write.companionPushes ?? []).filter(
            (push) => str(decode(Buffer.from(push.body)), "uuid", "") !== uuid,
        ),
        { command: "push.petdragon.march", body },
    ];
}

export function selectMarchCompanions(
    context: CityProgressionContext,
    params: Fields,
    marches: readonly Row[],
)
{
    const dragonId = str(params, "petDragonUid", ""),
        generalId = str(params, "generalId", ""),
        heroId = str(params, "heroUid", "");

    if (
        [dragonId, generalId, heroId].some(
            (id) => id.length > 40 || id.includes("\0") || !id.isWellFormed(),
        )
    )
    {
        worldMutationFailure();
    }

    const armies = marches.map((row) =>
        row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null
    );

    if (armies.some((army) => army && army.owner !== context.owner))
    {
        worldMutationFailure();
    }

    let dragon: Row | undefined, general: Row | undefined;

    if (dragonId)
    {
        if (
            !dragonFeature(context.rules, "dragon_new", context.now)
            || !dragonFeature(context.rules, "dragon_battle", context.now)
        )
        {
            worldMutationFailure();
        }

        dragon = context.state.dragons?.dragons.find((row) => row.uuid === dragonId);

        if (
            !dragon
            || dragon.uid !== context.owner
            || num(dragon, "dragonState") !== 3
            || num(dragon, "lv") < cityInteger(context.rules.items.get("dragon_new")?.k6, 1)
            || dragonJson(dragon.travelData, emptyDragonTravel).travelState === 1
            || armies.some((army) => army?.dragons?.some((row) => row.uuid === dragonId))
        )
        {
            worldMutationFailure();
        }

        dragonDefinition(context.rules, dragon);
    }

    if (generalId.trim())
    {
        const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
            id = cityInteger(generalId, 1);

        if (
            String(id) !== generalId
            || !dragonFeature(context.rules, "general_battle", context.now)
            || num(castle ?? {}, "level") + num(castle ?? {}, "star")
                < cityInteger(context.rules.items.get("general")?.k1, 1)
            || armies.some((army) => army?.general?.id === id)
        )
        {
            worldMutationFailure();
        }

        general = generalMarch(context.rules, ownedGeneral(context, id));
    }

    return { dragon, general };
}

export function attachMarchCompanions(
    context: CityProgressionContext,
    army: SavedMarchArmy,
    selected: ReturnType<typeof selectMarchCompanions>,
)
{
    const { dragon, general } = selected;

    if (dragon)
    {
        army.dragons = [
            {
                owner: context.owner,
                uuid: text(dragon, "uuid"),
                itemId: num(dragon, "itemId"),
                level: num(dragon, "lv"),
            },
        ];
        dragonChange(context, text(dragon, "uuid"), true);
    }

    if (general)
    {
        army.general = {
            owner: context.owner,
            id: num(general, "id"),
            level: num(general, "level"),
        };
        writeGeneral(context, general);
    }
}

export function releaseMarchCompanions(context: CityProgressionContext, row: Row)
{
    const army = row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null;

    if (!army || army.owner !== context.owner)
    {
        worldMutationFailure();
    }

    for (const dragon of army.dragons ?? [])
    {
        if (dragon.owner !== context.owner)
        {
            worldMutationFailure();
        }

        if (context.state.dragons?.dragons.some((row) => row.uuid === dragon.uuid))
        {
            dragonChange(context, dragon.uuid!, false);
        }
    }

    if (army.general)
    {
        if (army.general.owner !== context.owner)
        {
            worldMutationFailure();
        }

        const general = context.write.generalRoster?.generals?.find((row) =>
            row.id === army.general!.id
        )
            ?? context.state.generalRoster?.generals.find((row) => row.id === army.general!.id);

        if (general && num(general, "state") === 3)
        {
            writeGeneral(context, generalMarchReturn(general));
        }
    }
}

export function marchCompanionFields(
    context: CityProgressionContext,
    army: SavedMarchArmy | null,
): Fields
{
    const saved = army?.dragons?.[0],
        dragon = saved
            ? context.state.dragons?.dragons.find(
                (row) => row.uuid === saved.uuid && row.uid === context.owner,
            )
            : undefined;
    const petDragon = dragon ? reconnectMarchDragon(dragon, context.rules) : undefined;
    const general = army?.general
        ? reconnectMarchGeneral(
            army.general,
            context.state.generalRoster?.skills ?? [],
            context.now,
        )
        : undefined;

    return {
        ...(petDragon ? { petDragon: sfs.object(petDragon) } : {}),
        dragonList: sfs.array(petDragon ? [sfs.object(petDragon)] : []),
        generalList: sfs.array(general ? [sfs.object(general)] : []),
    };
}

export function marchCompanionPushes(context: CityProgressionContext)
{
    const pushes = [...(context.write.worldMutation?.companionPushes ?? [])];

    if (context.write.generalRoster?.generals?.length)
    {
        pushes.push({
            command: "push.general.info",
            body: encode(generalChanges(context, context.write.generalRoster.generals)),
        });
    }

    return pushes;
}
