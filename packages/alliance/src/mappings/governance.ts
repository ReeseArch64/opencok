import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";

export class AllianceGovernanceMapper
{
    public constructor(private readonly runtime: Pick<AllianceRecordReaders, "text">)
    {}

    public currentPermission(snapshot: Fields): Fields
    {
        return { permission: snapshot.permission! };
    }

    public permissions(values: Record<string, number>): Fields
    {
        return {
            permission: sfs.object(
                Object.fromEntries(
                    Object.entries(values).map(([key, value]) => [key, sfs.int(value)]),
                ),
            ),
        };
    }

    public rank(target: AllianceRecord, rank: number): Fields
    {
        const { text } = this.runtime;

        return { uid: sfs.string(text(target, "uid")), rank: sfs.int(rank) };
    }

    public leader(snapshot: () => Fields, leader: AllianceRecord, gold: () => bigint): Fields
    {
        const { text } = this.runtime;

        return {
            alliance: sfs.object(snapshot()),
            oldLeaderId: sfs.string(text(leader, "uid")),
            oldLeaderRank: sfs.int(4),
            gold: sfs.long(gold()),
        };
    }

    public blacklist(value: AllianceRecord): Fields
    {
        const { text } = this.runtime;

        return {
            black: sfs.string(text(value, "black")),
            white: sfs.string(text(value, "white")),
        };
    }

    public attributes(snapshot: () => Fields, gold: () => bigint): Fields
    {
        return { alliance: sfs.object(snapshot()), gold: sfs.long(gold()) };
    }
}
