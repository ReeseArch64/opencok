import { randomUUID, randomInt, createHash } from "node:crypto";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, str, int, Type, encode, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type {
    AllianceRepository,
    AllianceState,
    AllianceWrite,
} from "@opencok/contracts/alliance-gameplay";
import type { Rules } from "@opencok/rules/game";
import {
    allianceFailure,
    allianceText,
    allianceMember,
    allianceRight,
    alliancePermissions,
    allianceTargets,
    changeAlliancePermissions,
    newAllianceMember,
    allianceCreationCost,
    allianceJoinAllowed,
} from "@opencok/rules/alliance";
import { cityInteger } from "@opencok/rules/city-progression";
import { createAllianceSchema } from "@opencok/validations/alliance";
import { allianceMailData, allianceSnapshot } from "@opencok/mappings/alliance";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
import { previewRewards } from "@opencok/rules/rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import type { CreateAllianceDto } from "@opencok/dtos/create-alliance.dto";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import {
    createInventoryPlanner,
    type RealmInventoryPlanner,
    type InventoryEffects,
} from "@opencok/services/inventory-runtime";
import { activityEconomy } from "@opencok/economy/services/activity-economy";
import type { AllianceScienceFactory } from "@opencok/alliance/contracts/science";
import { AllianceScienceCommand } from "@opencok/alliance/enums/science-command";
import type { AllianceHelpFactory } from "@opencok/alliance/contracts/help";
import { AllianceHelpCommand } from "@opencok/alliance/enums/help-command";
import type { AllianceGiftFactory } from "@opencok/alliance/contracts/gifts";
import { AllianceGiftCommand } from "@opencok/alliance/enums/gift-command";

export const allianceCommands = [
    "al.create",
    "al.attr",
    "al.changeattr",
    "al.checkname",
    "al.name",
    "al.abbr",
    "al.searchuser",
    "al.apply",
    "al.cancelapply",
    "al.invite",
    "al.cancelinvite",
    "al.acceptapply",
    "al.refuseapply",
    "al.acceptinvite",
    "al.refuseinvite",
    "al.applylist",
    "al.invitelist",
    "al.userapplylist",
    "al.userinvitelist",
    "al.apply.message",
    "al.apply.message.get",
    "al.leave",
    "al.leave.v2",
    "al.dismiss",
    "al.kick",
    "al.setrank",
    "al.leader.trans",
    "al.leader.replace",
    "al.get.firstjoin",
    "al.rank",
    "al.view",
    "al.check",
    "al.search",
    "al.permission.get",
    "al.permission.modify",
    "al.rankname.set",
    "alliance.flag.choose",
    AllianceScienceCommand.Target,
    AllianceScienceCommand.Fresh,
    AllianceScienceCommand.Donate,
    AllianceScienceCommand.Research,
    AllianceScienceCommand.Cooldown,
    AllianceHelpCommand.Call,
    AllianceHelpCommand.Render,
    AllianceHelpCommand.All,
    AllianceHelpCommand.Show,
    AllianceGiftCommand.Show,
    AllianceGiftCommand.Open,
    AllianceGiftCommand.Clear,
    "al.diplo",
    "al.blacklist.query",
    "al.blacklist.modify",
] as const;

export class AllianceService
{
    constructor(
        readonly repository: AllianceRepository,
        readonly rules: Rules,
        readonly effects: InventoryEffects,
        readonly help: AllianceHelpFactory<Rules>,
        readonly gifts: AllianceGiftFactory<RealmInventoryPlanner>,
        readonly science: AllianceScienceFactory<RealmInventoryPlanner>,
        readonly forbidden: (value: string) => boolean | Promise<boolean> = () => false,
    )
    {}

    async publishGift(owner: string, eventId: string, type: number)
    {
        allianceText(eventId, 1, 128);
        cityInteger(type, 30000, 30500);
        const giftEvent = allianceStableId(`alliance-gift:${eventId}`),
            requestId = `alliance-gift:${giftEvent}`;
        const response = await this.repository.execute(
            {
                owner,
                command: "alliance.reward",
                requestId,
                request: encode({ eventId: sfs.string(eventId), type: sfs.int(type) }),
            },
            { giftEvent },
            async (state) => {
                const context = new AllianceContext(
                    owner,
                    state,
                    this.rules,
                    createInventoryPlanner(
                        state.inventory,
                        this.rules,
                        this.effects,
                        Number(state.now),
                    ),
                    this.effects,
                    this.help,
                    this.gifts,
                    this.science,
                );
                context.member();
                const body = this.gifts(context).publish(giftEvent, type),
                    inventory = context.ledger.result(body);

                if (context.write.publishedGift)
                {
                    inventory.events = [
                        ...(inventory.events ?? []),
                        {
                            id: "alliance",
                            type: "alliance.changed",
                            payload: encode({
                                allianceId: sfs.string(context.allianceId),
                                members: sfs.array([]),
                                command: sfs.string("alliance.reward"),
                            }),
                        },
                    ];
                }

                return { inventory, write: context.write };
            },
        );

        return inventoryReplay(response, requestId);
    }

