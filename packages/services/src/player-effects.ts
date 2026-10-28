import { prepareLegacyGeneral } from "@opencok/hero/services/legacy-general";

import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { vipMutation, temporaryEffect } from "@opencok/rules/player-effects";
import { vipState, temporaryState } from "@opencok/mappings/player-effects";

import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

const commands = [
    "effects.init",
    "effect.item",
    "skill.save",
    "skill.clear",
    "skill.switch",
    "skill",
    "skill.use",
    "skill.del",
    "status.remove",
    "show.status.item",
    "collect.svip.switch",
];

const invalid = () => {
    throw new GameError(errors.locked, "city_progression");
};

export function applyProgressionStatus(context: CityProgressionContext, id: string, count = 1)
{
    const plan = temporaryEffect(
        context.state.effects.states,
        context.rules,
        context.owner,
        id,
        context.now,
        count,
        randomInt,
    );
    context.write.states = plan.states;
    context.write.deletedStates = plan.deleted;
    const state = plan.states[0];

    if (!state)
    {
        return {};
    }

    const declaration = context.rules.power.statuses?.get(String(state.stateId));
    const effects = declaration?.random === "1"
        ? [[num(state, "ranEffId"), num(state, "ranEffValue")]]
        : (declaration?.effect ?? "")
            .split("|")
            .filter(Boolean)
            .map((pair) => pair.split(";").map(Number));
    const body: Fields = {
        effectState: sfs.object({
            [String(state.stateId)]: sfs.long(
                long(state, "endTime") === 9223372036854775807n
                    ? 2147000000000n
                    : long(state, "endTime"),
            ),
            startTime: sfs.long(long(state, "startTime")),
        }),
        statusId: sfs.int(num(state, "stateId")),
        endTime: sfs.long(long(state, "endTime")),
        status: sfs.array(
            effects.map(([id, value]) =>
                sfs.object({
                    effNum: sfs.int(id!),
                    effVal: sfs.int(value!),
                    stateId: sfs.int(num(state, "stateId")),
                })
            ),
        ),
    };

    if (plan.deleted[0] !== undefined)
    {
        body.oldStatus = sfs.string(String(plan.deleted[0]));
    }

    return body;
}

async function prepare(context: CityProgressionContext, command: string, params: Fields)
{
    let body: Fields = {};

    if (command === "effects.init")
    {
        const previous = context.state.effects.vip;
        const last = long(previous ?? {}, "lastLoginTime") / 86400000n,
            today = context.now / 86400000n;

        if ((!previous || last < today) && num(previous ?? {}, "sLevel") <= 0)
        {
            const config = context.rules.items.get("vip");
            const days = last === today - 1n ? num(previous ?? {}, "loginDays") : 0;
            const score = days + 1 >= Number(config?.k3)
                ? Number(config?.k4)
                : Number(config?.k1 ?? 100) + Number(config?.k2 ?? 20) * days;
            const row = vipMutation(
                previous ?? { level: 0 },
                context.rules,
                context.owner,
                context.now,
                110,
                score
                    + (long(previous ?? {}, "vipEndTime") > context.now
                        ? Number(config?.k5 ?? 0)
                        : 0),
            );
            row.loginDays = days + 1;
            row.lastLoginTime = context.now;
            context.write.vip = row;
        }

        context.write.deletedStates = context.state.effects.states
            .filter((row) => long(row, "endTime") <= context.now)
            .map((row) => num(row, "stateId"));
        body.vip = sfs.object(vipState(context.write.vip ?? previous ?? {}));
    }
    else if (command === "effect.item")
    {
        const id = str(params, "itemId"),
            count = cityInteger(int(params, "count"), 1),
            rule = context.rules.goods.get(id);

        if (!rule)
        {
            invalid();
        }

        if (rule!.type === "4")
        {
            body = applyProgressionStatus(context, rule!.para1!, count);
        }
        else if (rule!.type === "3" && ["70", "110", "249", "250"].includes(rule!.para1 ?? ""))
        {
            context.write.vip = vipMutation(
                context.state.effects.vip,
                context.rules,
                context.owner,
                context.now,
                Number(rule!.para1),
                cityInteger(cityInteger(rule!.para2) * count),
            );
            body = { vip: sfs.object(vipState(context.write.vip)) };
        }
        else
        {
            invalid();
        }
    }
    else if (command === "collect.svip.switch")
    {
        const value = int(params, "switch");

        if (![0, 1].includes(value) || !context.state.effects.vip)
        {
            invalid();
        }

        context.write.vip = { ...context.state.effects.vip!, vip_switch: value };
        body.switch = sfs.int(value);
    }
    else if (command === "status.remove")
    {
        const id = int(params, "statusId"),
            row = context.state.effects.states.find((row) => num(row, "stateId") === id);

        if (!row)
        {
            throw new GameError(errors.missing, "city_progression");
        }

        const rule = context.rules.power.statuses?.get(String(id));

        if (
            ![
                "100",
                "104",
                "105",
                "106",
                "108",
                "109",
                "110",
                "200",
                "202",
                "115",
                "123",
                "116",
            ].includes(rule?.type2 ?? "")
        )
        {
            invalid();
        }

        context.write.deletedStates = [id];
    }
    else if (command === "show.status.item")
    {
        body.statusItems = sfs.array(
            context.state.effects.states
                .filter(
                    (row) =>
                        long(row, "startTime") <= context.now && long(row, "endTime") > context.now,
                )
                .map((row) => sfs.object(temporaryState(row))),
        );
    }
    else
    {
        return prepareLegacyGeneral(context, command, params, applyProgressionStatus);
    }

    return { response: encode(body), event: null };
}

export class PlayerEffectsDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = commands;

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = prepare;

    public readonly apply: CityDomain["apply"] = async () => {
        throw new GameError(errors.invalid, "city_progression");
    };
}

export const playerEffectsDomain: CityDomain = new PlayerEffectsDomain();
