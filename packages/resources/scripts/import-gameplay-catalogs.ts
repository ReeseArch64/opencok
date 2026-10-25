import { readdir, readFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { createHash } from "node:crypto";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { writeCatalogModules, type CatalogSource } from "./write-catalogs.ts";
import type { SourceElement } from "./catalog-conversion.ts";

const directory = process.argv[2];
if (!directory) throw new Error("Supply an authorized XML source directory");
const parser = new XMLParser({
  preserveOrder: true,
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseAttributeValue: false,
  parseTagValue: false,
  trimValues: false,
  removeNSPrefix: true,
});
async function* sources(): AsyncIterable<CatalogSource> {
  const files = (await readdir(directory!))
    .filter((file) => file.endsWith(".xml") && file !== "building.xml")
    .sort();
  const expected = Object.values(GameplayCatalog)
    .filter((id) => id !== GameplayCatalog.Building)
    .map((id) => id + ".xml")
    .sort();
  if (JSON.stringify(files) !== JSON.stringify(expected))
    throw new Error("Supply the complete authorized catalog directory matching GameplayCatalog");
  for (const file of files) {
    const source = await readFile(join(directory!, file), "utf8");
    if (/<!DOCTYPE|<!ENTITY/i.test(source) || XMLValidator.validate(source) !== true)
      throw new Error("Invalid catalog input: " + file);
    yield {
      id: basename(file, ".xml"),
      ordered: parser.parse(source) as SourceElement[],
      sourceBytes: Buffer.byteLength(source),
      sourceSha256: createHash("sha256").update(source).digest("hex"),
    };
  }
}
await writeCatalogModules(sources());