    async command(owner: string, command: string, params: Fields)
    {
        if (
            command !== "alliance.tick"
            && command !== "alliance.init"
            && !(allianceCommands as readonly string[]).includes(command)
        )
        {
            throw new GameError(errors.unsupported);
        }

        if (command !== "alliance.tick")
        {
            await this.command(owner, "alliance.tick", {});
        }

        for (const [key, field] of Object.entries(params))
        {
            if (key === "_cok_")
            {
                continue;
            }

            if (
                [
                    "rank",
                    "page",
                    "type",
                    "qType",
                    "option",
                    "isuse",
                    "isBlack",
                    "isAdd",
                    "recruit",
                ].includes(key)
                && field.type !== Type.Int
            )
            {
                allianceFailure();
            }

            if (
                key === "scienceId"
                && field.type
                    !== (command === AllianceScienceCommand.Target ? Type.String : Type.Int)
            )
            {
                allianceFailure();
            }

            if (
                [
                    "operationId",
                    "allianceId",
                    "playerId",
                    "mailId",
                    "helpId",
                    "giftId",
                    "uid",
                    "queueId",
                    "itemId",
                    "name",
                    "abbr",
                    "intro",
                    "announce",
                    "language",
                    "lang",
                    "key",
                    "message",
                    "rankData",
                    "rankOne",
                    "rankTwo",
                    "rankThree",
                    "rankFour",
                    "rankFive",
                    "banner",
                    "ally",
                    "enemy",
                    "other",
                    "castleRestriction",
                    "powerRestriction",
                ].includes(key)
                && field.type !== Type.String
            )
            {
                allianceFailure();
            }

            if (
                ![Type.String, Type.Int, Type.Long, Type.Bool].includes(field.type)
                || (field.type === Type.String
                    && (typeof field.value !== "string"
                        || field.value.length > 500
                        || !field.value.isWellFormed()))
                || (field.type === Type.Int
                    && (typeof field.value !== "number"
                        || !Number.isInteger(field.value)
                        || field.value < -2147483648
                        || field.value > 2147483647))
            )
            {
                allianceFailure();
            }
        }

        for (
            const key of [
                "name",
                "abbr",
                "intro",
                "announce",
                "rankOne",
                "rankTwo",
                "rankThree",
                "rankFour",
                "rankFive",
            ]
        )
        {
            if (params[key] && (await this.forbidden(str(params, key))))
            {
                allianceFailure();
            }
        }

        const requestId = params.operationId
            ? allianceText(str(params, "operationId"), 1, 128)
            : randomUUID();

        if (
            command !== "alliance.tick"
            && command !== "alliance.init"
            && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                requestId,
            )
        )
        {
            allianceFailure();
        }

        const request: Fields = {};

        for (const key of Object.keys(params).sort())
        {
            if (key !== "operationId" && key !== "_cok_")
            {
                request[key] = params[key]!;
            }
        }

        const selection = {
            allianceId: str(params, "allianceId", "")
                || (["al.view", "al.rank"].includes(command) ? str(params, "uid", "") : "")
                || undefined,
            playerId:
                (command === "al.check" ? str(params, "uid", "") : str(params, "playerId", ""))
                || undefined,
            mailId: str(params, "mailId", "") || undefined,
            helpId: str(params, "helpId", "") || undefined,
            key: [
                    "al.search",
                    "al.checkname",
                    "al.name",
                    "al.abbr",
                    "al.searchuser",
                    "al.create",
                ].includes(command)
                ? str(params, "key", str(params, command === "al.abbr" ? "abbr" : "name", ""))
                : undefined,
            searchPlayers: command === "al.searchuser",
            language: str(params, "lang", str(params, "language", "")),
            pageSize: command === "al.search" && int(params, "type", 0) === 2 ? 5 : 10,
            page: Math.max(1, cityInteger(int(params, "page", 1), 0, 1000)),
        };

        for (const id of [selection.allianceId, selection.playerId, selection.mailId])
        {
            if (id)
            {
                allianceText(id, 1, 40);
            }
        }

        const response = await this.repository.execute(
            { owner, command, requestId, request: encode(request) },
            selection,
            async (state) => {
                const context = new AllianceContext(
                    owner,
                    state,
                    this.rules,
                    createInventoryPlanner(
                        state.inventory,
                        this.rules,
                        this.effects,
                        Number(state.now),
                    ),
                    this.effects,
                    this.help,
                    this.gifts,
                    this.science,
                );
                const body = await context.command(command, params);
                const inventory = context.ledger.result(body);

                if (Object.keys(context.write).length)
                {
                    inventory.events = [
                        ...(inventory.events ?? []),
                        {
                            id: "alliance",
                            type: "alliance.changed",
                            payload: encode({
                                allianceId: sfs.string(
                                    context.allianceId
                                        || text(context.write.alliances?.[0] ?? {}, "uid"),
                                ),
                                members: sfs.array(
                                    (context.write.memberships ?? []).map((row) =>
                                        sfs.object({
                                            uid: sfs.string(row.uid),
                                            allianceId: sfs.string(row.allianceId),
                                        })
                                    ),
                                ),
                                command: sfs.string(command),
                            }),
                        },
                    ];
                }

                return {
                    inventory,
                    write: context.write,
                    productionOwners: [...context.productionOwners],
                    productionAt: context.productionAt,
                };
            },
        );

        return inventoryReplay(response, requestId);
    }
}

export class AllianceContext
{
    readonly write: AllianceWrite = {};
    readonly productionOwners = new Set<string>();
    productionAt?: bigint;
    readonly allianceId: string;

    constructor(
        readonly owner: string,
        readonly state: AllianceState,
        readonly rules: Rules,
        readonly ledger: RealmInventoryPlanner,
        readonly effects: InventoryEffects,
        private readonly help: AllianceHelpFactory<Rules>,
        private readonly gifts: AllianceGiftFactory<RealmInventoryPlanner>,
        private readonly science: AllianceScienceFactory<RealmInventoryPlanner>,
    )
    {
        this.allianceId = text(state.inventory.profile, "allianceId");
    }

