function rounded(numerator: bigint, denominator: bigint): number {
  let exponent = numerator.toString(2).length - denominator.toString(2).length;

  if (
    exponent >= 0
      ? numerator < denominator << BigInt(exponent)
      : numerator << BigInt(-exponent) < denominator
  )
    exponent--;

  const quantum = Math.max(exponent - 23, -149);

  if (quantum >= 0) denominator <<= BigInt(quantum);
  else numerator <<= BigInt(-quantum);

  let result = numerator / denominator;
  const remainder = (numerator % denominator) * 2n;

  if (remainder > denominator || (remainder === denominator && (result & 1n) === 1n)) result++;

  return Math.fround(Number(result) * 2 ** quantum);
}

export function javaFloat(raw: unknown): number {
  if (typeof raw !== "string" || raw.length > 65535) throw new Error("Invalid decimal float");

  let start = 0;
  let end = raw.length;

  while (start < end && raw.charCodeAt(start) <= 32) start++;

  while (end > start && raw.charCodeAt(end - 1) <= 32) end--;

  const token = raw.slice(start, end);

  if (/^[+-]?NaN$/.test(token)) return NaN;

  if (/^[+-]?Infinity$/.test(token)) return token[0] === "-" ? -Infinity : Infinity;

  const sign = token[0] === "-" ? -1 : 1;
  const decimal = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?[fFdD]?$/.exec(token);

  if (decimal && (decimal[2] || decimal[3])) {
    const digits = `${decimal[2]}${decimal[3] ?? ""}`.replace(/^0+/, "");

    if (!digits) return sign < 0 ? -0 : 0;

    const shift = Number(decimal[4] ?? 0) - (decimal[3]?.length ?? 0);
    const exponent = digits.length - 1 + shift;

    if (exponent > 39) return sign * Infinity;

    if (exponent < -47) return sign < 0 ? -0 : 0;

    const mantissa = BigInt(digits);

    return (
      sign *
      (shift >= 0
        ? rounded(mantissa * 10n ** BigInt(shift), 1n)
        : rounded(mantissa, 10n ** BigInt(-shift)))
    );
  }

  const hex = /^([+-]?)0[xX]([\da-fA-F]*)(?:\.([\da-fA-F]*))?[pP]([+-]?\d+)[fFdD]?$/.exec(token);

  if (!hex || (!hex[2] && !hex[3])) throw new Error("Invalid decimal float");

  const mantissa = BigInt(`0x${hex[2]}${hex[3] ?? ""}`);

  if (!mantissa) return sign < 0 ? -0 : 0;

  const shift = Number(hex[4]) - 4 * (hex[3]?.length ?? 0);
  const exponent = mantissa.toString(2).length - 1 + shift;

  if (exponent > 127) return sign * Infinity;

  if (exponent < -150) return sign < 0 ? -0 : 0;

  return (
    sign *
    (shift >= 0 ? rounded(mantissa << BigInt(shift), 1n) : rounded(mantissa, 1n << BigInt(-shift)))
  );
}
