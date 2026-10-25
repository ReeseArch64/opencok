export interface ResearchResponse {
  readonly level: number;
  readonly itemId: string;
  readonly cd: bigint;
  readonly max_lv?: string;
  readonly research_need?: string;
  readonly time_research?: string;
  readonly building_condition?: string;
  readonly science_condition?: string;
  readonly reputation_condition?: string;
  readonly para1?: string;
  readonly para2?: string;
  readonly science_point?: string;
  readonly vip?: string;
  readonly nextPara2: string;
}
