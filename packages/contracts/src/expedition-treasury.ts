import type { MutationCommand, MutationResult } from "./mutation";
import type { AvatarSystemMail } from "./files";
import type { Row } from "./rows";

export const treasuryAssets = ["wood", "food", "iron", "stone"] as const;

export interface ExpeditionTreasuryState {
  now: bigint;
  profile: Row;
  target?: Row;
  treasury?: Row;
  king?: Row;
  received?: Row;
}

export interface ExpeditionTreasuryPlan extends Pick<MutationResult, "response" | "events"> {
  balances?: Readonly<Record<(typeof treasuryAssets)[number], bigint>>;
  received?: Row;
  record?: Row;
  mail?: AvatarSystemMail;
}

export type ExpeditionTreasuryExecutor = (
  command: MutationCommand,
  plan: (state: ExpeditionTreasuryState) => Promise<ExpeditionTreasuryPlan>,
) => Promise<Buffer>;
