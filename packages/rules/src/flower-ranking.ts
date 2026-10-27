export function flowerRankingRefresh(now: number, time: bigint | undefined, type: number): bigint {
  if (!Number.isSafeInteger(now)) {throw new Error("Invalid flower ranking clock");}

  const current = BigInt(now);

  if (time === undefined || ![1, 2, 3].includes(type))
    {return BigInt.asIntN(64, current + 9223372036854775807n);}

  let end: bigint;

  if (type === 3) {end = BigInt.asIntN(64, time + 1209600000n);}
  else {
    const date = new Date(now);

    if (!Number.isFinite(date.getTime())) {throw new Error("Invalid flower ranking date");}

    if (type === 1) {
      const start = Math.floor(now / 86400000) * 86400000;
      end = BigInt(start + (1 - date.getUTCDay() + 7) * 86400000 + date.getUTCMilliseconds());
    } else
      {end = BigInt(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1) + date.getUTCMilliseconds(),
      );}
  }

  return end > current ? end : current;
}
