import type { AllianceSnapshotContext } from "../contracts/snapshot";
import type { AllianceQueryRuntime } from "../contracts/query-runtime";
import { AllianceSnapshotMapper } from "../mappings/snapshot";

export class AllianceSnapshotService
{
    public constructor(
        private readonly c: AllianceSnapshotContext,
        private readonly runtime: Pick<AllianceQueryRuntime, "text" | "num" | "allianceFailure">,
        private readonly mapper: AllianceSnapshotMapper,
    )
    {}

    snapshot(
        alliance = this.c.alliance(),
        member = [...(this.c.write.members ?? []), ...this.c.state.members].find(
            (row) => row.uid === this.c.owner && row.allianceId === alliance.uid,
        ),
    )
    {
        const { text, num } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        const id = text(alliance, "uid"),
            members = this.c.list(id).filter(
                (row) => !(this.c.write.removedMembers ?? []).includes(text(row, "uid")),
            );

        for (const row of this.c.write.members ?? [])
        {
            if (row.allianceId === id)
            {
                const index = members.findIndex((value) => value.uid === row.uid);

                if (index >= 0)
                {
                    members[index] = row;
                }
                else
                {
                    members.push(row);
                }
            }
        }

        const leaders = members.filter((row) => num(row, "rank") === 5);

        if (leaders.length !== 1)
        {
            allianceFailure();
        }

        const leader = this.c.profile(text(leaders[0]!, "uid"));
        const result = this.mapper.base({
            uid: id,
            name: text(alliance, "alliancename"),
            abbr: text(alliance, "abbr"),
            intro: text(alliance, "intro"),
            announce: text(alliance, "announce"),
            language: text(alliance, "language"),
            member: members.length,
            maxMember: num(alliance, "maxMember") + Math.trunc(this.c.scienceEffect(500, id)),
            recruit: num(alliance, "recruit"),
            rank: num(member ?? {}, "rank"),
            point: num(member ?? {}, "point"),
            accPoint: num(member ?? {}, "accPoint"),
            leaderUid: text(leader, "uid"),
            leaderName: text(leader, "name"),
            fightpower: members.reduce((sum, row) => sum + this.c.power(text(row, "uid")), 0n),
        });

        return this.mapper.snapshot(result, alliance, member, () => this.c.scienceSnapshots(id));
    }
}
