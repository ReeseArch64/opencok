import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";
import type { AllianceScienceCatalog } from "../contracts/science-catalog";
import { AllianceMembershipPolicy } from "../rules/membership";

export class AlliancePublicationMapper
{
    public constructor(
        private readonly runtime: AllianceRecordReaders,
        private readonly policy: AllianceMembershipPolicy,
    )
    {}

    public info(
        id: string,
        record: Row,
        members: readonly Row[],
        member: Row,
        leader: Row | undefined,
        effects: ReadonlyMap<number, number>,
    ): Fields
    {
        const { text, num, long } = this.runtime;
        const { alliancePermissions, allianceTargets } = this.policy;

        return {
            uid: sfs.string(id),
            alliancename: sfs.string(text(record, "alliancename")),
            abbr: sfs.string(text(record, "abbr")),
            intro: sfs.string(text(record, "intro")),
            announce: sfs.string(text(record, "announce")),
            member: sfs.int(members.length),
            curMember: sfs.int(members.length),
            maxMember: sfs.int(num(record, "maxMember") + Math.trunc(effects.get(500) ?? 0)),
            language: sfs.string(text(record, "language")),
            recruit: sfs.int(num(record, "recruit")),
            icon: sfs.string(text(record, "icon")),
            bannerStyle: sfs.string(text(record, "bannerStyle")),
            permission: sfs.object(
                Object.fromEntries(
                    Object.entries(alliancePermissions(text(record, "permission"))).map((
                        [key, value],
                    ) => [
                        key,
                        sfs.int(value),
                    ]),
                ),
            ),
            targetScience: sfs.string(allianceTargets(text(record, "targetScience")).join(";")),
            ...Object.fromEntries(
                ["rankone", "ranktwo", "rankthree", "rankfour", "rankfive"].map((key) => [
                    key,
                    sfs.string(text(record, key)),
                ]),
            ),
            rank: sfs.int(num(member, "rank")),
            point: sfs.int(num(member, "point")),
            accPoint: sfs.int(num(member, "accPoint")),
            alliancepoint: sfs.long(long(record, "alliancepoint")),
            learderUid: sfs.string(leader ? text(leader, "uid") : ""),
            learderName: sfs.string(leader ? text(leader, "name") : ""),
        };
    }

    public join(
        info: Fields,
        rules: AllianceScienceCatalog,
        sciences: readonly Row[],
        scienceFields: (science: Row) => Fields,
    ): Fields
    {
        const { num } = this.runtime;

        return {
            alliance: sfs.object({
                ...info,
                allianceScience: sfs.array(
                    [...(rules.power.allianceSciences?.values() ?? [])]
                        .filter((rule) => rule.science_lv === "0")
                        .map((rule) =>
                            sfs.object(
                                scienceFields(
                                    sciences.find((row) =>
                                        num(row, "scienceId") === Number(rule.id)
                                    ) ?? {
                                        scienceId: Number(rule.id),
                                        level: 0,
                                        donateprogress: 0,
                                    },
                                ),
                            )
                        ),
                ),
            }),
        };
    }

    public leave(id: string): Fields
    {
        return { allianceId: sfs.string(id) };
    }

    public update(info: Fields): Fields
    {
        return { alliance: sfs.object(info) };
    }

    public points(record: Row): Fields
    {
        const { long } = this.runtime;

        return { alliancePoint: sfs.long(long(record, "alliancepoint")) };
    }

    public science(science: Fields, record: Row): Fields
    {
        const { long } = this.runtime;

        return { ...science, alliancepoint: sfs.long(long(record, "alliancepoint")) };
    }
}
