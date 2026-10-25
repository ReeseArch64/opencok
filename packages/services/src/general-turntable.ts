import { randomInt } from "node:crypto";
import {
  sfs,
  encode,
  decode,
  fields,
  str,
  int,
  Type,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import { num, long } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { generalFailure } from "@opencok/rules/general-progression";
import { chooseWeight } from "@opencok/rules/equipment";
import { generalFeatureAvailable } from "@opencok/rules/new-general-content";
import type { CityProgressionContext } from "./city-progression";
export function generalTurntable(
  context: CityProgressionContext,
  params: Fields,
): { body: Fields; event: Uint8Array | null } {
  if (
    !generalFeatureAvailable(context.rules, "hero_roulette", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    generalFailure();
  const action = str(params, "M__REQUEST_ID__H"),
    last = long(context.state.quests?.mixed ?? {}, "generalFree"),
    free = last / 86400000n !== context.now / 86400000n || last === 0n;
  if (action === "openui") {
    const history: Value[] = [];
    for (const payload of context.state.generalRoster?.drawHistory ?? []) {
      const data = decode(Buffer.from(payload));
      if (data.notices?.type !== Type.Array) continue;
      for (const value of data.notices.value as Value[]) {
        const notice = fields(value);
        history.push(
          sfs.object({
            name: sfs.string(str(notice, "name")),
            itemid: sfs.string(str(notice, "itemid")),
            itemnum: sfs.string(str(notice, "itemnum")),
          }),
        );
        if (history.length >= 50) break;
      }
      if (history.length >= 50) break;
    }
    return {
      body: { self_show_list: sfs.array(history), isTheSameDate: sfs.int(free ? 1 : 0) },
      event: null,
    };
  }
  if (action !== "openwheel") generalFailure();
  const id = str(params, "id"),
    count = cityInteger(int(params, "num"), 1, 1000),
    rule = context.rules.general.wheels?.get(id);
  const castle = context.state.buildings.find((row) => row.itemId === 400000);
  if (!rule || num(castle ?? {}, "level") < cityInteger(rule.minlevel, 1)) generalFailure();
  const items = (rule.item ?? "").split(";"),
    counts = (rule.item_num ?? "").split(";").map((value) => cityInteger(value, 1)),
    weights = (rule.rate ?? "").split(";").map((value) => cityInteger(value));
  if (
    !items.length ||
    items.length !== weights.length ||
    items.length !== counts.length ||
    items.some((id) => !context.rules.goods.has(id))
  )
    generalFailure();
  context.economy.gold(
    -BigInt(cityInteger(rule.gold, 1)) * BigInt(Math.max(0, count - (free ? 1 : 0))),
  );
  const winners: Value[] = [],
    notices: Value[] = [];
  for (let roll = 0; roll < count; roll++) {
    const index = chooseWeight(weights, randomInt),
      item = items[index]!,
      quantity = counts[index]!;
    context.economy.item(item, quantity);
    winners.push(
      sfs.object({
        item: sfs.string(item),
        num: sfs.string(String(quantity)),
        index: sfs.int(index),
      }),
    );
    if ((rule.notice_item ?? "").split(";").includes(String(index + 1)))
      notices.push(
        sfs.object({
          name: sfs.string(String(context.state.profile.name ?? "")),
          itemid: sfs.string(item),
          itemnum: sfs.string(String(quantity)),
        }),
      );
  }
  (context.write.generalRoster ??= {}).turntableAt = context.now;
  return {
    body: { list: sfs.array(winners), gold: sfs.long(context.balance("gold")) },
    event: encode({ notices: sfs.array(notices.slice(-50).reverse()) }),
  };
}
