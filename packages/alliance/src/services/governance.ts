import { str, int, type Fields } from "@opencok/messages/sfs";
import type { AllianceGovernanceContext } from "../contracts/governance";
import type { AllianceGovernanceRuntime } from "../contracts/governance-runtime";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AllianceGovernanceMapper } from "../mappings/governance";
import { AllianceGovernanceCommand } from "../enums/governance-command";

export class AllianceGovernanceService
{
    public constructor(
        private readonly c: AllianceGovernanceContext,
        private readonly runtime: AllianceGovernanceRuntime,
        private readonly policy: AllianceMembershipPolicy,
        private readonly mapper: AllianceGovernanceMapper,
    )
    {}

    public command(command: string, params: Fields): Fields
    {
        const { text, num, long, cityInteger, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { changeAlliancePermissions } = this.policy;

        if (command === AllianceGovernanceCommand.PermissionGet)
        {
            return this.mapper.currentPermission(this.c.snapshot());
        }

        if (command === AllianceGovernanceCommand.PermissionModify)
        {
            const values = changeAlliancePermissions(
                this.c.member(),
                text(this.c.alliance(), "permission"),
                str(params, "rankData"),
            );
            this.c.setAlliance({ ...this.c.alliance(), permission: JSON.stringify(values) });

            return this.mapper.permissions(values);
        }

        if (
            command === AllianceGovernanceCommand.Leave
            || command === AllianceGovernanceCommand.LeaveV2
        )
        {
            this.c.right("quit");

            return this.c.remove(this.c.owner);
        }

        if (command === AllianceGovernanceCommand.Dismiss)
        {
            this.c.right("dissolve");

            if (this.c.list().length !== 1)
            {
                allianceFailure(errors.locked);
            }

            const body = this.c.remove(this.c.owner);
            this.c.write.alliances = [];
            this.c.write.deletedAlliances = [this.c.allianceId];

            return body;
        }

        if (command === AllianceGovernanceCommand.Kick)
        {
            this.c.right("kick");
            const target = this.c.member(str(params, "playerId"));

            if (num(target, "rank") === 5 || target.uid === this.c.owner)
            {
                allianceFailure(errors.locked);
            }

            return this.c.remove(text(target, "uid"));
        }

        if (command === AllianceGovernanceCommand.Rank)
        {
            const target = this.c.member(str(params, "playerId")),
                rank = cityInteger(int(params, "rank"), 1, 4),
                own = this.c.member();
            this.c.right(rank > num(target, "rank") ? "rankup" : "rankdown");

            if (
                target.uid === this.c.owner
                || rank >= num(own, "rank")
                || num(target, "rank") > num(own, "rank")
            )
            {
                allianceFailure(errors.locked);
            }

            this.c.setMember({ ...target, rank });

            return this.mapper.rank(target, rank);
        }

        if (
            command === AllianceGovernanceCommand.Transfer
            || command === AllianceGovernanceCommand.Replace
        )
        {
            const leader = this.c.list().find((row) => num(row, "rank") === 5);

            if (!leader || this.c.list().filter((row) => num(row, "rank") === 5).length !== 1)
            {
                allianceFailure();
            }

            const target = command === AllianceGovernanceCommand.Transfer
                ? this.c.member(str(params, "playerId"))
                : this.c.member();

            if (
                target.uid === leader.uid
                || num(this.c.profile(text(leader, "uid")), "crossFightSrcServerId") > 0
                || num(this.c.profile(text(target, "uid")), "crossFightSrcServerId") > 0
            )
            {
                allianceFailure(errors.locked);
            }

            if (command === AllianceGovernanceCommand.Transfer)
            {
                this.c.right("transfer");
            }
            else
            {
                const days = cityInteger(
                        this.c.rules.items.get("alliance_cost")
                            ?.[num(target, "rank") <= 2 ? "k12" : "k11"],
                        1,
                    ),
                    offline = long(this.c.profile(text(leader, "uid")), "offLineTime");

                if (!offline || this.c.now - offline < BigInt(days) * 86400000n)
                {
                    allianceFailure(errors.locked);
                }

                this.c.cost("k7");
            }

            this.c.setMember({ ...leader, rank: 4 });
            this.c.setMember({ ...target, rank: 5 });
            this.c.setAlliance({ ...this.c.alliance(), rallyPoint: 0 });

            return this.mapper.leader(() => this.c.snapshot(), leader, () => this.c.ledger.total());
        }

        return this.attributes(command, params);
    }

    attributes(command: string, params: Fields): Fields
    {
        const { text, num, cityInteger, errors, unsupportedFailure } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceText } = this.policy;

        const alliance = this.c.alliance(),
            next = { ...alliance };

        if (
            command === AllianceGovernanceCommand.ChangeAttributes
            || command === AllianceGovernanceCommand.Attributes
        )
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
                    this.c.right(right);
                    next[key] = allianceText(str(params, input).trim(), min, max);

                    if (cost)
                    {
                        this.c.cost(cost);
                    }

                    if (input === "abbr")
                    {
                        if (num(alliance, "abbrRename") > 0)
                        {
                            this.c.cost("k2");
                        }

                        next.abbrRename = num(alliance, "abbrRename") + 1;
                    }
                }
            }

            if (params.recruit)
            {
                this.c.right("recruitment");
                next.recruit = cityInteger(int(params, "recruit"), 0, 1);
            }

            for (const key of ["powerRestriction", "castleRestriction"])
            {
                if (params[key])
                {
                    this.c.right("quest");
                    const value = Number(str(params, key));
                    next[key] = key === "powerRestriction"
                        ? BigInt(
                            cityInteger(
                                value,
                                0,
                                cityInteger(this.c.rules.items.get("alliance_gift")?.k3),
                            ),
                        )
                        : cityInteger(value, 0, 30);
                }
            }
        }
        else if (command === AllianceGovernanceCommand.RankNames)
        {
            this.c.right("rankname");

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
        else if (command === AllianceGovernanceCommand.Flag)
        {
            this.c.right("flag");
            next.bannerStyle = allianceText(str(params, "banner"), 1, 50);
        }
        else if (command === AllianceGovernanceCommand.Diplomacy)
        {
            this.c.right("announcement");

            for (const key of ["ally", "enemy", "other"])
            {
                next[key] = allianceText(str(params, key, ""), 0, 255);
            }
        }
        else if (
            command === AllianceGovernanceCommand.BlacklistQuery
            || command === AllianceGovernanceCommand.BlacklistModify
        )
        {
            const row = this.c.state.blacklist.find((row) => row.allianceId === this.c.allianceId)
                ?? {
                    allianceId: this.c.allianceId,
                    black: "[]",
                    white: "[]",
                };

            if (command.endsWith("modify"))
            {
                if (num(this.c.member(), "rank") !== 5)
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

                this.c.write.blacklist = [{ ...row, [field]: JSON.stringify(values) }];
            }

            const value = this.c.write.blacklist?.[0] ?? row;

            return this.mapper.blacklist(value);
        }
        else
        {
            unsupportedFailure();
        }

        this.c.setAlliance(next);

        return this.mapper.attributes(() => this.c.snapshot(next), () => this.c.ledger.total());
    }
}
