import { randomInt } from "node:crypto";
import {
  sfs,
  encode,
  decode,
  str,
  int,
  fields,
  Type,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  towerFailure,
  towerOpen,
  towerLayer,
  towerWeekStart,
  towerArmy,
  towerSelectedArmy,
  towerIndex,
} from "@opencok/rules/dragon-tower";
import { dragonFeature, dragonJson, emptyDragonTravel } from "@opencok/rules/dragon-progression";
import { cityInteger, citySpeedGold, cityAmount } from "@opencok/rules/city-progression";
import { equipmentItem } from "@opencok/mappings/equipment";
import {
  towerArmyView,
  towerUserView,
  towerLayerView,
  towerBuffViews,
  towerRankingView,
} from "@opencok/mappings/dragon-tower";
import { militaryBoolean } from "./training";
import type { CityDomain, CityProgressionContext } from "./city-progression";

function units(params: Fields) {
  if (params.armys?.type !== Type.Array) towerFailure();

  if (!(params.armys.value as Value[]).length || (params.armys.value as Value[]).length > 128)
    towerFailure();

  return (params.armys.value as Value[]).map((value) => {
    const row = fields(value);

    return { id: cityInteger(int(row, "id"), 1), num: cityInteger(int(row, "num"), 1) };
  });
}

function saveUnits(row: Row, key: string, values: ReadonlyMap<string, number>) {
  row[key] = JSON.stringify(Object.fromEntries([...values].filter(([, count]) => count > 0)));
}

function finishHeal(row: Row) {
  const healing = towerArmy(row.armyrevive),
    alive = towerArmy(row.army),
    dead = towerArmy(row.deadarmy);
  let total = 0;

  for (const [id, count] of healing) {
    if (count > (dead.get(id) ?? 0)) towerFailure();

    alive.set(id, cityInteger((alive.get(id) ?? 0) + count));
    dead.set(id, (dead.get(id) ?? 0) - count);
    total += count;
  }

  if (total > num(row, "armyrevivenum")) towerFailure();

  row.armyrevivenum = num(row, "armyrevivenum") - total;
  row.armyrevive = "";
  row.armyrevivecd = 0n;
  saveUnits(row, "army", alive);
  saveUnits(row, "deadarmy", dead);
}

function reset(row: Row, now: bigint, weekly: boolean, manual: boolean) {
  Object.assign(row, {
    currentlayer: 84501,
    dragon: "",
    army: "",
    deadarmy: "",
    armyrevive: "",
    armyrevivecd: 0n,
    armyrevivenum: 0,
    score: 0,
    resettimes: manual ? num(row, "resettimes") + 1 : 0,
  });

  if (!manual) Object.assign(row, { dailyresettime: now, weeklyrevive: 0, sharetimes: 0 });

  if (weekly) Object.assign(row, { weeklymaxlayer: 0, weeklyresettime: now });
}

function validateSelection(context: CityProgressionContext, row: Row, params: Fields) {
  if (params.generalid) {
    const raw = str(params, "generalid"),
      id = cityInteger(raw, 1);
    const general = context.state.generalRoster?.generals.find((item) => item.id === id);

    if (
      String(id) !== raw ||
      !general ||
      num(general, "state") !== 1 ||
      context.rules.power.newGeneralBases?.get(raw)?.battle !== "1"
    )
      towerFailure();

    row.generalid = id;
  }

  if (params.dragon) {
    const uuid = str(params, "dragon"),
      dragon = context.state.dragons?.dragons.find((item) => item.uuid === uuid);

    if (
      uuid &&
      (!dragon ||
        num(dragon, "dragonState") !== 3 ||
        dragonJson(dragon.travelData, emptyDragonTravel).travelState === 1)
    )
      towerFailure();

    row.dragon = uuid;
  }
}

