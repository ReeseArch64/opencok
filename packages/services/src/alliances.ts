import type { AllianceContextFactory } from "@opencok/alliance/contracts/context";
import { AllianceQueryCommand } from "@opencok/alliance/enums/query-command";
import { AllianceMembershipCommand } from "@opencok/alliance/enums/membership-command";
import { AllianceApplicationCommand } from "@opencok/alliance/enums/application-command";
import { AllianceGovernanceCommand } from "@opencok/alliance/enums/governance-command";
import { randomUUID, createHash } from "node:crypto";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, str, int, Type, encode, type Fields } from "@opencok/messages/sfs";
import { text } from "@opencok/contracts/rows";
import type { AllianceRepository, AllianceState } from "@opencok/contracts/alliance-gameplay";
import type { Rules } from "@opencok/rules/game";
import { allianceFailure, allianceText } from "@opencok/rules/alliance";
import { cityInteger } from "@opencok/rules/city-progression";
import { inventoryReplay } from "@opencok/economy/mappings/inventory";
import {
    createInventoryPlanner,
    type RealmInventoryPlanner,
    type InventoryEffects,
} from "@opencok/services/inventory-runtime";
import { AllianceScienceCommand } from "@opencok/alliance/enums/science-command";
import { AllianceHelpCommand } from "@opencok/alliance/enums/help-command";
import type { AllianceGiftFactory } from "@opencok/alliance/contracts/gifts";
import { AllianceGiftCommand } from "@opencok/alliance/enums/gift-command";

export const allianceCommands = [
    AllianceMembershipCommand.Create,
    AllianceGovernanceCommand.Attributes,
    AllianceGovernanceCommand.ChangeAttributes,
    AllianceQueryCommand.CheckName,
    AllianceQueryCommand.Name,
    AllianceQueryCommand.Abbreviation,
    AllianceQueryCommand.Candidates,
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
    AllianceQueryCommand.FirstJoin,
    AllianceQueryCommand.Rank,
    AllianceQueryCommand.View,
    AllianceQueryCommand.Check,
    AllianceQueryCommand.Search,
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
        readonly contextFactory: AllianceContextFactory<
            AllianceState,
            Rules,
            RealmInventoryPlanner,
            InventoryEffects
        >,
        readonly gifts: AllianceGiftFactory<RealmInventoryPlanner>,
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
                const context = this.contextFactory(
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
            && command !== AllianceQueryCommand.Init
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
            && command !== AllianceQueryCommand.Init
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
                || (([AllianceQueryCommand.View, AllianceQueryCommand.Rank] as readonly string[])
                        .includes(command)
                    ? str(params, "uid", "")
                    : "")
                || undefined,
            playerId: (command === AllianceQueryCommand.Check
                ? str(params, "uid", "")
                : str(params, "playerId", ""))
                || undefined,
            mailId: str(params, "mailId", "") || undefined,
            helpId: str(params, "helpId", "") || undefined,
            key: ([
                    AllianceQueryCommand.Search,
                    AllianceQueryCommand.CheckName,
                    AllianceQueryCommand.Name,
                    AllianceQueryCommand.Abbreviation,
                    AllianceQueryCommand.Candidates,
                    AllianceMembershipCommand.Create,
                ] as readonly string[]).includes(command)
                ? str(
                    params,
                    "key",
                    str(
                        params,
                        command === AllianceQueryCommand.Abbreviation ? "abbr" : "name",
                        "",
                    ),
                )
                : undefined,
            searchPlayers: command === AllianceQueryCommand.Candidates,
            language: str(params, "lang", str(params, "language", "")),
            pageSize: command === AllianceQueryCommand.Search && int(params, "type", 0) === 2
                ? 5
                : 10,
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
                const context = this.contextFactory(
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

export function allianceStableId(value: string)
{
    return createHash("sha256").update(value).digest("hex").slice(0, 32);
}
