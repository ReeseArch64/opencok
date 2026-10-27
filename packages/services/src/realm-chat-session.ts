import { isChatSessionTicket, type RealmChatSessionRequest } from "@opencok/contracts/chat";
import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function realmChatSessionRequest(
  profile: Row,
  uid: string,
  kingdomId: number,
): RealmChatSessionRequest {
  if (
    typeof uid !== "string" ||
    !uid.trim() ||
    uid.length > 40 ||
    !uid.isWellFormed() ||
    uid.includes("\0") ||
    profile.uid !== uid ||
    profile.serverId !== kingdomId ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    typeof profile.level !== "number" ||
    !Number.isInteger(profile.level) ||
    profile.level < -2147483648 ||
    profile.level > 2147483647
  )
    {throw new GameError(errors.invalid);}

  const userinfo: Record<string, string> = {};

  for (const [target, source] of Object.entries({
    userName: "name",
    deviceid: "deviceId",
    country: "country",
    pf: "pf",
    version: "appVersion",
    lang: "lang",
    allianceId: "allianceId",
    phoneDevice: "phoneDevice",
  })) {
    const value = source === "phoneDevice" && profile[source] == null ? "" : profile[source];

    if (typeof value !== "string" || !value.isWellFormed()) {throw new GameError(errors.invalid);}

    userinfo[target] = value;
  }

  return {
    uid,
    userinfo: {
      ...userinfo,
      lvl: String(profile.level),
      serverId: String(kingdomId),
      serverType: "0",
    },
  };
}

export function realmChatSessionResponse(value: unknown, now: number): Fields {
  if (!isChatSessionTicket(value, now)) {throw new GameError(errors.invalid);}

  return {
    session: sfs.string(value.session),
    expire: value.expire <= 2147483647 ? sfs.int(value.expire) : sfs.long(value.expire),
  };
}
