export interface WorldResourceOwnerResponse
{
    readonly q: number;
    readonly tq: number;
    readonly collected: number;
    readonly spd: number;
    readonly sdt: bigint;
    readonly changeCollectSpdTime: bigint;
    readonly occupyEndTime: bigint;
}

export interface WorldResourceGroupResponse
{
    readonly spd?: number;
    readonly tq?: number;
    readonly sdt?: number;
}

export interface WorldNeutralResourceResponse
{
    readonly occupybegintime?: bigint;
}
