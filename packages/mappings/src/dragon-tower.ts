import { validateFields } from "./validation";
import {
    towerArmySchema,
    towerUserSchema,
    towerLayerSchema,
} from "@opencok/validations/dragon-tower";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { decodeLegacyJsonArray } from "@opencok/messages/legacy-json";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { towerArmy, towerIndex, towerFailure } from "@opencok/rules/dragon-tower";
import { cityInteger } from "@opencok/rules/city-progression";
import type { Rules } from "@opencok/rules/game";
import type { DragonTowerState } from "@opencok/contracts/dragon-tower";

export function towerArmyView(row: Row, armies: readonly Row[]): Fields
{
    const units = (key: string) =>
        sfs.array(
            [...towerArmy(row[key])].map(([id, count]) =>
                sfs.object({
                    id: sfs.int(Number(id)),
                    num: sfs.int(count),
                    star: sfs.int(num(armies.find((army) => army.armyId === id) ?? {}, "level")),
                })
            ),
        );

    return validateFields(towerArmySchema, {
        army: units("army"),
        deadarmy: units("deadarmy"),
        armyrevive: units("armyrevive"),
        armyrevivenum: sfs.int(num(row, "armyrevivenum")),
        armyrevivecd: sfs.long(long(row, "armyrevivecd")),
    });
}

export function towerUserView(
    state: DragonTowerState,
    row: Row,
    armies: readonly Row[],
    rules: Rules,
    limit: number,
): Fields
{
    const config = rules.items.get("dragon_tower") ?? {};

    return validateFields(towerUserSchema, {
        currentlayer: sfs.int(towerIndex(num(row, "currentlayer"))),
        weeklymaxlayer: sfs.int(towerIndex(num(row, "weeklymaxlayer"))),
        maxlayer: sfs.int(towerIndex(num(row, "maxlayer"))),
        weeklyrevive: sfs.short(num(row, "weeklyrevive")),
        resettimes: sfs.int(Math.max(0, cityInteger(config.k5) - num(row, "resettimes"))),
        dailyresettime: sfs.long(long(row, "dailyresettime")),
        weeklyresettime: sfs.long(long(row, "weeklyresettime")),
        revivecost: sfs.int(cityInteger((num(row, "weeklyrevive") + 1) * cityInteger(config.k9))),
        generalid: sfs.string(num(row, "generalid") > 0 ? String(num(row, "generalid")) : ""),
        dragon: sfs.string(text(row, "dragon")),
        ...towerArmyView(row, armies),
        score: sfs.int(num(row, "score")),
        rankmax: sfs.int(state.rankMax),
        rankweekly: sfs.int(state.rankWeekly),
        limitlayer: sfs.int(limit),
        sharetimes: sfs.short(num(row, "sharetimes")),
    });
}

export function towerLayerView(row: Row): Fields
{
    const awards = text(row, "awards");

    if (awards.length > 65535)
    {
        towerFailure();
    }

    return validateFields(towerLayerSchema, {
        layer: sfs.int(num(row, "layer")),
        layerindex: sfs.int(towerIndex(num(row, "layer"))),
        difficulty: sfs.short(num(row, "difficulty")),
        monsters: sfs.string(text(row, "monsters")),
        buffs: sfs.string(text(row, "buff")),
        buybuff: sfs.int(num(row, "buybuff")),
        ...(awards ? { awards: sfs.array(decodeLegacyJsonArray(awards)) } : {}),
        awardstate: sfs.short(num(row, "awardstate")),
        layerstate: sfs.short(num(row, "layerstate")),
        fighttime: sfs.long(long(row, "fighttime")),
    });
}

export function towerBuffViews(rows: readonly Row[], layer: number, rules: Rules)
{
    return rows
        .filter((row) => {
            const rule = rules.advanced.dragonTowerBuffs?.get(text(row, "buffid"));

            if (!rule)
            {
                towerFailure();
            }

            return rule.time === "-1" || layer <= num(row, "remainlayers");
        })
        .map((row) => {
            const time = Number(rules.advanced.dragonTowerBuffs!.get(text(row, "buffid"))!.time);

            return sfs.object({
                buffid: sfs.int(num(row, "buffid")),
                remainlayers: sfs.int(time > 0 ? towerIndex(num(row, "remainlayers")) : time),
                buytime: sfs.long(long(row, "buytime")),
            });
        });
}

export function towerRankingView(rows: readonly Row[])
{
    return rows.map((row, index) =>
        sfs.object({
            username: sfs.string(text(row, "username")),
            alliancename: sfs.string(text(row, "alliancename")),
            abbr: sfs.string(text(row, "abbr")),
            pic: sfs.string(text(row, "pic")),
            picVer: sfs.int(num(row, "picVer")),
            picfraId: sfs.int(num(row, "picfraId")),
            maxlayer: sfs.int(towerIndex(num(row, "maxlayer"))),
            uid: sfs.string(text(row, "uid")),
            rank: sfs.int(index + 1),
        })
    );
}