    async effect(id: number)
    {
        const state = await this.state.inventory.effects();
        const value = playerGameEffect(
            state,
            this.rules,
            { kingdomId: this.rules.kingdomId, version: "12.06.0", now: Number(this.now) },
            generalSkillPoints(state.generals),
            await this.effects.world(),
            await this.effects.emperor(),
            id as Parameters<typeof playerGameEffect>[6],
        );

        if (!Number.isFinite(value))
        {
            allianceFailure();
        }

        return value;
    }

    get now()
    {
        return this.state.now;
    }

    member(uid = this.owner, id = this.allianceId)
    {
        if (!id || text(this.profile(uid), "allianceId") !== id)
        {
            allianceFailure(errors.locked);
        }

        return allianceMember(
            [
                ...(this.write.members ?? []),
                ...this.state.members.filter(
                    (row) => !(this.write.members ?? []).some((next) => next.uid === row.uid),
                ),
            ],
            uid,
            id,
        );
    }

    alliance(id = this.allianceId)
    {
        const row = (this.write.alliances ?? []).find((row) => row.uid === id)
            ?? this.state.alliances.find((row) => row.uid === id);

        if (!row)
        {
            allianceFailure();
        }

        return row;
    }

    profile(uid = this.owner)
    {
        const row = this.state.profiles.find((row) => row.uid === uid);

        if (!row)
        {
            allianceFailure();
        }

        return row;
    }

    castle(uid: string)
    {
        return num(
            this.state.cities.find((row) => row.uid === uid && num(row, "itemId") === 400000) ?? {},
            "level",
        );
    }

    power(uid: string)
    {
        return long(this.state.powers.find((row) => row.uid === uid) ?? {}, "power");
    }

    right(key: string)
    {
        allianceRight(this.member(), this.rules, key);
    }

    setAlliance(row: Row)
    {
        this.write.alliances = [
            ...(this.write.alliances ?? []).filter((value) => value.uid !== row.uid),
            row,
        ];
    }

    setMember(row: Row)
    {
        this.write.members = [
            ...(this.write.members ?? []).filter((value) => value.uid !== row.uid),
            row,
        ];
    }

    cost(key: string)
    {
        activityEconomy(this.ledger).gold(
            -BigInt(cityInteger(this.rules.items.get("alliance_cost")?.[key])),
        );
    }

    list(id = this.allianceId)
    {
        return this.state.members.filter((row) => row.allianceId === id);
    }

    scienceEffect(effect: number, id = this.allianceId)
    {
        return this.state.sciences
            .filter((row) => row.allianceId === id)
            .reduce((total, row) => {
                const rule = this.rules.power.allianceSciences?.get(
                    String(num(row, "scienceId") + num(row, "level")),
                );

                return total
                    + (rule?.para1?.split(";").includes(String(effect)) ? Number(rule.para2) : 0);
            }, 0);
    }

    snapshot(
        alliance = this.alliance(),
        member = [...(this.write.members ?? []), ...this.state.members].find(
            (row) => row.uid === this.owner && row.allianceId === alliance.uid,
        ),
    )
    {
        const id = text(alliance, "uid"),
            members = this.list(id).filter(
                (row) => !(this.write.removedMembers ?? []).includes(text(row, "uid")),
            );

        for (const row of this.write.members ?? [])
        {
            if (row.allianceId === id)
            {
                const index = members.findIndex((value) => value.uid === row.uid);

                if (index >= 0)
                {
                    members[index] = row;
                }
                else
                {
                    members.push(row);
                }
            }
        }

        const leaders = members.filter((row) => num(row, "rank") === 5);

        if (leaders.length !== 1)
        {
            allianceFailure();
        }

        const leader = this.profile(text(leaders[0]!, "uid"));
        const result = allianceSnapshot({
            uid: id,
            name: text(alliance, "alliancename"),
            abbr: text(alliance, "abbr"),
            intro: text(alliance, "intro"),
            announce: text(alliance, "announce"),
            language: text(alliance, "language"),
            member: members.length,
            maxMember: num(alliance, "maxMember") + Math.trunc(this.scienceEffect(500, id)),
            recruit: num(alliance, "recruit"),
            rank: num(member ?? {}, "rank"),
            point: num(member ?? {}, "point"),
            accPoint: num(member ?? {}, "accPoint"),
            leaderUid: text(leader, "uid"),
            leaderName: text(leader, "name"),
            fightpower: members.reduce((sum, row) => sum + this.power(text(row, "uid")), 0n),
        });

        return {
            ...result,
            alliancename: result.name!,
            curMember: result.member!,
            alliancepoint: sfs.long(long(alliance, "alliancepoint")),
            icon: sfs.string(text(alliance, "icon")),
            bannerStyle: sfs.string(text(alliance, "bannerStyle")),
            permission: sfs.object(
                Object.fromEntries(
                    Object.entries(alliancePermissions(text(alliance, "permission"))).map((
                        [key, value],
                    ) => [
                        key,
                        sfs.int(value),
                    ]),
                ),
            ),
            donateCDTime: sfs.long(long(member ?? {}, "donateCDTime")),
            donateAvailable: sfs.int(Number(member?.donateAvailable ?? 1)),
            jointime: sfs.long(long(member ?? {}, "jointime")),
            currentlevel: sfs.int(Math.floor(num(alliance, "giftlevel") / 1000)),
            nextlevel: sfs.int((Math.floor(num(alliance, "giftlevel") / 1000) + 1) * 1000),
            allianceScience: this.science(this).snapshots(id),
            ...Object.fromEntries(
                ["rankone", "ranktwo", "rankthree", "rankfour", "rankfive"].map((key) => [
                    key,
                    sfs.string(text(alliance, key)),
                ]),
            ),
            targetScience: sfs.string(allianceTargets(text(alliance, "targetScience")).join(";")),
        };
    }

