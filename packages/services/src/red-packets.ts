import { CityCommandDomain } from "./city-command-domain.ts";
import { paidGiftEvidence, redPacketInfo, redPacketRecord } from "@opencok/mappings/red-packets";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import type { AvatarSystemMail } from "@opencok/contracts/files";
import { containsNicknameBadWords } from "@opencok/rules/nickname-words";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import type { Rules } from "@opencok/rules/game";
import type { RedPacketExpiryStore } from "@opencok/contracts/paid-gifts";
import { createHash, randomInt, randomUUID } from "node:crypto";
import { encode, decode, fields, int, sfs, str, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { PaidGiftGateway } from "@opencok/contracts/paid-gifts";
import type { CampaignAudience } from "@opencok/contracts/campaign-notice";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { cityInteger } from "@opencok/rules/city-progression";
import { packetStatus, packetDistribution } from "@opencok/rules/red-packets";
import { CampaignPlanner } from "./local-campaign";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function paidGiftOperation(owner: string, orderId: string, platform: string)
{
    if (
        !orderId
        || orderId.length > 200
        || !platform
        || platform.length > 20
        || orderId.includes("\0")
        || platform.includes("\0")
    )
    {
        campaignFailure();
    }

    return `paid-gift:${
        createHash("sha256").update(`${owner}\0${platform}\0${orderId}`).digest("hex")
    }`;
}

export function paidGiftParameters(owner: string, orderId: string, platform: string): Fields
{
    return {
        orderId: sfs.string(orderId),
        platform: sfs.string(platform),
        operationId: sfs.string(paidGiftOperation(owner, orderId, platform)),
    };
}

export function createSystemPacket(context: CityProgressionContext, parameters: string)
{
    const parts = parameters.split(";");

    if (parts.length !== 8 || !parts[5])
    {
        campaignFailure();
    }

    const range = cityInteger(parts[0], 0, 1),
        type = cityInteger(parts[1], 0, 1),
        ceiling = cityInteger(parts[2], 1),
        people = cityInteger(parts[3], 1, 4096),
        minutes = cityInteger(parts[4], 1),
        mode = cityInteger(parts[6], 0, 1),
        floor = cityInteger(parts[7], 1, ceiling);
    const total = mode === 0 ? (floor === ceiling ? floor : randomInt(floor, ceiling)) : floor,
        rangeId = range === 0
            ? String(context.rules.kingdomId)
            : text(context.state.campaignProfile ?? {}, "allianceId");

    if (!rangeId || total < people || !context.economy.event)
    {
        campaignFailure();
    }

    const packet: Row = {
        uid: randomUUID().replaceAll("-", ""),
        range,
        rangeId,
        type,
        sender: "3000002",
        senderName: "Agatha",
        pic: "guidePlayerIcon",
        picVer: 0,
        total,
        remain: total,
        totalPeople: people,
        curPeople: 0,
        sendTime: context.now,
        endTime: context.now + BigInt(minutes) * 60000n,
        state: 0,
    };
    const write = (context.write.redPackets ??= {});
    write.created = [...(write.created ?? []), packet];
    context.economy.event({
        id: text(packet, "uid"),
        type: "redPackets.announce",
        payload: encode({
            owner: sfs.string(context.owner),
            endTime: sfs.long(long(packet, "endTime")),
            allianceId: sfs.string(range === 1 ? rangeId : ""),
            body: sfs.object({
                senderUid: sfs.string("3000002"),
                senderName: sfs.string("Agatha"),
                senderPic: sfs.string("guidePlayerIcon"),
                senderPicVer: sfs.int(0),
                type: sfs.int(range === 1 ? 2 : 0),
                post: sfs.int(12),
                version: sfs.string("2.0.0"),
                redPackets: sfs.string(text(packet, "uid")),
                server: sfs.int(context.rules.kingdomId),
                msg: sfs.string(""),
                dialogId: sfs.string(parts[5]!),
                timeLong: sfs.long(context.now),
            }),
        }),
    });
}

function goldTotal(context: CityProgressionContext)
{
    return context.balance("gold");
}

function profileEligible(context: CityProgressionContext)
{
    const profile = context.state.profile;

    return (
        num(profile, "serverId") === context.rules.kingdomId
        && num(profile, "crossFightSrcServerId") <= 0
        && num(profile, "banFlag") === 0
        && long(profile, "banTime") <= context.now
    );
}

function packetAudience(context: CityProgressionContext, packet: Row)
{
    if (!profileEligible(context))
    {
        return false;
    }

    if (num(packet, "range") === 0)
    {
        return text(packet, "rangeId") === String(context.rules.kingdomId);
    }

    return (
        num(packet, "range") === 1
        && text(packet, "rangeId") !== ""
        && text(packet, "rangeId") === text(context.state.campaignProfile ?? {}, "allianceId")
    );
}

function castle(context: CityProgressionContext, withStar = true)
{
    return context.state.buildings.reduce(
        (level, row) =>
            num(row, "itemId") === 400000
                ? Math.max(level, num(row, "level") + (withStar ? num(row, "star") : 0))
                : level,
        0,
    );
}

export class RedPacketDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"];
    public readonly types: CityDomain["types"];
    public readonly prepare: CityDomain["prepare"];
    public readonly apply: CityDomain["apply"];

    public constructor(gateway?: PaidGiftGateway)
    {
        super();

        this.commands = [
            "campaign.paid.gift",
            "redPackets.sd",
            "redPackets.rv",
            "redPackets.status",
            "redPackets.rvd.id",
        ];

        this.types = [];

        this.prepare = async (context, command, params) => {
            const reader = context.state.redPackets;

            if (!reader || !profileEligible(context))
            {
                campaignFailure();
            }

            if (command === "campaign.paid.gift")
            {
                const orderId = str(params, "orderId"),
                    platform = str(params, "platform");

                if (
                    !gateway
                    || str(params, "operationId")
                        !== paidGiftOperation(context.owner, orderId, platform)
                )
                {
                    campaignFailure();
                }

                const proof = await gateway.delivered({
                        owner: context.owner,
                        kingdomId: context.rules.kingdomId,
                        orderId,
                        platform,
                    }),
                    payment = await reader.payment(orderId, platform),
                    catalog = context.rules.advanced.castleExchanges?.get(proof?.exchangeId ?? "");

                if (
                    !proof
                    || proof.owner !== context.owner
                    || proof.kingdomId !== context.rules.kingdomId
                    || proof.orderId !== orderId
                    || proof.platform !== platform
                    || !catalog
                    || catalog.product_id !== proof.productId
                    || !/^[0-9]+(?:\.[0-9]{1,2})?$/.test(catalog.dollar ?? "")
                    || Math.round(Number(catalog.dollar) * 100) !== proof.priceCents
                    || !Number.isSafeInteger(proof.priceCents)
                    || proof.priceCents <= 0
                    || typeof proof.occurredAt !== "bigint"
                    || proof.occurredAt < 0n
                    || proof.occurredAt > context.now
                    || !Number.isSafeInteger(Number(proof.occurredAt))
                    || !payment
                    || num(payment, "status") !== 2
                    || text(payment, "productId") !== proof.productId
                    || (payment.time === null ? -1n : long(payment, "time")) !== proof.occurredAt
                    || Math.round(num(payment, "spend") * 100) !== proof.priceCents
                )
                {
                    campaignFailure();
                }

                new CampaignPlanner(
                    Object.assign(Object.create(context) as CityProgressionContext, {
                        now: proof.occurredAt,
                    }),
                    { exchange_id: proof.exchangeId, gift_product_id: proof.productId },
                ).event(56, proof.exchangeId);

                return {
                    response: encode({ evidence: sfs.object(paidGiftEvidence(proof)) }),
                    event: null,
                };
            }

            if (command === "redPackets.sd")
            {
                const message = [...str(params, "msg")]
                        .filter((value) => {
                            const code = value.codePointAt(0)!;

                            return code >= 32 && (code < 127 || code > 159);
                        })
                        .join(""),
                    uuid = str(params, "uuid"),
                    range = cityInteger(int(params, "range"), 0, 1),
                    total = cityInteger(int(params, "total"), 1),
                    people = cityInteger(int(params, "num"), 1, 4096),
                    item = context.economy.ownedItem?.(uuid),
                    rule = context.rules.goods.get(item?.itemId ?? ""),
                    limits = (rule?.para1 ?? "").split(";"),
                    rangeId = range === 0
                        ? String(context.rules.kingdomId)
                        : text(context.state.campaignProfile ?? {}, "allianceId");

                if (
                    !message.trim()
                    || [...message].length > 500
                    || !message.isWellFormed()
                    || containsNicknameBadWords(message, context.rules.profile.nicknameWords ?? [])
                    || long(context.state.profile, "chatBanTime") > context.now
                    || castle(context, false) < 20
                    || !item
                    || item.count < 1
                    || rule?.type !== "15"
                    || limits.length !== 3
                    || total > cityInteger(limits[0], 1)
                    || people < cityInteger(limits[1], 1)
                    || people > cityInteger(limits[2], 1)
                    || people > total
                    || !rangeId
                    || !context.economy.consumeItem
                    || !context.economy.event
                )
                {
                    campaignFailure();
                }

                const duration = BigInt(cityInteger(rule.para2, 1)) * 3600000n;
                context.economy.consumeItem(uuid, 1);
                context.economy.gold(-BigInt(total));
                const packet: Row = {
                    uid: randomUUID().replaceAll("-", ""),
                    range,
                    rangeId,
                    type: 0,
                    sender: context.owner,
                    senderName: text(context.state.profile, "name"),
                    pic: text(context.state.profile, "pic"),
                    picVer: num(context.state.profile, "picVer"),
                    total,
                    remain: total,
                    totalPeople: people,
                    curPeople: 0,
                    sendTime: context.now,
                    endTime: context.now + duration,
                    state: 0,
                };
                context.write.redPackets = { ...context.write.redPackets, created: [packet] };
                context.economy.event({
                    id: text(packet, "uid"),
                    type: "redPackets.announce",
                    payload: encode({
                        owner: sfs.string(context.owner),
                        endTime: sfs.long(long(packet, "endTime")),
                        allianceId: sfs.string(range === 1 ? rangeId : ""),
                        body: sfs.object({
                            senderUid: sfs.string(context.owner),
                            senderName: sfs.string(text(packet, "senderName")),
                            senderPic: sfs.string(text(packet, "pic")),
                            senderPicVer: sfs.int(num(packet, "picVer")),
                            senderpicfraId: sfs.int(num(context.state.profile, "picfraId")),
                            type: sfs.int(range === 1 ? 2 : 0),
                            post: sfs.int(12),
                            version: sfs.string("2.0.0"),
                            redPackets: sfs.string(text(packet, "uid")),
                            server: sfs.int(context.rules.kingdomId),
                            msg: sfs.string(message),
                            timeLong: sfs.long(context.now),
                        }),
                    }),
                });

                return {
                    response: encode({
                        uid: sfs.string(text(packet, "uid")),
                        gold: sfs.long(goldTotal(context)),
                        itemObj: sfs.object({
                            itemId: sfs.string(item.itemId),
                            count: sfs.int(item.count - 1),
                            itemEffectObj: sfs.object({}),
                        }),
                    }),
                    event: null,
                };
            }

            if (command === "redPackets.rvd.id")
            {
                return {
                    response: encode({
                        records: sfs.array(
                            (await reader.received()).map((row) =>
                                sfs.object({
                                    uid: sfs.string(text(row, "uid")),
                                    server: sfs.int(context.rules.kingdomId),
                                    status: sfs.int(0),
                                })
                            ),
                        ),
                    }),
                    event: null,
                };
            }

            if (int(params, "serverId") !== context.rules.kingdomId)
            {
                campaignFailure();
            }

            const uid = str(params, "uid"),
                loaded = await reader.packet(uid);

            if (!loaded)
            {
                return {
                    response: encode(
                        command === "redPackets.status"
                            ? { server: sfs.int(context.rules.kingdomId), status: sfs.int(3) }
                            : {
                                key_goldSum: sfs.string(uid),
                                status: sfs.int(3),
                                recordGold: sfs.int(0),
                            },
                    ),
                    event: null,
                };
            }

            const packet = { ...loaded.packet },
                records = [...loaded.records];

            if (!packetAudience(context, packet))
            {
                campaignFailure();
            }

            const system = text(packet, "sender") === "3000002",
                prior = records.find((row) => text(row, "player") === context.owner),
                eligible = !system
                    || castle(context)
                        >= cityInteger(context.rules.items.get("red_envelopes")?.k1, 1);
            let status = eligible ? packetStatus(packet, Boolean(prior), context.now) : 4;

            if (command === "redPackets.status")
            {
                return {
                    response: encode({
                        server: sfs.int(context.rules.kingdomId),
                        status: sfs.int(status),
                    }),
                    event: null,
                };
            }

            if (!eligible)
            {
                return {
                    response: encode({ key_goldSum: sfs.string(uid), status: sfs.int(4) }),
                    event: null,
                };
            }

            let add = 0;

            if (
                status === 1
                && !prior
                && int(params, "info", 0) !== 1
                && text(packet, "sender") !== context.owner
            )
            {
                const total = cityInteger(num(packet, "total"), 1),
                    remain = cityInteger(num(packet, "remain"), 1, total),
                    people = cityInteger(num(packet, "totalPeople"), 1, 4096);

                if (
                    num(packet, "curPeople") !== records.length
                    || records.length >= people
                    || records.some((record) => num(record, "value") <= 0)
                    || records.reduce((sum, record) => sum + num(record, "value"), remain) !== total
                )
                {
                    campaignFailure();
                }

                add = packetDistribution(
                    packet,
                    context.rules.items.get("redenvelope")?.k1 ?? "",
                    () => randomInt(0, 16777216) / 16777216,
                );
                context.economy.gold(BigInt(add));
                packet.remain = remain - add;
                packet.curPeople = records.length + 1;
                packet.state = num(packet, "remain") === 0 || num(packet, "curPeople") === people
                    ? 1
                    : 0;
                const record: Row = {
                    uid,
                    player: context.owner,
                    name: text(context.state.profile, "name"),
                    pic: text(context.state.profile, "pic"),
                    picVer: num(context.state.profile, "picVer"),
                    value: add,
                    getTime: context.now,
                };
                records.push(record);
                context.write.redPackets = {
                    ...context.write.redPackets,
                    updated: packet,
                    claim: record,
                };
                new CampaignPlanner(context, {
                    key_goldSum: add,
                    red_packet_system: system ? 1 : 0,
                }).event(
                    52,
                );
                status = 0;
            }

            return {
                response: encode({
                    ...(add > 0 ? { add: sfs.int(add), gold: sfs.long(goldTotal(context)) } : {}),
                    info: sfs.object(redPacketInfo(packet)),
                    records: sfs.array(
                        records.map((record) => sfs.object(redPacketRecord(record))),
                    ),
                    key_goldSum: sfs.string(uid),
                    status: sfs.int(status),
                    recordGold: sfs.int(prior ? num(prior, "value") : add),
                }),
                event: null,
            };
        };

        this.apply = async () => {
            campaignFailure();
        };
    }
}

