import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";
import { GeneralInfoDto } from "./profile.ts";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { OwnGeneralSnapshot, FriendshipMineView } from "@opencok/contracts/reconnect";
import { generalInfo } from "./profile.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "reconnect");
}

function signed(value: unknown, bits: 32 | 64): bigint {
  if (value === null || value === undefined) return 0n;
  if (typeof value === "number" && !Number.isSafeInteger(value)) return invalid();
  if (!/^[+-]?\d+$/.test(String(value))) return invalid();
  const parsed = BigInt(String(value));
  if (BigInt.asIntN(bits, parsed) !== parsed) return invalid();
  return parsed;
}

function serializeReconnectBalances(profile: Row): Fields {
  const free = signed(profile.gold, 64);
  const paid = signed(profile.paidGold, 64);
  const special = signed(profile.paidSpecialGold, 64);
  return {
    gold: sfs.long(BigInt.asIntN(64, free + paid + special)),
    dmmGold: sfs.long(signed(profile.dmmGold, 64)),
    dmmPaidGold: sfs.long(signed(profile.dmmPaidGold, 64)),
    dmmPaidSpecialGold: sfs.long(signed(profile.dmmPaidSpecialGold, 64)),
    freeGold: sfs.long(free),
    paidGold: sfs.long(paid),
    paidSpecialGold: sfs.long(special),
  };
}

function serializeReconnectArmy(row: Row): Fields {
  if (typeof row.armyId !== "string" || !row.armyId || row.armyId.length > 20) return invalid();
  const result: Fields = {
    id: sfs.string(row.armyId),
    free: sfs.int(Number(signed(row.free, 32))),
    march: sfs.int(Number(signed(row.march, 32))),
    level: sfs.int(Number(signed(row.level, 32))),
  };
  const train = Number(signed(row.train, 32));
  if (train !== 0) {
    result.train = sfs.int(train);
    result.finish = sfs.long(signed(row.finishTime, 64));
  }
  return result;
}

function serializeReconnectArmies(rows: readonly Row[]): Fields {
  if (rows.length > 32767) return invalid();
  const seen = new Set<string>();
  return {
    army: sfs.array(
      rows.map((row) => {
        const army = reconnectArmy(row);
        const id = row.armyId as string;
        if (seen.has(id)) return invalid();
        seen.add(id);
        return sfs.object(army);
      }),
    ),
  };
}

function serializeReconnectGenerals(generals: readonly OwnGeneralSnapshot[]): Fields {
  if (generals.length > 32767) return invalid();
  return {
    userGenerals: sfs.array(
      generals.map((general) =>
        sfs.object({
          ...generalInfo(general),
          abilityIndex: sfs.int(general.abilityIndex),
        }),
      ),
    ),
  };
}

function serializeReconnectMine(mine: FriendshipMineView): Fields {
  return {
    mine: sfs.object({
      itemId: sfs.int(mine.itemId),
      level: sfs.int(mine.level),
      exp: sfs.int(mine.exp),
      miner: sfs.int(mine.miner),
      mineTime: sfs.long(mine.mineTime),
      call: sfs.int(mine.call),
      xml_exp: sfs.int(mine.requiredExp),
      xml_miner: sfs.int(mine.maxMiners),
    }),
  };
}

export class ReconnectBalancesDto extends createZodDto(
  z.strictObject({
    gold: wire.long,
    dmmGold: wire.long,
    dmmPaidGold: wire.long,
    dmmPaidSpecialGold: wire.long,
    freeGold: wire.long,
    paidGold: wire.long,
    paidSpecialGold: wire.long,
  }),
) {}

export class ReconnectArmyDto extends createZodDto(
  z.strictObject({
    id: wire.string.refine(({ value }) => value.length > 0 && value.length <= 20),
    free: wire.int,
    march: wire.int,
    level: wire.int,
    train: wire.int.optional(),
    finish: wire.long.optional(),
  }),
) {}

export class ReconnectArmiesDto extends createZodDto(
  z.strictObject({ army: wire.array(wire.object(ReconnectArmyDto.schema)) }),
) {}

export class ReconnectGeneralsDto extends createZodDto(
  z.strictObject({
    userGenerals: wire.array(wire.object(GeneralInfoDto.schema.extend({ abilityIndex: wire.int }))),
  }),
) {}

export class ReconnectMineDto extends createZodDto(
  z.strictObject({
    mine: wire.object(
      z.strictObject({
        itemId: wire.int,
        level: wire.int,
        exp: wire.int,
        miner: wire.int,
        call: wire.int,
        xml_exp: wire.int,
        xml_miner: wire.int,
        mineTime: wire.long,
      }),
    ),
  }),
) {}

export function reconnectBalances(...args: Parameters<typeof serializeReconnectBalances>): Fields {
  return new ReconnectBalancesDto(serializeReconnectBalances(...args));
}

export function reconnectArmy(...args: Parameters<typeof serializeReconnectArmy>): Fields {
  return new ReconnectArmyDto(serializeReconnectArmy(...args));
}

export function reconnectArmies(...args: Parameters<typeof serializeReconnectArmies>): Fields {
  return new ReconnectArmiesDto(serializeReconnectArmies(...args));
}

export function reconnectGenerals(...args: Parameters<typeof serializeReconnectGenerals>): Fields {
  return new ReconnectGeneralsDto(serializeReconnectGenerals(...args));
}

export function reconnectMine(...args: Parameters<typeof serializeReconnectMine>): Fields {
  return new ReconnectMineDto(serializeReconnectMine(...args));
}
