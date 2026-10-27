import {
  decode,
  encode,
  fields,
  sfs,
  str,
  int,
  Type,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import type { CampaignNotice } from "@opencok/contracts/campaign-notice";
import type { CampaignNoticeResponse } from "@opencok/contracts/responses/campaign-notice";

export function campaignNoticeBody(notice: CampaignNoticeResponse): Fields {
  if (
    !notice.msgId ||
    notice.msgId.length > 128 ||
    notice.para.length > 8 ||
    notice.para.some((value) => typeof value !== "string" || Buffer.byteLength(value) > 4096)
  )
    throw new Error("Invalid native campaign notice");

  return {
    msgId: sfs.string(notice.msgId),
    ...(notice.para.length
      ? { para: sfs.array(notice.para.map((value) => sfs.string(value))) }
      : {}),
  };
}

export function campaignNoticeFrame(notice: CampaignNotice) {
  if (
    !notice.owner ||
    notice.owner.length > 40 ||
    notice.at <= 0n ||
    ![1, 2].includes(notice.scope) ||
    notice.allianceId.length > 40 ||
    (notice.scope === 1 && !notice.allianceId)
  )
    throw new Error("Invalid campaign notice envelope");

  return encode({
    at: sfs.long(notice.at),
    owner: sfs.string(notice.owner),
    scope: sfs.int(notice.scope),
    allianceId: sfs.string(notice.allianceId),
    notice: sfs.object(campaignNoticeBody(notice.message)),
  });
}

export function readCampaignNotice(payload: Uint8Array, owner: string): CampaignNotice {
  const data = decode(Buffer.from(payload)),
    scope = int(data, "scope"),
    allianceId = str(data, "allianceId"),
    body = fields(data.notice),
    parameters = body.para?.value ?? [];

  if (
    data.at?.type !== Type.Long ||
    typeof data.at.value !== "bigint" ||
    data.at.value <= 0n ||
    str(data, "owner") !== owner ||
    !owner ||
    owner.length > 40 ||
    ![1, 2].includes(scope) ||
    allianceId.length > 40 ||
    (scope === 1 && !allianceId) ||
    !Array.isArray(parameters) ||
    parameters.length > 8 ||
    parameters.some((value: Value) => value.type !== Type.String || typeof value.value !== "string")
  )
    throw new Error("Invalid owned campaign notice");

  const message = {
    msgId: str(body, "msgId"),
    para: parameters.map((value: Value) => value.value as string),
  };
  campaignNoticeBody(message);

  return { owner, at: data.at!.value as bigint, scope: scope as 1 | 2, allianceId, message };
}
