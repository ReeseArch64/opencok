import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt, createHash } from "node:crypto";
import { sfs, encode, decode, str } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { ComebackActivity } from "@opencok/contracts/comeback";
import type { InventoryState } from "@opencok/contracts/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import {
    comebackFailure,
    comebackEnabled,
    comebackEnrollment,
    comebackRecord,
    comebackActiveChannels,
    comebackChannels,
    comebackDeviceId,
    comebackDaily,
    comebackPayNodes,
    comebackClaims,
} from "@opencok/rules/comeback";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { previewRewards } from "@opencok/rules/rewards";
import { comebackInfoView, comebackRewardView } from "@opencok/mappings/comeback";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { createInventoryPlanner, type InventoryEffects } from "@opencok/services/inventory-runtime";
import { activityEconomy } from "@opencok/economy/services/activity-economy";
import type { ActivityEconomy } from "@opencok/economy/contracts/activity-economy";
import type { PreparedActivity } from "@opencok/contracts/timed-activity";
import type { Rules } from "@opencok/rules/game";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function rewards(context: CityProgressionContext, id: string)
{
    const rule = context.rules.advanced.payRewards?.get(id);

    if (!rule)
    {
        comebackFailure();
    }

    const result = previewRewards(
        id,
        context.rules,
        { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
        randomInt,
        rule,
    );

    if (result.length > 64)
    {
        comebackFailure();
    }

    return result;
}

function enroll(context: CityProgressionContext)
{
    const state = context.state.comeback;

    if (!state)
    {
        comebackFailure();
    }

    const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
    const selected = comebackEnrollment(
        context.rules,
        state,
        context.state.profile,
        num(castle ?? {}, "level"),
        context.now,
    );

    if (!selected)
    {
        return comebackRecord(state);
    }

    const { config, type } = selected;

    if (state.records.some((row) => row.configId === config.id))
    {
        comebackFailure();
    }

    const record: Row = {
        uid: context.owner,
        deviceId: comebackDeviceId(context.state.profile),
        configId: config.id!,
        backType: type,
        backTime: context.now,
        backReward: 0,
        dailyReward: "",
        payReward: "",
        payTotal: cityAmount(context.state.profile.payTotal ?? 0),
    };
    context.write.comeback = { record, clearBackFlags: type === 3 || type === 4 };

    if (config.mail && config.mail !== "0")
    {
        const template = context.rules.mail.get(config.mail),
            contents = javaMailBytes(template?.message);

        if (!template || !contents)
        {
            comebackFailure();
        }

        context.write.comeback.mail = {
            uid: createHash("sha256")
                .update(`comeback:${context.owner}:${config.id}`)
                .digest("hex")
                .slice(0, 32) + "00",
            owner: context.owner,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: null,
            rewardStatus: 1,
            reply: 0,
            createTime: context.now,
        };
    }

    return record;
}

function activities(
    context: CityProgressionContext,
    record: Row,
    config: import("@opencok/rules/game").Rule,
): ComebackActivity[]
{
    const day = Number(context.now / 86400000n - long(record, "backTime") / 86400000n) + 1;
    const daily = new Set(comebackClaims(record.dailyReward, 30)),
        paid = new Set(comebackClaims(record.payReward, 100));
    const currentPay = long(context.state.profile, "payTotal") - long(record, "payTotal");

    return comebackActiveChannels(config, record, context.now).map((channel): ComebackActivity => {
        const endTime = channel.end / 1000n;

        if (channel.type === 1)
        {
            return {
                type: 1,
                endTime,
                claimed: num(record, "backReward") > 0,
                ...(config.reward_back !== "0"
                    ? { rewards: rewards(context, config.reward_back!) }
                    : {}),
            };
        }

        if (channel.type === 2)
        {
            return {
                type: 2,
                endTime,
                daily: comebackDaily(config).map((row) => ({
                    day: row.day,
                    state: day < row.day ? 0 : daily.has(row.day) ? 2 : 1,
                    rewards: rewards(context, row.reward),
                })),
            };
        }

        return {
            type: 3,
            endTime,
            currentPay,
            payments: comebackPayNodes(config).map((row) => ({
                pay: String(row.pay),
                state: currentPay < BigInt(row.pay) ? 0 : paid.has(row.pay) ? 2 : 1,
                rewards: rewards(context, row.reward),
            })),
        };
    });
}

export class ComebackDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = [
        "comeback.init",
        "comeback.info",
        "comeback.reward",
    ];

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
        const state = context.state.comeback;

        if (!state)
        {
            comebackFailure();
        }

        const active = comebackEnabled(context.rules, context.now)
            && num(context.state.profile, "crossFightSrcServerId") <= 0;

        if (!active)
        {
            if (command === "comeback.reward")
            {
                comebackFailure();
            }

            return {
                response: encode(command === "comeback.info" ? comebackInfoView([]) : {}),
                event: null,
            };
        }

        const current = command === "comeback.reward" ? comebackRecord(state) : enroll(context);
        const config = current
            ? context.rules.advanced.comebacks?.get(text(current, "configId"))
            : undefined;

        if (
            !current
            || !config
            || long(current, "backTime") <= 0n
            || long(current, "backTime") > context.now
        )
        {
            if (command === "comeback.reward")
            {
                comebackFailure();
            }

            return {
                response: encode(command === "comeback.info" ? comebackInfoView([]) : {}),
                event: null,
            };
        }

        if (command === "comeback.init")
        {
            const show = comebackActiveChannels(config, current, context.now).length > 0
                && config.popup === "1"
                && (state.viewedAt === 0n
                    || state.viewedAt / 86400000n !== context.now / 86400000n);

            return { response: encode(show ? { login_popup: sfs.int(57083) } : {}), event: null };
        }

        if (command === "comeback.info")
        {
            const rows = activities(context, current, config);

            if (rows.length)
            {
                context.write.comeback = { ...context.write.comeback, viewedAt: context.now };
            }

            return { response: encode(comebackInfoView(rows)), event: null };
        }

        const type = cityInteger(str(params, "type"), 1, 3),
            param = str(params, "param");
        const channel = comebackChannels(config).find((channel) => channel.type === type);

        if (!channel || context.now > long(current, "backTime") + BigInt(channel.days) * 86400000n)
        {
            comebackFailure();
        }

        const record = { ...current };
        let id: string;

        if (type === 1)
        {
            if (num(record, "backReward") > 0 || !config.reward_back || config.reward_back === "0")
            {
                comebackFailure();
            }

            record.backReward = 1;
            id = config.reward_back;
        }
        else if (type === 2)
        {
            const day = cityInteger(param, 1, 365),
                selected = comebackDaily(config).find((row) => row.day === day),
                claimed = comebackClaims(record.dailyReward, 30);

            if (
                !selected
                || claimed.includes(day)
                || context.now / 86400000n - long(record, "backTime") / 86400000n + 1n < BigInt(day)
            )
            {
                comebackFailure();
            }

            record.dailyReward = [...claimed, day].join(";");
            id = selected.reward;
        }
        else
        {
            const pay = cityInteger(param, 1),
                selected = comebackPayNodes(config).find((row) => row.pay === pay),
                claimed = comebackClaims(record.payReward, 100);

            if (
                !selected
                || claimed.includes(pay)
                || long(context.state.profile, "payTotal") - long(record, "payTotal") < BigInt(pay)
            )
            {
                comebackFailure();
            }

            record.payReward = [...claimed, pay].join(";");
            id = selected.reward;
        }

        context.write.comeback = { record };
        const granted = grantNativeProgressionReward(
            context,
            pinProgressionReward(context, id, context.rules.advanced.payRewards),
        );

        return { response: encode(comebackRewardView(type, granted)), event: null };
    };

    public readonly apply: CityDomain["apply"] = async () => {
        comebackFailure();
    };
}

export const comebackDomain: CityDomain = new ComebackDomain();

export async function planComebackLogin(
    state: InventoryState,
    rules: Rules,
    effects: InventoryEffects,
    now: bigint,
    prepare: (economy: ActivityEconomy) => Promise<PreparedActivity>,
): Promise<InventoryPlan>
{
    const ledger = createInventoryPlanner(state, rules, effects, Number(now));
    const result = await prepare(activityEconomy(ledger));

    return ledger.result(decode(Buffer.from(result.response)));
}
