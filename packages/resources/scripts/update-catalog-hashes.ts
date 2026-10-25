import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { gameplayCatalogs } from "../src/catalogs.ts";

const path = new URL("../src/catalogs/inventory.json", import.meta.url);
const inventory: {
  id: GameplayCatalog;
  module: string;
  documentBytes: number;
  documentSha256: string;
}[] = JSON.parse(await readFile(path, "utf8"));
const requested = process.argv[2];
if (requested === GameplayCatalog.Building)
  throw new Error("Edit src/buildings directly; domain models do not require catalog checksums");
const selected = inventory.find((entry) => entry.id === requested);
if (!selected) throw new Error("Supply a catalog identifier from GameplayCatalog");
const factory = gameplayCatalogs[selected.id];
if (!factory) throw new Error("This catalog has migrated to a domain model");
const document = await factory();
const serialized = JSON.stringify(document);
const checksum = createHash("sha256").update(serialized).digest("hex");
for (const entry of inventory.filter((entry) => entry.module === selected.module)) {
  entry.documentBytes = Buffer.byteLength(serialized);
  entry.documentSha256 = checksum;
}
await writeFile(path, JSON.stringify(inventory, null, 2) + "\n");
console.log(`Updated catalog integrity metadata for ${requested} and its shared aliases`);
