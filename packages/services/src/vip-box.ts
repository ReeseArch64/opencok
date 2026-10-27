import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt, randomUUID } from "node:crypto";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { sfs, encode, int } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { serverFeature } from "@opencok/rules/power-context";
import {
  vipBoxBand,
  vipBoxIndices,
  vipBoxContents,
  vipBoxWeighted,
  vipBoxFailure,
} from "@opencok/rules/vip-box";
import { localActivityConditions, investmentDays } from "@opencok/rules/daily-investment";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { vipBoxView, vipBoxNotice } from "@opencok/mappings/vip-box";
import type { CityDomain } from "./city-domain.ts";

export class VipBoxDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["vip.box.init", "vip.box.turntable.ui", "vip.box.turntable.reward"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const state = context.state.vipBox;

      if (!state) vipBoxFailure();

      const enabled = serverFeature(context.rules, "box_vip", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      });

      if (!enabled) {
        if (command === "vip.box.init") return { response: encode({}), event: null };

        vipBoxFailure();
      }

      const tables = [...(context.rules.advanced.vipBoxes?.values() ?? [])];

      if (!tables.length || tables.length > 4096) vipBoxFailure();

      const vip = context.state.effects.vip ?? {};
      let scoreLevel = 0;

      for (const rule of context.rules.power.vip?.values() ?? [])
        if (cityInteger(rule.point) <= num(vip, "score"))
          scoreLevel = (cityInteger(rule.id) % 100) + 1;

      const baseLevel = num(vip, "level") >= 0 ? num(vip, "level") : scoreLevel,
        level = baseLevel + (baseLevel >= 10 ? cityInteger(num(vip, "sLevel")) : 0),
        ownBand = vipBoxBand(tables, level);

      if (command === "vip.box.init") {
        const row = state.records.find((row) => num(row, "vip") === ownBand);

        return {
          response: encode(row ? { box_vip_free: sfs.bool(num(row, "free") > 0) } : {}),
          event: null,
        };
      }

      const band =
        command === "vip.box.turntable.ui"
          ? vipBoxBand(tables, cityInteger(int(params, "vip"), 0, 255))
          : ownBand;
      let row: Row | undefined = state.records.find((row) => num(row, "vip") === band);
      row = row ? { ...row } : undefined;

      if (
        command === "vip.box.turntable.ui" &&
        (!row || long(row, "refreshTime") / 86400000n !== context.now / 86400000n)
      ) {
        const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
          eligible = tables.filter(
            (rule) =>
              cityInteger(rule.vip) === band &&
              context.now >= state.openedAt &&
              localActivityConditions(
                rule.condition,
                num(castle ?? {}, "level") + num(castle ?? {}, "star"),
                scoreLevel,
                investmentDays(context.now, state.openedAt),
              ),
          );

        if (!eligible.length) vipBoxFailure();

        const table =
          eligible[
            vipBoxWeighted(
              eligible.map((rule) => cityInteger(rule.cond_rate)),
              random,
            )
          ]!;
        vipBoxContents(table);
        row = {
          uid: context.owner,
          vip: band,
          tableid: cityInteger(table.id, 1),
          itemidlist: "",
          openCount: row?.openCount ?? 0n,
          stepNum: 0,
          free: 0,
          rewardTime: row?.rewardTime ?? context.now,
          refreshTime: context.now,
        };
        context.write.vipBox = { record: row };
      }

      if (!row) vipBoxFailure();

      const table = context.rules.advanced.vipBoxes?.get(String(num(row, "tableid")));

      if (!table || cityInteger(table.vip) !== band) vipBoxFailure();

      const contents = vipBoxContents(table),
        indices = vipBoxIndices(text(row, "itemidlist"), contents.items.length);

      if (indices.length !== num(row, "stepNum") || indices.length > 0 !== num(row, "free") > 0)
        vipBoxFailure();

      if (command === "vip.box.turntable.ui") {
        const tableInfo = Object.fromEntries(
          javaHashMapOrder(Object.keys(table)).map((key) => [key, sfs.string(table[key] ?? "")]),
        );

        return {
          response: encode(
            vipBoxView(
              {
                table_info: sfs.object(tableInfo),
                itemidlist: sfs.string(text(row, "itemidlist")),
                free: sfs.bool(num(row, "free") > 0),
                stepNum: sfs.int(indices.length),
              },
              state.history.map((row) => ({
                name: text(row, "name"),
                itemid: text(row, "itemId"),
                itemnum: String(num(row, "count")),
              })),
              ownBand > level ? 0 : ownBand,
            ),
          ),
          event: null,
        };
      }

      if (
        band > level ||
        long(row, "refreshTime") / 86400000n !== context.now / 86400000n ||
        indices.length >= contents.items.length
      )
        vipBoxFailure();

      if (num(row, "free") > 0)
        context.economy.item(table.deplete!, -contents.costs[Math.max(0, indices.length - 1)]!);

      const index = vipBoxWeighted(
          contents.weights.map((weight, index) => (indices.includes(index) ? 0 : weight)),
          random,
        ),
        itemId = contents.items[index]!,
        count = contents.counts[index]!;

      if (!context.rules.goods.has(itemId)) vipBoxFailure();

      context.economy.item(itemId, count);
      const notable = (table.notice_item ?? "").split(";").includes(String(index + 1)),
        notice = {
          name: text(context.state.profile, "name"),
          itemid: itemId,
          itemnum: String(count),
        };
      Object.assign(row, {
        itemidlist: [...indices, index].join(",") + ",",
        stepNum: indices.length + 1,
        free: 1,
        rewardTime: context.now,
      });
      context.write.vipBox = {
        record: row,
        ...(notable
          ? {
              history: {
                id: randomUUID(),
                uid: context.owner,
                name: notice.name,
                itemId,
                count,
                createdAt: context.now,
              },
            }
          : {}),
      };

      return {
        response: encode({
          item: sfs.string(itemId),
          num: sfs.string(String(count)),
          index: sfs.int(index),
          show_list: sfs.object(notable ? vipBoxNotice(notice) : {}),
        }),
        event: null,
      };
    };

    this.apply = async () => {
      vipBoxFailure();
    };
  }
}

export function createVipBoxDomain(random: (maximum: number) => number = randomInt): CityDomain {
  return new VipBoxDomain(random);
}
