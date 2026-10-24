import { readFile, stat, access } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";
import { join } from "node:path";
import { Rules, type Rule } from "@opencok/rules/game";

function parseDocument(xml: string, preserveOrder = false) {
  if (
    Buffer.byteLength(xml) > 16 * 1024 * 1024 ||
    /<!DOCTYPE|<!ENTITY/i.test(xml) ||
    XMLValidator.validate(xml) !== true
  )
    throw new Error("Invalid gameplay resource XML");
  return new XMLParser({
    preserveOrder,
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
    removeNSPrefix: true,
    isArray: (tag) => tag === "Group" || tag === "ItemSpec",
  }).parse(xml);
}

function parseRecords(xml: string, name: string): Rule[] {
  const parsed = parseDocument(xml);
  if (!Object.hasOwn(parsed, "database")) throw new Error("Invalid gameplay resource root");
  const records: unknown[] = [];
  const collect = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const group = node as { id?: string; ItemSpec?: unknown[]; Group?: unknown[] };
    if (group.ItemSpec && (name !== "vip" || group.id === "vip")) records.push(...group.ItemSpec);
    for (const child of group.Group ?? []) collect(child);
  };
  collect(parsed.database);
  for (const record of records)
    if (
      !record ||
      typeof record !== "object" ||
      Array.isArray(record) ||
      Object.values(record).some((value) => typeof value !== "string")
    )
      throw new Error("Invalid gameplay resource record");
  return records as Rule[];
}

function parseDeclaredCatalog(xml: string): {
  items: Map<string, Rule>;
  groups: Map<string, Rule[]>;
  records: Rule[];
} {
  type Element = Record<string, unknown> & { ":@"?: Rule };
  const parsed = parseDocument(xml, true) as Element[];
  const root = parsed.find((element) => Object.hasOwn(element, "database"));
  if (!root || !Array.isArray(root.database)) throw new Error("Invalid gameplay resource root");
  const elements = (nodes: Element[]) =>
    nodes.filter((node) =>
      Object.keys(node).some((key) => key !== ":@" && !key.startsWith("#") && !key.startsWith("?")),
    );
  const children = elements(root.database as Element[]);
  const groups = children.filter((node) => Object.hasOwn(node, "Group"));
  const items = new Map<string, Rule>();
  const groupsById = new Map<string, Rule[]>();
  const declarations: Rule[] = [];
  const records = (nodes: Element[]): Rule[] =>
    elements(nodes).map((node) => {
      const record = { ...node[":@"] };
      if (Object.values(record).some((value) => typeof value !== "string"))
        throw new Error("Invalid gameplay resource record");
      items.set(record.id ?? "null", record);
      declarations.push(record);
      return record;
    });
  if (!groups.length) records(children);
  else
    for (const group of groups) {
      const id = group[":@"]?.id;
      if (typeof id !== "string" || !Array.isArray(group.Group))
        throw new Error("Invalid gameplay resource group");
      const values = records(group.Group as Element[]);
      groupsById.set(id, values);
    }
  return { items, groups: groupsById, records: declarations };
}