    checkMarch(uid: string)
    {
        if (
            this.state.marches.some(
                (row) =>
                    row.ownerUid === uid
                    && (text(row, "teamId")
                        || (text(row, "allianceId")
                            && text(row, "allianceId") !== this.allianceId)),
            )
        )
        {
            allianceFailure(errors.locked);
        }
    }

    join(uid: string, alliance: Row, rank = 1)
    {
        const profile = this.profile(uid),
            id = text(alliance, "uid");
        this.checkMarch(uid);

        if (
            this.state.marches.length > 8192
            || this.state.marches.some(
                (march) =>
                    march.allianceId === id
                    && num(march, "state") === 0
                    && long(march, "marchArrivalTime") >= this.now
                    && (march.targetUid === uid
                        || this.state.points.some(
                            (point) =>
                                point.ownerId === uid
                                && num(point, "id") === num(march, "targetId"),
                        )),
            )
        )
        {
            allianceFailure(errors.locked);
        }

        allianceJoinAllowed(
            profile,
            alliance,
            this.state.members,
            this.power(uid),
            this.castle(uid),
            num(alliance, "maxMember") + Math.trunc(this.scienceEffect(500, id)),
        );
        const row = newAllianceMember(
            uid,
            id,
            rank,
            this.now,
            this.state.members.find((row) => row.uid === uid),
        );
        this.setMember(row);
        this.write.actions = [{ uid, kind: "alliance.join", count: 1 }];
        this.write.memberships = [{ uid, allianceId: id }];
        this.setAlliance({ ...alliance, curMember: this.list(id).length + 1 });

        if (
            Number(this.state.lords.find((row) => row.uid === uid)?.firstJoinAllianceFlag ?? 1)
                === 1
        )
        {
            const template = this.rules.mail.get("10011");

            if (template)
            {
                const rewards = previewRewards(
                    template.reward,
                    this.rules,
                    { kingdomId: this.rules.kingdomId, version: "12.06.0", now: Number(this.now) },
                    randomInt,
                );
                const rewardId = rewards
                    .map((reward) => {
                        if (reward.kind === "item")
                        {
                            return `goods,${reward.id},${reward.count}`;
                        }

                        if (reward.kind !== "count")
                        {
                            allianceFailure();
                        }

                        const category: Record<number, string> = {
                            0: "wood",
                            1: "stone",
                            2: "iron",
                            3: "food",
                            4: "silver",
                            5: "gold",
                            19: "crystal",
                        };

                        if (!category[reward.type])
                        {
                            allianceFailure();
                        }

                        return `${category[reward.type]},0,${reward.value}`;
                    })
                    .join("|");
                const contents = javaMailBytes(template.message);

                if (!contents)
                {
                    allianceFailure();
                }

                this.write.mails = [
                    ...(this.write.mails ?? []),
                    {
                        uid: allianceStableId(`alliance-first-join:${uid}`) + "00",
                        toUser: uid,
                        fromUser: null,
                        fromName: template.sender ?? "",
                        title: template.title ?? "",
                        type: 2,
                        contents: Buffer.from(contents),
                        rewardId: rewardId || null,
                        rewardStatus: rewardId ? 0 : 1,
                        createTime: this.now,
                        itemIdFlag: 1,
                    },
                ];
            }
        }

        this.productionOwners.add(uid);

        return {
            alliance: sfs.object(this.snapshot(alliance, row)),
            join: sfs.bool(true),
            joinBool: sfs.bool(true),
            rank: sfs.int(rank),
            isfirstJoin: sfs.int(
                Number(this.state.lords.find((row) => row.uid === uid)?.firstJoinAllianceFlag ?? 1),
            ),
        };
    }

    remove(uid: string)
    {
        this.checkMarch(uid);
        const profile = this.profile(uid);

        if (num(profile, "crossFightSrcServerId") > 0)
        {
            allianceFailure(errors.locked);
        }

        this.write.memberships = [{ uid, allianceId: "" }];
        this.write.removedMembers = [uid];
        this.write.firstJoin = [uid];
        this.setAlliance({ ...this.alliance(), curMember: this.list().length - 1 });
        this.productionOwners.add(uid);

        return { uid: sfs.string(uid), allianceId: sfs.string(this.allianceId) };
    }

    application(type: number, uid = this.owner, id = this.allianceId)
    {
        return this.state.applications.find(
            (row) =>
                row.userId === uid
                && row.allianceId === id
                && num(row, "type") === type
                && long(row, "applyTime") + 28800000n > this.now,
        );
    }

    mail(type: number, to: string, id: string, contents: Record<string, string | number>)
    {
        const template = this.rules.mail.get(type === 17 ? "10009" : "10010");
        this.write.mails = [
            ...(this.write.mails ?? []),
            {
                uid: id,
                toUser: to,
                fromUser: this.owner,
                fromName: text(this.profile(), "name"),
                type,
                title: template?.title ?? "",
                contents: Buffer.from(JSON.stringify(contents)),
                createTime: this.now,
                rewardStatus: 0,
            },
        ];
    }

