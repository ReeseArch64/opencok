import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceContextState, AllianceContextWrite } from "../contracts/context-state";
import type { AllianceContextCatalog } from "../contracts/context-catalog";
import type { AllianceContextLedger } from "../contracts/context";
import type { AllianceContextRuntime } from "../contracts/context-runtime";
import type { AllianceContextFactories } from "../contracts/context-factories";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AlliancePublicationTrigger } from "../enums/publication";
import { AllianceQueryCommand } from "../enums/query-command";
import { AllianceMembershipCommand } from "../enums/membership-command";
import { AllianceApplicationCommand } from "../enums/application-command";
import { AllianceScienceCommand } from "../enums/science-command";
import { AllianceHelpCommand } from "../enums/help-command";
import { AllianceGiftCommand } from "../enums/gift-command";

export class AllianceContext<
    TCatalog extends AllianceContextCatalog,
    TLedger extends AllianceContextLedger,
>
{
    readonly write: AllianceContextWrite = {};
    readonly productionOwners = new Set<string>();
    productionAt?: bigint;
    readonly allianceId: string;

    public constructor(
        readonly owner: string,
        readonly state: AllianceContextState,
        readonly rules: TCatalog,
        readonly ledger: TLedger,
        private readonly runtime: AllianceContextRuntime<TLedger>,
        private readonly policy: AllianceMembershipPolicy,
        private readonly factories: AllianceContextFactories<TCatalog, TLedger>,
    )
    {
        this.allianceId = this.runtime.text(state.inventory.profile, "allianceId");
    }

    async effect(id: number)
    {
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const value = await this.runtime.effect(id);

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
        const { text, errors } = this.runtime;
        const { allianceMember } = this.policy;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

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
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

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
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        const row = this.state.profiles.find((row) => row.uid === uid);

        if (!row)
        {
            allianceFailure();
        }

        return row;
    }

    castle(uid: string)
    {
        const { num } = this.runtime;

        return num(
            this.state.cities.find((row) => row.uid === uid && num(row, "itemId") === 400000) ?? {},
            "level",
        );
    }

    power(uid: string)
    {
        const { long } = this.runtime;

        return long(this.state.powers.find((row) => row.uid === uid) ?? {}, "power");
    }

    right(key: string)
    {
        const { allianceRight } = this.policy;

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
        const { activityEconomy, cityInteger } = this.runtime;

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
        const { num } = this.runtime;

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

    snapshot(alliance?: Row, member?: Row)
    {
        return this.factories.snapshotFactory(this).snapshot(alliance, member);
    }

    scienceSnapshots(id: string)
    {
        return this.factories.science(this).snapshots(id);
    }

    join(uid: string, alliance: Row, rank = 1)
    {
        return this.factories.membershipFactory(this).join(uid, alliance, rank);
    }

    remove(uid: string)
    {
        return this.factories.membershipFactory(this).remove(uid);
    }

    async command(command: string, params: Fields): Promise<Fields>
    {
        if (command === AlliancePublicationTrigger.Tick)
        {
            return this.factories.science(this).complete();
        }

        if (command === AllianceQueryCommand.Init)
        {
            return this.factories.queriesFactory(this).command(command);
        }

        if (command === AllianceMembershipCommand.Create)
        {
            return this.factories.membershipFactory(this).create(params);
        }

        if ((Object.values(AllianceQueryCommand) as readonly string[]).includes(command))
        {
            return this.factories.queriesFactory(this).command(command);
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
            return this.factories.applicationsFactory(this).command(command, params);
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
            return this.factories.applicationsFactory(this).queries(command, params);
        }

        this.member();

        if (command.startsWith("al.science.") || command === AllianceScienceCommand.Target)
        {
            return this.factories.science(this).command(command, params);
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
            return this.factories.help(this).command(command, params);
        }

        if (
            ([
                AllianceGiftCommand.Show,
                AllianceGiftCommand.Open,
                AllianceGiftCommand.Clear,
            ] as readonly string[]).includes(command)
        )
        {
            return this.factories.gifts(this).command(command, params);
        }

        return this.factories.governance(this).command(command, params);
    }
}
