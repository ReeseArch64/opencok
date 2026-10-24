export class HeroSelfRankingDto {
  declare public readonly eventList: never[];
  declare public readonly ranking: number;
  declare public readonly rankingAlliance: number;
  declare public readonly type: number;
}

export class HeroInsideMemberDto {
  declare public readonly uid?: string;
  declare public readonly name?: string;
  declare public readonly pic?: string;
  declare public readonly picVer: number;
  declare public readonly picfraId: number;
  declare public readonly power?: bigint;
  declare public readonly abbr?: string;
  declare public readonly lang?: string;
  declare public readonly mainBuildingLevel?: number;
  declare public readonly allianceId?: string;
  declare public readonly gmFlag: number;
  declare public readonly crossFightSrcServerId: number;
  declare public readonly vipLevel: number;
  declare public readonly svipLevel: number;
  declare public readonly vipEndTime?: bigint;
  declare public readonly offLineTime?: bigint;
  declare public readonly rank: number;
  declare public readonly score: number;
}
export class HeroInsideRankingDto {
  declare public readonly rankList: HeroInsideMemberDto[];
}

export class HeroHistoryMemberDto {
  declare public readonly uid?: string;
  declare public readonly allianceId?: string;
  declare public readonly rewardId: string;
  declare public readonly rank: number;
  declare public readonly name?: string;
  declare public readonly server?: number;
  declare public readonly pic?: string;
  declare public readonly picVer?: number;
  declare public readonly picfraId?: number;
  declare public readonly abbr?: string;
  declare public readonly icon?: string;
}
export class HeroHistoryRealmDto {
  declare public readonly id: number;
  declare public readonly rank: number;
  declare public readonly name?: string;
  declare public readonly banner?: string;
}
export class HeroHistoryEntryDto {
  declare public readonly eventId: string;
  declare public readonly endTime: bigint;
  declare public readonly userList: HeroHistoryMemberDto[];
  declare public readonly kingdomList: HeroHistoryRealmDto[];
}
export class HeroHistoryDto {
  declare public readonly history: HeroHistoryEntryDto[];
}
