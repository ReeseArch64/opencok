import { publicEquipment } from "@opencok/mappings/equipment-preview";
import { integer } from "@opencok/mappings/profile-values";
import { signed } from "@opencok/mappings/profile-values";
import { validateFields } from "@opencok/messages/validations/fields";
import {
    publicStatisticsSchema,
    publicMedalSchema,
    publicProfileBaseSchema,
} from "@opencok/player/validations/public-profile";
import { text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { playerStatistics } from "@opencok/mappings/power";
import type { PublicProfileState } from "@opencok/player/contracts/public-profile";
import type { Rules } from "@opencok/rules/game";
import type { RuleContext } from "@opencok/rules/availability";
import { publicProfileProgress, publicProfileSocial } from "../rules/public-profile.ts";

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
