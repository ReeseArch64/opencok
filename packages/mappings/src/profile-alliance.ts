import { validateFields } from "./validation.ts";
import {
    allianceVideoSchema,
    publicAllianceInfoSchema,
    allianceStringFields as strings,
    allianceIntegerFields as integers,
    allianceLongFields as longs,
} from "@opencok/validations/profile-alliance";

import type { PublicAllianceState } from "@opencok/contracts/profile";
import { text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { publicAllianceProgress } from "@opencok/rules/profile";

function signed(value: unknown, bits: 8 | 32 | 64): bigint
{
    if (
        (typeof value === "number" && !Number.isSafeInteger(value))
        || !/^[+-]?\d+$/.test(String(value))
    )
    {
        throw new GameError(errors.unsupported, "public_profile");
    }

    const parsed = BigInt(String(value));

    if (BigInt.asIntN(bits, parsed) !== parsed)
    {
        throw new GameError(errors.unsupported, "public_profile");
    }

    return parsed;
}

function serializeAllianceVideo(row: Row): Fields
{
    const fields: Fields = {};

    for (
        const [wire, column] of [
            ["allianceid", "allianceId"],
            ["videoURL", "vedioURL"],
            ["thumbnailURL", "thumbnailURL"],
        ]
    )
    {
        if (typeof row[column!] !== "string")
        {
            throw new GameError(errors.unsupported, "public_profile");
        }

        fields[wire!] = sfs.string(text(row, column!));
    }

    for (
        const [wire, column] of [
            ["videoH", "vedioH"],
            ["videoW", "vedioW"],
            ["videoSize", "vedioSize"],
            ["videoLength", "vedioLength"],
        ]
    )
    {
        fields[wire!] = sfs.int(Number(signed(row[column!], 32)));
    }

    fields.checksign = sfs.byte(Number(signed(row.checkSign, 8)));

    return fields;
}

function serializePublicAllianceInfo(
    state: PublicAllianceState,
    rules: Rules,
    remote: boolean,
    permissions: ReadonlyMap<string, number> | undefined,
): Fields
{
    const progress = publicAllianceProgress(state, rules);
    const fields: Fields = {};

    for (const key of strings)
    {
        if (state.alliance[key] !== null && state.alliance[key] !== undefined)
        {
            fields[key] = sfs.string(text(state.alliance, key));
        }
    }

    for (const key of integers)
    {
        if (state.alliance[key] !== null && state.alliance[key] !== undefined)
        {
            fields[key] = sfs.int(Number(signed(state.alliance[key], 32)));
        }
    }

    for (const key of longs)
    {
        if (state.alliance[key] !== null && state.alliance[key] !== undefined)
        {
            fields[key] = sfs.long(signed(state.alliance[key], 64));
        }
    }

    for (const key of ["currentlevel", "nextlevel", "fightpower"] as const)
    {
        const value = progress[key];

        if (value !== undefined)
        {
            fields[key] = remote ? sfs.long(BigInt.asIntN(64, value)) : sfs.double(Number(value));
        }
    }

    fields.member = sfs.long(progress.member);

    if (progress.maxMember !== undefined)
    {
        fields.maxMember = sfs.int(progress.maxMember);
    }

    fields.learderUid = sfs.string(text(state.leader, "uid"));

    if (state.leader.name !== null && state.leader.name !== undefined)
    {
        fields.learderName = sfs.string(text(state.leader, "name"));
    }

    if (permissions !== undefined)
    {
        fields.permission = sfs.object(
            Object.fromEntries(
                [...permissions].map(([key, value]) => [key, sfs.int(Number(signed(value, 32)))]),
            ),
        );
    }

    if (state.video)
    {
        if (text(state.video, "allianceId") !== text(state.alliance, "uid"))
        {
            throw new GameError(errors.unsupported, "public_profile");
        }

        fields.allianceVideo = sfs.object(allianceVideo(state.video));
    }

    return { alliance: sfs.object(fields) };
}

export function allianceVideo(...args: Parameters<typeof serializeAllianceVideo>): Fields
{
    return validateFields(allianceVideoSchema, serializeAllianceVideo(...args));
}

export function publicAllianceInfo(
    ...args: Parameters<typeof serializePublicAllianceInfo>
): Fields
{
    return validateFields(publicAllianceInfoSchema, serializePublicAllianceInfo(...args));
}
