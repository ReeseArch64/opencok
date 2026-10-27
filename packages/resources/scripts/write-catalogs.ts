import { mkdir, writeFile, rm, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { CatalogValue, CatalogCodec } from "../src/catalog-model.ts";
import { convertCatalog, type SourceElement } from "./catalog-conversion.ts";
import { namedHeroRecord } from "./named-hero-records.ts";

export interface CatalogSource {
  readonly id: string;
  readonly ordered: SourceElement[];
  readonly sourceBytes: number;
  readonly sourceSha256: string;
}

export function catalogHash(value: unknown): string {
  return createHash("sha256")
    .update(
      JSON.stringify(value, (_, item) =>
        typeof item === "bigint" ? { integer: String(item) } : item,
      ),
    )
    .digest("hex");
}

export function render(value: unknown, key?: string): string {
  if (typeof value === "bigint") return String(value) + "n";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Non-finite catalog number");
    return String(value);
  }
  if (key === "kind" && typeof value === "string")
    return "CatalogKind." + Object.entries(CatalogKind).find(([, item]) => item === value)![0];
  if (key === "scope" && typeof value === "string" && ["C", "G", "I", "P", "S"].includes(value))
    return "VariableScope." + value;
  if (Array.isArray(value)) return "[" + value.map((item) => render(item)).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([field, item]) => JSON.stringify(field) + ":" + render(item, field))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}

function typeOf(value: CatalogValue): string {
  if (!Array.isArray(value)) return typeof value;
  const members = [...new Set(value.map((item) => typeOf(item)))].sort();
  return "readonly (" + (members.join(" | ") || "never") + ")[]";
}
function recordType(records: readonly object[], name: string): string {
  const fields = new Map<string, { count: number; types: Set<string> }>();
  for (const record of records)
    for (const [key, value] of Object.entries(record)) {
      const field = fields.get(key) ?? { count: 0, types: new Set<string>() };
      field.count++;
      field.types.add(typeOf(value as CatalogValue));
      fields.set(key, field);
    }
  return (
    "export interface " +
    name +
    " {\n" +
    [...fields]
      .map(
        ([key, field]) =>
          "readonly " +
          JSON.stringify(key) +
          (field.count === records.length ? "" : "?") +
          ": " +
          [...field.types].sort().join(" | ") +
          ";",
      )
      .join("\n") +
    "\n}\n"
  );
}

