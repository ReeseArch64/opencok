import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { gameplayCatalogs } from "./catalogs.ts";
import type { GameplayCatalogDocument } from "./catalog.ts";
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

function parseRecords(source: string | GameplayCatalogDocument, name: string): Rule[] {
  const parsed = typeof source === "string" ? parseDocument(source) : source.unordered;
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

function parseDeclaredCatalog(source: string | GameplayCatalogDocument): {
  items: Map<string, Rule>;
  groups: Map<string, Rule[]>;
  records: Rule[];
} {
  type Element = Record<string, unknown> & { ":@"?: Rule };
  const parsed = (
    typeof source === "string" ? parseDocument(source, true) : source.ordered
  ) as Element[];
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
    if (!item.id?.trim()) continue;
    if (!replaceDuplicates && map.has(item.id))
      throw new Error(`Invalid gameplay resource ID: ${name}`);
    map.set(item.id, item);
  }
  if (!map.size && name !== "goods") throw new Error(`Invalid gameplay resource ID: ${name}`);
  return map;
}

export function parseRules(xml: string | GameplayCatalogDocument, name: string): Map<string, Rule> {
  if (
    [
      "item",
      "general_sale",
      "pay_servercontrol",
      "function_on",
      "kingdomskill",
      "setting",
      "fb_share",
      "function_star",
    ].includes(name)
  )
    return parseDeclaredCatalog(xml).items;
  return indexRules(parseRecords(xml, name), name);
}

export function parseGameplayCatalog(xml: string): GameplayCatalogDocument {
  return { ordered: parseDocument(xml, true), unordered: parseDocument(xml) };
}

