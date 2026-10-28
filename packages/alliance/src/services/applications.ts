import { str, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceApplicationContext } from "../contracts/applications";
import type { AllianceApplicationRuntime } from "../contracts/application-runtime";
import { AllianceMembershipPolicy } from "../rules/membership";
import { AllianceApplicationsMapper } from "../mappings/applications";
import { AllianceApplicationCommand } from "../enums/application-command";

export class AllianceApplicationsService
{
    public constructor(
        private readonly c: AllianceApplicationContext,
        private readonly runtime: AllianceApplicationRuntime,
        private readonly policy: AllianceMembershipPolicy,
        private readonly mapper: AllianceApplicationsMapper,
    )
    {}

    command(command: string, params: Fields): Fields
    {
        const { text, num, long, randomUUID, errors } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceJoinAllowed } = this.policy;

        if (
            command === AllianceApplicationCommand.Apply
            || command === AllianceApplicationCommand.CancelApply
        )
        {
            const id = str(params, "allianceId"),
                alliance = this.c.alliance(id);

            if (command === AllianceApplicationCommand.CancelApply)
            {
                this.c.write.deletedApplications = this.c.state.applications
                    .filter(
                        (row) =>
                            row.userId === this.c.owner && row.allianceId === id
                            && num(row, "type") === 1,
                    )
                    .map((row) => text(row, "uid"));

                return {};
            }

            allianceJoinAllowed(
                this.c.profile(),
                alliance,
                this.c.state.members,
                this.c.power(this.c.owner),
                this.c.castle(this.c.owner),
                num(alliance, "maxMember") + Math.trunc(this.c.scienceEffect(500, id)),
            );

            if (num(alliance, "recruit") === 1)
            {
                return this.c.join(this.c.owner, alliance);
            }

            if (this.application(1, this.c.owner, id))
            {
                return this.mapper.pending();
            }

            const applications = this.c.state.applications
                .filter((row) => row.userId === this.c.owner && num(row, "type") === 1)
                .sort((a, b) => Number(long(a, "applyTime") - long(b, "applyTime")));
            this.c.write.deletedApplications = applications
                .slice(0, Math.max(0, applications.length - 3))
                .map((row) => text(row, "uid"));
            const uid = randomUUID();
            this.c.write.applications = [
                {
                    uid,
                    userId: this.c.owner,
                    allianceId: id,
                    type: 1,
                    applyTime: this.c.now,
                    message: Buffer.alloc(0),
                },
            ];
            const leader = this.c.list(id).find((row) => num(row, "rank") === 5);

            if (leader)
            {
                this.mail(25, text(leader, "uid"), uid, {
                    applicantId: this.c.owner,
                    applicantName: text(this.c.profile(), "name"),
                    contents: "115001|" + text(this.c.profile(), "name"),
                    deal: 0,
                });
            }

            return this.mapper.pendingMail(uid);
        }

        if (
            command === AllianceApplicationCommand.Invite
            || command === AllianceApplicationCommand.CancelInvite
        )
        {
            this.c.right("invite");
            const uid = str(params, "playerId"),
                target = this.c.profile(uid);

            if (text(target, "allianceId") || num(target, "crossFightSrcServerId") > 0)
            {
                allianceFailure(errors.locked);
            }

            if (command === AllianceApplicationCommand.CancelInvite)
            {
                const row = this.application(2, uid);
                this.c.write.deletedApplications = row ? [text(row, "uid")] : [];

                return {};
            }

            if ([1, 2, 3].some((type) => this.application(type, uid)))
            {
                allianceFailure(errors.locked);
            }

            const id = randomUUID(),
                alliance = this.c.alliance();
            this.c.write.applications = [
                {
                    uid: id,
                    userId: uid,
                    allianceId: this.c.allianceId,
                    type: 2,
                    applyTime: this.c.now,
                    message: Buffer.alloc(0),
                },
            ];
            this.mail(17, uid, id, {
                allianceId: this.c.allianceId,
                alliancename: text(alliance, "alliancename"),
                allianceLang: text(alliance, "language"),
                contents: "115000|" + text(alliance, "alliancename"),
                deal: 0,
            });

            return this.mapper.invitation(this.c.allianceId, this.c.owner, uid, id);
        }

        const invite = command.endsWith("invite");
        let application: Row | undefined;
        let selectedMail: Row | undefined;

