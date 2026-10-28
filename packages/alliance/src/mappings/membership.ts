import { sfs, type Fields } from "@opencok/messages/sfs";
import type { RewardPreview } from "@opencok/economy/contracts/reward-preview";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceMembershipMailTemplate } from "../contracts/membership-catalog";
import type { AllianceMembershipMappingRuntime } from "../contracts/membership-runtime";

export class AllianceMembershipMapper
{
    public constructor(private readonly runtime: AllianceMembershipMappingRuntime)
    {}

    public rewardId(rewards: readonly RewardPreview[]): string
    {
        const allianceFailure: () => never = this.runtime.allianceFailure;

        return rewards
            .map((reward) => {
                if (reward.kind === "item")
                {
                    return `goods,${reward.id},${reward.count}`;
                }

                if (reward.kind !== "count")
                {
                    allianceFailure();
                }

                const category: Record<number, string> = {
                    0: "wood",
                    1: "stone",
                    2: "iron",
                    3: "food",
                    4: "silver",
                    5: "gold",
                    19: "crystal",
                };

                if (!category[reward.type])
                {
                    allianceFailure();
                }

                return `${category[reward.type]},0,${reward.value}`;
            })
            .join("|");
    }

    public firstJoinMail(
        uid: string,
        template: AllianceMembershipMailTemplate,
        contents: Uint8Array,
        rewardId: string,
        now: bigint,
    ): AllianceRecord
    {
        const { allianceStableId } = this.runtime;

        return {
            uid: allianceStableId(`alliance-first-join:${uid}`) + "00",
            toUser: uid,
            fromUser: null,
            fromName: template.sender ?? "",
            title: template.title ?? "",
            type: 2,
            contents: Buffer.from(contents),
            rewardId: rewardId || null,
            rewardStatus: rewardId ? 0 : 1,
            createTime: now,
            itemIdFlag: 1,
        };
    }

    public joined(snapshot: () => Fields, rank: number, firstJoin: () => number): Fields
    {
        return {
            alliance: sfs.object(snapshot()),
            join: sfs.bool(true),
            joinBool: sfs.bool(true),
            rank: sfs.int(rank),
            isfirstJoin: sfs.int(firstJoin()),
        };
    }

    public removed(uid: string, allianceId: string): Fields
    {
        return { uid: sfs.string(uid), allianceId: sfs.string(allianceId) };
    }
}
