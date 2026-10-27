import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";
import { nicknameCharactersAllowed, nicknameLength, nicknameTrim } from "./nickname.ts";

export interface NicknameChangeFilters {
  forbidden(name: string): boolean | Promise<boolean>;
  badWords(name: string): boolean | Promise<boolean>;
}

export async function validateNicknameChange(
  raw: string,
  filters: NicknameChangeFilters,
): Promise<string> {
  if (typeof raw !== "string" || raw.length > 65535) {throw new GameError(errors.invalid);}

  const replaced = raw.replace(/\n|\\n/g, " ");

  if (await filters.forbidden(nicknameTrim(replaced))) {throw new GameError(errors.nicknameOccupied);}

  if (await filters.badWords(replaced)) {throw new GameError(errors.nicknameOccupied);}

  for (let index = 0; index < replaced.length; index++) {
    const code = replaced.charCodeAt(index);

    if (code <= 31 || (code >= 127 && code <= 159)) {throw new GameError(errors.nicknameOccupied);}
  }

  if (mailBlank(replaced)) {throw new GameError(errors.invalid);}

  const name = nicknameTrim(replaced);

  if (name.startsWith("(")) {throw new GameError(errors.nicknameInvalid);}

  const length = nicknameLength(name);

  if (length < 3 || length > 16) {throw new GameError(errors.invalid);}

  if (!nicknameCharactersAllowed(name)) {throw new GameError(errors.nicknameCharacters);}

  return name;
}

export interface NicknameGoldBalances {
  gold: bigint;
  paidGold: bigint;
  paidSpecialGold: bigint;
  dmmGold: bigint;
  dmmPaidGold: bigint;
  dmmPaidSpecialGold: bigint;
}

export interface NicknameGoldChange {
  balances: NicknameGoldBalances;
  gold: bigint;
  delta: bigint;
  pool: "mobile" | "dmm";
}

const mobile = ["gold", "paidGold", "paidSpecialGold"] as const;

const dmm = ["dmmGold", "dmmPaidGold", "dmmPaidSpecialGold"] as const;

const long = (value: bigint) => BigInt.asIntN(64, value);

function balance(value: bigint): bigint {
  if (typeof value !== "bigint" || long(value) !== value) {throw new Error("Invalid gold balance");}

  return value;
}

function total(balances: Readonly<NicknameGoldBalances>, keys: typeof mobile | typeof dmm): bigint {
  return long(keys.reduce((sum, key) => sum + balance(balances[key]), 0n));
}

export function nicknameGoldDebit(
  balances: Readonly<NicknameGoldBalances>,
  platform: string | null,
  rawPrice: unknown,
): NicknameGoldChange {
  const price = javaDecimal(rawPrice, 32);

  if (price < 0n) {throw new Error("Negative nickname gold cost");}

  const keys = platform === "dmm" ? dmm : mobile;
  const before = total(balances, keys);

  if (before < 0n) {throw new Error("Negative total gold");}

  if (before < price) {throw new GameError(errors.gold);}

  const result = { ...balances };
  const [free, paid, special] = keys;

  if (result[free] > 0n) {
    result[free] = long(result[free] - price);

    if (result[free] < 0n) {
      result[special] = long(result[special] + result[free]);

      if (result[special] < 0n) {
        result[paid] = long(result[paid] + result[special]);
        result[special] = 0n;
      }

      result[free] = 0n;
    }
  } else if (result[special] > 0n) {
    result[special] = long(result[special] - price);

    if (result[special] < 0n) {
      result[paid] = long(result[paid] + result[special]);
      result[special] = 0n;
    }
  } else {result[paid] = long(result[paid] - price);}

  return {
    balances: result,
    gold: platform === "dmm" ? before : total(result, keys),
    delta: -price,
    pool: platform === "dmm" ? "dmm" : "mobile",
  };
}

export function nicknameGoldRefund(
  balances: Readonly<NicknameGoldBalances>,
  platform: string | null,
  rawPrice: unknown,
  readRatio: () => number,
): NicknameGoldChange {
  const price = javaDecimal(rawPrice, 32);
  const ratio = platform === "cn1" ? readRatio() : 1;

  if (typeof ratio !== "number") {throw new Error("Invalid nickname refund ratio");}

  const product = Math.fround(Math.fround(Number(price)) * Math.fround(ratio));
  const delta = Number.isNaN(product)
    ? 0n
    : product >= 9223372036854775808
      ? 9223372036854775807n
      : product <= -9223372036854775808
        ? -9223372036854775808n
        : BigInt(Math.trunc(product));
  const free = platform === "dmm" ? "dmmGold" : "gold";
  const result = { ...balances, [free]: long(balance(balances[free]) + delta) };

  return {
    balances: result,
    gold: total(result, mobile),
    delta,
    pool: platform === "dmm" ? "dmm" : "mobile",
  };
}

export function nicknameItemDebit(count: number | null | undefined, rawType: unknown): number {
  const type = javaDecimal(rawType, 32);

  if (
    count !== undefined &&
    count !== null &&
    (!Number.isInteger(count) || count < -2147483648 || count > 2147483647)
  )
    {throw new Error("Invalid nickname item count");}

  if (count === undefined || count === null || count < 1)
    {throw new GameError(type === 17n || type === 20n ? "E100165" : "102198");}

  return count - 1;
}