    async command(command: string, params: Fields): Promise<Fields>
    {
        if (command === "alliance.tick")
        {
            return this.science(this).complete();
        }

        if (command === "alliance.init")
        {
            const present = this.state.alliances.some((row) => row.uid === this.allianceId)
                && this.list().some((row) => row.uid === this.owner)
                && this.list().filter((row) => num(row, "rank") === 5).length === 1;

            return { alliance: sfs.object(present ? this.snapshot() : {}) };
        }

        if (command === "al.create")
        {
            const input: CreateAllianceDto = {
                name: str(params, "name").trim(),
                intro: str(params, "intro", ""),
                language: str(params, "language", ""),
            };
            const parsed = createAllianceSchema.safeParse(input);

            if (!parsed.success)
            {
                allianceFailure();
            }

            const { name, intro, language } = parsed.data;
            allianceText(name, 3, 20);
            allianceText(intro, 0, 200);

            if (
                this.allianceId
                || this.state.members.some((row) =>
                    row.uid === this.owner && text(row, "allianceId")
                )
                || num(this.profile(), "crossFightSrcServerId") > 0
            )
            {
                allianceFailure(errors.locked);
            }

            activityEconomy(this.ledger).gold(
                -allianceCreationCost(this.rules, this.castle(this.owner)),
            );
            const proposed = [...name].slice(0, 3).join(""),
                abbr = this.state.directory.some(
                        (row) => text(row, "abbr").toLowerCase() === proposed.toLowerCase(),
                    )
                    ? randomUUID().slice(0, 3).toUpperCase()
                    : proposed;
            const id = randomUUID(),
                row: Row = {
                    uid: id,
                    alliancename: name,
                    abbr,
                    intro,
                    announce: "",
                    language: language ?? "",
                    icon: "Alliance_Flag_1",
                    country: text(this.profile(), "country"),
                    curMember: 0,
                    maxMember: 50,
                    recruit: 1,
                    alliancepoint: 0n,
                    createtime: this.now,
                    bannerStyle: text(this.profile(), "country") || "UN",
                    giftlevel: 0,
                    permission: JSON.stringify(alliancePermissions("")),
                    powerRestriction: 0n,
                    castleRestriction: 0,
                };
            this.setAlliance(row);

            return this.join(this.owner, row, 5);
        }

        if (command === "al.check")
        {
            return {
                allianceId: sfs.string(
                    text(
                        this.state.profiles.find((row) => row.uid === this.state.selection.playerId)
                            ?? {},
                        "allianceId",
                    ),
                ),
            };
        }

        if (command === "al.name" || command === "al.abbr")
        {
            const key = command === "al.name" ? "alliancename" : "abbr",
                value = this.state.selection.key ?? "";
            const invalid = value.length < 3
                || value.length > (command === "al.name" ? 20 : 3)
                || this.state.directory.some((row) =>
                    text(row, key).toLowerCase() === value.toLowerCase()
                );

            return { result: sfs.bool(invalid) };
        }

        if (command === "al.searchuser")
        {
            this.right("invite");
            const eligible = this.state.candidates.filter(
                (row) =>
                    !this.state.applications.some(
                        (application) =>
                            application.userId === row.uid
                            && application.allianceId === this.allianceId
                            && (this.state.selection.key ? num(application, "type") === 1 : true),
                    ),
            );
            const preferred = eligible.filter((row) =>
                text(row, "lang").startsWith(this.state.selection.language ?? "")
            );
            const candidates = preferred.length ? preferred : eligible,
                page = this.state.selection.page ?? 1;

            return {
                list: sfs.array(
                    candidates.slice((page - 1) * 10, page * 10).map((row) =>
                        sfs.object({
                            uid: sfs.string(text(row, "uid")),
                            name: sfs.string(text(row, "name")),
                            pic: sfs.string(text(row, "pic")),
                            picVer: sfs.int(num(row, "picVer")),
                            picfraId: sfs.int(num(row, "picfraId")),
                            lang: sfs.string(text(row, "lang")),
                            power: sfs.long(long(row, "power")),
                            offLineTime: sfs.long(long(row, "offLineTime")),
                            online: sfs.bool(false),
                        })
                    ),
                ),
                total: sfs.long(BigInt(candidates.length)),
                page: sfs.int(this.state.selection.page ?? 1),
            };
        }

        if (command === "al.search" || command === "al.checkname")
        {
            return command === "al.checkname"
                ? {
                    result: sfs.bool(
                        !this.state.directory.some(
                            (row) =>
                                text(row, "alliancename").toLowerCase()
                                    === (this.state.selection.key ?? "").toLowerCase(),
                        ),
                    ),
                }
                : {
                    list: sfs.array(
                        this.state.directory.map((row) =>
                            sfs.object({
                                uid: sfs.string(text(row, "uid")),
                                alliancename: sfs.string(text(row, "alliancename")),
                                abbr: sfs.string(text(row, "abbr")),
                                curMember: sfs.int(num(row, "curMember")),
                                maxMember: sfs.int(num(row, "maxMember")),
                                language: sfs.string(text(row, "language")),
                                recruit: sfs.int(num(row, "recruit")),
                            })
                        ),
                    ),
                    page: sfs.int(this.state.selection.page ?? 1),
                    total: sfs.long(this.state.directoryTotal),
                };
        }

        if (command === "al.get.firstjoin")
        {
            return {
                firstJoin: sfs.int(
                    Number(
                        this.state.lords.find((row) => row.uid === this.owner)
                            ?.firstJoinAllianceFlag ?? 1,
                    ),
                ),
            };
        }

        if (command === "al.view")
        {
            return {
                alliance: sfs.object(
                    this.snapshot(
                        this.alliance(this.state.selection.allianceId ?? this.allianceId),
                    ),
                ),
            };
        }

        if (command === "al.rank")
        {
            const id = this.state.selection.allianceId ?? this.allianceId;
            this.alliance(id);

            return {
                list: sfs.array(
                    this.list(id)
                        .sort(
                            (a, b) =>
                                num(b, "rank") - num(a, "rank")
                                || text(a, "uid").localeCompare(text(b, "uid")),
                        )
                        .map((row) => {
                            const profile = this.profile(text(row, "uid"));

                            return sfs.object({
                                uid: sfs.string(text(row, "uid")),
                                name: sfs.string(text(profile, "name")),
                                pic: sfs.string(text(profile, "pic")),
                                picVer: sfs.int(num(profile, "picVer")),
                                picfraId: sfs.int(num(profile, "picfraId")),
                                rank: sfs.int(num(row, "rank")),
                                power: sfs.long(this.power(text(row, "uid"))),
                            });
                        }),
                ),
            };
        }

        if (
            [
                "al.apply",
                "al.cancelapply",
                "al.acceptapply",
                "al.refuseapply",
                "al.invite",
                "al.cancelinvite",
                "al.acceptinvite",
                "al.refuseinvite",
            ].includes(command)
        )
        {
            return this.membership(command, params);
        }

        if (
            [
                "al.applylist",
                "al.invitelist",
                "al.userapplylist",
                "al.userinvitelist",
                "al.apply.message",
                "al.apply.message.get",
            ].includes(command)
        )
        {
            return this.applications(command, params);
        }

        this.member();

        if (command.startsWith("al.science.") || command === AllianceScienceCommand.Target)
        {
            return this.science(this).command(command, params);
        }

        if (
            ([
                AllianceHelpCommand.Call,
                AllianceHelpCommand.Render,
                AllianceHelpCommand.All,
                AllianceHelpCommand.Show,
            ] as readonly string[]).includes(command)
        )
        {
            return this.help(this).command(command, params);
        }

        if (
            ([
                AllianceGiftCommand.Show,
                AllianceGiftCommand.Open,
                AllianceGiftCommand.Clear,
            ] as readonly string[]).includes(command)
        )
        {
            return this.gifts(this).command(command, params);
        }

        if (command === "al.permission.get")
        {
            return { permission: this.snapshot().permission! };
        }

        if (command === "al.permission.modify")
        {
            const values = changeAlliancePermissions(
                this.member(),
                text(this.alliance(), "permission"),
                str(params, "rankData"),
            );
            this.setAlliance({ ...this.alliance(), permission: JSON.stringify(values) });

            return {
                permission: sfs.object(
                    Object.fromEntries(
                        Object.entries(values).map(([key, value]) => [key, sfs.int(value)]),
                    ),
                ),
            };
        }

        if (command === "al.leave" || command === "al.leave.v2")
        {
            this.right("quit");

            return this.remove(this.owner);
        }

        if (command === "al.dismiss")
        {
            this.right("dissolve");

            if (this.list().length !== 1)
            {
                allianceFailure(errors.locked);
            }

            const body = this.remove(this.owner);
            this.write.alliances = [];
            this.write.deletedAlliances = [this.allianceId];

            return body;
        }

        if (command === "al.kick")
        {
            this.right("kick");
            const target = this.member(str(params, "playerId"));

            if (num(target, "rank") === 5 || target.uid === this.owner)
            {
                allianceFailure(errors.locked);
            }

            return this.remove(text(target, "uid"));
        }

        if (command === "al.setrank")
        {
            const target = this.member(str(params, "playerId")),
                rank = cityInteger(int(params, "rank"), 1, 4),
                own = this.member();
            this.right(rank > num(target, "rank") ? "rankup" : "rankdown");

            if (
                target.uid === this.owner
                || rank >= num(own, "rank")
                || num(target, "rank") > num(own, "rank")
            )
            {
                allianceFailure(errors.locked);
            }

            this.setMember({ ...target, rank });

            return { uid: sfs.string(text(target, "uid")), rank: sfs.int(rank) };
        }

        if (command === "al.leader.trans" || command === "al.leader.replace")
        {
            const leader = this.list().find((row) => num(row, "rank") === 5);

            if (!leader || this.list().filter((row) => num(row, "rank") === 5).length !== 1)
            {
                allianceFailure();
            }

            const target = command === "al.leader.trans"
                ? this.member(str(params, "playerId"))
                : this.member();

            if (
                target.uid === leader.uid
                || num(this.profile(text(leader, "uid")), "crossFightSrcServerId") > 0
                || num(this.profile(text(target, "uid")), "crossFightSrcServerId") > 0
            )
            {
                allianceFailure(errors.locked);
            }

            if (command === "al.leader.trans")
            {
                this.right("transfer");
            }
            else
            {
                const days = cityInteger(
                        this.rules.items.get("alliance_cost")
                            ?.[num(target, "rank") <= 2 ? "k12" : "k11"],
                        1,
                    ),
                    offline = long(this.profile(text(leader, "uid")), "offLineTime");

                if (!offline || this.now - offline < BigInt(days) * 86400000n)
                {
                    allianceFailure(errors.locked);
                }

                this.cost("k7");
            }

            this.setMember({ ...leader, rank: 4 });
            this.setMember({ ...target, rank: 5 });
            this.setAlliance({ ...this.alliance(), rallyPoint: 0 });

            return {
                alliance: sfs.object(this.snapshot()),
                oldLeaderId: sfs.string(text(leader, "uid")),
                oldLeaderRank: sfs.int(4),
                gold: sfs.long(this.ledger.total()),
            };
        }

        return this.attributes(command, params);
    }

