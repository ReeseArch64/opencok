import { nicknameChangeReply } from "@opencok/mappings/nickname-change";
import { randomUUID } from "node:crypto";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { Type, type Fields } from "@opencok/messages/sfs";
import { validateNicknameChange } from "@opencok/rules/nickname-change";

export async function changeNickname(
  db: GameStore,
  services: GameServices,
  owner: string,
  kingdomId: number,
  params: Fields,
  now: number,
): Promise<Fields> {
  const profile = await db.getProfileById(owner);

  if (!profile) {throw new GameError(errors.missing);}

  if (
    profile.uid !== owner ||
    profile.serverId !== kingdomId ||
    (profile.banFlag ?? 0) !== 0 ||
    typeof (profile.banTime ?? 0n) !== "bigint" ||
    ((profile.banTime as bigint) ?? 0n) > BigInt(now)
  )
    {throw new GameError(errors.invalid);}

  if (params.nickName?.type !== Type.String || typeof params.nickName.value !== "string")
    {throw new GameError(errors.invalid);}

  if (!services.nicknameChange || !services.nicknameForbidden || !services.nicknameBadWords)
    {throw new GameError(errors.unsupported);}

  const operation = params.operationId;

  if (
    operation !== undefined &&
    (operation.type !== Type.String ||
      typeof operation.value !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        operation.value,
      ))
  )
    {throw new GameError(errors.invalid);}

  const name = await validateNicknameChange(params.nickName.value, {
    forbidden: services.nicknameForbidden,
    badWords: services.nicknameBadWords,
  });

  return nicknameChangeReply(
    await services.nicknameChange(
      owner,
      operation ? (operation.value as string).toLowerCase() : randomUUID(),
      name,
      now,
    ),
  );
}
