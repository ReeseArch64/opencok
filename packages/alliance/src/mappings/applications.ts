import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";

export class AllianceApplicationsMapper
{
    public constructor(private readonly runtime: AllianceRecordReaders)
    {}

    public static mailData(contents: Buffer): Record<string, string | number>
    {
        const raw = contents.toString("utf8").replace(/^\s+|[\s\0]+$/g, "");
        const value: unknown = JSON.parse(raw);

        if (!value || typeof value !== "object" || Array.isArray(value))
        {
            throw new Error("Invalid alliance mail");
        }

        const result: Record<string, string | number> = {};

        for (const [key, entry] of Object.entries(value))
        {
            if (typeof entry === "string" || typeof entry === "number")
            {
                result[key] = entry;
            }
        }

        return result;
    }

    public pending(): Fields
    {
        return { join: sfs.bool(false), joinBool: sfs.bool(false) };
    }

    public pendingMail(uid: string): Fields
    {
        return { join: sfs.bool(false), joinBool: sfs.bool(false), mailId: sfs.string(uid) };
    }

    public invitation(allianceId: string, owner: string, uid: string, id: string): Fields
    {
        return {
            allianceId: sfs.string(allianceId),
            inviteSenderId: sfs.string(owner),
            inviteReceiver: sfs.string(uid),
            mailId: sfs.string(id),
        };
    }

    public result(): Fields
    {
        return { result: sfs.int(1) };
    }

    public acceptedInvite(result: Fields): Fields
    {
        return { result: sfs.int(1), allianceInfo: sfs.object(result) };
    }

    public message(row: AllianceRecord): Fields
    {
        return {
            message: sfs.string(
                Buffer.isBuffer(row.message) ? row.message.toString("utf8") : "",
            ),
        };
    }

    public list(rows: readonly AllianceRecord[], page: () => number): Fields
    {
        const { text, long } = this.runtime;

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
            page: sfs.int(page()),
        };
    }
}
