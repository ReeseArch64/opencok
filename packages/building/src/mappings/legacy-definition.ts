import type {
    BuildingCosts,
    BuildingEffects,
    BuildingLevelDefinition,
    BuildingStep,
} from "@opencok/building/contracts/building";

const resources = ["wood", "stone", "iron", "food", "silver"] as const;

const production = new Map([
    [413000, 0],
    [412000, 1],
    [414000, 2],
    [415000, 3],
    [437000, 17],
    [455000, 211508],
]);

function steps<T>(
    value: string | undefined,
    decode: (parts: string[]) => T,
): BuildingStep<T>[] | undefined
{
    if (value === undefined)
    {
        return undefined;
    }

    return value
        .split("|")
        .filter(Boolean)
        .map((entry) => {
            const parts = entry.split(";").filter(Boolean);

            return { progress: Number(parts[0]), value: decode(parts.slice(1)) };
        });
}

export function importBuildingDefinition(
    record: Readonly<Record<string, string>>,
    fallbackId?: number,
): BuildingLevelDefinition
{
    const id = record.id === undefined ? fallbackId : Number(record.id);

    if (id === undefined || !Number.isSafeInteger(id))
    {
        throw new Error("Invalid building definition ID");
    }

    const level = Number(record.level);
    const buildingId = Math.floor(id / 1000) * 1000;
    const scalar = (
        name: string,
    ) => (record[name] === undefined ? undefined : Number(record[name]));
    const costs: BuildingCosts = Object.fromEntries(
        resources.filter((key) => record[key] !== undefined).map((
            key,
        ) => [key, BigInt(record[key]!)]),
    );
    const effects: Record<string, number> = {};
    const effectSteps: Record<string, BuildingStep<number>[]> = {};
    const parameters = Array.from({ length: 6 }, (_, index) => {
        const value = record["para" + (index + 1)];

        return value === undefined
            ? null
            : {
                value,
                ...(value.includes("|") ? { steps: steps(value, (parts) => parts[0] ?? "") } : {}),
            };
    });
    const effect = (index: number, name: keyof BuildingEffects) => {
        const value = record["para" + (index + 1)];

        if (value === undefined)
        {
            return;
        }

        if (value.includes("|"))
        {
            const values = steps(value, (parts) => Number(parts[0]));

            if (values)
            {
                effectSteps[name] = values;
            }
        }
        else
        {
            effects[name] = Number(value);
        }

        parameters[index] = null;
    };

    if (production.has(buildingId))
    {
        effects.productionResourceId = production.get(buildingId)!;
        effect(0, "productionPerHour");
        effect(1, "productionCapacity");
    }

    if (buildingId === 404000)
    {
        effect(3, "protectedFood");
    }

    if (buildingId === 427000)
    {
        effect(0, "reinforcementCapacity");
    }

    if (buildingId === 407000)
    {
        effect(0, "rallyCapacity");
    }

    if (buildingId === 441000)
    {
        effect(0, "woundedKnightCapacity");
    }

    const item = (value: string) => {
        const [itemId, quantity] = value.split(";");

        return {
            itemId: Number(itemId),
            ...(quantity === undefined ? {} : { quantity: BigInt(quantity) }),
        };
    };
    const paired = (left?: string, right?: string) =>
        left?.split(";").map((code, index) => ({
            code: Number(code),
            value: right?.split(";")[index] === undefined
                ? undefined
                : Number(right.split(";")[index]),
        }));
    const unlockValues = steps(record.unlock_value, (parts) => Number(parts[0]));
    const unlock = record.unlock_type?.includes("|")
        ? steps(record.unlock_type, (parts) => Number(parts[0]))?.map((entry, index) => ({
            progress: entry.progress,
            value: { code: entry.value, value: unlockValues?.[index]?.value ?? NaN },
        }))
        : undefined;
    const paymentValues = steps(record.unlock_cost_value, (parts) => parts[0] ?? "0");
    const payment = steps(record.unlock_cost_type, (parts) => Number(parts[0]))?.map(
        (entry, index) => ({
            progress: entry.progress,
            value: { paymentId: entry.value, amount: BigInt(paymentValues?.[index]?.value ?? "0") },
        }),
    );
    const upgrades = {
        constructionSeconds: steps(record.star_time, (parts) => Number(parts[0])),
        experience: steps(record.star_exp, (parts) => Number(parts[0])),
        power: steps(record.star_power, (parts) => Number(parts[0])),
        costs: steps(
            record.star_res,
            (parts) =>
                Object.fromEntries(
                    resources
                        .slice(0, 4)
                        .filter((_, index) => parts[index] !== undefined)
                        .map((key, index) => [key, BigInt(parts[index]!)]),
                ) as BuildingCosts,
        ),
        requiredItems: steps(record.star_item, (parts) => parts.join(";").split(",").map(item)),
        requiredBuildings: steps(record.star_building, (parts) =>
            parts.map((value) => {
                const [levelId, quantity] = value.split(",");

                return { levelId: Number(levelId), quantity: Number(quantity ?? 1) };
            })),
        unlockConditions: unlock,
        unlockPayment: payment,
    };

    return {
        id,
        buildingId,
        level,
        starLevel: id - buildingId - level,
        costs,
        constructionSeconds: scalar("time"),
        demolitionSeconds: scalar("destroy_time"),
        experience: scalar("exp"),
        power: scalar("power"),
        civilizationLevel: scalar("civilization_level"),
        maxInstances: scalar("num"),
        starEnabled: record.star_on === undefined ? undefined : record.star_on === "1",
        limit: scalar("limit"),
        requiredBuildings: record.building === ""
            ? []
            : record.building?.split("|").map((entry) => {
                const [buildingId, level] = entry.split(";");

                return { buildingId: Number(buildingId), level: Number(level) };
            }),
        requiredItems: record.item === "" ? [] : record.item?.split("|").map(item),
        effects: Object.keys(effects).length ? effects : undefined,
        effectSteps: Object.keys(effectSteps).length ? effectSteps : undefined,
        clientParameters: parameters.some(Boolean) ? parameters : undefined,
        unlockConditions: record.unlock_type?.includes("|")
            ? undefined
            : paired(record.unlock_type, record.unlock_value),
        upgrades: Object.values(upgrades).some((value) => value !== undefined)
            ? upgrades
            : undefined,
    };
}

export function importBuildingCatalog(
    records: ReadonlyMap<string, Readonly<Record<string, string>>>,
)
{
    return new Map(
        [...records].map((
            [id, record],
        ) => [Number(id), importBuildingDefinition(record, Number(id))]),
    );
}