export async function writeCatalogModules(sources: AsyncIterable<CatalogSource>): Promise<void> {
  const base = new URL("../src/", import.meta.url).pathname;
  const directory = join(base, "catalogs", "data");
  const typesDirectory = join(base, "catalogs", "types");
  const heroTypesDirectory = new URL("../../hero/src/resources/catalogs/types/", import.meta.url)
    .pathname;
  await mkdir(directory, { recursive: true });
  await mkdir(typesDirectory, { recursive: true });
  await mkdir(heroTypesDirectory, { recursive: true });
  const generated = new Set<string>();
  const generatedTypes = new Set<string>();
  const generatedHeroTypes = new Set<string>();
  const modules = new Map<string, string>();
  const names = new Map(Object.entries(GameplayCatalog).map(([member, id]) => [id, member]));
  const registry: string[] = [];
  const models: string[] = [];
  const typeImports: string[] = [];
  const codecs: Record<string, CatalogCodec> = {};
  const inventory: {
    id: string;
    sourceBytes: number;
    sourceSha256: string;
    module: string;
    kind: CatalogKind;
    records?: number;
  }[] = [];
  for await (const source of sources) {
    if (source.id === GameplayCatalog.Building) continue;
    const { definition, codec } = convertCatalog(source.ordered, source.id);
    const hash = catalogHash({ definition, codec });
    let module = modules.get(hash);
    const member = names.get(source.id as GameplayCatalog);
    if (!member) throw new Error("Unknown catalog source: " + source.id);
    if (!module) {
      module = source.id;
      modules.set(hash, module);
      const imports = [
        "import { CatalogKind" +
          (definition.kind === CatalogKind.Automation && definition.variables.length
            ? ", VariableScope"
            : "") +
          ' } from "@opencok/enums/catalog-kind";',
      ];
      let type: string;
      const fields: Record<string, string> = {};
      if (definition.kind === CatalogKind.Table) {
        const recordName = member + "Definition";
        const typeName = recordName + "Catalog";
        const hero = /hero|general/.test(module);
        const recordModule = hero
          ? "@opencok/hero/resources/catalogs/types/" + module
          : "../types/" + module + ".ts";
        const catalogModule = hero ? recordModule : "./catalogs/types/" + module + ".ts";
        typeImports.push("import type { " + typeName + ' } from "' + catalogModule + '";');
        const model =
          recordType(definition.records, recordName) +
          '\nimport type { CatalogTable } from "' +
          (hero ? "@opencok/resources/catalog-model" : "../../catalog-model.ts") +
          '";\nexport type ' +
          typeName +
          " = CatalogTable<" +
          recordName +
          ">;\n";
        await writeFile(join(hero ? heroTypesDirectory : typesDirectory, module + ".ts"), model);
        (hero ? generatedHeroTypes : generatedTypes).add(module + ".ts");
        imports.push("import type { " + recordName + ' } from "' + recordModule + '";');
        imports.push('import type { CatalogTable } from "../../catalog-model.ts";');
        type = "CatalogTable<" + recordName + ">";
        const parts: string[] = [];
        for (let offset = 0; offset < definition.records.length; offset += 750) {
          const part = module + ".records" + parts.length + ".ts";
          const records = definition.records.slice(offset, offset + 750);
          const named = records.map((record) => namedHeroRecord(module!, record));
          const declarations = [
            ...new Set(named.flatMap((entry) => (entry ? [entry.declaration] : []))),
          ];
          await writeFile(
            join(directory, part),
            "import type { " +
              recordName +
              ' } from "' +
              recordModule +
              '";\n' +
              declarations.join("\n") +
              "\nexport const records: readonly " +
              recordName +
              "[] = " +
              "[" +
              records.map((record, index) => named[index]?.expression ?? render(record)).join(",") +
              "]" +
              ";\n",
          );
          generated.add(part);
          const name = "records" + parts.length;
          parts.push(name);
          imports.push("import { records as " + name + ' } from "./' + part + '";');
        }
        fields.records = "[" + parts.map((name) => "..." + name).join(",") + "]";
      } else {
        type = (
          {
            [CatalogKind.TileMap]: "TileMapDefinition",
            [CatalogKind.Automation]: "AutomationCatalog",
            [CatalogKind.Variables]: "VariableCatalog",
            [CatalogKind.WebRouting]: "WebRoutingCatalog",
          } as const
        )[definition.kind];
        imports.push("import type { " + type + ' } from "../../catalog-model.ts";');
        if (definition.kind === CatalogKind.TileMap) {
          fields.layers =
            "[" +
            (
              await Promise.all(
                definition.layers.map(async (layer, index) => {
                  const parts: string[] = [];
                  for (let offset = 0; offset < layer.tiles.length; offset += 32768) {
                    const part = module + ".layer" + index + ".tiles" + parts.length + ".ts";
                    const name = "layer" + index + "tiles" + parts.length;
                    parts.push(name);
                    await writeFile(
                      join(directory, part),
                      "export const tiles: readonly number[] = " +
                        render(layer.tiles.slice(offset, offset + 32768)) +
                        ";\n",
                    );
                    generated.add(part);
                    imports.push("import { tiles as " + name + ' } from "./' + part + '";');
                  }
                  return (
                    "{name:" +
                    render(layer.name) +
                    ",width:" +
                    layer.width +
                    ",height:" +
                    layer.height +
                    ",tiles:[" +
                    parts.map((name) => "..." + name).join(",") +
                    "]}"
                  );
                }),
              )
            ).join(",") +
            "]";
        }
      }
      const body =
        "{" +
        Object.entries(definition)
          .map(
            ([field, value]) =>
              JSON.stringify(field) + ":" + (fields[field] ?? render(value, field)),
          )
          .join(",") +
        "}";
      await writeFile(
        join(directory, module + ".ts"),
        imports.join("\n") + "\nexport const catalog: " + type + " = " + body + ";\n",
      );
      generated.add(module + ".ts");
    }
    const originalMember = names.get(module as GameplayCatalog)!;
    const type =
      definition.kind === CatalogKind.Table
        ? originalMember + "DefinitionCatalog"
        : (
            {
              [CatalogKind.TileMap]: "TileMapDefinition",
              [CatalogKind.Automation]: "AutomationCatalog",
              [CatalogKind.Variables]: "VariableCatalog",
              [CatalogKind.WebRouting]: "WebRoutingCatalog",
            } as const
          )[definition.kind];
    models.push("[GameplayCatalog." + member + "]: " + type + ";");
    registry.push(
      "[GameplayCatalog." +
        member +
        ']: async () => (await import("./catalogs/data/' +
        module +
        '.ts")).catalog,',
    );
    codecs[source.id] = codec;
    inventory.push({
      id: source.id,
      sourceBytes: source.sourceBytes,
      sourceSha256: source.sourceSha256,
      module,
      kind: definition.kind,
      ...(definition.kind === CatalogKind.Table ? { records: definition.records.length } : {}),
    });
  }
  for (const file of await readdir(directory))
    if (!generated.has(file)) await rm(join(directory, file));
  for (const file of await readdir(typesDirectory))
    if (!generatedTypes.has(file)) await rm(join(typesDirectory, file));
  for (const file of await readdir(heroTypesDirectory))
    if (!generatedHeroTypes.has(file)) await rm(join(heroTypesDirectory, file));
  const header = 'import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";\n';
  const modelImports =
    'import type { TileMapDefinition, AutomationCatalog, VariableCatalog, WebRoutingCatalog } from "./catalog-model.ts";\n';
  await writeFile(
    join(base, "catalog-definitions.ts"),
    header +
      modelImports +
      typeImports.join("\n") +
      "\nexport interface GameplayCatalogDefinitions {\n" +
      models.join("\n") +
      "\n}\nexport const catalogDefinitions: { readonly [Id in keyof GameplayCatalogDefinitions]: () => Promise<GameplayCatalogDefinitions[Id]> } = {\n" +
      registry.join("\n") +
      "\n};\nexport async function loadCatalog<Id extends keyof GameplayCatalogDefinitions>(id: Id): Promise<GameplayCatalogDefinitions[Id]> {\nreturn catalogDefinitions[id]();\n}\n",
  );
  await writeFile(
    join(base, "catalog-codecs.ts"),
    'import type { CatalogCodec } from "./catalog-model.ts";\nexport const catalogCodecs: Readonly<Record<string, CatalogCodec>> = ' +
      render(codecs) +
      ";\n",
  );
  await writeFile(
    join(base, "catalogs", "provenance.json"),
    JSON.stringify(inventory, null, 2) + "\n",
  );
  console.log(
    "Wrote " + inventory.length + " catalogs, " + modules.size + " distinct domain definitions",
  );
}
