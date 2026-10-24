import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { PlayerPower } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";

function signed(value: unknown, bits: 32 | 64): bigint {
  if (value === undefined || value === null) return 0n;
  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new GameError(errors.unsupported, "power_rule");
  if (!/^[+-]?\d+$/.test(String(value))) throw new GameError(errors.unsupported, "power_rule");
  const parsed = BigInt(String(value));
  if (BigInt.asIntN(bits, parsed) !== parsed) throw new GameError(errors.unsupported, "power_rule");
  return parsed;
}

function serializePlayerStatistics(statistics: Row | undefined): Fields {
  const fields: Fields = {};
  for (const [wire, column] of Object.entries({
    battleWin: "battlesWin",
    battleLose: "battlesLose",
    attackWin: "attacksWin",
    attackLose: "attacksLose",
    defenseWin: "defensesWin",
    detectNum: "detectNum",
    armyDead: "armyDead",
    armyCure: "armyCure",
    cityDes: "cityDestroyed",
  }))
    fields[wire] = sfs.int(Number(signed(statistics?.[column], 32)));
  fields.armyKill = sfs.long(signed(statistics?.armyKill, 64));
  return fields;
}

function serializePowerInfo(
  statistics: Row | undefined,
  power: PlayerPower,
  upload: Row | undefined,
  rules: Rules,
): Fields {
  const fields = playerStatistics(statistics);
  for (const key of [
    "playerPower",
    "heroPower",
    "buildingPower",
    "sciencePower",
    "civilizationSciencePower",
    "questpower",
    "equipPower",
    "knight_title",
    "sagatower_science",
  ] as const)
    fields[key] = sfs.int(Number(signed(power[key], 32)));
  for (const key of ["armyPower", "fortPower", "petDragonPower", "prinessPower"] as const)
    fields[key] = sfs.long(signed(power[key], 64));
  let nextUpdateTime = 0n;
  if (upload) {
    const seconds = rules.items.get("hero")?.k7;
    if (seconds === undefined) throw new GameError(errors.unsupported, "power_rule");
    nextUpdateTime = BigInt.asIntN(64, signed(upload.updateTime, 64) + signed(seconds, 64) * 1000n);
  }
  fields.nextUpdateTime = sfs.long(nextUpdateTime);
  fields.banTime = sfs.long(signed(upload?.banTime, 64));
  fields.banCount = sfs.int(Number(signed(upload?.banCount, 32)));
  return fields;
}

export class PlayerStatisticsDto extends createZodDto(
  z.strictObject({
    battleWin: wire.int,
    battleLose: wire.int,
    attackWin: wire.int,
    attackLose: wire.int,
    defenseWin: wire.int,
    detectNum: wire.int,
    armyDead: wire.int,
    armyCure: wire.int,
    cityDes: wire.int,
    armyKill: wire.long,
  }),
) {}

export class PowerInfoDto extends createZodDto(
  PlayerStatisticsDto.schema.extend({
    playerPower: wire.int,
    heroPower: wire.int,
    buildingPower: wire.int,
    sciencePower: wire.int,
    civilizationSciencePower: wire.int,
    questpower: wire.int,
    equipPower: wire.int,
    knight_title: wire.int,
    sagatower_science: wire.int,
    banCount: wire.int,
    armyPower: wire.long,
    fortPower: wire.long,
    petDragonPower: wire.long,
    prinessPower: wire.long,
    nextUpdateTime: wire.long,
    banTime: wire.long,
  }),
) {}

export function playerStatistics(...args: Parameters<typeof serializePlayerStatistics>): Fields {
  return new PlayerStatisticsDto(serializePlayerStatistics(...args));
}

export function powerInfo(...args: Parameters<typeof serializePowerInfo>): Fields {
  return new PowerInfoDto(serializePowerInfo(...args));
}
