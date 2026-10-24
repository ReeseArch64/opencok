export class AvatarMailPushDto {
  declare public readonly title: string;
  declare public readonly rewardId: string;
  declare public readonly uid: string;
  declare public readonly fromUid: string;
  declare public readonly fromName: string;
  declare public readonly oldName: string;
  declare public readonly contentsLocal?: string;
  declare public readonly toUser?: string;
  declare public readonly translationId?: string;
  declare public readonly fromUser?: string;
  declare public readonly type: number;
  declare public readonly itemIdFlag: number;
  declare public readonly unread?: number;
  declare public readonly totalNum?: number;
  declare public readonly rewardStatus?: number;
  declare public readonly status?: number;
  declare public readonly saveFlag?: number;
  declare public readonly reply?: number;
  declare public readonly createTime: bigint;
}
