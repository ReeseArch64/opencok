import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function worldSearchOffset(page: number): number {
  if (!Number.isInteger(page) || page < -2147483648 || page > 2147483647)
    throw new GameError(errors.invalid);

  const offset = Math.imul(Math.max(1, page) - 1, 8);

  if (offset < 0) throw new GameError(errors.invalid);

  return offset;
}

export function worldSearchName(name: unknown): name is string {
  return (
    typeof name === "string" &&
    name.isWellFormed() &&
    !name.includes("\0") &&
    new TextEncoder().encode(name).length <= 32767
  );
}
