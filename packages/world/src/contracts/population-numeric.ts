export interface WorldPopulationNumericRuntime
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    worldMutationFailure(): never;
    eventTimestamp(value: string | undefined): bigint | undefined;
    chooseWeight(weights: readonly number[], random: (maximum: number) => number): number;
    javaDecimal(raw: unknown, bits: 32 | 64): bigint;
    javaHashMapOrder(keys: Iterable<string>): string[];
}