export function createRedPacketDomain(gateway?: PaidGiftGateway): CityDomain
{
    return new RedPacketDomain(gateway);
}

export async function publishRedPacketAnnouncement(
    payload: Uint8Array,
    owner: string,
    online: readonly string[],
    audience: CampaignAudience,
    publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
    now = Date.now(),
)
{
    const data = decode(Buffer.from(payload)),
        body = fields(data.body),
        end = data.endTime?.value,
        allianceId = str(data, "allianceId");

    if (
        str(data, "owner") !== owner
        || typeof end !== "bigint"
        || int(body, "post") !== 12
        || !str(body, "redPackets")
    )
    {
        throw new Error("Invalid red packet announcement");
    }

    if (BigInt(now) >= end)
    {
        return;
    }

    const owners = [...new Set(online)];

    for (let start = 0; start < owners.length; start += 500)
    {
        const recipients = await audience.select(
            owners.slice(start, start + 500),
            allianceId || undefined,
            BigInt(now),
        );

        for (let offset = 0; offset < recipients.length; offset += 32)
        {
            await Promise.all(
                recipients
                    .slice(offset, offset + 32)
                    .map((recipient) => publish(recipient, "push.chat", body)),
            );
        }
    }
}

export function settleRedPacketExpiry(store: RedPacketExpiryStore, rules: Rules, now: bigint)
{
    return store.settle(now, (packet) => {
        if (text(packet, "sender") === "3000002" || num(packet, "remain") <= 0)
        {
            return null;
        }

        const template = rules.mail.get("11636"),
            contents = javaMailBytes(template?.message);

        if (!template || !contents || num(packet, "remain") > num(packet, "total"))
        {
            campaignFailure();
        }

        const uid = createHash("sha256")
            .update(`red-packet-refund:${text(packet, "uid")}`)
            .digest("hex")
            .slice(0, 32) + "00";
        const mail: AvatarSystemMail = {
            uid,
            owner: text(packet, "sender"),
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents,
            extra: null,
            rewardId: `gold,0,${cityInteger(num(packet, "remain"), 1)}`,
            rewardStatus: 0,
            reply: 0,
            createTime: long(packet, "endTime"),
        };

        return {
            mail,
            event: {
                id: uid,
                type: "redPackets.mail",
                payload: encode({
                    owner: sfs.string(mail.owner),
                    mail: sfs.object(avatarMailPush(mail, true)),
                }),
            },
        };
    });
}
