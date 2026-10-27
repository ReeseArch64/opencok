import { randomUUID } from "node:crypto";
import { inventoryWeighted } from "@opencok/rules/inventory";
import { sfs, str, type Fields } from "@opencok/messages/sfs";
import { text, num, long } from "@opencok/contracts/rows";
import { allianceFailure } from "@opencok/rules/alliance";
import { cityInteger } from "@opencok/rules/city-progression";
import { activityEconomy } from "./timed-activity";
import type { AllianceContext } from "./alliances";

export function allianceGift(c: AllianceContext, command: string, params: Fields): Fields {
  if (c.state.gifts.length > 2048) {allianceFailure();}

  if (command === "al.showgift")
    {return {
      gifts: sfs.array(
        c.state.gifts
          .filter(
            (row) =>
              row.allianceId === c.allianceId &&
              long(row, "time") + BigInt(num(row, "expiretime")) * 3600000n > c.now,
          )
          .map((row) =>
            sfs.object({
              giftId: sfs.string(text(row, "uuid")),
              uuid: sfs.string(text(row, "uuid")),
              type: sfs.int(num(row, "gifttype")),
              gifttype: sfs.int(num(row, "gifttype")),
              giftlevel: sfs.int(num(row, "level")),
              alliancegfitexp: sfs.int(num(c.alliance(), "giftlevel")),
              alliancegiftlevel: sfs.int(Math.floor(num(c.alliance(), "giftlevel") / 1000)),
              nextlevelexp: sfs.int((Math.floor(num(c.alliance(), "giftlevel") / 1000) + 1) * 1000),
              timeleft: sfs.long(
                long(row, "time") + BigInt(num(row, "expiretime")) * 3600000n - c.now,
              ),
              level: sfs.int(num(row, "level")),
              valid: sfs.int(num(row, "valid")),
              item: sfs.string(text(row, "item")),
              num: sfs.int(num(row, "num")),
              para: sfs.int(num(row, "para")),
              exp: sfs.int(num(row, "exp")),
              time: sfs.long(long(row, "time")),
              expiretime: sfs.int(num(row, "expiretime")),
            }),
          ),
      ),
    };}

  const id = str(params, "giftId"),
    gift = c.state.gifts.find(
      (row) => row.uuid === id && row.uid === c.owner && row.allianceId === c.allianceId,
    );

  if (!gift) {allianceFailure();}

  const expired =
    long(gift, "time") + BigInt(cityInteger(num(gift, "expiretime"), 1)) * 3600000n <= c.now;

  if (command === "al.cleargift") {
    if (num(gift, "valid") !== 0 && !expired) {allianceFailure();}

    c.write.deletedGifts = [id];

    return { stats: sfs.int(1) };
  }

  if (num(gift, "valid") !== 1 || expired) {allianceFailure();}

  const item = text(gift, "item"),
    quantity = cityInteger(num(gift, "num"), 1),
    experience = cityInteger(num(gift, "exp")),
    economy = activityEconomy(c.ledger);

  if (/^[0-5]$/.test(item)) {
    const resource = ["wood", "stone", "iron", "food", "silver", "gold"][Number(item)]!;

    if (resource === "gold") {economy.gold(BigInt(quantity));}
    else {economy.resource(resource as "wood", BigInt(quantity));}
  } else if (item === "6") {
    const member = c.member();
    c.setMember({
      ...member,
      point: cityInteger(num(member, "point") + quantity),
      accPoint: cityInteger(num(member, "accPoint") + quantity),
    });
  } else if (/^200\d+$/.test(item)) {c.ledger.add(item, quantity, cityInteger(num(gift, "para")));}
  else {allianceFailure();}

  c.write.gifts = [{ ...gift, valid: 0 }];
  c.setAlliance({
    ...c.alliance(),
    giftlevel: cityInteger(num(c.alliance(), "giftlevel") + experience),
  });

  return {
    item: sfs.string(item),
    num: sfs.int(quantity),
    exp: sfs.int(experience),
    para: sfs.int(num(gift, "para")),
  };
}

export function publishAllianceGift(c: AllianceContext, event: string, type: number): Fields {
  if (![30000, 30100, 30200, 30300, 30400, 30500].includes(type)) {allianceFailure();}

  if (c.state.sharedGifts.length) {
    const saved = c.state.sharedGifts[0]!;

    if (saved.allianceid !== c.allianceId || num(saved, "typeId") !== type) {allianceFailure();}

    return { giftId: sfs.string(event) };
  }

  const level = Math.floor(num(c.alliance(), "giftlevel") / 1000) + 1;
  const rule =
    c.rules.alliance.gifts?.get(String(type + level)) ?? c.rules.alliance.gifts?.get(String(type));

  if (!rule) {allianceFailure();}

  const choices = new Map<string, number>(),
    quantities = new Map<string, number>();

  for (const [key, item] of Object.entries(rule)) {
    const resource = /^rss(\d+)$/.exec(key),
      goods = /^item_(\d+)$/.exec(key);

    if (!resource && !goods) {continue;}

    const index = resource?.[1] ?? goods![1]!,
      suffix = resource ? index : "_" + index;
    const id = String(item),
      weight = cityInteger(rule["rate" + suffix], 0),
      quantity = cityInteger(rule["num" + suffix], 1);

    if (weight) {
      const identity = key + ":" + id;
      choices.set(identity, weight);
      quantities.set(identity, quantity);
    }
  }

  if (!choices.size) {allianceFailure();}

  const expires = cityInteger(rule.time, 1),
    experience = cityInteger(rule.exp);
  c.write.publishedGift = {
    uid: event,
    allianceid: c.allianceId,
    level,
    typeId: type,
    time: c.now,
    expiretime: expires,
  };
  c.write.sharedGifts = c.list().map((member) => {
    const chosen = inventoryWeighted(choices),
      item = chosen.split(":")[1]!;

    return {
      uuid: randomUUID(),
      giftId: event,
      uid: text(member, "uid"),
      allianceId: c.allianceId,
      gifttype: type + level,
      valid: 1,
      level,
      item,
      num: quantities.get(chosen)!,
      para: 0,
      time: c.now,
      expiretime: expires,
      exp: experience,
      description: "",
    };
  });

  return { giftId: sfs.string(event) };
}
