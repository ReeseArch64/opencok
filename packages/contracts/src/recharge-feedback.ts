export interface RechargeFeedbackClaim {
  id: string;
  startTime: bigint;
  endTime: bigint;
}

export interface RechargeFeedbackReader {
  counts(
    start: bigint,
    end: bigint,
    prices: readonly number[],
  ): Promise<ReadonlyMap<number, bigint>>;
  claims(start: bigint, end: bigint): Promise<readonly RechargeFeedbackClaim[]>;
  payment(
    orderId: string,
    platform: string,
  ): Promise<{ productId: string; time: bigint | null; spend: number } | undefined>;
}

export interface RechargeFeedbackGateway {
  accepted(input: {
    owner: string;
    eventId: string;
  }): Promise<{ orderId: string; platform: string; productId: string } | null>;
}
