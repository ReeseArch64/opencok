import { long, num, text, type Row } from "@opencok/contracts/rows";
import { decode, encode, fields, sfs, str, type Fields, type Value } from "@opencok/messages/sfs";
import { inventoryResponse } from "./inventory.ts";

export function combineMailRewards(responses: readonly Buffer[], ids: readonly string[]): Buffer {
  const body: Fields = {},
    goods = new Map<string, Value>(),
    items = new Map<string, Value>();
  let resource: Fields | undefined;
  for (const response of responses) {
    const envelope = decode(response),
      result = fields(envelope.body);
    for (const [key, value] of Object.entries(result)) {
      if (key === "goods") {
        for (const item of value.value as Value[]) goods.set(str(fields(item), "uuid"), item);
      } else body[key] = value;
    }
    for (const value of envelope.pushes!.value as Value[]) {
      const push = fields(value),
        payload = fields(push.body);
      if (str(push, "command") === "push.useritem")
        for (const item of payload.useritemlist!.value as Value[])
          items.set(str(fields(item), "uuid"), item);
      else if (str(push, "command") === "push.city.refresh") resource = payload;
    }
  }
  if (goods.size) body.goods = sfs.array([...goods.values()]);
  body.successUids = sfs.string(ids.join(","));
  const pushes: { command: string; body: Fields }[] = [];
  if (items.size)
    pushes.push({
      command: "push.useritem",
      body: { useritemlist: sfs.array([...items.values()]) },
    });
  if (resource) pushes.push({ command: "push.city.refresh", body: resource });
  return inventoryResponse(body, pushes);
}
export function mailRewardEvent(entry: Row): Buffer {
  return encode({
    uid: sfs.string(text(entry, "uid")),
    reward: sfs.string(text(entry, "rewardId")),
    type: sfs.int(num(entry, "type")),
    title: sfs.string(text(entry, "title")),
    fromUser: sfs.string(text(entry, "fromUser")),
    createTime: sfs.long(long(entry, "createTime")),
  });
}
