import nicknameWords from "../data/badwords.json";
import { createBuildingCatalog } from "./buildings/index.ts";
import { importBuildingCatalog } from "./buildings/import.ts";
import { GameplayCatalog } from "@opencok/enums/gameplay-catalog";
import { CatalogKind } from "@opencok/enums/catalog-kind";
import { catalogDefinitions } from "./catalog-definitions.ts";
import { catalogCodecs } from "./catalog-codecs.ts";
import type { CatalogDefinition } from "./catalog-model.ts";
import {
  legacyCatalogRecords,
  legacyDeclaredCatalog,
  indexRules,
} from "./catalog-compatibility.ts";
import { readFile, stat, access } from "node:fs/promises";
import { join } from "node:path";
import { Rules, type Rule } from "@opencok/rules/game";

export async function loadRules(directory?: string, kingdomId = 1) {
  const fixtures = directory === undefined ? undefined : await import("./xml-fixtures.ts");
  const available = async (name: GameplayCatalog): Promise<boolean> =>
    directory === undefined
      ? Object.hasOwn(catalogDefinitions, name)
      : exists(join(directory, `${name}.xml`));
  const read = async (name: GameplayCatalog): Promise<string | CatalogDefinition> => {
    if (directory === undefined) {
      const factory = catalogDefinitions[name as keyof typeof catalogDefinitions];
      if (!factory) throw new Error("Missing gameplay catalog");
      return factory();
    }
    const file = join(directory, `${name}.xml`);
    if ((await stat(file)).size > 16 * 1024 * 1024) throw new Error("Oversized gameplay resource");
    return readFile(file, "utf8");
  };
  const records = (source: string | CatalogDefinition, name: GameplayCatalog): Rule[] =>
    typeof source === "string"
      ? fixtures!.parseRecords(source, name)
      : legacyCatalogRecords(source, catalogCodecs[name] ?? {}, name);
  const load = async (name: GameplayCatalog): Promise<Map<string, Rule>> => {
    const source = await read(name);
    return typeof source === "string"
      ? fixtures!.parseRules(source, name)
      : indexRules(records(source, name), name);
  };
  const optionalRecords = async (name: GameplayCatalog) =>
    (await available(name)) ? records(await read(name), name) : [];
  const parseDeclared = (source: string | CatalogDefinition, name: GameplayCatalog) => {
    if (typeof source === "string") return fixtures!.parseDeclaredCatalog(source);
    if (source.kind !== CatalogKind.Table) throw new Error("Expected gameplay table");
    return legacyDeclaredCatalog(source, catalogCodecs[name] ?? {});
  };
  const declared = async (name: GameplayCatalog) =>
    (await available(name)) ? parseDeclared(await read(name), name) : undefined;
  const rechargeFeedbackRecords = await optionalRecords(GameplayCatalog.DailyRecharge);
  const campaignSource = (await available(GameplayCatalog.TriggerActivity))
    ? await read(GameplayCatalog.TriggerActivity)
    : undefined;
  const variableSource = (await available(GameplayCatalog.TriggerVar))
    ? await read(GameplayCatalog.TriggerVar)
    : undefined;
  const campaignRules =
    campaignSource &&
    typeof campaignSource !== "string" &&
    campaignSource.kind === CatalogKind.Automation
      ? campaignSource.rules
      : [];
  const campaignVariables =
    variableSource &&
    typeof variableSource !== "string" &&
    variableSource.kind === CatalogKind.Automation
      ? new Map(variableSource.variables.map((v) => [`${v.scope}$${v.id}`, v]))
      : new Map();
  const buildings =
    directory === undefined
      ? createBuildingCatalog()
      : importBuildingCatalog(await load(GameplayCatalog.Building));
  const [roles, positions] = await Promise.all([
    load(GameplayCatalog.Role),
    load(GameplayCatalog.Position),
  ]);
  const starCatalog = await declared(GameplayCatalog.FunctionStar);
  const itemCatalog = (await available(GameplayCatalog.Item))
    ? parseDeclared(await read(GameplayCatalog.Item), GameplayCatalog.Item)
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
    ? records(await read(GameplayCatalog.ReputationLevel), GameplayCatalog.ReputationLevel)
    : undefined;
  const prestigeLevels = prestigeLevelRecords
    ? indexRules(prestigeLevelRecords, GameplayCatalog.ReputationLevel)
    : new Map<string, Rule>();
  const allianceTeleport = await optional(GameplayCatalog.AllianceTeleport);
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
    ? parseDeclared(await read(GameplayCatalog.Quest), GameplayCatalog.Quest).records
    : undefined;
  const positionUnlock = (await available(GameplayCatalog.PositionUnlock))
    ? parseDeclared(await read(GameplayCatalog.PositionUnlock), GameplayCatalog.PositionUnlock)
        .records
    : undefined;
  const [fieldMonsters, armies, neutralResources, barbarians] = await Promise.all([
    optional(GameplayCatalog.FieldMonster),
    optional(GameplayCatalog.Army),
    optional(GameplayCatalog.SpResources),
    optional(GameplayCatalog.Barbarion),
  ]);
  const resources = (await declared(GameplayCatalog.Resources))?.groups;
  const heritage = await optional(GameplayCatalog.Heritage);
  const residential = await optional(GameplayCatalog.Resdential);
  const allianceBuildings = (await available(GameplayCatalog.AllianceBuilding))
    ? parseDeclared(await read(GameplayCatalog.AllianceBuilding), GameplayCatalog.AllianceBuilding)
        .records
    : undefined;
  const achievementRecords = (await available(GameplayCatalog.Achievement))
    ? records(await read(GameplayCatalog.Achievement), GameplayCatalog.Achievement)
    : [];
  const achievementCount = achievementRecords.length;
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
      allianceTeleport,
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
    {
      nicknameWords,
      achievementCount,
      achievements: achievementRecords,
      militaryRanks,
      servers,
      characters: await optional(GameplayCatalog.Characters),
    },
    { treasures, rewards, quests, positionUnlock },
    mail,
    {
      fieldMonsters,
      armies,
      neutralResources,
      barbarians,
      allianceBuildings,
      resources,
      heritage,
      residential,
    },
    { militaryGroups, heroEvents },
    await optional(GameplayCatalog.Material),
    await optional(GameplayCatalog.ShopNew),
    await optional(GameplayCatalog.Trade),
    {
      legacyDaily: await optional(GameplayCatalog.DailyQuest),
      legacyRewards: await optional(GameplayCatalog.DailyReward),
      freshSignIn: await optional(GameplayCatalog.SignIn2),
      equipmentRandom: await optional(GameplayCatalog.EquipmentRandom),
      forgeRandom: await optional(GameplayCatalog.PowerRandom),
      reforgeRandom: await optional(GameplayCatalog.ReforgeRandom),
      abilities: await optional(GameplayCatalog.Ab),
      story: await optional(GameplayCatalog.StorySetting),
      daily: await optional(GameplayCatalog.NewDailyTask),
      dailyRewards: await optional(GameplayCatalog.DailyTaskReward),
      questPhases: await optional(GameplayCatalog.QuestPhase),
      signIn: await optional(GameplayCatalog.SignIn),
    },
    {
      levels: await optional(GameplayCatalog.GeneralLevel),
      stations: await optional(GameplayCatalog.GeneralStation),
      unlocks: await optional(GameplayCatalog.GetGeneral),
      draws: await optional(GameplayCatalog.GeneralDraw),
      wheels: await optional(GameplayCatalog.HeroRoulette),
      refinementValues: await optionalRecords(GameplayCatalog.GeneralRandomNum),
      refinementLimits: await optionalRecords(GameplayCatalog.GeneralMaxNum),
      refinementRepeats: await optionalRecords(GameplayCatalog.GeneralRepeat),
      recruits: await optional(GameplayCatalog.Recruit),
    },
    {
      ranks: await optional(GameplayCatalog.Rank),
      gifts: await optional(GameplayCatalog.Gift),
      buildingSkills: await optional(GameplayCatalog.AllianceBuildingSkill),
    },
    {
      comebacks: await optional(GameplayCatalog.Comeback),
      activityPages: await optional(GameplayCatalog.ActivityPage),
      hotItems: await optional(GameplayCatalog.Hotstore),
      heroActivities: await optional(GameplayCatalog.Heroactivity),
      heroScores: await optional(GameplayCatalog.Score),
      olympicBets: await optional(GameplayCatalog.Bet),
      specialExchanges: await optional(GameplayCatalog.Exchange),
      continuedCosts: await optional(GameplayCatalog.ContinuedCost),
      fragments: await optional(GameplayCatalog.Fragment),
      recallTasks: await optional(GameplayCatalog.RecallQuest),
      recallActivities: await optional(GameplayCatalog.RecallActivity),
      regionalRecalls: await optional(GameplayCatalog.Recall),
      vipBoxes: await optional(GameplayCatalog.BoxVip),
      targetTasks: await optional(GameplayCatalog.TargetQuest),
      rechargeFeedback: rechargeFeedbackRecords.length
        ? indexRules(rechargeFeedbackRecords, GameplayCatalog.DailyRecharge)
        : new Map<string, Rule>(),
      eggs: await optional(GameplayCatalog.Egg),
      goldenEggs: await optional(GameplayCatalog.GoldenEgg),
      goldenEggSteps: await optional(GameplayCatalog.GoldenEggStep),
      normalRechargeThresholds: await optional(GameplayCatalog.Heap),
      rechargeThresholds: await optional(GameplayCatalog.NewsHeap),
      ordinaryBoxes: await optional(GameplayCatalog.BoxOrdinary),
      exchangeCycles: await optional(GameplayCatalog.ExchangeCycle),
      cycleDraws: await optional(GameplayCatalog.LuckDraw),
      shippingInvestments: await optional(GameplayCatalog.GoldReward),
      dailyInvestments: await optional(GameplayCatalog.Bank),
      castleLevels: await optional(GameplayCatalog.NewsCastleLV),
      payRewards: await optional(GameplayCatalog.PayReward),
      castleExchanges: new Map([
        ...(await optional(GameplayCatalog.Exchange)),
        ...(await optional(GameplayCatalog.NewExchange)),
      ]),
      luckyDays: await optional(GameplayCatalog.LuckyDay),
      expeditionStages: await optional(GameplayCatalog.NewWkReward),
      expeditionScores: await optional(GameplayCatalog.NewWkScore),
      expeditionRewards: await optional(GameplayCatalog.NewWkPersonReward),
      campaignRules,
      campaignVariables,
      anniversaryWeeks: await optional(GameplayCatalog.Catalog3thAnniversaryControl),
      anniversaryTasks: await optional(GameplayCatalog.Catalog3thAnniversary),
      lotteries: await optional(GameplayCatalog.Lottery),
      civilizationFortress: await optional(GameplayCatalog.CivilizationFortress),
      totems: await optional(GameplayCatalog.Totem),
      dragonTravel: await optional(GameplayCatalog.DragonTravel),
      dragonSkillExp: await optional(GameplayCatalog.DragonSkillExp),
      dragonTalent: await optional(GameplayCatalog.DragonTalent),
      dragonTalentExp: await optional(GameplayCatalog.DragonTalentExp),
      dragonTower: await optional(GameplayCatalog.DragonTowerLayer),
      dragonTowerBuffs: await optional(GameplayCatalog.DragonTowerBuff),
      dragonTowerMonsters: await optional(GameplayCatalog.DragonTowerMonster),
    },
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
