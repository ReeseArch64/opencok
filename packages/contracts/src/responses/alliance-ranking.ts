export interface AllianceRankingResponse {
  readonly selfRanking?: number;
  readonly allianceRanking: {
    readonly uid: string;
    readonly alliancename: string;
    readonly abbr: string;
    readonly leader?: string;
    readonly icon?: string;
    readonly curMember: number;
    readonly maxMember: number;
    readonly nums: number | bigint;
    readonly fightpower?: number;
    readonly armyKill?: number;
    readonly allianceVideo?: {
      readonly allianceid: string;
      readonly videoURL: string;
      readonly thumbnailURL: string;
      readonly videoH: number;
      readonly videoW: number;
      readonly videoSize: number;
      readonly videoLength: number;
      readonly checksign: number;
    };
  }[];
}