    membership(command: string, params: Fields): Fields
    {
        if (command === "al.apply" || command === "al.cancelapply")
        {
            const id = str(params, "allianceId"),
                alliance = this.alliance(id);

            if (command === "al.cancelapply")
            {
                this.write.deletedApplications = this.state.applications
                    .filter(
                        (row) =>
                            row.userId === this.owner && row.allianceId === id
                            && num(row, "type") === 1,
                    )
                    .map((row) => text(row, "uid"));

                return {};
            }

            allianceJoinAllowed(
                this.profile(),
                alliance,
                this.state.members,
                this.power(this.owner),
                this.castle(this.owner),
                num(alliance, "maxMember") + Math.trunc(this.scienceEffect(500, id)),
            );

            if (num(alliance, "recruit") === 1)
            {
                return this.join(this.owner, alliance);
            }

            if (this.application(1, this.owner, id))
            {
                return { join: sfs.bool(false), joinBool: sfs.bool(false) };
            }

            const applications = this.state.applications
                .filter((row) => row.userId === this.owner && num(row, "type") === 1)
                .sort((a, b) => Number(long(a, "applyTime") - long(b, "applyTime")));
            this.write.deletedApplications = applications
                .slice(0, Math.max(0, applications.length - 3))
                .map((row) => text(row, "uid"));
            const uid = randomUUID();
            this.write.applications = [
                {
                    uid,
                    userId: this.owner,
                    allianceId: id,
                    type: 1,
                    applyTime: this.now,
                    message: Buffer.alloc(0),
                },
            ];
            const leader = this.list(id).find((row) => num(row, "rank") === 5);

            if (leader)
            {
                this.mail(25, text(leader, "uid"), uid, {
                    applicantId: this.owner,
                    applicantName: text(this.profile(), "name"),
                    contents: "115001|" + text(this.profile(), "name"),
                    deal: 0,
                });
            }

            return { join: sfs.bool(false), joinBool: sfs.bool(false), mailId: sfs.string(uid) };
        }

        if (command === "al.invite" || command === "al.cancelinvite")
        {
            this.right("invite");
            const uid = str(params, "playerId"),
                target = this.profile(uid);

            if (text(target, "allianceId") || num(target, "crossFightSrcServerId") > 0)
            {
                allianceFailure(errors.locked);
            }

            if (command === "al.cancelinvite")
            {
                const row = this.application(2, uid);
                this.write.deletedApplications = row ? [text(row, "uid")] : [];

                return {};
            }

            if ([1, 2, 3].some((type) => this.application(type, uid)))
            {
                allianceFailure(errors.locked);
            }

            const id = randomUUID(),
                alliance = this.alliance();
            this.write.applications = [
                {
                    uid: id,
                    userId: uid,
                    allianceId: this.allianceId,
                    type: 2,
                    applyTime: this.now,
                    message: Buffer.alloc(0),
                },
            ];
            this.mail(17, uid, id, {
                allianceId: this.allianceId,
                alliancename: text(alliance, "alliancename"),
                allianceLang: text(alliance, "language"),
                contents: "115000|" + text(alliance, "alliancename"),
                deal: 0,
            });

            return {
                allianceId: sfs.string(this.allianceId),
                inviteSenderId: sfs.string(this.owner),
                inviteReceiver: sfs.string(uid),
                mailId: sfs.string(id),
            };
        }

        const invite = command.endsWith("invite");
        let application: Row | undefined;
        let selectedMail: Row | undefined;

        if (params.mailId)
        {
            const id = str(params, "mailId"),
                mail = this.state.mails.find((row) => row.uid === id);

            if (!mail || mail.toUser !== this.owner || num(mail, "type") !== (invite ? 17 : 25))
            {
                allianceFailure(errors.locked);
            }

            selectedMail = mail;
            const data = allianceMailData(
                Buffer.isBuffer(mail.contents) ? mail.contents : Buffer.alloc(0),
            );

            if (Number(data.deal ?? 0) !== 0)
            {
                allianceFailure(errors.locked);
            }

            application = this.state.applications.find(
                (row) =>
                    num(row, "type") === (invite ? 2 : 1)
                    && long(row, "applyTime") + 28800000n > this.now
                    && (row.uid === id
                        || (invite && row.userId === this.owner
                            && row.allianceId === data.allianceId)
                        || (!invite && row.userId === data.applicantId
                            && row.allianceId === this.allianceId)),
            );
        }
        else if (!invite)
        {
            application = this.application(1, str(params, "playerId"));
        }

        if (!application)
        {
            allianceFailure(errors.locked);
        }

        if (
            (invite && application.userId !== this.owner)
            || (!invite && application.allianceId !== this.allianceId)
        )
        {
            allianceFailure(errors.locked);
        }

        if (!invite)
        {
            this.right("invite");
        }

        if (selectedMail)
        {
            this.write.mailUpdates = [
                {
                    ...selectedMail,
                    contents: Buffer.from(
                        JSON.stringify({
                            ...allianceMailData(selectedMail.contents as Buffer),
                            deal: 1,
                        }),
                    ),
                },
            ];
        }

        if (command.startsWith("al.refuse"))
        {
            if (invite)
            {
                this.write.applications = [{ ...application, type: 3 }];
            }
            else
            {
                this.write.deletedApplications = [text(application, "uid")];
            }

            return { result: sfs.int(1) };
        }

        const result = this.join(
            text(application, "userId"),
            this.alliance(text(application, "allianceId")),
        );

        return invite ? { result: sfs.int(1), allianceInfo: sfs.object(result) } : result;
    }

