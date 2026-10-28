export const questPeriod = (now: bigint, delay = 0n) => (now - delay) / 86400000n;