export async function loadRules(directory?: string, kingdomId = 1) {
  const available = async (name: GameplayCatalog): Promise<boolean> =>
    directory === undefined
      ? Object.hasOwn(gameplayCatalogs, name)
      : exists(join(directory, `${name}.xml`));
  const read = async (name: GameplayCatalog): Promise<string | GameplayCatalogDocument> => {
    if (directory === undefined) {
      if (!Object.hasOwn(gameplayCatalogs, name)) throw new Error("Missing gameplay catalog");
      return gameplayCatalogs[name]();
    }
    const file = join(directory, `${name}.xml`);
    if ((await stat(file)).size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
    return readFile(file, "utf8");
  };
  const load = async (name: GameplayCatalog): Promise<Map<string, Rule>> =>
    parseRules(await read(name), name);
  const declared = async (name: GameplayCatalog) =>
    (await available(name)) ? parseDeclaredCatalog(await read(name)) : undefined;
  const [buildings, roles, positions] = await Promise.all([
    load(GameplayCatalog.Building),
    load(GameplayCatalog.Role),
    load(GameplayCatalog.Position),
  ]);
  const starCatalog = await declared(GameplayCatalog.FunctionStar);
  const itemCatalog = (await available(GameplayCatalog.Item))
    ? parseDeclaredCatalog(await read(GameplayCatalog.Item))
    : undefined;
  const items = itemCatalog?.items ?? new Map<string, Rule>();
  const dataConfig = new Map(
    (itemCatalog?.groups.get("data_config") ?? []).map((record) => [record.id ?? null, record]),
  );
  const optional = async (name: GameplayCatalog) =>
    (await available(name)) ? load(name) : new Map<string, Rule>();
  const [
    arms,
    goods,
    featureCatalog,
    settingCatalog,
    generalSaleCatalog,
    payControl,
    kingdomSkillCatalog,
    facebookShareCatalog,
    serverConfig,
  ] = await Promise.all([
    optional(GameplayCatalog.Arms),
    optional(GameplayCatalog.Goods),
    declared(GameplayCatalog.FunctionOn),
    declared(GameplayCatalog.Setting),
    declared(GameplayCatalog.GeneralSale),
    optional(GameplayCatalog.PayServercontrol),
    declared(GameplayCatalog.Kingdomskill),
    declared(GameplayCatalog.FbShare),
    optional(GameplayCatalog.ServersConfig),
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
      GameplayCatalog.General,
      GameplayCatalog.Science,
      GameplayCatalog.ScienceRace,
      GameplayCatalog.SagaTowerScienceUp,
      GameplayCatalog.Hero,
      GameplayCatalog.Equipment,
      GameplayCatalog.DragonWords,
      GameplayCatalog.DragonBase,
      GameplayCatalog.DragonNew,
      GameplayCatalog.Status,
      GameplayCatalog.Sk,
      GameplayCatalog.GeneralBase,
      GameplayCatalog.GeneralSkill,
      GameplayCatalog.GeneralOfficial,
      GameplayCatalog.GeneralRandomEffect,
      GameplayCatalog.Suit,
      GameplayCatalog.Vip,
      GameplayCatalog.Svip,
      GameplayCatalog.Alliancescience,
      GameplayCatalog.CivilizationFeature,
      GameplayCatalog.WrSkill,
      GameplayCatalog.MiracleBuff,
      GameplayCatalog.DragonSkill,
      GameplayCatalog.ActivityEvent,
      GameplayCatalog.Office,
      GameplayCatalog.LifeTreeS,
      GameplayCatalog.SagaTowerScienceBase,
      GameplayCatalog.ForeignCivilizationUp,
      GameplayCatalog.ForeignCivilizationBase,
      GameplayCatalog.ActivityPanel,
      GameplayCatalog.MergeActivity,
      GameplayCatalog.LuckyEffect,
      GameplayCatalog.MonarchTitleLord,
    ].map(optional),
  );
  const prestigeLevelRecords = (await available(GameplayCatalog.ReputationLevel))
    ? parseRecords(await read(GameplayCatalog.ReputationLevel), GameplayCatalog.ReputationLevel)
    : undefined;
  const prestigeLevels = prestigeLevelRecords
    ? indexRules(prestigeLevelRecords, GameplayCatalog.ReputationLevel)
    : new Map<string, Rule>();
  const [militaryGroups, heroEvents] = await Promise.all([
    optional(GameplayCatalog.WrSever),
    optional(GameplayCatalog.Heroevent),
  ]);
  const [militaryRanks, servers] = await Promise.all([
    optional(GameplayCatalog.WrRank),
    optional(GameplayCatalog.Servers),
  ]);
  const [treasures, rewards, mail] = await Promise.all([
    optional(GameplayCatalog.Treasure),
    optional(GameplayCatalog.Reward),
    optional(GameplayCatalog.Mail),
  ]);
  const quests = (await available(GameplayCatalog.Quest))
    ? parseDeclaredCatalog(await read(GameplayCatalog.Quest)).records
    : undefined;
  const positionUnlock = (await available(GameplayCatalog.PositionUnlock))
    ? parseDeclaredCatalog(await read(GameplayCatalog.PositionUnlock)).records
    : undefined;
  const [fieldMonsters, armies, neutralResources, barbarians] = await Promise.all([
    optional(GameplayCatalog.FieldMonster),
    optional(GameplayCatalog.Army),
    optional(GameplayCatalog.SpResources),
    optional(GameplayCatalog.Barbarion),
  ]);
  const achievementCount = (await available(GameplayCatalog.Achievement))
    ? parseRecords(await read(GameplayCatalog.Achievement), GameplayCatalog.Achievement).length
    : 0;
  return new Rules(
    buildings,
    roles,
    positions,
    starCatalog?.items ?? new Map<string, Rule>(),
    items,
    arms,
    goods,
    featureCatalog?.items ?? new Map<string, Rule>(),
    kingdomId,
    settingCatalog?.items ?? new Map<string, Rule>(),
    {
      settingRecords: settingCatalog?.records ?? [],
      starRecords: starCatalog?.records ?? [],
      featureRecords: featureCatalog?.groups.get(GameplayCatalog.FunctionOn) ?? [],
      dataConfig,
      generalSales: generalSaleCatalog?.items ?? new Map<string, Rule>(),
      generalSaleRecords: generalSaleCatalog?.records ?? [],
      payControl,
      kingdomSkills: kingdomSkillCatalog?.items ?? new Map<string, Rule>(),
      kingdomSkillRecords: kingdomSkillCatalog?.records ?? [],
      facebookShare: facebookShareCatalog?.items ?? new Map<string, Rule>(),
      facebookShareRecords: facebookShareCatalog?.records ?? [],
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
    { treasures, rewards, quests, positionUnlock },
    mail,
    { fieldMonsters, armies, neutralResources, barbarians },
    { militaryGroups, heroEvents },
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
