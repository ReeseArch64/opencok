import { javaDigit } from "./java-integer.ts";

function floor(value: bigint, divisor: bigint): bigint {
  const quotient = value / divisor;

  return value % divisor < 0n ? quotient - 1n : quotient;
}

function fixedDate(year: number, month: number, day: number, julian: boolean): bigint {
  const previous = BigInt(year) - 1n;
  const leap = year % 4 === 0 && (julian || year % 100 !== 0 || year % 400 === 0);

  return (
    365n * previous +
    floor(previous, 4n) +
    (julian ? -2n : -floor(previous, 100n) + floor(previous, 400n)) +
    BigInt(Math.floor((367 * month - 362) / 12)) +
    BigInt(day) -
    (month > 2 ? (leap ? 1n : 2n) : 0n)
  );
}

function numericField(value: string, start: number): { value: number; end: number } | undefined {
  let index = start;

  while (value[index] === " " || value[index] === "\t") {index++;}

  if (value[index] === "\ufffd") {return { value: 0, end: index + 1 };}

  const negative = value[index] === "-";

  if (negative) {index++;}

  if (value[index] === "∞") {return { value: negative ? -2147483648 : 2147483647, end: index + 1 };}

  let digits = "";

  while (index < value.length) {
    const digit = javaDigit(value.charCodeAt(index));

    if (digit === undefined) {break;}

    digits += digit;
    index++;
  }

  if (!digits) {return undefined;}

  let exponent = 0;

  if (value[index] === "E") {
    let end = index + 1;
    const negativeExponent = value[end] === "-";

    if (negativeExponent) {end++;}

    let power = "";

    while (end < value.length) {
      const digit = javaDigit(value.charCodeAt(end));

      if (digit === undefined) {break;}

      power += digit;
      end++;
    }

    const significant = power.replace(/^0+/, "");

    if (power && significant.length <= 19) {
      const magnitude = BigInt(significant || "0");
      const signed = negativeExponent ? -magnitude : magnitude;

      if (signed >= -9223372036854775808n && signed <= 9223372036854775807n) {
        exponent = Number(BigInt.asIntN(32, signed));
        index = end;
      }
    }
  }

  digits = digits.replace(/^0+/, "");
  const decimalAt = (digits.length + exponent) | 0;
  digits = digits.replace(/0+$/, "");

  if (!digits || decimalAt < 0) {return { value: 0, end: index };}

  const limit = negative ? -2147483648 : 2147483647;

  if (decimalAt > 19) {return { value: limit, end: index };}

  if (decimalAt >= digits.length) {
    const magnitude = BigInt(digits + "0".repeat(decimalAt - digits.length));
    const signed = negative ? -magnitude : magnitude;

    return {
      value:
        signed >= -9223372036854775808n && signed <= 9223372036854775807n
          ? Number(BigInt.asIntN(32, signed))
          : limit,
      end: index,
    };
  }

  const number = Number(`${negative ? "-" : ""}${digits}e${decimalAt - digits.length}`);

  return { value: Math.max(-2147483648, Math.min(2147483647, Math.trunc(number))), end: index };
}

export function javaCalendarDate(
  value: string,
  fields: 3 | 5 = 5,
  utcOffsetMinutes = 0,
  previousTime?: bigint,
): bigint | undefined {
  if (
    typeof value !== "string" ||
    value.length > 65535 ||
    !Number.isInteger(utcOffsetMinutes) ||
    Math.abs(utcOffsetMinutes) > 840 ||
    (fields !== 3 && fields !== 5) ||
    (previousTime !== undefined &&
      (typeof previousTime !== "bigint" || BigInt.asIntN(64, previousTime) !== previousTime))
  )
    {throw new Error("Invalid calendar date input");}

  const parsed: number[] = [];
  let index = 0;

  for (let field = 0; field < fields; field++) {
    const part = numericField(value, index);

    if (!part) {return undefined;}

    parsed.push(part.value);
    index = part.end;

    if (field < fields - 1 && value[index++] !== "-") {return undefined;}
  }

  const sourceYear = parsed[0]!;
  const rawMonth = (parsed[1]! - 1) | 0;
  const year = (sourceYear + Math.floor(rawMonth / 12)) | 0;
  const month = (((rawMonth % 12) + 12) % 12) + 1;
  const milliseconds = (BigInt(parsed[3] ?? 0) * 60n + BigInt(parsed[4] ?? 0)) * 60000n;
  const days = floor(milliseconds, 86400000n);
  const remainder = milliseconds - days * 86400000n;
  const gregorian = fixedDate(year, month, parsed[2]!, false) + days;
  const julian = fixedDate(year, month, parsed[2]!, true) + days;
  const priorJulian =
    previousTime !== undefined &&
    previousTime + BigInt(utcOffsetMinutes) * 60000n < -12219292800000n;
  const useGregorian =
    sourceYear >= 1582 &&
    gregorian >= 577736n &&
    !(sourceYear === 1582 && julian < 577736n && priorJulian);
  const date = useGregorian ? gregorian : julian;

  return BigInt.asIntN(
    64,
    (date - 719163n) * 86400000n + remainder - BigInt(utcOffsetMinutes) * 60000n,
  );
}
