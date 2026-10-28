import { CityCommandDomain } from "./city-command-domain.ts";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { encode, sfs, str, type Fields } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { localEventWindow } from "@opencok/rules/local-events";
import { alchemistInfo } from "@opencok/mappings/alchemist";
import { grantNativeProgressionReward, pinProgressionReward } from "./progression-rewards";
import type { CityDomain } from "./city-domain.ts";

export class AlchemistDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = ["alchemist"];

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = async (context, _command, params) => {
        if (!localEventWindow(context.rules.power.activityPanels?.get("57139"), context.now))
        {
            throw new GameError(errors.unsupported, "city_progression");
        }

        const rule = context.rules.items.get("alchemist"),
            action = str(params, "M__REQUEST_ID__H");

        if (!rule || !["info", "reward"].includes(action))
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        const row: Row = {
            uid: context.owner,
            type: 1,
            listen: 0,
            listentime: 0n,
            share: 0,
            sharetime: 0n,
            reward: 0,
            rewardtime: 0n,
            resettime: context.now,
            ...context.state.minstrel,
        };

        if (row.uid !== context.owner || num(row, "type") !== 1)
        {
            throw new GameError(errors.invalid, "city_progression");
        }

        if (long(row, "resettime") / 86400000n !== context.now / 86400000n)
        {
            Object.assign(row, { listen: 0, share: 0, reward: 0, resettime: context.now });
        }

        const body: Fields = {};

        if (action === "reward")
        {
            const interval = BigInt(cityInteger(num(row, "reward") === 0 ? rule.k2 : rule.k3))
                * 1000n;

            if (context.now - long(row, "rewardtime") < interval)
            {
                context.write.minstrel = row;

                return { response: encode({}), event: null };
            }

            if (num(row, "reward") >= cityInteger(rule.k1))
            {
                throw new GameError(errors.invalid, "city_progression");
            }

            body.rewards = sfs.array(
                grantNativeProgressionReward(context, pinProgressionReward(context, rule.k4 ?? "")),
            );
            row.reward = cityInteger(num(row, "reward") + 1);
            row.rewardtime = context.now;
        }

        context.write.minstrel = row;
        body.info = sfs.object(alchemistInfo(row, rule));

        return { response: encode(body), event: action === "info" ? null : undefined };
    };

    public readonly apply: CityDomain["apply"] = async () => {
        throw new GameError(errors.unsupported, "city_progression");
    };
}

export const alchemistDomain: CityDomain = new AlchemistDomain();
