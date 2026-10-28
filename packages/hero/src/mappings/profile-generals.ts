import { integer } from "@opencok/mappings/profile-values";
import { signed } from "@opencok/mappings/profile-values";
import { validateFields } from "@opencok/mappings/validation";
import {
    generalInfoSchema,
    publicGeneralsSchema,
} from "@opencok/hero/validations/profile-generals";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

import type { GeneralPreview } from "@opencok/hero/contracts/profile-generals";

function serializePublicGenerals(generals: readonly GeneralPreview[]): Fields
{
    if (!generals.length)
    {
        throw new GameError(errors.unsupported, "public_profile");
    }

    return {
        skillPoint: sfs.int(generals[0]!.plusSkillPoint),
        userGenerals: sfs.array(generals.map((general) => sfs.object(generalInfo(general)))),
    };
}

function serializeGeneralInfo(general: Omit<GeneralPreview, "plusSkillPoint">): Fields
{
    return {
        uuid: sfs.string(general.uuid),
        generalId: sfs.string(general.generalId),
        level: sfs.int(general.level),
        status: sfs.int(general.status),
        att: sfs.int(general.attack),
        defence: sfs.int(general.defence),
        ability: sfs.array(
            general.ability.map((tree) =>
                sfs.object(
                    Object.fromEntries(
                        Object.entries(tree).map(([key, value]) => [
                            key,
                            value === null
                                ? sfs.null()
                                : typeof value === "string"
                                ? sfs.string(value)
                                : sfs.int(value),
                        ]),
                    ),
                )
            ),
        ),
        skill: sfs.array(
            general.skills.map((row) =>
                sfs.object({
                    uuid: sfs.string(text(row, "uuid")),
                    ownerId: sfs.string(text(row, "ownerId")),
                    skillId: sfs.string(text(row, "skillId")),
                    startTime: sfs.long(signed(row.startTime, 64)),
                    endTime: sfs.long(signed(row.endTime, 64)),
                    actTime: sfs.long(signed(row.actTime, 64)),
                    stat: sfs.int(integer(row, "stat")),
                    param1: sfs.int(integer(row, "param1")),
                    param2: sfs.int(integer(row, "param2")),
                })
            ),
        ),
    };
}

export function publicGenerals(...args: Parameters<typeof serializePublicGenerals>): Fields
{
    return validateFields(publicGeneralsSchema, serializePublicGenerals(...args));
}

export function generalInfo(...args: Parameters<typeof serializeGeneralInfo>): Fields
{
    return validateFields(generalInfoSchema, serializeGeneralInfo(...args));
}
