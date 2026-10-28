import { CityCommandDomain } from "./city-command-domain.ts";
import { encode, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { serverFeature } from "@opencok/rules/power-context";
import { castleFailure, castleRule, settleCastle } from "@opencok/rules/civilization-castle";
import {
    cityAmount,
    cityInteger,
    citySpeedGold,
    cityAssets,
} from "@opencok/rules/city-progression";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { civilizationCastleView } from "@opencok/mappings/civilization-castle";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function gain(context: CityProgressionContext, row: Row, count: number)
{
    if (count < 0 || !Number.isSafeInteger(count))
    {
        castleFailure();
    }

    const item = context.rules.items.get("civilization_fortress")?.k1;

    if (!item || !context.rules.goods.has(item))
    {
        castleFailure();
    }

    if (count)
    {
        context.economy.item(item, count);
    }

    row.resourceNum = Number(row.resourceNum ?? 0) - count;
}

export class CivilizationCastleDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"];
    public readonly types: CityDomain["types"];
    public readonly prepare: CityDomain["prepare"];
    public readonly apply: CityDomain["apply"];

    public constructor(size: number)
    {
        super();

        this.commands = ["civilizationCastle"];

        this.types = [];

        this.prepare = async (context, _command, params) => {
            if (
                !serverFeature(context.rules, "civilization_fortress_on", {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                })
            )
            {
                castleFailure();
            }

            const action = str(params, "M__REQUEST_ID__H");
            const world = context.state.worldMutation;

            if (!world)
            {
                castleFailure();
            }

            let row = settleCastle(
                context.rules,
                { uid: context.owner, level: 1, status: 0, ...context.state.civilizationCastle },
                context.now,
            );
            const oldPoint = num(row, "pointId");
            const occupied = world.points.find((entry) => num(entry, "id") === oldPoint);

            if (occupied && text(occupied, "ownerMarchUUid"))
            {
                castleFailure();
            }

            if (action === "info")
            {
                const target = context.state.civilizationCastleTarget;

                if (!target)
                {
                    context.write.civilizationCastle = row;
                }

                const view = target ? settleCastle(context.rules, target.castle, context.now) : row;

                return {
                    response: encode(
                        civilizationCastleView(
                            view,
                            target?.profile ?? context.state.profile,
                            Number(
                                castleRule(context.rules, num(view, "level") || 1).basic_output
                                    ?? 0,
                            ),
                        ),
                    ),
                    event: null,
                };
            }

            const body: Fields = {};
            const pointWrites: Row[] = [];
            const erase = () => {
                for (const id of world.civilizationFootprint ?? worldFootprint(oldPoint, size))
                {
                    const point = world.points.find((entry) => num(entry, "id") === id);

                    if (
                        !point
                        || text(point, "ownerId") !== context.owner
                        || ![68, 69].includes(num(point, "pointType"))
                    )
                    {
                        castleFailure();
                    }

                    pointWrites.push({
                        ...point,
                        pointType: 0,
                        ownerId: "",
                        ownerName: "",
                        allianceId: "",
                        pointItem: "",
                        ownerMarchUUid: "",
                        fireTime: 0n,
                    });
                }
            };
            const place = (point: number) => {
                const ids = worldFootprint(point, size);

                if (ids.length !== 4)
                {
                    castleFailure();
                }

                for (const id of ids)
                {
                    const entry = world.points.find((value) => num(value, "id") === id);

                    if (
                        !entry
                        || text(entry, "ownerId")
                        || text(entry, "ownerMarchUUid")
                        || text(entry, "territoryAlliance")
                        || world.placementClaims?.includes(id)
                        || num(entry, "pointType") !== 0
                        || num(entry, "gridType") !== 2
                        || num(entry, "grid2Type") !== 0
                        || num(entry, "resInitValue") !== 0
                    )
                    {
                        castleFailure();
                    }

                    pointWrites.push({
                        ...entry,
                        pointType: id === point ? 68 : 69,
                        ownerId: context.owner,
                        ownerName: text(context.state.profile, "name"),
                        allianceId: text(context.state.profile, "allianceId"),
                        pointItem: "",
                        ownerMarchUUid: "",
                    });
                }

                row.pointId = point;
            };

            if (action === "place")
            {
                if (num(row, "status") !== 0)
                {
                    castleFailure();
                }

                const building = context.state.buildings.find((entry) =>
                    String(entry.itemId) === "443000"
                );
                const level = num(building ?? {}, "level");

                if (!level)
                {
                    castleFailure();
                }

                const costRule = castleRule(context.rules, num(row, "level") || 1);
                place(int(params, "pointId"));
                context.spend(
                    Object.fromEntries(
                        cityAssets.map((asset) => [asset, cityAmount(costRule[asset] ?? 0)]),
                    ),
                    false,
                );
                const score = cityAmount(costRule.integral ?? 0);

                if (
                    !context.economy.civilizationScore
                    || context.balance("civilizationSorce") < score
                )
                {
                    castleFailure();
                }

                context.economy.civilizationScore(-score);
                const rule = castleRule(context.rules, level);
                row = {
                    ...row,
                    level,
                    status: 1,
                    def: cityInteger(rule.value_f),
                    resourceNum: 0,
                    buildTime: context.now + BigInt(cityInteger(rule.time)) * 1000n,
                    lastOutputTime: 0n,
                    lastSettleTime: 0n,
                };
                row = settleCastle(context.rules, row, context.now);
                body.civilizationScore = sfs.long(context.balance("civilizationSorce"));
            }
            else if (action === "settle")
            {
                const cooldown =
                    BigInt(cityInteger(context.rules.items.get("civilization_fortress")?.k3))
                    * 1000n;

                if (
                    num(row, "status") !== 2
                    || Number(row.resourceNum ?? 0) < 1
                    || context.now - long(row, "lastSettleTime") < cooldown
                )
                {
                    castleFailure();
                }

                const requested = int(params, "gainCount", -1);
                const count = requested < 0
                    ? Math.floor(Number(row.resourceNum))
                    : Math.min(requested, Math.floor(Number(row.resourceNum)));
                gain(context, row, count);
                row.lastSettleTime = context.now;
                body.gainCount = sfs.int(count);
                body.lastSettleTime = sfs.long(context.now);
            }
            else if (action === "remove")
            {
                if (!num(row, "status"))
                {
                    castleFailure();
                }

                gain(context, row, Math.floor(Number(row.resourceNum ?? 0)));
                erase();
                row = { ...row, status: 0, pointId: 0, def: 0, resourceNum: 0 };
            }
            else if (action === "move")
            {
                if (!num(row, "status"))
                {
                    castleFailure();
                }

                place(int(params, "pointId"));
                erase();
                const item = context.rules.items.get("civilization_fortress")?.k4;

                if (!item)
                {
                    castleFailure();
                }

                context.spendItem(item, 1);
            }
            else if (action === "speedUp")
            {
                if (num(row, "status") !== 1)
                {
                    castleFailure();
                }

                let remaining = long(row, "buildTime") - context.now;
                const gold = int(params, "isGold") === 1;

                if (gold)
                {
                    context.economy.gold(-citySpeedGold(context.rules, remaining));
                    remaining = 0n;
                    body.remainGold = sfs.long(context.balance("gold"));
                }
                else
                {
                    const item = context.economy.ownedItem?.(str(params, "itemUuid"));
                    const rule = item ? context.rules.goods.get(item.itemId) : undefined;

                    if (!item || rule?.type !== "2")
                    {
                        castleFailure();
                    }

                    let count = cityInteger(int(params, "itemCount", 1), 1);
                    const speed = cityInteger(rule.para3, 1);

                    if (rule.para2 === "1")
                    {
                        const maximum = Number(
                            (remaining + BigInt(speed) * 1000n - 1n) / (BigInt(speed) * 1000n),
                        );
                        count = Math.min(count, maximum);
                        remaining = remaining > BigInt(speed * count) * 1000n
                            ? remaining - BigInt(speed * count) * 1000n
                            : 0n;
                    }
                    else if (rule.para2 === "2" && speed <= 100 && count === 1)
                    {
                        remaining = (remaining * BigInt(100 - speed)) / 100n;
                    }
                    else
                    {
                        castleFailure();
                    }

                    if (item.count < count)
                    {
                        castleFailure();
                    }

                    context.economy.item(item.itemId, -count);
                    body.itemId = sfs.string(item.itemId);
                    body.count = sfs.int(item.count - count);
                }

                row.buildTime = context.now + remaining;
                row = settleCastle(context.rules, row, context.now);
                body.isGold = sfs.int(gold ? 1 : 0);
                body.buildTime = sfs.long(long(row, "buildTime"));
            }
            else
            {
                castleFailure();
            }

            context.write.civilizationCastle = row;

            if (pointWrites.length)
            {
                context.write.worldMutation = { points: pointWrites };
            }

            return {
                response: encode(body),
                event: pointWrites.length
                    ? encode({
                        owner: sfs.string(context.owner),
                        origin: sfs.int(num(row, "pointId") || oldPoint),
                        points: sfs.array(
                            pointWrites.map((point) =>
                                sfs.object({ id: sfs.int(num(point, "id")) })
                            ),
                        ),
                    })
                    : null,
            };
        };

        this.apply = async () => {
            castleFailure();
        };
    }
}

export function createCivilizationCastleDomain(size: number): CityDomain
{
    return new CivilizationCastleDomain(size);
}
