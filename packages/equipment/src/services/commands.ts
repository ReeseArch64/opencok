import { randomInt } from "node:crypto";

import type { PreparedActivity } from "@opencok/base/contracts/activity";
import type {
    EquipmentCatalog,
    EquipmentContext,
    EquipmentRecord as Row,
} from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { sfs, encode, str, int, type Fields } from "@opencok/messages/sfs";
import { EquipmentPolicy } from "../rules/equipment";
import { EquipmentMapper } from "../mappings/equipment";
import { invalidEquipment as invalid } from "../validations/invalid";
import { EquipmentAccess } from "./access";
import { EquipmentFactory } from "./factory";
import { EquipmentForge } from "./forge";
import { EquipmentMaterials } from "./materials";
import { EquipmentCommand } from "../enums/equipment-command";

export class EquipmentCommands<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: EquipmentRuntime<TCatalog, TContext>,
        private readonly access: EquipmentAccess<TCatalog, TContext>,
        private readonly policy: EquipmentPolicy,
        private readonly mapper: EquipmentMapper,
        private readonly factory: EquipmentFactory,
        private readonly forging: EquipmentForge<TCatalog, TContext>,
        private readonly materials: EquipmentMaterials<TCatalog, TContext>,
    )
    {}

    public readonly prepare = async (
        context: TContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        const { text, num, cityInteger, cityAmount, refreshQuests, chooseWeight } = this.runtime;

        const {
            equipmentRule,
            equipmentPairs,
            equipmentCosts,
            randomEquipmentProperty,
            dismantleEquipment,
        } = this.policy;

        const { equipment, equipmentItems } = this.mapper;

        let body: Fields = {};
        let suitColor: number | undefined;

        if (command === EquipmentCommand.CreateSuit)
        {
            const prefix = String(cityInteger(int(params, "groupId"), 1)),
                base = equipmentRule(context.rules, `${prefix}4`),
                sonId = str(params, "sonEquipUUid", ""),
                stoneId = str(params, "material", "0");
            const son = sonId ? this.access.own(context, sonId) : undefined;

            if (son)
            {
                this.access.idle(son);

                if (!base.cotyledons?.split(";").includes(text(son, "itemId")))
                {
                    invalid();
                }
            }

            suitColor = son && num(son, "itemId") % 10 === 5 ? 5 : 4;

            if (stoneId !== "0")
            {
                if (suitColor === 5)
                {
                    invalid();
                }

                const owned = context.economy.ownedItem?.(stoneId),
                    good = owned ? context.rules.goods.get(owned.itemId) : undefined;
                const [minimum, maximum] = good?.para5?.split(";").map(Number) ?? [];

                if (
                    !owned
                    || good?.type !== "43"
                    || Number(base.level) < minimum!
                    || Number(base.level) > maximum!
                )
                {
                    invalid();
                }

                context.spendItem(owned!.itemId, 1);

                if (randomInt(100) <= cityInteger(good!.para4, 0, 100))
                {
                    suitColor = 5;
                }
            }

            params = { ...params, itemId: sfs.string(`${prefix}4`), uuid: sfs.string(sonId) };
            command = EquipmentCommand.CreateSuitEquipment;
        }

        if (command === EquipmentCommand.Initialize)
        {
            body = {
                equip: sfs.array(
                    context.state.equipment
                        .filter((row) => num(row, "on") !== 2)
                        .map((row) => sfs.object(equipment(row))),
                ),
                decomposeequip: sfs.array(
                    (context.state.suitDecompositions ?? []).map((row) =>
                        sfs.object({
                            decompose_suit_item: sfs.string(
                                [
                                    text(row, "suitid"),
                                    ...Array.from({ length: 6 }, (_, index) =>
                                        text(row, `item${index + 1}`) || "0"),
                                ].join(";"),
                            ),
                        })
                    ),
                ),
                materialBackup: sfs.int(
                    Math.max(1, num(context.state.quests?.mixed ?? {}, "materialBackup")),
                ),
            };
        }
        else if (command === EquipmentCommand.CreateMaterial && params.equips)
        {
            const ids = str(params, "equips").split(","),
                count = cityInteger(context.rules.items.get("equip")?.k6, 1);

            if (ids.length !== count || new Set(ids).size !== count)
            {
                invalid();
            }

            const rows = ids.map((id) => this.access.own(context, id)),
                first = equipmentRule(context.rules, text(rows[0]!, "itemId"));

            if (Number(first.color) >= 5)
            {
                invalid();
            }

            for (const row of rows)
            {
                this.access.idle(row);
                const rule = equipmentRule(context.rules, text(row, "itemId"));

                if (
                    rule.color !== first.color
                    || rule.level !== first.level
                    || (rule.suit_id ?? "") !== (first.suit_id ?? "")
                )
                {
                    invalid();
                }
            }

            context.write.deletedEquipment = ids;
            const row = this.factory.newEquipment(context, String(Number(first.id) + 1));
            context.write.equipment = [row];
            body.equipAdd = sfs.array([sfs.object(equipment(row))]);
            refreshQuests(context, { daily: 36, legacy: 14, count: 1 });
        }
        else if (command.startsWith("material."))
        {
            body = this.materials.material(context, command, params);
        }
        else if (command === EquipmentCommand.Buy)
        {
            const good = context.rules.goods.get(str(params, "itemId")),
                count = cityInteger(int(params, "count"), 1, 128);

            if (!good?.para1 || !context.rules.power.equipment?.has(good.para1))
            {
                invalid();
            }

            context.economy.gold(-BigInt(cityInteger(good!.price, 1)) * BigInt(count));
            const rows = Array.from(
                { length: count },
                () => this.factory.newEquipment(context, good!.para1!),
            );

            if (context.state.equipment.length + rows.length > 1000)
            {
                invalid();
            }

            context.write.equipment = rows;
            body = {
                equips: sfs.array(rows.map((row) => sfs.object(equipment(row)))),
                gold: sfs.long(context.balance("gold")),
            };
        }
        else if (
            command === EquipmentCommand.Create || command === EquipmentCommand.CreateSuitEquipment
        )
        {
            return this.forging.prepareForge(context, command, params, suitColor);
        }
        else if (command === EquipmentCommand.SelectSuitEffect)
        {
            const selection = str(params, "suits").split(";");

            if (selection.length !== 3)
            {
                invalid();
            }

            for (const [index, id] of selection.entries())
            {
                if (id !== "0")
                {
                    const row = context.state.suitDecompositions?.find((row) => row.suitid === id);

                    if (
                        !context.rules.power.equipmentSets?.has(id)
                        || !row
                        || Array.from({ length: 6 }, (_, n) => text(row, `item${n + 1}`)).filter(
                                (id) => id && id !== "0",
                            ).length
                            < (index + 1) * 2
                    )
                    {
                        invalid();
                    }
                }
            }

            context.write.equipmentSelection = selection.join(";");
            body.decomposeSuitEffect = sfs.string(selection.join(";"));
        }
        else if (command === EquipmentCommand.DecomposeSuit)
        {
            const id = str(params, "suitid"),
                ids = str(params, "item", str(params, "uuids", ""))
                    .split(";")
                    .filter(Boolean);

            if (
                !context.rules.power.equipmentSets?.has(id)
                || !ids.length
                || ids.length > 6
                || new Set(ids).size !== ids.length
            )
            {
                invalid();
            }

            const prior = context.state.suitDecompositions?.find((row) => row.suitid === id),
                value: Row = { owner: context.owner, suitid: id };
            const consumed = Array.from(
                { length: 6 },
                (_, index) => text(prior ?? {}, `item${index + 1}`) || "0",
            );

            for (const uuid of ids)
            {
                const row = this.access.own(context, uuid);
                this.access.idle(row);
                const rule = equipmentRule(context.rules, text(row, "itemId"));

                if (
                    rule.suit_id !== id
                    || rule.site === "6"
                    || consumed.some((id) =>
                        id !== "0" && equipmentRule(context.rules, id).site === rule.site
                    )
                )
                {
                    invalid();
                }

                const slot = consumed.indexOf("0");

                if (slot < 0)
                {
                    invalid();
                }

                consumed[slot] = text(row, "itemId");
            }

            consumed.forEach((id, index) => {
                value[`item${index + 1}`] = id;
            });
            context.write.suitDecompositions = [value];
            context.write.deletedEquipment = ids;
            body = { decompose_suit_item: sfs.string([id, ...consumed].join(";")) };
        }
        else
        {
            const row = this.access.own(context, str(params, "uuid")),
                rule = equipmentRule(context.rules, text(row, "itemId"));

            if (command === EquipmentCommand.PutOn || command === EquipmentCommand.TakeOff)
            {
                if (num(row, "on") === 2)
                {
                    invalid();
                }

                const assigned = context.state.newGenerals.generals.find(
                    (general) => num(general, "id") === num(row, "generalid"),
                );

                if (
                    num(row, "generalid") > 0
                    && (!assigned || ![1, 2, 6].includes(num(assigned, "state")))
                )
                {
                    invalid();
                }

                const put = command === EquipmentCommand.PutOn,
                    generalId = cityInteger(str(params, "generalid", "0")),
                    general = generalId > 0
                        ? context.state.newGenerals.generals.find((row) =>
                            num(row, "id") === generalId
                        )
                        : undefined;

                if (generalId > 0 && (!general || ![1, 2, 6].includes(num(general, "state"))))
                {
                    invalid();
                }

                if (
                    put
                    && (Number(rule.level)
                            > (generalId > 0
                                ? num(general!, "level")
                                : num(context.state.profile, "level"))
                        || (rule.exclusive_hero === "1" && generalId === 0))
                )
                {
                    invalid();
                }

                if (
                    put
                    && ((generalId === 0 && num(row, "on") === 1)
                        || (generalId > 0 && num(row, "generalid") === generalId))
                )
                {
                    invalid();
                }

                const old = context.state.equipment.filter(
                    (other) =>
                        other.uuid !== row.uuid
                        && equipmentRule(context.rules, text(other, "itemId")).site === rule.site
                        && (generalId === 0
                            ? num(other, "on") === 1
                            : num(other, "generalid") === generalId),
                );
                const changed = [
                    ...old.map((other) => ({ ...other, on: 0, generalid: 0 })),
                    { ...row, on: put && generalId === 0 ? 1 : 0, generalid: put ? generalId : 0 },
                ];

                if (!put)
                {
                    if (
                        generalId === 0
                            ? num(row, "on") !== 1
                            : num(row, "generalid") !== generalId
                    )
                    {
                        invalid();
                    }

                    changed.splice(0, old.length);
                }

                const power = (records: readonly Row[]) =>
                    records
                        .filter((row) => num(row, "on") === 1)
                        .reduce(
                            (sum, row) =>
                                sum
                                + cityAmount(
                                    equipmentRule(context.rules, text(row, "itemId")).power ?? 0,
                                ),
                            0n,
                        );
                context.power(power(changed) - power([row, ...old]));
                context.write.equipment = changed;
                body = { equips: sfs.array(changed.map((row) => sfs.object(equipment(row)))) };
                refreshQuests(context);
            }
            else if (command === EquipmentCommand.Break)
            {
                this.access.forge(context);
                this.access.idle(row);

                if (rule.no_decompose === "1")
                {
                    invalid();
                }

                const items = dismantleEquipment(rule, randomInt);

                for (const [id, count] of items)
                {
                    context.economy.item(id, count);
                }

                context.write.deletedEquipment = [text(row, "uuid")];
                body = {
                    goods: equipmentItems(
                        items,
                        (id: string) => context.economy.quantity?.(id) ?? 0,
                        context.rules,
                        context.economy.itemState,
                    ),
                    resource: sfs.object(context.resource()),
                    uuid: sfs.string(text(row, "uuid")),
                    itemId: sfs.string(text(row, "itemId")),
                };
            }
            else if (command === EquipmentCommand.Strengthen)
            {
                if (num(row, "on") === 2 || rule.isStrengthen !== "1")
                {
                    invalid();
                }

                const level = cityInteger(num(row, "strengthLevel"), 0, 9);
                context.spend(
                    { silver: cityAmount(rule.Strengthen_iron?.split("|")[level]) },
                    false,
                );

                for (const pair of rule.Strengthen_cost?.split("|")[level]?.split(";") ?? [])
                {
                    const [id, count] = pair.split(":");
                    context.spendItem(id!, cityInteger(count, 1));
                }

                const rate = cityInteger(rule.Strengthen_rate?.split("|")[level], 0, 100),
                    success = rate === 100 || randomInt(101) <= rate;

                if (success)
                {
                    context.write.equipment = [{ ...row, strengthLevel: level + 1 }];
                }

                body = {
                    strengthLevel: sfs.int(level + (success ? 1 : 0)),
                    result: sfs.string(success ? "1" : "0"),
                };
            }
            else if (command === EquipmentCommand.Reforge)
            {
                this.access.idle(row);

                if (!text(row, "extraProperty") || !rule.reforgeRandomID)
                {
                    invalid();
                }

                const config = context.rules.items.get("equipment_combine"),
                    count = num(row, "reforgeCount"),
                    multiplier = 1
                        + (Math.min(count, Number(config?.k11 ?? 0)) * Number(config?.k10 ?? 0))
                            / 100;
                context.spend(equipmentCosts(rule.reforgeCost, 0, multiplier), false);

                for (const [id, cost] of equipmentPairs(rule.reforgeItem))
                {
                    context.spendItem(id, Math.ceil(cost * multiplier));
                }

                const library = config?.k9
                    ?.split("|")[(count + 1) % cityInteger(config?.k8, 1) === 0 ? 1 : 0]?.split(";")
                    .map(Number) ?? [];
                const extra = text(row, "extraProperty")
                    .split("|")
                    .filter(Boolean)
                    .map(() =>
                        randomEquipmentProperty(
                            context.rules.progression.reforgeRandom?.get(rule.reforgeRandomID!),
                            cityInteger(rule.color, 0, 5),
                            randomInt,
                            chooseWeight(library, randomInt) + 1,
                        )
                    )
                    .join("|");
                const value = { ...row, extraProperty: extra, reforgeCount: count + 1 };
                context.write.equipment = [value];
                body = equipment(value);
            }
            else
            {
                invalid();
            }
        }

        return { response: encode(body), event: null };
    };
}
