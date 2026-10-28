import { randomInt } from "node:crypto";

import type { PreparedActivity } from "@opencok/base/contracts/activity";
import type {
    EquipmentCatalog,
    EquipmentContext,
    EquipmentRecord as Row,
} from "../contracts/equipment";
import type { EquipmentRuntime } from "../contracts/runtime";
import { sfs, encode, str, int, Type, type Fields, type Value } from "@opencok/messages/sfs";
import { EquipmentPolicy } from "../rules/equipment";

import { invalidEquipment as invalid } from "../validations/invalid";
import { EquipmentAccess } from "./access";
import { EquipmentFactory } from "./factory";
import { EquipmentCommand } from "../enums/equipment-command";

export class EquipmentForge<
    TCatalog extends EquipmentCatalog,
    TContext extends EquipmentContext<TCatalog>,
>
{
    public constructor(
        private readonly runtime: EquipmentRuntime<TCatalog, TContext>,
        private readonly access: EquipmentAccess<TCatalog, TContext>,
        private readonly policy: EquipmentPolicy,
        private readonly factory: EquipmentFactory,
    )
    {}

    public readonly prepareForge = (
        context: TContext,
        command: string,
        params: Fields,
        suitColor: number | undefined,
    ): PreparedActivity => {
        const { text, num, long, cityInteger, cityAmount, cityDuration } = this.runtime;

        const {
            equipmentRule,
            equipmentPairs,
            equipmentCosts,
            equipmentMaterials,
            equipmentColor,
            randomEquipmentProperty,
        } = this.policy;

        const building = this.access.forge(context),
            id = str(params, "itemId"),
            rule = equipmentRule(context.rules, id);

        if (rule.no_forge === "1" || rule.site === "6")
        {
            invalid();
        }

        const modern = params.rate !== undefined,
            multiple = modern ? cityInteger(int(params, "rate"), 1, 99999) : 1;
        const rate = modern
            ? [...(context.rules.progression.forgeRandom?.values() ?? [])].find(
                (rule) => Number(rule.times) === multiple,
            )
            : undefined;

        if (modern && !rate)
        {
            invalid();
        }

        const payment = int(params, "gold", 0);

        if (![0, 1].includes(payment))
        {
            invalid();
        }

        const input = params.tools;

        if (input && input.type !== Type.Array)
        {
            invalid();
        }

        const tools = ((input?.value ?? []) as Value[]).map((value) => {
            if (value.type !== Type.Int)
            {
                invalid();
            }

            return cityInteger(value.value);
        });
        const fixed = command === EquipmentCommand.CreateSuitEquipment;
        const selected = fixed
            ? {
                costs: new Map(
                    Array.from({ length: 4 }, (_, index) => rule[`material${index + 1}`])
                        .filter((raw): raw is string => !!raw)
                        .flatMap((raw) => [...equipmentPairs(raw)]),
                ),
                colors: [],
            }
            : equipmentMaterials(rule, context.rules, tools, multiple, modern);
        const parent = str(params, "uuid", ""),
            needsParent = !!rule.son_equipment
                || rule.reform === "1"
                || (suitColor !== undefined && !!rule.cotyledons);
        let son: Row | undefined;

        if (needsParent)
        {
            son = this.access.own(context, parent);
            this.access.idle(son);
            const before = equipmentRule(context.rules, text(son, "itemId"));

            if (
                rule.reform === "1" || (suitColor !== undefined && !!rule.cotyledons)
                    ? !rule.cotyledons?.split(";").includes(text(son, "itemId"))
                    : Number(before.level) < Number(rule.son_equipment)
                        || Number(before.level) > Number(rule.level)
            )
            {
                invalid();
            }

            context.write.deletedEquipment = [text(son, "uuid")];
        }

        for (const [itemId, count] of selected.costs)
        {
            context.spendItem(itemId, count);
        }

        const reduction = context.effect(203)
            + context.generalEffect(203, 429000)
            + Number(building.clientParameters?.[1]?.value ?? 0);
        context.spend(
            equipmentCosts(rule.cost, reduction, Math.max(1, Number(rate?.iron ?? 1))),
            payment === 1,
        );
        const color = fixed
            ? (suitColor ?? cityInteger(rule.color, 0, 5))
            : equipmentColor(
                context.rules,
                selected.colors,
                son,
                modern,
                multiple,
                context.effect(2201),
                randomInt,
            );
        const result = equipmentRule(context.rules, `${id.slice(0, -1)}${color}`),
            row = this.factory.newEquipment(context, result.id!);
        const stone = str(params, "stoneId", "");

        if (stone)
        {
            const goods = context.rules.goods.get(stone);

            if (goods?.type !== "43" || color < 4)
            {
                invalid();
            }

            context.spendItem(stone, multiple);
        }

        if (modern && result.ran)
        {
            let count = 0;

            for (let index = 1; index <= 3; index++)
            {
                if (randomInt(10000) < Number(rate?.[`ran_${index}`] ?? 0))
                {
                    count++;
                }
            }

            row.extraProperty = Array.from(
                { length: Math.min(cityInteger(result.ran_num ?? 0), count) },
                () =>
                    randomEquipmentProperty(
                        context.rules.progression.equipmentRandom?.get(result.ran!),
                        color,
                        randomInt,
                    ),
            ).join("|");
        }

        const duration = cityDuration(
            cityInteger(rule.time),
            context.effect(219)
                + context.generalEffect(219, 429000)
                + Number(building.clientParameters?.[0]?.value ?? 0),
        );
        const durationMs = cityAmount(
            Math.trunc(Number(duration) * Math.max(1, Number(rate?.time ?? 1))),
        );
        row.on = 2;
        row.cost = [...selected.costs].map(([id, count]) => `${id};${count}`).join("|");
        context.write.equipment = [row];
        const quality = context.state.effects.states.filter(
            (state) =>
                (context.rules.power.statuses?.get(String(state.stateId))?.effect ?? "")
                    .split("|")
                    .some((pair) => pair.startsWith("2201;"))
                && long(state, "endTime") > context.now,
        );

        if (quality.length)
        {
            context.write.deletedStates = quality.map((state) => num(state, "stateId"));
        }

        return {
            type: 11,
            itemId: text(row, "uuid"),
            durationMs,
            data: context.data("equipment"),
            responseKind: "nested",
            item: encode({
                itemId: sfs.string(text(row, "itemId")),
                cost: sfs.string(text(row, "cost")),
            }),
            response: encode({
                resource: sfs.object(context.resource()),
                gold: sfs.long(context.balance("gold")),
            }),
        };
    };
}
