import { readdir, readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { createGameplayCatalog, type GameplayCatalogElement } from "../src/catalog.ts";

const source = process.argv[2];
if (!source) throw new Error("Supply an authorized XML source directory");
const root = new URL("../../../", import.meta.url).pathname;
const destination = join(root, "packages/resources/src/catalogs");
await mkdir(destination, { recursive: true });
const names = (await readdir(source))
  .filter((name) => name.endsWith(".xml") && name !== "building.xml")
  .sort();
const sha256 = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
const member = (name: string) =>
  name
    .split(/[^a-zA-Z0-9]+/)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join("");
const members = new Set<string>();
const documents = new Map<string, string>();
const registry: string[] = [];
const enumMembers: string[] = ['  Building = "building",'];
const generatedParts: string[] = [];
const inventory: {
  id: string;
  sourceBytes: number;
  sourceSha256: string;
  documentBytes: number;
  documentSha256: string;
  module: string;
}[] = [];
for (const filename of names) {
  const id = filename.slice(0, -4);
  const normalized = member(id);
  const key = /^\d/.test(normalized) ? `Catalog${normalized}` : normalized;
  if (!/^[A-Za-z_]\w*$/.test(key) || members.has(key))
    throw new Error(`Ambiguous catalog identifier: ${filename}`);
  members.add(key);
  const original = await readFile(join(source, filename));
  const xml = original.toString("utf8");
  if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true)
    throw new Error(`Invalid catalog XML: ${filename}`);
  const parse = (preserveOrder: boolean) =>
    new XMLParser({
      preserveOrder,
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: false,
      parseTagValue: false,
      trimValues: false,
      removeNSPrefix: true,
      isArray: (tag) => tag === "Group" || tag === "ItemSpec",
    }).parse(xml);
  const ordered: GameplayCatalogElement[] = parse(true);
  const document = createGameplayCatalog(ordered);
  if (JSON.stringify(document.unordered) !== JSON.stringify(parse(false)))
    throw new Error(`Catalog projection mismatch: ${filename}`);
  const serialized = JSON.stringify(document);
  const digest = sha256(serialized);
  const module = documents.get(digest) ?? id;
  if (!documents.has(digest)) {
    let part = 0;
    const emit = async (value: unknown): Promise<string> => {
      if (!Array.isArray(value)) {
        if (!value || typeof value !== "object") return JSON.stringify(value);
        const entries = [];
        for (const [key, child] of Object.entries(value))
          entries.push(`${JSON.stringify(key)}: ${await emit(child)}`);
        return `{ ${entries.join(", ")} }`;
      }
      if (!value.length) return "[]";
      if (value.length > 10_000 && value[0]?.["#text"] !== undefined) {
        const separator = value[0]["#text"];
        const gids: number[] = [];
        let valid = true;
        for (let index = 0; index + 1 < value.length; index += 2) {
          const whitespace = value[index];
          const tile = value[index + 1];
          const gid = tile?.[":@"]?.gid;
          if (
            Object.keys(whitespace).length !== 1 ||
            whitespace["#text"] !== separator ||
            Object.keys(tile).length !== 2 ||
            !Array.isArray(tile.tile) ||
            tile.tile.length !== 0 ||
            Object.keys(tile[":@"] ?? {}).length !== 1 ||
            !Number.isSafeInteger(Number(gid)) ||
            String(Number(gid)) !== gid
          ) {
            valid = false;
            break;
          }
          gids.push(Number(gid));
        }
        if (valid && gids.length) {
          const parts: string[] = [];
          for (let start = 0; start < gids.length; start += 10_000) {
            const symbol = `tiles${part++}`;
            const partName = `${module}.${symbol}`;
            await writeFile(
              join(destination, `${partName}.ts`),
              `export const ${symbol}: readonly number[] = [${gids.slice(start, start + 10_000).join(", ")}];\n`,
            );
            generatedParts.push(partName);
            imports.push(`import { ${symbol} } from "./${partName}.ts";`);
            parts.push(`...catalogTiles(${symbol}, ${JSON.stringify(separator)})`);
          }
          if (value.length % 2) parts.push(await emit(value[value.length - 1]));
          return `[${parts.join(",\n")}]`;
        }
      }
      const signatures = value.map((entry) => JSON.stringify(entry));
      const entries: string[] = [];
      for (let index = 0; index < value.length;) {
        let width = 1;
        let repetitions = 1;
        for (let candidate = 1; candidate <= 4 && index + candidate < value.length; candidate++) {
          let count = 1;
          while (
            index + (count + 1) * candidate <= value.length &&
            signatures
              .slice(index, index + candidate)
              .every(
                (signature, offset) => signature === signatures[index + count * candidate + offset],
              )
          )
            count++;
          if (count > 1 && count * candidate - candidate > repetitions * width - width) {
            width = candidate;
            repetitions = count;
          }
        }
        if (repetitions * width > width + 2) {
          const sequence = [];
          for (let offset = 0; offset < width; offset++)
            sequence.push(await emit(value[index + offset]));
          entries.push(`...repeatCatalogElements(${repetitions}, ${sequence.join(", ")})`);
          index += repetitions * width;
        } else {
          entries.push(await emit(value[index]));
          index++;
        }
      }
      if (entries.join("").length < 200_000) return `[\n${entries.join(",\n")}\n]`;
      const parts: string[] = [];
      for (let start = 0; start < entries.length; start += 500) {
        const symbol = `part${part++}`;
        const partName = `${module}.${symbol}`;
        const contents = entries.slice(start, start + 500).join(",\n");
        const dependencies = imports.filter((line) => {
          const dependency = /import \{ (\w+) \}/.exec(line)?.[1];
          return (
            dependency &&
            (contents.includes(`...${dependency}()`) ||
              contents.includes(`catalogTiles(${dependency},`))
          );
        });
        await writeFile(
          join(destination, `${partName}.ts`),
          `import { ${contents.includes("repeatCatalogElements") ? "repeatCatalogElements, " : ""}${contents.includes("catalogTiles") ? "catalogTiles, " : ""}type GameplayCatalogElement } from "../catalog.ts";\n${dependencies.join("\n")}\nexport function ${symbol}(): GameplayCatalogElement[] { return [\n${contents}\n]; }\n`,
        );
        parts.push(symbol);
        generatedParts.push(partName);
      }
      for (const symbol of parts)
        imports.push(`import { ${symbol} } from "./${module}.${symbol}.ts";`);
      return `[${parts.map((symbol) => `...${symbol}()`).join(", ")}]`;
    };
    const imports: string[] = [];
    const body = await emit(ordered);
    const rootImports = imports.filter((line) => {
      const dependency = /import \{ (\w+) \}/.exec(line)?.[1];
      return (
        dependency &&
        (body.includes(`...${dependency}()`) || body.includes(`catalogTiles(${dependency},`))
      );
    });
    await writeFile(
      join(destination, `${module}.ts`),
      `import { createGameplayCatalog, ${body.includes("repeatCatalogElements") ? "repeatCatalogElements, " : ""}${body.includes("catalogTiles") ? "catalogTiles, " : ""}type GameplayCatalogDocument } from "../catalog.ts";\n${rootImports.join("\n")}\nexport function createCatalog(): GameplayCatalogDocument {\nreturn createGameplayCatalog(${body});\n}\n`,
    );
    documents.set(digest, module);
  }
  enumMembers.push(`  ${key} = ${JSON.stringify(id)},`);
  registry.push(
    `  [GameplayCatalog.${key}]: async () => (await import("./catalogs/${module}.ts")).createCatalog(),`,
  );
  inventory.push({
    id,
    sourceBytes: original.length,
    sourceSha256: sha256(original),
    documentBytes: Buffer.byteLength(serialized),
    documentSha256: digest,
    module,
  });
}
await writeFile(
  join(root, "packages/enums/src/gameplay-catalog.ts"),
  `export enum GameplayCatalog {\n${enumMembers.join("\n")}\n}\n`,
);
await writeFile(
  join(root, "packages/resources/src/catalogs.ts"),
  `import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";\nimport type { GameplayCatalogDocument } from "./catalog.ts";\n\nexport const gameplayCatalogs: Partial<Readonly<Record<GameplayCatalog, () => Promise<GameplayCatalogDocument>>>> = {\n${registry.join("\n")}\n};\n`,
);
await writeFile(join(destination, "inventory.json"), JSON.stringify(inventory, null, 2) + "\n");
const generated = new Set([...documents.values(), ...generatedParts].map((name) => `${name}.ts`));
for (const filename of await readdir(destination))
  if (filename.endsWith(".ts") && !generated.has(filename)) await rm(join(destination, filename));
console.log(`Converted ${names.length} XML catalogs into ${documents.size} unique typed documents`);
