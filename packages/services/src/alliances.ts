import type { AllianceMembershipFactory } from "@opencok/alliance/contracts/membership";
import { AllianceMembershipCommand } from "@opencok/alliance/enums/membership-command";
import type { AllianceApplicationsFactory } from "@opencok/alliance/contracts/applications";
import { AllianceApplicationCommand } from "@opencok/alliance/enums/application-command";
import type { AllianceGovernanceFactory } from "@opencok/alliance/contracts/governance";
import { AllianceGovernanceCommand } from "@opencok/alliance/enums/governance-command";
import { randomUUID, createHash } from "node:crypto";
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
} from "@opencok/rules/alliance";
import { cityInteger } from "@opencok/rules/city-progression";
import { allianceSnapshot } from "@opencok/mappings/alliance";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
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
    AllianceMembershipCommand.Create,
    AllianceGovernanceCommand.Attributes,
    AllianceGovernanceCommand.ChangeAttributes,
    "al.checkname",
    "al.name",
    "al.abbr",
    "al.searchuser",
    AllianceApplicationCommand.Apply,
    AllianceApplicationCommand.CancelApply,
    AllianceApplicationCommand.Invite,
    AllianceApplicationCommand.CancelInvite,
    AllianceApplicationCommand.AcceptApply,
    AllianceApplicationCommand.RefuseApply,
    AllianceApplicationCommand.AcceptInvite,
    AllianceApplicationCommand.RefuseInvite,
    AllianceApplicationCommand.ApplyList,
    AllianceApplicationCommand.InviteList,
    AllianceApplicationCommand.UserApplyList,
    AllianceApplicationCommand.UserInviteList,
    AllianceApplicationCommand.Message,
    AllianceApplicationCommand.GetMessage,
    AllianceGovernanceCommand.Leave,
    AllianceGovernanceCommand.LeaveV2,
    AllianceGovernanceCommand.Dismiss,
    AllianceGovernanceCommand.Kick,
    AllianceGovernanceCommand.Rank,
    AllianceGovernanceCommand.Transfer,
    AllianceGovernanceCommand.Replace,
    "al.get.firstjoin",
    "al.rank",
    "al.view",
    "al.check",
    "al.search",
    AllianceGovernanceCommand.PermissionGet,
    AllianceGovernanceCommand.PermissionModify,
    AllianceGovernanceCommand.RankNames,
    AllianceGovernanceCommand.Flag,
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
    AllianceGovernanceCommand.Diplomacy,
    AllianceGovernanceCommand.BlacklistQuery,
    AllianceGovernanceCommand.BlacklistModify,
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
        readonly governance: AllianceGovernanceFactory,
        readonly applicationsFactory: AllianceApplicationsFactory,
        readonly membershipFactory: AllianceMembershipFactory<Rules, RealmInventoryPlanner>,
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
                    this.governance,
                    this.applicationsFactory,
                    this.membershipFactory,
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
                    AllianceMembershipCommand.Create,
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
                    this.governance,
                    this.applicationsFactory,
                    this.membershipFactory,
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
        private readonly governance: AllianceGovernanceFactory,
        private readonly applicationsFactory: AllianceApplicationsFactory,
        private readonly membershipFactory: AllianceMembershipFactory<Rules, RealmInventoryPlanner>,
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

    join(uid: string, alliance: Row, rank = 1)
    {
        return this.membershipFactory(this).join(uid, alliance, rank);
    }

    remove(uid: string)
    {
        return this.membershipFactory(this).remove(uid);
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

        if (command === AllianceMembershipCommand.Create)
        {
            return this.membershipFactory(this).create(params);
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
            ([
                AllianceApplicationCommand.Apply,
                AllianceApplicationCommand.CancelApply,
                AllianceApplicationCommand.AcceptApply,
                AllianceApplicationCommand.RefuseApply,
                AllianceApplicationCommand.Invite,
                AllianceApplicationCommand.CancelInvite,
                AllianceApplicationCommand.AcceptInvite,
                AllianceApplicationCommand.RefuseInvite,
            ] as readonly string[]).includes(command)
        )
        {
            return this.applicationsFactory(this).command(command, params);
        }

        if (
            ([
                AllianceApplicationCommand.ApplyList,
                AllianceApplicationCommand.InviteList,
                AllianceApplicationCommand.UserApplyList,
                AllianceApplicationCommand.UserInviteList,
                AllianceApplicationCommand.Message,
                AllianceApplicationCommand.GetMessage,
            ] as readonly string[]).includes(command)
        )
        {
            return this.applicationsFactory(this).queries(command, params);
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

        return this.governance(this).command(command, params);
    }
}

export function allianceStableId(value: string)
{
    return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
