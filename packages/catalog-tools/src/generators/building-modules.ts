import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { importBuildingDefinition } from "@opencok/resources/buildings/import";
import { parseRules } from "@opencok/resources/fixtures";

export async function writeBuildingModules(source: string, directory: URL): Promise<void>
{
    const records = parseRules(source, "building");
    const groups = new Map<number, unknown[]>();
    for (const [id, record] of records)
    {
        const definition = importBuildingDefinition(record, Number(id));
        const group = groups.get(definition.buildingId) ?? [];
        group.push(definition);
        groups.set(definition.buildingId, group);
    }
    const render = (value: unknown): string => {
        if (typeof value === "bigint")
        {
            return String(value) + "n";
        }
        if (typeof value === "number")
        {
            if (!Number.isFinite(value))
            {
                throw new Error("Invalid numeric building definition");
            }
            return String(value);
        }
        if (Array.isArray(value))
        {
            return "[\n" + value.map(render).join(",\n") + "\n]";
        }
        if (value && typeof value === "object")
        {
            return (
                "{\n"
                + Object.entries(value)
                    .filter(([, item]) => item !== undefined)
                    .map(([key, item]) => key + ": " + render(item))
                    .join(",\n")
                + "\n}"
            );
        }
        return JSON.stringify(value);
    };
    await mkdir(directory, { recursive: true });
    const imports: string[] = [];
    for (const [id, levels] of groups)
    {
        const name = "building" + id;
        await writeFile(
            new URL(String(id) + ".ts", directory),
            "import type { BuildingLevelDefinition } from \"@opencok/contracts/building\";\nexport const "
                + name
                + ": readonly BuildingLevelDefinition[] = "
                + render(levels)
                + ";\n",
        );
        imports.push("import { " + name + " } from \"./" + id + ".ts\";");
    }
    await writeFile(
        new URL("levels.ts", directory),
        "import type { BuildingLevelDefinition } from \"@opencok/contracts/building\";\n"
            + imports.join("\n")
            + "\nexport const BUILDING_LEVELS: readonly BuildingLevelDefinition[] = [\n"
            + [...groups.keys()].map((id) => "...building" + id).join(",\n")
            + "\n];\nexport function createBuildingCatalog(): Map<number, BuildingLevelDefinition> {\nreturn new Map(structuredClone(BUILDING_LEVELS).map((level) => [level.id, level]));\n}\n",
    );
    await writeFile(
        new URL("provenance.json", directory),
        JSON.stringify(
            {
                source: "building.xml",
                sourceSha256: createHash("sha256").update(source).digest("hex"),
                records: records.size,
                buildings: groups.size,
            },
            null,
            2,
        ) + "\n",
    );
    console.log(
        "Imported " + records.size + " building levels across " + groups.size + " building types",
    );

    await writeFile(
        new URL("index.ts", directory),
        "export { BUILDING_LEVELS, createBuildingCatalog } from \"./levels.ts\";\nexport { getBuildingDefinition } from \"./lookup.ts\";\n",
    );
}
