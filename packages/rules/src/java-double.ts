function hexDouble(token: string): number | undefined {
  const match = /^([+-]?)0[xX]([\da-fA-F]*)(?:\.([\da-fA-F]*))?[pP]([+-]?\d+)[fFdD]?$/.exec(token);
  if (!match || (!match[2] && !match[3])) return undefined;
  const digits = `${match[2]}${match[3] ?? ""}`;
  const mantissa = BigInt(`0x${digits}`);
  const sign = match[1] === "-" ? -1 : 1;
  if (mantissa === 0n) return sign < 0 ? -0 : 0;
  const shift = Number(match[4]) - 4 * (match[3]?.length ?? 0);
  const exponent = mantissa.toString(2).length - 1 + shift;
  if (exponent > 1023) return sign * Infinity;
  if (exponent < -1075) return sign < 0 ? -0 : 0;
  const quantum = Math.max(exponent - 52, -1074);
  const discarded = quantum - shift;
  let rounded: bigint;
  if (discarded <= 0) rounded = mantissa << BigInt(-discarded);
  else {
    const count = BigInt(discarded);
    rounded = mantissa >> count;
    const remainder = mantissa - (rounded << count);
    const midpoint = 1n << (count - 1n);
    if (remainder > midpoint || (remainder === midpoint && (rounded & 1n) === 1n)) rounded++;
  }
  return sign * Number(rounded) * 2 ** quantum;
}

export function javaDouble(raw: unknown): number {
  if (typeof raw !== "string" || raw.length > 65535) throw new Error("Invalid decimal double");
  let start = 0;
  let end = raw.length;
  while (start < end && raw.charCodeAt(start) <= 32) start++;
  while (end > start && raw.charCodeAt(end - 1) <= 32) end--;
  const value = raw.slice(start, end);
  if (/^[+-]?NaN$/.test(value)) return NaN;
  if (/^[+-]?Infinity$/.test(value)) return value[0] === "-" ? -Infinity : Infinity;
  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[dDfF]?$/.test(value))
    return Number(value.replace(/[dDfF]$/, ""));
  const hex = hexDouble(value);
  if (hex === undefined) throw new Error("Invalid decimal double");
  return hex;
}
