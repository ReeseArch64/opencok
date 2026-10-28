import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { Rule } from "@opencok/rules/game";
import type {
    CatalogCodec,
    CatalogDefinition,
    CatalogFieldCodec,
    CatalogTable,
    CatalogValue,
} from "./catalog-model.ts";

function legacyValue(value: CatalogValue, codec: CatalogFieldCodec, depth = 0): string
{
    if (!Array.isArray(value))
    {
        return String(value);
    }

    const separator = codec.separators?.[depth];

    if (separator === undefined)
    {
        throw new Error("Missing legacy catalog sequence codec");
    }

    return value.map((item) => legacyValue(item, codec, depth + 1)).join(separator);
}

export function legacyRecord(record: object, codec: CatalogCodec): Rule
{
    const fields = new Map(
        Object.entries(codec).map(([key, descriptor]) => [descriptor.field, { key, descriptor }]),
    );

    return Object.fromEntries(
        Object.entries(record).map(([field, value]) => {
            const metadata = fields.get(field);

            if (!metadata)
            {
                throw new Error("Unmapped legacy catalog field: " + field);
            }

            return [metadata.key, legacyValue(value as CatalogValue, metadata.descriptor)];
        }),
    );
}

export function legacyCatalogRecords(
    catalog: CatalogDefinition,
    codec: CatalogCodec,
    name: string,
): Rule[]
{
    if (catalog.kind !== CatalogKind.Table)
    {
        throw new Error("Catalog is not a gameplay table");
    }

    const records = name === "vip"
        ? catalog.sections
            .filter((section) => section.id === "vip")
            .flatMap((section) =>
                catalog.records.slice(section.start, section.start + section.count)
            )
        : catalog.records;

    return records.map((record) => legacyRecord(record, codec));
}

export function legacyDeclaredCatalog(
    table: CatalogTable,
    codec: CatalogCodec,
): { items: Map<string, Rule>; groups: Map<string, Rule[]>; records: Rule[]; }
{
    const groups = new Map<string, Rule[]>();
    const top = table.sections.filter((section) => section.parent === undefined);
    const declarations = top.length
        ? top.flatMap((section) =>
            table.records.slice(section.start, section.start + section.count)
        )
        : table.records;
    const records = declarations.map((record) => legacyRecord(record, codec));

    for (const section of top)
    {
        if (section.id === undefined)
        {
            throw new Error("Missing catalog section ID");
        }

        groups.set(
            String(section.id),
            table.records
                .slice(section.start, section.start + section.count)
                .map((record) => legacyRecord(record, codec)),
        );
    }

    return {
        items: new Map(records.map((record) => [record.id ?? "null", record])),
        groups,
        records,
    };
}

export function indexRules(records: Rule[], name: string): Map<string, Rule>
{
    if (!records.length)
    {
        throw new Error("Missing gameplay resource records");
    }

    const map = new Map<string, Rule>();
    const replaceDuplicates = [
        "goods",
        "shop_new",
        "science",
        "equipment",
        "status",
        "dragon_skill",
        "activity_panel",
        "reward",
        "mail",
        "alliance_teleport",
        "field_monster",
        "army",
        "sp_resources",
        "barbarion",
        "general_base",
        "general_skill",
        "general_official",
        "general_random_effect",
        "reputation_level",
    ].includes(name);

    for (const record of records)
    {
        const item = record;

        if (!item.id?.trim())
        {
            continue;
        }

        if (!replaceDuplicates && map.has(item.id))
        {
            throw new Error(`Invalid gameplay resource ID: ${name}`);
        }

        map.set(item.id, item);
    }

    if (!map.size && name !== "goods")
    {
        throw new Error(`Invalid gameplay resource ID: ${name}`);
    }

    return map;
}
