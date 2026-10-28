import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceHelpReaders } from "../contracts/help-runtime";

export class AllianceHelpMapper
{
    public constructor(private readonly runtime: AllianceHelpReaders)
    {}

    public readonly snapshot = (
        help: Row,
        activity: Row,
        profile: Row,
        allianceId: string,
        owner: string,
    ): Fields => {
        const { text, num, long } = this.runtime;

        return {
            uid: sfs.string(text(help, "helpId")),
            helpId: sfs.string(text(help, "helpId")),
            allianceId: sfs.string(allianceId),
            senderId: sfs.string(text(help, "senderId")),
            recvId: sfs.string(owner),
            content: sfs.string(text(help, "content")),
            queueId: sfs.string(text(help, "content")),
            name: sfs.string(text(profile, "name")),
            pic: sfs.string(text(profile, "pic")),
            picVer: sfs.int(num(profile, "picVer")),
            qType: sfs.int(num(help, "type")),
            type: sfs.int(num(help, "type")),
            itemId: sfs.string(text(help, "itemId")),
            level: sfs.int(num(help, "level")),
            maxcount: sfs.int(num(help, "maxcount")),
            nowcount: sfs.int(num(help, "nowcount")),
            maxCount: sfs.int(num(help, "maxcount")),
            nowCount: sfs.int(num(help, "nowcount")),
            star: sfs.int(num(help, "star")),
            progress: sfs.int(num(help, "progress")),
            stats: sfs.int(help.senderId === owner ? 0 : 1),
            updateTime: sfs.long(long(activity, "dueAt")),
            startTime: sfs.long(long(help, "startTime")),
        };
    };

    public readonly result = (
        row: Row,
        next: Row,
        queue: Row,
        dueAt: bigint,
        profile: () => Row,
    ): Fields => {
        const { text, num } = this.runtime;

        return {
            queueId: sfs.string(text(queue, "uuid")),
            updateTime: sfs.long(dueAt),
            senderId: sfs.string(text(row, "senderId")),
            helpName: sfs.string(text(profile(), "name")),
            helpId: sfs.string(text(row, "helpId")),
            itemId: sfs.string(text(row, "itemId")),
            level: sfs.int(num(row, "level")),
            type: sfs.int(num(row, "type")),
            maxCount: sfs.int(num(row, "maxcount")),
            nowCount: sfs.int(num(next, "nowcount")),
        };
    };

    public readonly publication = (help: Row, active: Row): Fields => {
        const { text, num, long } = this.runtime;

        return {
            helpId: sfs.string(text(help, "helpId")),
            senderId: sfs.string(text(help, "senderId")),
            content: sfs.string(text(help, "content")),
            queueId: sfs.string(text(help, "content")),
            updateTime: sfs.long(long(active, "updateTime")),
            maxcount: sfs.int(num(help, "maxcount")),
            nowcount: sfs.int(num(help, "nowcount")),
            maxCount: sfs.int(num(help, "maxcount")),
            nowCount: sfs.int(num(help, "nowcount")),
            qType: sfs.int(num(help, "type")),
            itemId: sfs.string(text(help, "itemId")),
            level: sfs.int(num(help, "level")),
            isvalid: sfs.int(num(help, "isvalid")),
        };
    };
}
