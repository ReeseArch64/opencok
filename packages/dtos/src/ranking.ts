export class PlayerRankingDto {
  readonly selfRanking?: number;
  readonly myRanking?: number;
  readonly serverRanking!: {
    readonly uid?: string;
    readonly name?: string;
    readonly pic?: string;
    readonly allianceId?: string;
    readonly alliancename?: string;
    readonly abbr?: string;
    readonly icon?: string;
    readonly picVer?: number | bigint;
    readonly picfraId?: number | bigint;
    readonly power?: number | bigint;
    readonly armyKill?: number | bigint;
    readonly contributeSum?: number | bigint;
    readonly level?: number | bigint;
    readonly exp?: number | bigint;
    readonly banTime?: number | bigint;
    readonly updateTime?: number | bigint;
    readonly star?: number | bigint;
    readonly buildingPower?: number | bigint;
  }[];
}
