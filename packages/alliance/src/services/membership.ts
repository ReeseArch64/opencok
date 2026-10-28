import { str, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceMembershipCatalog } from "../contracts/membership-catalog";
import type { AllianceMembershipContext } from "../contracts/membership";
import type { AllianceMembershipRuntime } from "../contracts/membership-runtime";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AllianceMembershipMapper } from "../mappings/membership";
import { AllianceProgressAction } from "../enums/progress-action";
import type { CreateAllianceDto } from "../dtos/create-alliance.dto";
import { createAllianceSchema } from "../validations/alliance";

export class AllianceMembershipService<TCatalog extends AllianceMembershipCatalog, TLedger>
{
    public constructor(
        private readonly c: AllianceMembershipContext<TCatalog, TLedger>,
        private readonly runtime: AllianceMembershipRuntime<TCatalog, TLedger>,
        private readonly policy: AllianceMembershipPolicy,
        private readonly mapper: AllianceMembershipMapper,
    )
    {}

    public create(params: Fields): Fields
    {
        const { text, num, randomUUID, errors, activityEconomy } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceText, allianceCreationCost, alliancePermissions } = this.policy;

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
            this.c.allianceId
            || this.c.state.members.some((row) =>
                row.uid === this.c.owner && text(row, "allianceId")
            )
            || num(this.c.profile(), "crossFightSrcServerId") > 0
        )
        {
            allianceFailure(errors.locked);
        }

        activityEconomy(this.c.ledger).gold(
            -allianceCreationCost(this.c.rules, this.c.castle(this.c.owner)),
        );
        const proposed = [...name].slice(0, 3).join(""),
            abbr = this.c.state.directory.some(
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
                country: text(this.c.profile(), "country"),
                curMember: 0,
                maxMember: 50,
                recruit: 1,
                alliancepoint: 0n,
                createtime: this.c.now,
                bannerStyle: text(this.c.profile(), "country") || "UN",
                giftlevel: 0,
                permission: JSON.stringify(alliancePermissions("")),
                powerRestriction: 0n,
                castleRestriction: 0,
            };
        this.c.setAlliance(row);

        return this.join(this.c.owner, row, 5);
    }

    checkMarch(uid: string)
    {
        const { text, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        if (
            this.c.state.marches.some(
                (row) =>
                    row.ownerUid === uid
                    && (text(row, "teamId")
                        || (text(row, "allianceId")
                            && text(row, "allianceId") !== this.c.allianceId)),
            )
        )
        {
            allianceFailure(errors.locked);
        }
    }

    public join(uid: string, alliance: Row, rank = 1)
    {
        const { text, num, long, errors, previewRewards, randomInt, javaMailBytes } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceJoinAllowed, newAllianceMember } = this.policy;

        const profile = this.c.profile(uid),
            id = text(alliance, "uid");
        this.checkMarch(uid);

        if (
            this.c.state.marches.length > 8192
            || this.c.state.marches.some(
                (march) =>
                    march.allianceId === id
                    && num(march, "state") === 0
                    && long(march, "marchArrivalTime") >= this.c.now
                    && (march.targetUid === uid
                        || this.c.state.points.some(
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
            this.c.state.members,
            this.c.power(uid),
            this.c.castle(uid),
            num(alliance, "maxMember") + Math.trunc(this.c.scienceEffect(500, id)),
        );
        const row = newAllianceMember(
            uid,
            id,
            rank,
            this.c.now,
            this.c.state.members.find((row) => row.uid === uid),
        );
        this.c.setMember(row);
        this.c.write.actions = [{ uid, kind: AllianceProgressAction.Join, count: 1 }];
        this.c.write.memberships = [{ uid, allianceId: id }];
        this.c.setAlliance({ ...alliance, curMember: this.c.list(id).length + 1 });

        if (
            Number(this.c.state.lords.find((row) => row.uid === uid)?.firstJoinAllianceFlag ?? 1)
                === 1
        )
        {
            const template = this.c.rules.mail.get("10011");

            if (template)
            {
                const rewards = previewRewards(
                    template.reward,
                    this.c.rules,
                    {
                        kingdomId: this.c.rules.kingdomId,
                        version: "12.06.0",
                        now: Number(this.c.now),
                    },
                    randomInt,
                );
                const rewardId = this.mapper.rewardId(rewards);
                const contents = javaMailBytes(template.message);

                if (!contents)
                {
                    allianceFailure();
                }

                this.c.write.mails = [
                    ...(this.c.write.mails ?? []),
                    this.mapper.firstJoinMail(uid, template, contents, rewardId, this.c.now),
                ];
            }
        }

        this.c.productionOwners.add(uid);

        return this.mapper.joined(
            () => this.c.snapshot(alliance, row),
            rank,
            () =>
                Number(
                    this.c.state.lords.find((row) => row.uid === uid)?.firstJoinAllianceFlag ?? 1,
                ),
        );
    }

    public remove(uid: string)
    {
        const { num, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;

        this.checkMarch(uid);
        const profile = this.c.profile(uid);

        if (num(profile, "crossFightSrcServerId") > 0)
        {
            allianceFailure(errors.locked);
        }

        this.c.write.memberships = [{ uid, allianceId: "" }];
        this.c.write.removedMembers = [uid];
        this.c.write.firstJoin = [uid];
        this.c.setAlliance({ ...this.c.alliance(), curMember: this.c.list().length - 1 });
        this.c.productionOwners.add(uid);

        return this.mapper.removed(uid, this.c.allianceId);
    }
}
