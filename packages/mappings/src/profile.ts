import { integer } from "@opencok/mappings/profile-values";
import { signed } from "@opencok/mappings/profile-values";
import { validateFields } from "@opencok/messages/validations/fields";
import {
    publicStatisticsSchema,
    publicMedalSchema,
    publicEquipmentSchema,
    publicProfileBaseSchema,
} from "@opencok/validations/profile";
import { text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { playerStatistics } from "./power.ts";
import type { PublicProfileState } from "@opencok/contracts/profile";
import type { Rules } from "@opencok/rules/game";
import type { RuleContext } from "@opencok/rules/availability";
import { publicProfileProgress, publicProfileSocial } from "@opencok/rules/profile";

function serializePublicStatistics(statistics: Row | undefined): Fields
{
    if (!statistics)
    {
        return {};
    }

    return {
        ...playerStatistics(statistics),
        power: sfs.long(signed(statistics.power, 64)),
    };
}

function serializePublicMedal(row: Row): Fields
{
    return { id: sfs.string(text(row, "id")), level: sfs.int(integer(row, "level")) };
}

function serializePublicProfileBase(
    state: PublicProfileState,
    rules: Rules,
    context: RuleContext,
    lastUpdateTime: string,
    profileKingdomId = context.kingdomId,
): Fields
{
    if (!state.profile || !state.lord)
    {
        throw new GameError(errors.unsupported, "public_profile");
    }

    const progress = publicProfileProgress(state, rules, context, profileKingdomId);
    const social = publicProfileSocial(state, profileKingdomId);
    const fields: Fields = {
        ...publicStatistics(state.statistics),
        score: sfs.int(integer(state.vip ?? {}, "score")),
        medal: sfs.string(text(state.lord, "medal")),
        medalList: sfs.array(state.honors.map((row) => sfs.object(publicMedal(row)))),
        equip: sfs.array(
            state.equipment.map((row) =>
                sfs.object(publicEquipment(row, progress.equipmentStrengthen))
            ),
        ),
        showEquip: sfs.bool(integer(state.mixed ?? {}, "showEquip") === 1),
        showMedal: sfs.bool(integer(state.mixed ?? {}, "showMedal") === 1),
        showMarchSoldier: sfs.bool(integer(state.mixed ?? {}, "marchSoldierShow") === 1),
        achieveNum: { type: Type.Float, value: progress.achieveNum },
        serverId: sfs.int(profileKingdomId),
        serverName: sfs.string(progress.serverName),
        lastUpdateTime: sfs.string(lastUpdateTime),
        flowerVal: sfs.int(social.flowerVal),
    };

    if (social.officer !== undefined)
    {
        fields.officer = sfs.string(social.officer);
    }

    for (const key of ["uid", "name", "pic"])
    {
        fields[key] = sfs.string(text(state.profile, key));
    }

    for (const key of ["level", "exp", "picVer", "picfraId", "gmFlag"])
    {
        fields[key] = sfs.int(integer(state.profile, key));
    }

    for (const key of ["maxExp", "vip", "vipEndTime", "armedLevel", "market"] as const)
    {
        fields[key] = sfs.int(progress[key]);
    }

    return fields;
}

function serializePublicEquipment(row: Row, strengthen: boolean): Fields
{
    const fields: Fields = {
        uuid: sfs.string(text(row, "uuid")),
        itemId: sfs.string(String(integer(row, "itemId"))),
        on: sfs.int(integer(row, "on")),
        extraProperty: sfs.string(text(row, "extraProperty")),
        refineProperty: sfs.string(text(row, "refineProperty")),
        reforgeCount: sfs.int(integer(row, "reforgeCount")),
    };

    if (strengthen)
    {
        fields.strength_level = sfs.int(integer(row, "strengthLevel"));
        fields.suit_effect = sfs.string("2-2910#4-774#6-756#8-68#10-69");
        fields.suit_value = sfs.string("2-6.5536#4-6.5536#6-655.36#8-13.1072#10-13.1072");
        fields.suit_value_type = sfs.string("2-0#4-0#6-0#8-1#10-1");
        fields.suit_value_sign = sfs.string("2-2#4-2#6-2#8-1#10-1");

        for (const key of ["Buff", "buff", "buff_str", "buff_Str", "buffStr", "BuffStr"])
        {
            fields[key] = sfs.string("50");
        }
    }

    if (row.lockProperty !== null && row.lockProperty !== undefined)
    {
        const raw = text(row, "lockProperty");
        const segments = raw.split("|");

        if (raw)
        {
            while (segments.at(-1) === "")
            {
                segments.pop();
            }
        }

        let locks = "";

        for (const segment of segments)
        {
            const parts = segment.split(",");

            while (parts.at(-1) === "" && parts.length > 1)
            {
                parts.pop();
            }

            if (parts.length < 2)
            {
                throw new GameError(errors.unsupported, "public_profile");
            }

            if (parts[1] === "1")
            {
                locks += (locks ? "|" : "") + parts[0]!;
            }
        }

        fields.lockProperty = sfs.string(locks);
    }

    return fields;
}

export function publicStatistics(...args: Parameters<typeof serializePublicStatistics>): Fields
{
    return validateFields(publicStatisticsSchema, serializePublicStatistics(...args));
}

export function publicMedal(...args: Parameters<typeof serializePublicMedal>): Fields
{
    return validateFields(publicMedalSchema, serializePublicMedal(...args));
}

export function publicProfileBase(...args: Parameters<typeof serializePublicProfileBase>): Fields
{
    return validateFields(publicProfileBaseSchema, serializePublicProfileBase(...args));
}

export function publicEquipment(...args: Parameters<typeof serializePublicEquipment>): Fields
{
    return validateFields(publicEquipmentSchema, serializePublicEquipment(...args));
}
