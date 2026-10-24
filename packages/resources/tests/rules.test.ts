import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadRules, parseRules } from "../src/rules.ts";

const records =
  '<database><ItemSpec id="100100" level="0"/><ItemSpec id="100101" level="1"/></database>';

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
    expect(Object.values(rules.power).every((catalog) => catalog.size === 0)).toBe(true);
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
    expect(Object.keys(power)).toHaveLength(30);
    expect(Object.values(power).every((catalog) => catalog.get("001")?.power === "007")).toBe(true);
    for (const name of ["general_sale", "pay_servercontrol", "kingdomskill", "fb_share"])
      await writeFile(
        join(directory, `${name}.xml`),
        '<database><Group id="synthetic"><ItemSpec id="001" value="007"/></Group></database>',
      );
    const catalogs = (await loadRules(directory)).configuration;
    expect(catalogs.generalSales?.get("001")?.value).toBe("007");
    expect(catalogs.payControl?.get("001")?.value).toBe("007");
    expect(catalogs.kingdomSkills?.get("001")?.value).toBe("007");
    expect(catalogs.facebookShare?.get("001")?.value).toBe("007");
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
