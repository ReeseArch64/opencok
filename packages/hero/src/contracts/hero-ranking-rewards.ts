import type { Row } from "@opencok/contracts/rows";

export interface HeroRankAwardDraft {
  id: string;
  ownerUid: string;
  sender: string;
  title: string;
  contents: Uint8Array;
  rewardId: string | null;
  pinnedReward: string | null;
}

export interface HeroRankAwardReader {
  load(id: string): Promise<{ award: Row; recorded: boolean } | undefined>;
}

export interface HeroRankAwardWrite {
  id: string;
  history?: Row;
}

export interface HeroRankRewardStore {
  candidates(): Promise<readonly Row[]>;
  plan(
    closure: Row,
    standing: Row,
    create: ((owners: readonly string[]) => readonly HeroRankAwardDraft[]) | undefined,
    now: bigint,
  ): Promise<number>;
  finished(closure: Row): Promise<void>;
  pending(now: bigint): Promise<readonly Row[]>;
  defer(id: string, now: bigint): Promise<void>;
}

export interface HeroRankRewardStandings {
  page(closure: Row): Promise<readonly Row[] | undefined>;
}
