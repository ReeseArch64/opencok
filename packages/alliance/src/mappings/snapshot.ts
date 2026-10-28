import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import type { AllianceResponse } from "../contracts/responses/alliance";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";
import { AllianceMembershipPolicy } from "../rules/membership";

export class AllianceSnapshotMapper
{
    public constructor(
        private readonly runtime: AllianceRecordReaders,
        private readonly policy: AllianceMembershipPolicy,
    )
    {}

    public base(value: AllianceResponse): Fields
    {
        return {
            uid: sfs.string(value.uid),
            name: sfs.string(value.name),
            abbr: sfs.string(value.abbr),
            intro: sfs.string(value.intro),
            announce: sfs.string(value.announce),
            language: sfs.string(value.language),
            member: sfs.int(value.member),
            maxMember: sfs.int(value.maxMember),
            recruit: sfs.int(value.recruit),
            rank: sfs.int(value.rank),
            point: sfs.int(value.point),
            accPoint: sfs.int(value.accPoint),
            learderUid: sfs.string(value.leaderUid),
            learderName: sfs.string(value.leaderName),
            fightpower: sfs.long(value.fightpower),
        };
    }

    public snapshot(
        result: Fields,
        alliance: AllianceRecord,
        member: AllianceRecord | undefined,
        science: () => Value,
    ): Fields
    {
        const { text, num, long } = this.runtime;
        const { alliancePermissions, allianceTargets } = this.policy;

        return {
            ...result,
            alliancename: result.name!,
            curMember: result.member!,
            alliancepoint: sfs.long(long(alliance, "alliancepoint")),
            icon: sfs.string(text(alliance, "icon")),
            bannerStyle: sfs.string(text(alliance, "bannerStyle")),
            permission: sfs.object(
                Object.fromEntries(
                    Object.entries(alliancePermissions(text(alliance, "permission"))).map((
                        [key, value],
                    ) => [
                        key,
                        sfs.int(value),
                    ]),
                ),
            ),
            donateCDTime: sfs.long(long(member ?? {}, "donateCDTime")),
            donateAvailable: sfs.int(Number(member?.donateAvailable ?? 1)),
            jointime: sfs.long(long(member ?? {}, "jointime")),
            currentlevel: sfs.int(Math.floor(num(alliance, "giftlevel") / 1000)),
            nextlevel: sfs.int((Math.floor(num(alliance, "giftlevel") / 1000) + 1) * 1000),
            allianceScience: science(),
            ...Object.fromEntries(
                ["rankone", "ranktwo", "rankthree", "rankfour", "rankfive"].map((key) => [
                    key,
                    sfs.string(text(alliance, key)),
                ]),
            ),
            targetScience: sfs.string(allianceTargets(text(alliance, "targetScience")).join(";")),
        };
    }
}
