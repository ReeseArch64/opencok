export interface AvatarMailPushResponse
{
    readonly title: string;
    readonly rewardId: string;
    readonly uid: string;
    readonly fromUid: string;
    readonly fromName: string;
    readonly oldName: string;
    readonly contentsLocal?: string;
    readonly toUser?: string;
    readonly translationId?: string;
    readonly fromUser?: string;
    readonly type: number;
    readonly itemIdFlag: number;
    readonly unread?: number;
    readonly totalNum?: number;
    readonly rewardStatus?: number;
    readonly status?: number;
    readonly saveFlag?: number;
    readonly reply?: number;
    readonly createTime: bigint;
}