function indexRules(records: Rule[], name: string): Map<string, Rule> {
  if (name === "kingdomskill")
    return new Map(records.map((record) => [record.id ?? "null", record]));
  if (!records.length) throw new Error("Missing gameplay resource records");
  const map = new Map<string, Rule>();
  const replaceDuplicates = [
    "goods",
    "science",
    "equipment",
    "status",
    "dragon_skill",
    "activity_panel",
    "reward",
    "mail",
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
  for (const record of records) {
    const item = record;
    if (name === "goods" && !item.id) continue;
    if (!item.id?.trim() || (!replaceDuplicates && map.has(item.id)))
      throw new Error("Invalid gameplay resource ID");
    map.set(item.id, item);
  }
  return map;
}

export function parseRules(xml: string, name: string): Map<string, Rule> {
  if (["item", "general_sale", "pay_servercontrol", "function_on", "kingdomskill"].includes(name))
    return parseDeclaredCatalog(xml).items;
  return indexRules(parseRecords(xml, name), name);
}

export async function loadRules(directory: string, kingdomId = 1) {
  const read = async (name: string): Promise<string> => {
    const file = join(directory, `${name}.xml`);
    if ((await stat(file)).size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
    return readFile(file, "utf8");
  };
  const load = async (name: string): Promise<Map<string, Rule>> =>
    parseRules(await read(name), name);
  const [buildings, roles, positions] = await Promise.all([
    load("building"),
    load("role"),
    load("position"),
  ]);
  const stars = (await exists(join(directory, "function_star.xml")))
    ? await load("function_star")
    : new Map<string, Rule>();
  const itemCatalog = (await exists(join(directory, "item.xml")))
    ? parseDeclaredCatalog(await read("item"))
    : undefined;
  const items = itemCatalog?.items ?? new Map<string, Rule>();
  const dataConfig = new Map(
    (itemCatalog?.groups.get("data_config") ?? []).map((record) => [record.id ?? null, record]),
  );
  const optional = async (name: string) =>
    (await exists(join(directory, `${name}.xml`))) ? load(name) : new Map<string, Rule>();
  const [
    arms,
    goods,
    features,
    settings,
    generalSaleCatalog,
    payControl,
    kingdomSkillRecords,
    facebookShare,
    serverConfig,
  ] = await Promise.all([
    optional("arms"),
    optional("goods"),
    optional("function_on"),
    optional("setting"),
    (async () =>
      (await exists(join(directory, "general_sale.xml")))
        ? parseDeclaredCatalog(await read("general_sale"))
        : undefined)(),
    optional("pay_servercontrol"),
    (async () =>
      (await exists(join(directory, "kingdomskill.xml")))
        ? parseDeclaredCatalog(await read("kingdomskill")).records
        : [])(),
    optional("fb_share"),
    optional("servers_config"),
  ]);
  const [
    generals,
    sciences,
    civilizationSciences,
    sagaSciences,
    heroes,
    equipment,
    titles,
    dragonBases,
    dragonLevels,
    statuses,
    generalSkills,
    newGeneralBases,
    newGeneralSkills,
    newGeneralOffices,
    newGeneralRefinement,
    equipmentSets,
    vip,
    superVip,
    allianceSciences,
    civilizationFeatures,
    militarySkills,
    miracleBuffs,
    dragonSkills,
    activityEvents,
    offices,
    treeSkins,
    sagaScienceBases,
    foreignSciences,
    foreignScienceBases,
    activityPanels,
    mergeActivities,
    luckyEffects,
    monarchTitles,
  ] = await Promise.all(
    [
      "general",
      "science",
      "scienceRace",
      "saga_tower_science_up",
      "hero",
      "equipment",
      "dragon_words",
      "dragon_base",
      "dragon_new",
      "status",
      "sk",
      "general_base",
      "general_skill",
      "general_official",
      "general_random_effect",
      "suit",
      "vip",
      "svip",
      "alliancescience",
      "civilization_feature",
      "wr_skill",
      "miracle_buff",
      "dragon_skill",
      "activity_event",
      "office",
      "life_treeS",
      "saga_tower_science_base",
      "foreign_civilization_up",
      "foreign_civilization_base",
      "activity_panel",
      "merge_activity",
      "lucky_effect",
      "monarch_title_lord",
    ].map(optional),
  );
  const prestigeLevelRecords = (await exists(join(directory, "reputation_level.xml")))
    ? parseRecords(await read("reputation_level"), "reputation_level")
    : undefined;
  const prestigeLevels = prestigeLevelRecords
    ? indexRules(prestigeLevelRecords, "reputation_level")
    : new Map<string, Rule>();
  const [militaryRanks, servers] = await Promise.all([optional("wr_rank"), optional("servers")]);
  const [treasures, rewards, mail] = await Promise.all([
    optional("treasure"),
    optional("reward"),
    optional("mail"),
  ]);
  const [fieldMonsters, armies, neutralResources, barbarians] = await Promise.all([
    optional("field_monster"),
    optional("army"),
    optional("sp_resources"),
    optional("barbarion"),
  ]);
  const achievementCount = (await exists(join(directory, "achievement.xml")))
    ? parseRecords(await read("achievement"), "achievement").length
    : 0;
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
    {
      dataConfig,
      generalSales: generalSaleCatalog?.items ?? new Map<string, Rule>(),
      generalSaleRecords: generalSaleCatalog?.records ?? [],
      payControl,
      kingdomSkills: indexRules(kingdomSkillRecords, "kingdomskill"),
      kingdomSkillRecords,
      facebookShare,
      serverConfig,
    },
    {
      generals,
      sciences,
      civilizationSciences,
      sagaSciences,
      heroes,
      equipment,
      titles,
      dragonBases,
      dragonLevels,
      statuses,
      generalSkills,
      newGeneralBases,
      newGeneralSkills,
      newGeneralOffices,
      newGeneralRefinement,
      equipmentSets,
      vip,
      superVip,
      allianceSciences,
      prestigeLevels,
      prestigeLevelRecords: prestigeLevelRecords ?? [],
      civilizationFeatures,
      militarySkills,
      miracleBuffs,
      dragonSkills,
      activityEvents,
      offices,
      treeSkins,
      sagaScienceBases,
      foreignSciences,
      foreignScienceBases,
      activityPanels,
      mergeActivities,
      luckyEffects,
      monarchTitles,
    },
    { achievementCount, militaryRanks, servers },
    { treasures, rewards },
    mail,
    { fieldMonsters, armies, neutralResources, barbarians },
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
