import { long, num, type Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function checkGameProfile(profile: Row | undefined, now: number): Row {
  if (!profile) {throw new GameError(errors.missing);}

  if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
    {throw new GameError(errors.invalid);}

  return profile;
}
