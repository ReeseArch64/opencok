import { readFile, stat, access } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { join } from "node:path";
import { Rules, type Rule } from "@opencok/rules/game";

export async function loadRules(directory: string, kingdomId = 1) {
  const load = async (name: string, replaceDuplicates = false): Promise<Map<string, Rule>> => {
    const file = join(directory, `${name}.xml`);
    if ((await stat(file)).size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
    const xml = await readFile(file, "utf8");
    if (xml.includes("<!DOCTYPE") || XMLValidator.validate(xml) !== true)
      throw new Error("Invalid gameplay resource XML");
    const parsed = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: false,
      removeNSPrefix: true,
    }).parse(xml);
    const items = parsed.database?.ItemSpec ?? parsed.database?.Group?.ItemSpec;
    if (!Array.isArray(items)) throw new Error("Missing gameplay resource records");
    const map = new Map<string, Rule>();
    for (const item of items as Rule[]) {
      if (name === "goods" && !item.id) continue;
      if (!item.id || (!replaceDuplicates && map.has(item.id)))
        throw new Error("Invalid gameplay resource ID");
      map.set(item.id, item);
    }
    return map;
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
    (await exists(join(directory, `${name}.xml`)))
      ? load(name, name === "goods" || name === "function_on")
      : new Map<string, Rule>();
  const [arms, goods, features] = await Promise.all([
    optional("arms"),
    optional("goods"),
    optional("function_on"),
  ]);
  return new Rules(buildings, roles, positions, stars, items, arms, goods, features, kingdomId);
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
