export interface HeroMatchRealm {
  kingdomId: number;
  power: bigint;
  shuffle: number;
}
export interface HeroMatchRegistration extends HeroMatchRealm {
  periodId: string;
  definition: string;
  startTime: bigint;
  endTime: bigint;
  registeredAt: bigint;
  groupSize: number;
  matchSize: number;
}
export interface HeroMatchResult {
  periodId: string;
  serverGroup: string;
  matchedAt: bigint;
}
export interface HeroMatchingRegistry {
  register(value: HeroMatchRegistration): Promise<void>;
  match(periodId: string, now: bigint): Promise<void>;
  result(periodId: string, kingdomId: number): Promise<HeroMatchResult | undefined>;
}
export interface HeroMatchingRealmStore {
  pending(): Promise<
    readonly { id: string; definition: string; startTime: bigint; endTime: bigint; power: bigint }[]
  >;
  apply(id: string, result: HeroMatchResult): Promise<void>;
}