    applications(command: string, params: Fields): Fields
    {
        if (command === "al.apply.message" || command === "al.apply.message.get")
        {
            const id = str(params, "allianceId"),
                uid = command.endsWith(".get") ? str(params, "uid") : this.owner;

            if (uid !== this.owner)
            {
                this.member(this.owner, id);
                this.right("invite");
            }

            const row = this.application(1, uid, id);

            if (!row)
            {
                allianceFailure();
            }

            if (command.endsWith(".get"))
            {
                return {
                    message: sfs.string(
                        Buffer.isBuffer(row.message) ? row.message.toString("utf8") : "",
                    ),
                };
            }

            const message = allianceText(str(params, "message", ""), 0, 200);
            this.write.applications = [{ ...row, message: Buffer.from(message) }];

            return {};
        }

        const own = command.startsWith("al.user"),
            type = command.includes("invite") ? 2 : 1;

        if (!own)
        {
            this.member();
            this.right("invite");
        }

        const rows = this.state.applications
            .filter(
                (row) =>
                    num(row, "type") === type
                    && long(row, "applyTime") + 28800000n > this.now
                    && (own ? row.userId === this.owner : row.allianceId === this.allianceId),
            )
            .sort((a, b) => text(a, "uid").localeCompare(text(b, "uid")))
            .slice(
                ((this.state.selection.page ?? 1) - 1) * 10,
                ((this.state.selection.page ?? 1) - 1) * 10 + 10,
            );

        return {
            list: sfs.array(
                rows.map((row) =>
                    sfs.object({
                        uid: sfs.string(text(row, "uid")),
                        playerId: sfs.string(text(row, "userId")),
                        allianceId: sfs.string(text(row, "allianceId")),
                        applyTime: sfs.long(long(row, "applyTime")),
                        message: sfs.string(
                            Buffer.isBuffer(row.message) ? row.message.toString("utf8") : "",
                        ),
                    })
                ),
            ),
            page: sfs.int(this.state.selection.page ?? 0),
        };
    }

