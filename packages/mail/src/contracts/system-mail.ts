export interface AvatarSystemMail
{
    uid: string;
    owner: string;
    fromName: string;
    title: string;
    type: 2 | 9 | 15;
    contents: Uint8Array;
    extra: Uint8Array | null;
    rewardId: string | null;
    rewardStatus: 0 | 1;
    reply: number;
    itemIdFlag?: 0 | 1;
    createTime: bigint;
}
