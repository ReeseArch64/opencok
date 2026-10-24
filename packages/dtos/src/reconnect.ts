import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

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

export function reconnectBalances(profile: Row): Fields {
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

export function reconnectArmy(row: Row): Fields {
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

export function reconnectArmies(rows: readonly Row[]): Fields {
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