    attributes(command: string, params: Fields): Fields
    {
        const alliance = this.alliance(),
            next = { ...alliance };

        if (command === "al.changeattr" || command === "al.attr")
        {
            const changes: readonly [string, string, string, number, number, string?][] = [
                ["name", "alliancename", "name", 3, 20, "k1"],
                ["abbr", "abbr", "briefname", 3, 3],
                ["intro", "intro", "slogan", 0, 200],
                ["announce", "announce", "announcement", 0, 200],
                ["language", "language", "alliancelanguage", 0, 40],
                ["icon", "icon", "flag", 1, 40, "k3"],
            ];

            for (const [input, key, right, min, max, cost] of changes)
            {
                if (params[input])
                {
                    this.right(right);
                    next[key] = allianceText(str(params, input).trim(), min, max);

                    if (cost)
                    {
                        this.cost(cost);
                    }

                    if (input === "abbr")
                    {
                        if (num(alliance, "abbrRename") > 0)
                        {
                            this.cost("k2");
                        }

                        next.abbrRename = num(alliance, "abbrRename") + 1;
                    }
                }
            }

            if (params.recruit)
            {
                this.right("recruitment");
                next.recruit = cityInteger(int(params, "recruit"), 0, 1);
            }

            for (const key of ["powerRestriction", "castleRestriction"])
            {
                if (params[key])
                {
                    this.right("quest");
                    const value = Number(str(params, key));
                    next[key] = key === "powerRestriction"
                        ? BigInt(
                            cityInteger(
                                value,
                                0,
                                cityInteger(this.rules.items.get("alliance_gift")?.k3),
                            ),
                        )
                        : cityInteger(value, 0, 30);
                }
            }
        }
        else if (command === "al.rankname.set")
        {
            this.right("rankname");

            for (
                const [input, key] of [
                    ["rankOne", "rankone"],
                    ["rankTwo", "ranktwo"],
                    ["rankThree", "rankthree"],
                    ["rankFour", "rankfour"],
                    ["rankFive", "rankfive"],
                ]
            )
            {
                next[key!] = allianceText(str(params, input!), 0, 10);
            }
        }
        else if (command === "alliance.flag.choose")
        {
            this.right("flag");
            next.bannerStyle = allianceText(str(params, "banner"), 1, 50);
        }
        else if (command === "al.diplo")
        {
            this.right("announcement");

            for (const key of ["ally", "enemy", "other"])
            {
                next[key] = allianceText(str(params, key, ""), 0, 255);
            }
        }
        else if (command === "al.blacklist.query" || command === "al.blacklist.modify")
        {
            const row = this.state.blacklist.find((row) => row.allianceId === this.allianceId) ?? {
                allianceId: this.allianceId,
                black: "[]",
                white: "[]",
            };

            if (command.endsWith("modify"))
            {
                if (num(this.member(), "rank") !== 5)
                {
                    allianceFailure(errors.locked);
                }

                const field = cityInteger(int(params, "isBlack"), 0, 1) ? "black" : "white",
                    id = allianceText(str(params, "allianceId"), 1, 40);
                let values: string[];

                try
                {
                    values = JSON.parse(text(row, field) || "[]");
                }
                catch
                {
                    allianceFailure();
                }

                if (!Array.isArray(values) || values.some((value) => typeof value !== "string"))
                {
                    allianceFailure();
                }

                values = values.filter((value) => value !== id);

                if (cityInteger(int(params, "isAdd"), 0, 1))
                {
                    values.push(id);
                }

                if (JSON.stringify(values).length > 500)
                {
                    allianceFailure(errors.full);
                }

                this.write.blacklist = [{ ...row, [field]: JSON.stringify(values) }];
            }

            const value = this.write.blacklist?.[0] ?? row;

            return {
                black: sfs.string(text(value, "black")),
                white: sfs.string(text(value, "white")),
            };
        }
        else
        {
            throw new GameError(errors.unsupported);
        }

        this.setAlliance(next);

        return { alliance: sfs.object(this.snapshot(next)), gold: sfs.long(this.ledger.total()) };
    }
}

export function allianceStableId(value: string)
{
    return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
