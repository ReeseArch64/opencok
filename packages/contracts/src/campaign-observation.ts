export interface CampaignObservation {
  code: 40 | 61 | 68;
  selector: string;
  attributes: Readonly<Record<string, string | number | bigint>>;
}
