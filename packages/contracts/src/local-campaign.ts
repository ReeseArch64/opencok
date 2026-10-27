export interface CampaignClause {
  readonly code: number;
  readonly name?: string;
  readonly group?: number | string;
  readonly parameters?: string;
  readonly conditions?: readonly CampaignClause[];
}
export interface CampaignAction extends CampaignClause {
  readonly actions?: readonly CampaignAction[];
  readonly branch?: {
    readonly conditions: readonly CampaignClause[];
    readonly onMatch: readonly CampaignAction[];
    readonly otherwise: readonly CampaignAction[];
  };
}
export interface CampaignRule {
  readonly name?: string;
  readonly id: number | string;
  readonly state?: number;
  readonly openType?: number;
  readonly events: readonly CampaignClause[];
  readonly conditions: readonly CampaignClause[];
  readonly actions: readonly CampaignAction[];
}
export interface CampaignVariable {
  readonly scope: string;
  readonly id: string;
  readonly valueType?: string;
  readonly initialValue?: string | number | bigint | boolean;
  readonly refreshType?: number;
  readonly refreshInterval?: number;
}
