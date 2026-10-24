import { sfs, type Value } from "./sfs.ts";

const digitZeros = [
  0x30, 0x660, 0x6f0, 0x7c0, 0x966, 0x9e6, 0xa66, 0xae6, 0xb66, 0xbe6, 0xc66, 0xce6, 0xd66, 0xe50,
  0xed0, 0xf20, 0x1040, 0x1090, 0x17e0, 0x1810, 0x1946, 0x19d0, 0x1a80, 0x1a90, 0x1b50, 0x1bb0,
  0x1c40, 0x1c50, 0xa620, 0xa8d0, 0xa900, 0xa9d0, 0xaa50, 0xabf0, 0xff10,
];
function digit(code: number): number {
  for (const zero of digitZeros) if (code >= zero && code <= zero + 9) return code - zero;
  for (const start of [0x41, 0x61, 0xff21, 0xff41])
    if (code >= start && code <= start + 25) return code - start + 10;
  return -1;
}
function integer(token: string, radix: number, bits: number): bigint | undefined {
  const negative = token[0] === "-";
  const start = negative || token[0] === "+" ? 1 : 0;
  if (start === token.length) return undefined;
  const limit = (1n << BigInt(bits - 1)) - (negative ? 0n : 1n);
  let value = 0n;
  for (let index = start; index < token.length; index++) {
    const number = digit(token.charCodeAt(index));
    if (number < 0 || number >= radix) return undefined;
    value = value * BigInt(radix) + BigInt(number);
    if (value > limit) return undefined;
  }
  return negative ? -value : value;
}
export function legacyHexCodeUnit(token: string): number | undefined {
  const value = integer(token, 16, 32);
  return value === undefined ? undefined : Number(value) & 65535;
}

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

export function legacyJsonNumber(token: string): Value | undefined {
  if (token[0] === "0") {
    const initial =
      /^0[xX]/.test(token) && token.length > 2
        ? integer(token.slice(2), 16, 32)
        : integer(token, 8, 32);
    if (initial !== undefined) return sfs.int(Number(initial));
  }
  const int = integer(token, 10, 32);
  if (int !== undefined) return sfs.int(Number(int));
  const long = integer(token, 10, 64);
  if (long !== undefined) return sfs.long(long);
  if (/^[+-]?(?:Infinity|NaN)$/.test(token)) return undefined;
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[dDfF]?$/.test(token)
    ? Number(token.replace(/[dDfF]$/, ""))
    : hexDouble(token);
  if (decimal === undefined) return sfs.string(token);
  return Number.isFinite(decimal) ? sfs.double(decimal) : undefined;
}