function healDuration(
  context: CityProgressionContext,
  row: Row,
  selection: ReadonlyMap<string, number>,
) {
  if (!dragonFeature(context.rules, "dragon_tower_heal", context.now)) return 0n;

  let seconds = 0;

  for (const [id, count] of selection) {
    const rule = context.rules.arms.get(id);

    if (!rule) towerFailure();

    const base =
      count * cityInteger(rule.time) * Math.fround(cityInteger(rule.heal_time) / 1000) -
      context.effect(2154);
    const level = ["107013", "107113", "107213", "107316"].includes(id)
      ? 10
      : id === "107412"
        ? 11
        : ["107014", "107114", "107214", "107314", "107414", "107514", "107614", "107714"].includes(
              id,
            )
          ? 14
          : (Number(id) % 100) + 1;
    const tierEffect =
      level <= 7 ? context.effect(430) : level <= 10 ? context.effect(423 + level) : 0;
    const effect =
      tierEffect +
      context.effect(121) +
      context.generalEffect(121) +
      context.effect(304) +
      context.effect(2155);
    seconds += Math.trunc(base / (1 + effect / 100));
  }

  const factor = Math.fround(
      Number(context.rules.advanced.dragonTower?.get(text(row, "currentlayer"))?.heal),
    ),
    multiplier = Math.fround(Number(context.rules.items.get("dragon_tower")?.k3));
  const duration =
    Math.trunc(Math.fround(Math.fround(Math.fround(seconds) * factor) * multiplier)) * 1000;

  if (!Number.isSafeInteger(duration) || duration < 0) towerFailure();

  return BigInt(duration);
}

