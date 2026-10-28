export class UpdateBuildingDto
{
    declare public readonly uuid: string;
    declare public readonly itemId: number;
    declare public readonly pos: number;
    declare public readonly level: number;
    declare public readonly opType: number;
    declare public readonly star: number;
    declare public readonly progress: number;
    declare public readonly reward: number;
    declare public readonly refreshTime: bigint;
    declare public readonly updateTime: bigint;
    declare public readonly effectTime: bigint;
    declare public readonly putId: string;
    declare public readonly unlockFlag: number;
    declare public readonly costUnlockTimes: number;
}
