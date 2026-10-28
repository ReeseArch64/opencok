import { str, int, Type, type Fields } from "@opencok/messages/sfs";
import type { AllianceCommandRequest, AllianceCommandRuntime } from "../contracts/command";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AllianceScienceCommand } from "../enums/science-command";
import { AllianceQueryCommand } from "../enums/query-command";
import { AllianceMembershipCommand } from "../enums/membership-command";
import { AlliancePublicationTrigger } from "../enums/publication";

export class AllianceCommandValidation
{
    public constructor(
        private readonly runtime: AllianceCommandRuntime,
        private readonly policy: AllianceMembershipPolicy,
        private readonly forbidden: (value: string) => boolean | Promise<boolean> = () => false,
    )
    {}

    public async prepare(command: string, params: Fields): Promise<AllianceCommandRequest>
    {
        const { cityInteger, randomUUID } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceText } = this.policy;

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
            command !== AlliancePublicationTrigger.Tick
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

        return { requestId, request, selection };
    }
}
