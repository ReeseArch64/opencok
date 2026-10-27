import type { Row } from "./rows";

export interface GroupBuyTier {
  level: number;
  reward: string;
  mail: string;
}

export interface GroupBuyRound {
  sTime: number;
  eTime: number;
  cTime: number;
  flag: number;
  tiers?: readonly GroupBuyTier[];
  total?: number;
  mail?: string;
}

export interface GroupBuyPeriod {
  start: bigint;
  end: bigint;
  rounds: readonly GroupBuyRound[];
}

export interface GroupBuyState {
  openedAt: bigint;
  load(
    period: GroupBuyPeriod | { id: string },
    round: number,
  ): Promise<{
    activity: Row;
    rounds: GroupBuyRound[];
    record?: Row;
    total: number;
    pending: boolean;
    recent: readonly Row[];
  }>;
}

export interface GroupBuyWrite {
  activity: Row;
  record?: Row;
}

export interface GroupBuyGateway {
  accepted(input: { owner: string; kingdomId: number; eventId: string }): Promise<{
    activityId: string;
    round: number;
    exchangeId: string;
    occurredAt: bigint;
  } | null>;
  cancelled(input: { owner: string; kingdomId: number; eventId: string }): Promise<boolean>;
  reconciled(input: {
    kingdomId: number;
    start: bigint;
    end: bigint;
    round: number;
    cutoff: bigint;
  }): Promise<{ totalPoints: number } | null>;
}
