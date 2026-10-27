import type { CampaignNoticeResponse } from "./responses/campaign-notice";

export interface CampaignNotice {
  owner: string;
  at: bigint;
  scope: 1 | 2;
  allianceId: string;
  message: CampaignNoticeResponse;
}

export interface CampaignAudience {
  select(
    owners: readonly string[],
    allianceId: string | undefined,
    now: bigint,
  ): Promise<readonly string[]>;
}
