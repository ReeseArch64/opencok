import { readFile, stat, access } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { join } from "node:path";
import { Rules, type Rule } from "@opencok/rules/game";

export function parseRules(xml: string, name: string): Map<string, Rule> {
  if (
    Buffer.byteLength(xml) > 16 * 1024 * 1024 ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) ||
    XMLValidator.validate(xml) !== true
  )
    throw new Error("Invalid gameplay resource XML");
  const parsed = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
    removeNSPrefix: true,
    isArray: (tag) => tag === "Group" || tag === "ItemSpec",
  }).parse(xml);
  const records: unknown[] = [];
  const collect = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const group = node as { ItemSpec?: unknown[]; Group?: unknown[] };
    if (group.ItemSpec) records.push(...group.ItemSpec);
    for (const child of group.Group ?? []) collect(child);
  };
  collect(parsed.database);
  if (!records.length) throw new Error("Missing gameplay resource records");
  const map = new Map<string, Rule>();
  const replaceDuplicates = name === "goods" || name === "function_on";
  for (const record of records) {
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      Object.values(record).some((value) => typeof value !== "string")
    )
      throw new Error("Invalid gameplay resource record");
    const item = record as Rule;
    if (name === "goods" && !item.id) continue;
    if (!item.id?.trim() || (!replaceDuplicates && map.has(item.id)))
      throw new Error("Invalid gameplay resource ID");
    map.set(item.id, item);
  }
  return map;
}

export async function loadRules(directory: string, kingdomId = 1) {
  const load = async (name: string): Promise<Map<string, Rule>> => {
    const file = join(directory, `${name}.xml`);
    if ((await stat(file)).size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
    const xml = await readFile(file, "utf8");
    return parseRules(xml, name);
  };
  const [buildings, roles, positions] = await Promise.all([
    load("building"),
    load("role"),
    load("position"),
  ]);
  const stars = (await exists(join(directory, "function_star.xml")))
    ? await load("function_star")
    : new Map<string, Rule>();
  const items = (await exists(join(directory, "item.xml")))
    ? await load("item")
    : new Map<string, Rule>();
  const optional = async (name: string) =>
    (await exists(join(directory, `${name}.xml`))) ? load(name) : new Map<string, Rule>();
  const [arms, goods, features, settings] = await Promise.all([
    optional("arms"),
    optional("goods"),
    optional("function_on"),
    optional("setting"),
  ]);
  return new Rules(
    buildings,
    roles,
    positions,
    stars,
    items,
    arms,
    goods,
    features,
    kingdomId,
    settings,
  );
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}
