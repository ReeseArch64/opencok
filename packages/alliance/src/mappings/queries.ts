import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";

export class AllianceQueryMapper
{
    public constructor(private readonly runtime: AllianceRecordReaders)
    {}

    public alliance(value: Fields): Fields
    {
        return { alliance: sfs.object(value) };
    }

    public result(value: boolean): Fields
    {
        return { result: sfs.bool(value) };
    }

    public check(profiles: readonly AllianceRecord[], playerId?: string): Fields
    {
        const { text } = this.runtime;

        return {
            allianceId: sfs.string(
                text(
                    profiles.find((row) => row.uid === playerId)
                        ?? {},
                    "allianceId",
                ),
            ),
        };
    }

    public candidates(
        candidates: readonly AllianceRecord[],
        page: number,
        readPage: () => number,
    ): Fields
    {
        const { text, num, long } = this.runtime;

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
            page: sfs.int(readPage()),
        };
    }

    public directory(
        directory: readonly AllianceRecord[],
        page: () => number,
        total: () => bigint,
    ): Fields
    {
        const { text, num } = this.runtime;

        return {
            list: sfs.array(
                directory.map((row) =>
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
            page: sfs.int(page()),
            total: sfs.long(total()),
        };
    }

    public firstJoin(lords: readonly AllianceRecord[], owner: string): Fields
    {
        return {
            firstJoin: sfs.int(
                Number(
                    lords.find((row) => row.uid === owner)
                        ?.firstJoinAllianceFlag ?? 1,
                ),
            ),
        };
    }

    public ranks(
        rows: () => AllianceRecord[],
        readProfile: (uid: string) => AllianceRecord,
        power: (uid: string) => bigint,
    ): Fields
    {
        const { text, num } = this.runtime;

        return {
            list: sfs.array(
                rows()
                    .sort(
                        (a, b) =>
                            num(b, "rank") - num(a, "rank")
                            || text(a, "uid").localeCompare(text(b, "uid")),
                    )
                    .map((row) => {
                        const profile = readProfile(text(row, "uid"));

                        return sfs.object({
                            uid: sfs.string(text(row, "uid")),
                            name: sfs.string(text(profile, "name")),
                            pic: sfs.string(text(profile, "pic")),
                            picVer: sfs.int(num(profile, "picVer")),
                            picfraId: sfs.int(num(profile, "picfraId")),
                            rank: sfs.int(num(row, "rank")),
                            power: sfs.long(power(text(row, "uid"))),
                        });
                    }),
            ),
        };
    }
}
