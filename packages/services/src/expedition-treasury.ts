import { randomUUID } from "node:crypto";
import {
    treasuryAssets,
    type ExpeditionTreasuryExecutor,
} from "@opencok/contracts/expedition-treasury";
import { long, num, text } from "@opencok/contracts/rows";
import { sfs, encode, decode, int, str, Type, type Fields } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { expeditionFailure } from "@opencok/rules/new-expedition";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { expeditionDistribution } from "@opencok/mappings/new-expedition";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
import type { Rules } from "@opencok/rules/game";

export const expeditionTreasuryCommands = [
    "exchequer.show",
    "expedition.king.present",
    "expedition.recieve.count",
] as const;

export class ExpeditionTreasuryService
{
    constructor(
        private readonly execute: ExpeditionTreasuryExecutor,
        private readonly rules: Rules,
    )
    {}

    async command(owner: string, command: string, params: Fields)
    {
        if (!(expeditionTreasuryCommands as readonly string[]).includes(command))
        {
            expeditionFailure();
        }

        const operationId = str(params, "operationId", "") || randomUUID(),
            uid = command === "exchequer.show" ? "" : str(params, "uid");

        if (
            !/^[A-Za-z0-9:._-]{1,128}$/.test(operationId)
            || (command !== "exchequer.show" && (!uid.trim() || uid.length > 40))
        )
        {
            expeditionFailure();
        }

        const request = Object.fromEntries(
            Object.keys(params)
                .sort()
                .filter((key) => !["operationId", "_cok_", "cmdBaseTime"].includes(key))
                .map((key) => [key, params[key]!]),
        );
        const response = await this.execute(
            {
                owner,
                requestId: operationId,
                command,
                request: encode(request),
                participants: [...new Set([owner, ...(uid ? [uid] : [])])],
            },
            async (state) => {
                if (num(state.profile, "crossFightSrcServerId") > 0)
                {
                    expeditionFailure();
                }

                const treasury = state.treasury ?? {};
                const balanceFields = Object.fromEntries(
                    [...treasuryAssets, "silver"].map((
                        asset,
                    ) => [asset, sfs.long(long(treasury, asset))]),
                );

                if (command === "exchequer.show")
                {
                    return {
                        response: encode({
                            body: sfs.object({
                                ...balanceFields,
                                operationId: sfs.string(operationId),
                            }),
                            pushes: sfs.array([]),
                        }),
                    };
                }

                if (!state.target)
                {
                    expeditionFailure();
                }

                const previous = state.received
                    ?? { uid, recieveResource: 0n, lastClearTime: state.now };
                const received = {
                    ...previous,
                    recieveResource:
                        long(previous, "lastClearTime") / 86400000n === state.now / 86400000n
                            ? long(previous, "recieveResource")
                            : 0n,
                    lastClearTime: state.now,
                };

                if (command === "expedition.recieve.count")
                {
                    return {
                        received,
                        response: encode({
                            body: sfs.object({
                                count: sfs.long(received.recieveResource),
                                operationId: sfs.string(operationId),
                            }),
                            pushes: sfs.array([]),
                        }),
                    };
                }

                if (text(state.king ?? {}, "uid") !== owner || !state.treasury)
                {
                    expeditionFailure();
                }

                const amounts = Object.fromEntries(
                    treasuryAssets.map((
                        asset,
                    ) => [asset, BigInt(cityInteger(int(params, asset, 0)))]),
                ) as Record<(typeof treasuryAssets)[number], bigint>;

                if (!treasuryAssets.some((asset) => amounts[asset] > 0n))
                {
                    expeditionFailure();
                }

                const weights = this.rules.items.get("resources_weight");
                const weightKeys = { wood: "k1", food: "k4", iron: "k3", stone: "k2" };
                const weighted = treasuryAssets.reduce(
                    (sum, asset) =>
                        sum + amounts[asset] * BigInt(cityInteger(weights?.[weightKeys[asset]], 1)),
                    0n,
                );
                received.recieveResource += weighted;

                if (received.recieveResource > cityAmount(this.rules.items.get("wk_info_new1")?.k3))
                {
                    expeditionFailure();
                }

                const balances = Object.fromEntries(
                    treasuryAssets.map((asset) => [
                        asset,
                        cityAmount(long(treasury, asset) - amounts[asset]),
                    ]),
                ) as typeof amounts;
                const record = {
                    uuid: randomUUID().replaceAll("-", ""),
                    kingUid: owner,
                    kingName: text(state.profile, "name"),
                    toUid: uid,
                    toUserName: text(state.target, "name"),
                    sendTime: state.now,
                    ...amounts,
                };
                const template = this.rules.mail.get("11789"),
                    contents = javaMailBytes(template?.message);

                if (!template || !contents)
                {
                    expeditionFailure();
                }

                const mail = {
                    uid: randomUUID().replaceAll("-", "") + "00",
                    owner: uid,
                    fromName: template.sender ?? "",
                    title: template.title ?? "",
                    type: 2 as const,
                    contents,
                    extra: null,
                    rewardId: treasuryAssets
                        .filter((asset) => amounts[asset] > 0n)
                        .map((asset) => `${asset},0,${amounts[asset]}`)
                        .join("|"),
                    rewardStatus: 0 as const,
                    reply: 0,
                    createTime: state.now,
                };
                const full = this.rules.items.get("chat_switch")?.k3?.split("|").includes("1")
                    ?? false;

                return {
                    balances,
                    received,
                    record,
                    mail,
                    response: encode({
                        body: sfs.object({
                            ...Object.fromEntries(
                                treasuryAssets.map((asset) => [asset, sfs.long(balances[asset])]),
                            ),
                            record: sfs.object(expeditionDistribution(record)),
                            operationId: sfs.string(operationId),
                        }),
                        pushes: sfs.array([]),
                    }),
                    events: [
                        {
                            id: "treasury-mail",
                            type: command,
                            payload: encode({
                                recipient: sfs.string(uid),
                                mail: sfs.object(avatarMailPush(mail, full)),
                            }),
                        },
                    ],
                };
            },
        );

        return inventoryReplay(response, operationId);
    }
}

export async function publishExpeditionTreasuryMutation(
    payload: Buffer,
    publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
)
{
    const body = decode(payload),
        owner = str(body, "recipient");

    if (!owner || body.mail?.type !== Type.Object)
    {
        expeditionFailure();
    }

    await publish(owner, "push.mail", body.mail.value as Fields);
}
