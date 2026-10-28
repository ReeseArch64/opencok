import type { AvatarSystemMail } from "./files.ts";

export interface NicknameAllianceTask
{
    readonly id: string;
    readonly num: bigint | null;
    readonly state: number | null;
}

export interface NicknameAlliancePlan
{
    readonly updates: readonly NicknameAllianceTask[];
    readonly complete: boolean;
}

export type NicknameAlliancePlanner = (
    tasks: readonly NicknameAllianceTask[],
    stem: string,
) => NicknameAlliancePlan & { readonly mail: AvatarSystemMail | null; };

export interface NicknameAllianceStore
{
    deliverAlliance(
        owner: string,
        operationId: string,
        now: number,
        plan: NicknameAlliancePlanner,
    ): Promise<boolean>;
}