export const dragonTowerDomain: CityDomain = {
  commands: ["dragontower", "dragontower.init", "dragontower.tick"],
  types: [],
  async prepare(context, command, params) {
    const state = context.state.dragonTower;

    if (!state) towerFailure();

    const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
      building = context.state.buildings.find((row) => num(row, "itemId") === 432000),
      config = context.rules.items.get("dragon_tower") ?? {};
    const open = towerOpen(
      context.rules,
      context.state.profile,
      num(castle ?? {}, "level"),
      state.serverOpenedAt,
      context.now,
    );

    if (command === "dragontower.init" && (!open || !building))
      return { response: encode({ dragontowerplay: sfs.bool(false) }), event: null };

    if (!open || !building) towerFailure();

    const action = command === "dragontower" ? str(params, "M__REQUEST_ID__H") : "entertower";

    if (["battle", "quickbattle"].includes(action)) towerFailure();

    if (action === "ranking")
      return {
        response: encode({
          weeklyranking: sfs.array(
            towerRankingView(
              (state.weeklyRanking ?? []).slice(
                0,
                cityInteger(context.rules.items.get("ranking")?.k2, 1, 1024),
              ),
            ),
          ),
          historyranking: sfs.array(
            towerRankingView(
              (state.historyRanking ?? []).slice(
                0,
                cityInteger(context.rules.items.get("ranking")?.k2, 1, 1024),
              ),
            ),
          ),
        }),
        event: null,
      };

    if (action === "maxlayer")
      return {
        response: encode({ historymaxlayer: sfs.int(towerIndex(state.historyMax)) }),
        event: null,
      };

    if (action === "reportsimple")
      return {
        response: encode({
          reportlist: sfs.array(
            (state.reports ?? []).map((row) =>
              sfs.object({
                citylevel: sfs.short(num(row, "citylevel")),
                citystar: sfs.short(num(row, "citystar")),
                layer: sfs.int(towerIndex(num(row, "layer"))),
                difficulty: sfs.short(num(row, "difficulty")),
                playerdead: sfs.int(num(row, "playerdead")),
                monsterid: sfs.int(num(row, "monsterid")),
                monsterdead: sfs.int(num(row, "monsterdead")),
                time: sfs.long(long(row, "fighttime")),
              }),
            ),
          ),
        }),
        event: null,
      };

    if (action === "report") {
      const report = state.reports?.[0],
        raw = text(report ?? {}, "report");

      if (raw.length > 65535) towerFailure();

      return {
        response: encode(
          report && raw
            ? { ...decodeLegacyJsonObject(raw), owner: sfs.string(text(report, "uid")) }
            : {},
        ),
        event: null,
      };
    }

    if (action === "reporttemp") return { response: encode({}), event: null };

    const row: Row = state.user
      ? { ...state.user }
      : {
          uid: context.owner,
          currentlayer: 84501,
          weeklymaxlayer: 0,
          maxlayer: 0,
          weeklyrevive: 0,
          resettimes: 0,
          dailyresettime: context.now,
          weeklyresettime: context.now,
          dragon: "",
          generalid: 0,
          army: "",
          deadarmy: "",
          armyrevivenum: 0,
          armyrevive: "",
          armyrevivecd: 0n,
          score: 0,
          sharetimes: 0,
        };
    const write = (context.write.dragonTower ??= {});
    write.user = row;
    let layers = [...state.layers],
      buffs = [...state.buffs],
      resetOccurred = false,
      healed = false;
    const saveLayer = (layer: Row) => {
      layers = [...layers.filter((item) => item.layer !== layer.layer), layer];
      write.layers = [...(write.layers ?? []).filter((item) => item.layer !== layer.layer), layer];
    };
    const weekly = long(row, "weeklyresettime") < towerWeekStart(context.now),
      daily = long(row, "dailyresettime") / 86400000n !== context.now / 86400000n;

    if (weekly || daily) {
      reset(row, context.now, weekly, false);
      write.buffs = [];
      buffs = [];
      saveLayer(towerLayer(context.rules, context.owner, 84501, randomInt));
      resetOccurred = true;
    }

    if (long(row, "armyrevivecd") > 0n && long(row, "armyrevivecd") <= context.now) {
      finishHeal(row);
      healed = true;
    }

    let layer = layers.find((item) => item.layer === num(row, "currentlayer"));

    if (!layer) {
      layer = towerLayer(context.rules, context.owner, num(row, "currentlayer"), randomInt);
      saveLayer(layer);
    }

    const limit = cityInteger(
        context.rules.building("432000", num(building, "level"), num(building, "star"))
          .clientParameters?.[0]?.value,
        1,
      ),
      castleLimit =
        Number(
          context.rules
            .building("400000", num(castle!, "level"))
            .clientParameters?.[0]?.value.split(";")[0] ?? 0,
        ) + context.effect(56);
    const view = (includeLayer = true): Fields => ({
      tower: sfs.object(towerUserView(state, row, context.state.armies, context.rules, limit)),
      ...(includeLayer ? { layer: sfs.object(towerLayerView(layer!)) } : {}),
      buffs: sfs.array(towerBuffViews(buffs, num(row, "currentlayer"), context.rules)),
    });
    const pushes: { command: string; body: Uint8Array }[] = [];
    const completeResponse = (body: Fields) => {
      if (resetOccurred) pushes.push({ command: "push.dragontower.reset", body: encode(view()) });
      else if (healed)
        pushes.push({
          command: "push.dragontower.army",
          body: encode(towerArmyView(row, context.state.armies)),
        });

      return {
        response: encode(body),
        event: pushes.length
          ? encode({
              owner: sfs.string(context.owner),
              pushes: sfs.array(
                pushes.map((push) =>
                  sfs.object({
                    command: sfs.string(push.command),
                    body: sfs.object(decode(Buffer.from(push.body))),
                  }),
                ),
              ),
            })
          : null,
      };
    };

    if (command === "dragontower.init")
      return completeResponse({ dragontowerplay: sfs.bool(num(row, "weeklymaxlayer") <= 0) });

    if (resetOccurred) return completeResponse({});

    if (action === "entertower" || command === "dragontower.tick")
      return completeResponse(command === "dragontower.tick" ? {} : view());

    if (action === "reset") {
      if (num(row, "currentlayer") === 84501 || num(row, "resettimes") >= cityInteger(config.k5))
        towerFailure();

      reset(row, context.now, false, true);
      buffs = [];
      write.buffs = [];
      layer = towerLayer(context.rules, context.owner, 84501, randomInt);
      saveLayer(layer);

      return completeResponse(view());
    }

    if (action === "setarmy" || action === "addarmy") {
      const current = towerArmy(row.army),
        hasCurrent = current.size > 0;
      let cap = castleLimit;

      if (hasCurrent) {
        const buffId = cityInteger(int(params, "buffid"), 1),
          buff = buffs.find((item) => item.buffid === buffId),
          rule = context.rules.advanced.dragonTowerBuffs?.get(String(buffId));

        if (
          !buff ||
          !rule ||
          Number(rule.type) !== (action === "addarmy" ? 2 : 3) ||
          (rule.time !== "-1" && num(buff, "remainlayers") < num(row, "currentlayer"))
        )
          towerFailure();

        if (action === "addarmy") cap = cityInteger(rule.army, 1);

        buffs = buffs.filter((item) => item !== buff);
        write.buffs = buffs;
      }

      const selection = towerSelectedArmy(context.rules, context.state.armies, units(params), cap);
      validateSelection(context, row, params);

      if (action === "setarmy") {
        saveUnits(row, "army", selection);
        Object.assign(row, { deadarmy: "", armyrevive: "", armyrevivecd: 0n, armyrevivenum: 0 });
      } else {
        for (const [id, count] of selection)
          current.set(id, cityInteger((current.get(id) ?? 0) + count));

        saveUnits(row, "army", current);
      }

      return completeResponse(view(false));
    }

    if (action === "healarmy") {
      if (long(row, "armyrevivecd") > context.now) towerFailure();

      const dead = towerArmy(row.deadarmy),
        selected = new Map<string, number>();
      let total = 0;

      for (const unit of units(params)) {
        const id = String(unit.id);

        if (selected.has(id) || unit.num > (dead.get(id) ?? 0)) towerFailure();

        selected.set(id, unit.num);
        total += unit.num;
      }

      if (!total || total > num(row, "armyrevivenum")) towerFailure();

      const duration = healDuration(context, row, selected);
      saveUnits(row, "armyrevive", selected);
      let buy: Fields | undefined;

      if (duration === 0n || militaryBoolean(params, "gold")) {
        if (duration > 0n) {
          const price = Math.fround(
            Math.fround(Number(citySpeedGold(context.rules, duration))) *
              Math.fround(Number(config.k11)),
          );
          context.economy.gold(-BigInt(cityInteger(Math.ceil(price))));
          buy = { gold: sfs.long(context.balance("gold")) };
        }

        finishHeal(row);
        healed = true;
      } else row.armyrevivecd = context.now + duration;

      return completeResponse({ ...view(false), ...(buy ? { buyresult: sfs.object(buy) } : {}) });
    }

    if (action === "buyhealcd") {
      const remaining = long(row, "armyrevivecd") - context.now;
      let buy: Fields = {};

      if (remaining > 0n) {
        if (militaryBoolean(params, "gold")) {
          const cost = Math.trunc(
            Math.fround(
              Math.fround(Number(citySpeedGold(context.rules, remaining))) *
                Math.fround(Number(config.k11)),
            ),
          );
          context.economy.gold(-BigInt(cityInteger(cost)));
          finishHeal(row);
          healed = true;
          buy = { gold: sfs.long(context.balance("gold")) };
        } else {
          const owned = context.economy.ownedItem?.(str(params, "item"));

          if (!owned) towerFailure();

          const rule = context.rules.goods.get(owned.itemId);

          if (rule?.type !== "2") towerFailure();

          let count = cityInteger(int(params, "count"), 1),
            seconds = Number(remaining / 1000n);
          const value = cityInteger(rule.para3, 1);

          if (rule.para2 === "1") {
            count = Math.min(count, Math.ceil(seconds / value));
            seconds = Math.max(0, seconds - count * value);
          } else {
            if (value > 100) towerFailure();

            count = 1;
            seconds = Math.trunc(seconds * (1 - value / 100));
          }

          context.spendItem(owned.itemId, count);
          row.armyrevivecd = context.now + BigInt(seconds) * 1000n;

          if (!seconds) {
            finishHeal(row);
            healed = true;
          }

          buy = {
            itemId: sfs.string(owned.itemId),
            count: sfs.int(context.economy.quantity?.(owned.itemId) ?? 0),
          };
        }
      }

      return completeResponse({ ...view(false), buyresult: sfs.object(buy) });
    }

    if (action === "revive") {
      const times = cityInteger(num(row, "weeklyrevive") + 1, 1, 127);
      context.economy.gold(-BigInt(cityInteger(times * cityInteger(config.k9))));
      const alive = towerArmy(row.army);

      for (const [id, count] of towerArmy(row.deadarmy))
        alive.set(id, cityInteger((alive.get(id) ?? 0) + count));

      saveUnits(row, "army", alive);
      Object.assign(row, {
        weeklyrevive: times,
        deadarmy: "",
        armyrevive: "",
        armyrevivecd: 0n,
        armyrevivenum: 0,
      });
      layer = { ...layer, layerstate: 1 };
      saveLayer(layer);

      return completeResponse({
        ...view(),
        buyresult: sfs.object({ gold: sfs.long(context.balance("gold")) }),
      });
    }

    if (action === "buybuff") {
      const id = cityInteger(int(params, "buffid"), 1),
        offered = layers.find((item) => item.layer === int(params, "layer")),
        rule = context.rules.advanced.dragonTowerBuffs?.get(String(id));

      if (
        !offered ||
        offered.layer !== row.currentlayer ||
        num(offered, "layerstate") !== 3 ||
        num(offered, "buybuff") > 0 ||
        !text(offered, "buff").split("|").includes(String(id)) ||
        !rule ||
        num(row, "score") < Number(rule.score)
      )
        towerFailure();

      context.economy.gold(-cityAmount(rule.gold ?? "0"));
      row.score = num(row, "score") - cityInteger(rule.score);
      buffs = buffs.filter(
        (buff) =>
          context.rules.advanced.dragonTowerBuffs?.get(text(buff, "buffid"))?.group !== rule.group,
      );
      const duration = Number(rule.time);

      if (!Number.isInteger(duration) || duration < -1 || duration > 1024) towerFailure();

      buffs.push({
        uid: context.owner,
        buffid: id,
        remainlayers: num(row, "currentlayer") + duration,
        buytime: context.now,
      });
      write.buffs = buffs;
      layer = { ...offered, buybuff: id };
      saveLayer(layer);

      return completeResponse({
        buffs: sfs.array(towerBuffViews(buffs, num(row, "currentlayer"), context.rules)),
        buyresult: sfs.object({
          score: sfs.int(num(row, "score")),
          buybuff: sfs.int(id),
          gold: sfs.long(context.balance("gold")),
        }),
      });
    }

    if (action === "nextlayer") {
      if (num(layer, "layerstate") !== 3 || towerIndex(num(layer, "layer")) > limit) towerFailure();

      const next = num(layer, "layer") + 1;

      if (!context.rules.advanced.dragonTower?.has(String(next))) {
        layer = { ...layer, layerstate: 4 };
        saveLayer(layer);
      } else {
        row.currentlayer = next;
        layer = towerLayer(context.rules, context.owner, next, randomInt);
        saveLayer(layer);
      }

      return completeResponse(view());
    }

    if (action === "share") {
      const first = num(row, "sharetimes") === 0;
      row.sharetimes = Math.min(127, num(row, "sharetimes") + 1);
      let reward: Fields | undefined;

      if (first) {
        const id = config.k10 ?? "";
        cityInteger(id, 1);
        context.economy.item(id, 1);
        reward = equipmentItem(
          id,
          context.economy.quantity?.(id) ?? 0,
          context.economy.itemState?.(id),
          context.rules,
        );
      }

      return completeResponse({
        ...view(false),
        ...(reward ? { sharereward: sfs.object(reward) } : {}),
      });
    }

    return towerFailure();
  },
  async apply() {
    towerFailure();
  },
};

export async function publishDragonTowerMutation(
  payload: Buffer,
  publish: (owner: string, command: string, body: Fields) => Promise<unknown>,
) {
  const body = decode(payload),
    owner = str(body, "owner");

  for (const entry of (body.pushes?.value ?? []) as Value[]) {
    const push = fields(entry),
      name = str(push, "command");

    if (!["push.dragontower.army", "push.dragontower.reset"].includes(name)) towerFailure();

    await publish(owner, name, fields(push.body));
  }
}