        if (params.mailId)
        {
            const id = str(params, "mailId"),
                mail = this.c.state.mails.find((row) => row.uid === id);

            if (!mail || mail.toUser !== this.c.owner || num(mail, "type") !== (invite ? 17 : 25))
            {
                allianceFailure(errors.locked);
            }

            selectedMail = mail;
            const data = AllianceApplicationsMapper.mailData(
                Buffer.isBuffer(mail.contents) ? mail.contents : Buffer.alloc(0),
            );

            if (Number(data.deal ?? 0) !== 0)
            {
                allianceFailure(errors.locked);
            }

            application = this.c.state.applications.find(
                (row) =>
                    num(row, "type") === (invite ? 2 : 1)
                    && long(row, "applyTime") + 28800000n > this.c.now
                    && (row.uid === id
                        || (invite && row.userId === this.c.owner
                            && row.allianceId === data.allianceId)
                        || (!invite && row.userId === data.applicantId
                            && row.allianceId === this.c.allianceId)),
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
            (invite && application.userId !== this.c.owner)
            || (!invite && application.allianceId !== this.c.allianceId)
        )
        {
            allianceFailure(errors.locked);
        }

        if (!invite)
        {
            this.c.right("invite");
        }

        if (selectedMail)
        {
            this.c.write.mailUpdates = [
                {
                    ...selectedMail,
                    contents: Buffer.from(
                        JSON.stringify({
                            ...AllianceApplicationsMapper.mailData(selectedMail.contents as Buffer),
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
                this.c.write.applications = [{ ...application, type: 3 }];
            }
            else
            {
                this.c.write.deletedApplications = [text(application, "uid")];
            }

            return this.mapper.result();
        }

        const result = this.c.join(
            text(application, "userId"),
            this.c.alliance(text(application, "allianceId")),
        );

        return invite ? this.mapper.acceptedInvite(result) : result;
    }

    queries(command: string, params: Fields): Fields
    {
        const { text, num, long } = this.runtime;
        const allianceFailure: (code?: string) => never = this.runtime.allianceFailure;
        const { allianceText } = this.policy;

        if (
            command === AllianceApplicationCommand.Message
            || command === AllianceApplicationCommand.GetMessage
        )
        {
            const id = str(params, "allianceId"),
                uid = command.endsWith(".get") ? str(params, "uid") : this.c.owner;

            if (uid !== this.c.owner)
            {
                this.c.member(this.c.owner, id);
                this.c.right("invite");
            }

            const row = this.application(1, uid, id);

            if (!row)
            {
                allianceFailure();
            }

            if (command.endsWith(".get"))
            {
                return this.mapper.message(row);
            }

            const message = allianceText(str(params, "message", ""), 0, 200);
            this.c.write.applications = [{ ...row, message: Buffer.from(message) }];

            return {};
        }

        const own = command.startsWith("al.user"),
            type = command.includes("invite") ? 2 : 1;

        if (!own)
        {
            this.c.member();
            this.c.right("invite");
        }

        const rows = this.c.state.applications
            .filter(
                (row) =>
                    num(row, "type") === type
                    && long(row, "applyTime") + 28800000n > this.c.now
                    && (own ? row.userId === this.c.owner : row.allianceId === this.c.allianceId),
            )
            .sort((a, b) => text(a, "uid").localeCompare(text(b, "uid")))
            .slice(
                ((this.c.state.selection.page ?? 1) - 1) * 10,
                ((this.c.state.selection.page ?? 1) - 1) * 10 + 10,
            );

        return this.mapper.list(rows, () => this.c.state.selection.page ?? 0);
    }

    application(type: number, uid = this.c.owner, id = this.c.allianceId)
    {
        const { num, long } = this.runtime;

        return this.c.state.applications.find(
            (row) =>
                row.userId === uid
                && row.allianceId === id
                && num(row, "type") === type
                && long(row, "applyTime") + 28800000n > this.c.now,
        );
    }

    mail(type: number, to: string, id: string, contents: Record<string, string | number>)
    {
        const { text } = this.runtime;

        const template = this.c.rules.mail.get(type === 17 ? "10009" : "10010");
        this.c.write.mails = [
            ...(this.c.write.mails ?? []),
            {
                uid: id,
                toUser: to,
                fromUser: this.c.owner,
                fromName: text(this.c.profile(), "name"),
                type,
                title: template?.title ?? "",
                contents: Buffer.from(JSON.stringify(contents)),
                createTime: this.c.now,
                rewardStatus: 0,
            },
        ];
    }
}
