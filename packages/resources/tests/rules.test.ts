import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRules, parseRules } from "../src/rules.ts";

const records =
  '<database><ItemSpec id="100100" level="0"/><ItemSpec id="100101" level="1"/></database>';

test("reconnect treasure catalogs preserve declaration order and exact level strings", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-reconnect-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    expect((await loadRules(directory)).reconnect.treasures?.size).toBe(0);
    await writeFile(
      join(directory, "treasure.xml"),
      '<database><ItemSpec id="9000" lv="1" exp="03" helper="2"/><Group id="later"><ItemSpec id="8000" lv="01" exp="4" helper="3"/></Group></database>',
    );
    const catalog = (await loadRules(directory)).reconnect.treasures!;
    expect([...catalog.keys()]).toEqual(["9000", "8000"]);
    expect(catalog.get("9000")?.exp).toBe("03");
    expect(catalog.get("8000")?.lv).toBe("01");
    await writeFile(
      join(directory, "treasure.xml"),
      '<database><ItemSpec id="9000"/><ItemSpec id="9000"/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("reward catalogs retain the final duplicate definition required by the reference resources", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-reward-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    expect((await loadRules(directory)).reconnect.rewards?.size).toBe(0);
    await writeFile(
      join(directory, "reward.xml"),
      '<database><ItemSpec id="synthetic" gold="1"/><ItemSpec id="synthetic" gold="007" item="200100;200200" rate="1;2" num="3;4" circle="2"/></database>',
    );
    const reward = (await loadRules(directory)).reconnect.rewards!;
    expect(reward.size).toBe(1);
    expect(reward.get("synthetic")).toEqual({
      id: "synthetic",
      gold: "007",
      item: "200100;200200",
      rate: "1;2",
      num: "3;4",
      circle: "2",
    });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("profile catalogs count every achievement record and keep military/server lookups optional", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-profile-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const missing = (await loadRules(directory)).profile;
    expect(missing.achievementCount).toBe(0);
    expect(missing.militaryRanks?.size).toBe(0);
    expect(missing.servers?.size).toBe(0);
    await writeFile(
      join(directory, "achievement.xml"),
      '<database><ItemSpec id="1"/><Group id="a"><ItemSpec id="1"/><Group id="b"><ItemSpec id="2"/></Group></Group></database>',
    );
    await writeFile(
      join(directory, "wr_rank.xml"),
      '<database><ItemSpec id="501" level="8"/></database>',
    );
    await writeFile(
      join(directory, "servers.xml"),
      '<database><ItemSpec id="2" name="Synthetic Kingdom"/></database>',
    );
    const profile = (await loadRules(directory)).profile;
    expect(profile.achievementCount).toBe(3);
    expect(profile.militaryRanks?.get("501")?.level).toBe("8");
    expect(profile.servers?.get("2")?.name).toBe("Synthetic Kingdom");
    await writeFile(join(directory, "achievement.xml"), "<database/>");
    expect((await loadRules(directory)).profile.achievementCount).toBe(0);
    for (const invalid of [
      "<wrong/>",
      "<database>",
      "<!DOCTYPE database><database/>",
      '<database><ItemSpec id="1"><value><nested/></value></ItemSpec></database>',
    ]) {
      await writeFile(join(directory, "achievement.xml"), invalid);
      await expect(loadRules(directory)).rejects.toThrow();
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("resource loading preserves optional files, duplicate policy and realm-specific rules", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const rules = await loadRules(directory, 2);
    expect(rules.kingdomId).toBe(2);
    expect(rules.role(1).level).toBe("1");
    expect(rules.stars.size).toBe(0);
    expect(rules.goods.size).toBe(0);
    expect(rules.settings.size).toBe(0);
    expect(rules.configuration.generalSales?.size).toBe(0);
    expect(rules.configuration.payControl?.size).toBe(0);
    expect(rules.configuration.kingdomSkills?.size).toBe(0);
    expect(rules.configuration.facebookShare?.size).toBe(0);
    expect(rules.configuration.serverConfig?.size).toBe(0);
    const { prestigeLevelRecords: emptyPrestige, ...emptyPower } = rules.power;
    expect(emptyPrestige).toEqual([]);
    expect(Object.values(emptyPower).every((catalog) => catalog.size === 0)).toBe(true);
    for (const name of [
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
      "svip",
      "alliancescience",
      "reputation_level",
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
    ])
      await writeFile(
        join(directory, `${name}.xml`),
        '<database><ItemSpec id="001" power="007"/></database>',
      );
    await writeFile(
      join(directory, "vip.xml"),
      '<database><Group id="vip"><ItemSpec id="001" power="007"/></Group></database>',
    );
    const power = (await loadRules(directory)).power;
    const { prestigeLevelRecords, ...indexedPower } = power;
    expect(Object.keys(indexedPower)).toHaveLength(34);
    expect(prestigeLevelRecords).toEqual([{ id: "001", power: "007" }]);
    expect(
      Object.values(indexedPower).every((catalog) => catalog.get("001")?.power === "007"),
    ).toBe(true);
    for (const name of [
      "general_sale",
      "pay_servercontrol",
      "kingdomskill",
      "fb_share",
      "servers_config",
    ])
      await writeFile(
        join(directory, `${name}.xml`),
        '<database><Group id="synthetic"><ItemSpec id="001" value="007"/></Group></database>',
      );
    const catalogs = (await loadRules(directory)).configuration;
    expect(catalogs.generalSales?.get("001")?.value).toBe("007");
    expect(catalogs.payControl?.get("001")?.value).toBe("007");
    expect(catalogs.kingdomSkills?.get("001")?.value).toBe("007");
    expect(catalogs.facebookShare?.get("001")?.value).toBe("007");
    expect(catalogs.serverConfig?.get("001")?.value).toBe("007");
    await writeFile(
      join(directory, "setting.xml"),
      '<database><Group id="settings"><ItemSpec id="001" value="0007"/></Group></database>',
    );
    expect((await loadRules(directory)).settings.get("001")?.value).toBe("0007");
    await writeFile(
      join(directory, "goods.xml"),
      '<database><ItemSpec id="1" value="old"/><ItemSpec id="1" value="new"/></database>',
    );
    expect((await loadRules(directory)).goods.get("1")?.value).toBe("new");
    await writeFile(
      join(directory, "building.xml"),
      '<database><ItemSpec id="1"/><ItemSpec id="1"/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
    await writeFile(join(directory, "building.xml"), "<!DOCTYPE database><database/>");
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource XML");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("XML records support singleton, multiple groups, and nested groups with exact strings", () => {
  expect(
    parseRules('<database><ItemSpec id="001" value="0007"/></database>', "setting").get("001"),
  ).toEqual({ id: "001", value: "0007" });
  const rules = parseRules(
    '<database><Group id="one"><ItemSpec id="001" value="  text  "/></Group><Group id="two"><ItemSpec id="002" value="a &amp; b"/><Group id="nested"><ItemSpec id="003" value="城"/></Group></Group></database>',
    "setting",
  );
  expect([...rules.values()]).toEqual([
    { id: "001", value: "  text  " },
    { id: "002", value: "a & b" },
    { id: "003", value: "城" },
  ]);
});

test("duplicates remain explicit across groups and malformed resource records are rejected", () => {
  const duplicate =
    '<database><Group id="one"><ItemSpec id="a" value="1"/></Group><Group id="two"><ItemSpec id="a" value="2"/></Group></database>';
  expect(() => parseRules(duplicate, "setting")).toThrow("Invalid gameplay resource ID");
  expect(parseRules(duplicate, "function_on").get("a")?.value).toBe("2");
  expect(parseRules(duplicate, "goods").get("a")?.value).toBe("2");
  for (const name of ["science", "equipment", "status", "dragon_skill", "activity_panel"])
    expect(parseRules(duplicate, name).get("a")?.value).toBe("2");
  expect(
    parseRules('<database><ItemSpec value="ignored"/><ItemSpec id="a"/></database>', "goods").size,
  ).toBe(1);
  for (const xml of [
    '<database><ItemSpec value="missing ID"/></database>',
    '<database><ItemSpec id=" "/></database>',
    '<database><ItemSpec id="a"><nested value="invalid"/></ItemSpec></database>',
    "<database/>",
    '<other><ItemSpec id="a"/></other>',
    "<database>",
    '<!DOCTYPE database [<!ENTITY secret "private">]><database><ItemSpec id="a"/></database>',
  ])
    expect(() => parseRules(xml, "setting")).toThrow();
});

test("VIP resources select only the named group and retain threshold declaration order", () => {
  const rules = parseRules(
    '<database><ItemSpec id="root" point="0"/><Group id="other"><ItemSpec id="decoy" point="0"/></Group><Group id="vip"><ItemSpec id="7002" point="300"/><ItemSpec id="7000" point="0"/></Group></database>',
    "vip",
  );
  expect([...rules.keys()]).toEqual(["7002", "7000"]);
  expect(rules.get("7000")?.point).toBe("0");
  expect(() =>
    parseRules('<database><Group id="other"><ItemSpec id="7000"/></Group></database>', "vip"),
  ).toThrow("Missing gameplay resource records");
});

test("mail catalogs preserve template strings and final duplicate definitions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-mail-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    expect((await loadRules(directory)).mail.size).toBe(0);
    await writeFile(
      join(directory, "mail.xml"),
      '<database><ItemSpec id="10111" message="old"/><Group id="final"><ItemSpec id="10111" type="2" title=" synthetic title " sender="synthetic" message="one\\ntwo"/></Group></database>',
    );
    const catalog = (await loadRules(directory)).mail;
    expect(catalog.size).toBe(1);
    expect(catalog.get("10111")).toEqual({
      id: "10111",
      type: "2",
      title: " synthetic title ",
      sender: "synthetic",
      message: "one\\ntwo",
    });
    await writeFile(join(directory, "mail.xml"), "<!DOCTYPE database><database/>");
    await expect(loadRules(directory)).rejects.toThrow();
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("world monster catalogs load optionally, preserve final duplicates and stay distinct from troop arms", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-world-monster-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const absent = (await loadRules(directory)).world;
    expect(absent.fieldMonsters?.size).toBe(0);
    expect(absent.armies?.size).toBe(0);
    await writeFile(
      join(directory, "field_monster.xml"),
      '<database><Group id="first"><ItemSpec id="boss" NPC="1" Gift="03"/></Group><Group id="last"><ItemSpec id="boss" NPC="0" army="a;;b"/></Group></database>',
    );
    await writeFile(
      join(directory, "army.xml"),
      '<database><ItemSpec id="a" arm="unit;1"/><ItemSpec id="a" arm="unit;+03"/><ItemSpec id="b" arm="unit;4"/></database>',
    );
    await writeFile(
      join(directory, "arms.xml"),
      '<database><ItemSpec id="a" load="99"/></database>',
    );
    const loaded = await loadRules(directory);
    expect(loaded.world.fieldMonsters!.get("boss")).toEqual({ id: "boss", NPC: "0", army: "a;;b" });
    expect(loaded.world.armies!.get("a")).toEqual({ id: "a", arm: "unit;+03" });
    expect(loaded.arms.get("a")).toEqual({ id: "a", load: "99" });
    await writeFile(join(directory, "army.xml"), '<database><ItemSpec id=""/></database>');
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("neutral resource durations load optionally and preserve final duplicate definitions and exact strings", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-neutral-resource-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    expect((await loadRules(directory)).world.neutralResources?.size).toBe(0);
    await writeFile(
      join(directory, "sp_resources.xml"),
      '<database><Group id="a"><ItemSpec id="res" gather_time="1"/></Group><Group id="b"><ItemSpec id="res" gather_time="+003"/></Group></database>',
    );
    expect((await loadRules(directory)).world.neutralResources!.get("res")).toEqual({
      id: "res",
      gather_time: "+003",
    });
    await writeFile(
      join(directory, "sp_resources.xml"),
      '<database><ItemSpec id="" gather_time="1"/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("barbarian catalogs load optionally and retain final duplicate definitions independently of formations", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-barbarian-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    expect((await loadRules(directory)).world.barbarians?.size).toBe(0);
    await writeFile(
      join(directory, "barbarion.xml"),
      '<database><Group id="a"><ItemSpec id="camp" army="first" para3="1"/></Group><Group id="b"><ItemSpec id="camp" army="formation" para3=" 0x1p2D "/></Group></database>',
    );
    const rules = await loadRules(directory);
    expect(rules.world.barbarians!.get("camp")).toEqual({
      id: "camp",
      army: "formation",
      para3: " 0x1p2D ",
    });
    expect(rules.world.armies!.size).toBe(0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("new-general catalogs are optional, preserve final definitions and stay separate from ordinary general skills", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-new-general-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const absent = (await loadRules(directory)).power;
    expect(absent.newGeneralBases?.size).toBe(0);
    expect(absent.newGeneralSkills?.size).toBe(0);
    await writeFile(
      join(directory, "general_base.xml"),
      '<database><ItemSpec id="1" base_skill="10" base_skill_2="11;10"/></database>',
    );
    await writeFile(
      join(directory, "general_skill.xml"),
      '<database><Group id="a"><ItemSpec id="10" type="1"/></Group><Group id="b"><ItemSpec id="10" type="0" para1="78;78" base=" 0x1p2F ;1" condition_type=" "/></Group></database>',
    );
    await writeFile(
      join(directory, "sk.xml"),
      '<database><ItemSpec id="10" effect="133;2"/></database>',
    );
    const rules = await loadRules(directory);
    expect(rules.power.newGeneralBases!.get("1")).toEqual({
      id: "1",
      base_skill: "10",
      base_skill_2: "11;10",
    });
    expect(rules.power.newGeneralSkills!.get("10")).toEqual({
      id: "10",
      type: "0",
      para1: "78;78",
      base: " 0x1p2F ;1",
      condition_type: " ",
    });
    expect(rules.power.generalSkills!.get("10")).toEqual({ id: "10", effect: "133;2" });
    await writeFile(join(directory, "general_skill.xml"), '<database><ItemSpec id=""/></database>');
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("new-general office and refinement catalogs load optionally with exact strings and final duplicate definitions", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-new-general-effects-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const absent = (await loadRules(directory)).power;
    expect(absent.newGeneralOffices?.size).toBe(0);
    expect(absent.newGeneralRefinement?.size).toBe(0);
    await writeFile(
      join(directory, "general_official.xml"),
      '<database><Group id="first"><ItemSpec id="office" effect="1"/></Group><Group id="last"><ItemSpec id="office" effect="78|91" unlock_person_num="1|2" pos_unlock="1;0;0"/></Group></database>',
    );
    await writeFile(
      join(directory, "general_random_effect.xml"),
      '<database><ItemSpec id="a" effect="1"/><ItemSpec id="a" effect="78;78;91"/></database>',
    );
    const rules = await loadRules(directory);
    expect(rules.power.newGeneralOffices!.get("office")).toEqual({
      id: "office",
      effect: "78|91",
      unlock_person_num: "1|2",
      pos_unlock: "1;0;0",
    });
    expect(rules.power.newGeneralRefinement!.get("a")).toEqual({ id: "a", effect: "78;78;91" });
    await writeFile(
      join(directory, "general_official.xml"),
      '<database><ItemSpec id=""/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("prestige catalogs retain every ordered definition for first-range selection alongside the final ID index", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-prestige-order-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const absent = (await loadRules(directory)).power;
    expect(absent.prestigeLevelRecords).toEqual([]);
    expect(absent.prestigeLevels?.size).toBe(0);
    await writeFile(
      join(directory, "reputation_level.xml"),
      '<database><Group id="first"><ItemSpec id="same" reputation_point="100" reputation_level="5"/></Group><Group id="second"><ItemSpec id="same" reputation_point="100" reputation_level="9"/><ItemSpec id="last" reputation_point="0;100" reputation_level="1"/></Group></database>',
    );
    const power = (await loadRules(directory)).power;
    expect(power.prestigeLevelRecords?.map((rule) => rule.reputation_level)).toEqual([
      "5",
      "9",
      "1",
    ]);
    expect(power.prestigeLevels?.get("same")?.reputation_level).toBe("9");
    await writeFile(
      join(directory, "reputation_level.xml"),
      '<database><ItemSpec id=""/></database>',
    );
    await expect(loadRules(directory)).rejects.toThrow("Invalid gameplay resource ID");
    await writeFile(join(directory, "reputation_level.xml"), "<database/>");
    await expect(loadRules(directory)).rejects.toThrow("Missing gameplay resource records");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("kingdom skill catalogs retain source order and duplicate or absent IDs independently of the final cache index", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-kingdom-skill-rules-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(join(directory, `${name}.xml`), records);
    const absent = (await loadRules(directory)).configuration;
    expect(absent.kingdomSkillRecords).toEqual([]);
    expect(absent.kingdomSkills?.size).toBe(0);
    await writeFile(
      join(directory, "kingdomskill.xml"),
      '<database><Group id="first"><ItemSpec id="same" value="1"/><ItemSpec value="missing"/></Group><Group id="second"><ItemSpec id="same" value="2"/><ItemSpec id="null" value="literal"/><ItemSpec id="" value="empty"/></Group></database>',
    );
    const catalog = (await loadRules(directory)).configuration;
    expect(catalog.kingdomSkillRecords?.map((rule) => rule.value)).toEqual([
      "1",
      "missing",
      "2",
      "literal",
      "empty",
    ]);
    expect(catalog.kingdomSkills?.get("same")?.value).toBe("2");
    expect(catalog.kingdomSkills?.get("null")?.value).toBe("literal");
    expect(catalog.kingdomSkills?.get("")?.value).toBe("empty");
    expect(catalog.kingdomSkillRecords?.[1]?.id).toBeUndefined();
    expect(
      parseRules(
        '<database><ItemSpec id="same" value="1"/><ItemSpec id="same" value="2"/></database>',
        "kingdomskill",
      ).get("same")?.value,
    ).toBe("2");
    await writeFile(join(directory, "kingdomskill.xml"), "<database/>");
    const empty = (await loadRules(directory)).configuration;
    expect(empty.kingdomSkillRecords).toEqual([]);
    expect(empty.kingdomSkills?.size).toBe(0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
