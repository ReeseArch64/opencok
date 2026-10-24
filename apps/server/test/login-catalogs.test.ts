import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { featureConfig, loginConfiguration, settingConfig } from "@opencok/dtos/bootstrap";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { loadRules } from "@opencok/resources/rules";
import { Rules, type Rule } from "@opencok/rules/game";

const context = {
  kingdomId: 1,
  uid: "synthetic",
  platform: "market_global",
  version: "12.6.0",
  now: 1000,
};
const fresh = () => new Rules(new Map(), new Map(), new Map());
const array = (value: Value) =>
  (decode(encode({ result: value })).result!.value as Value[]).map(fields);
const login = (rules: Rules) =>
  loginConfiguration(rules, { profile: {}, pushSettings: [], switches: [] }, context, false);
async function withCatalogs(run: (directory: string) => Promise<void>) {
  const directory = await mkdtemp(join(tmpdir(), "opencok-login-catalogs-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(
        join(directory, `${name}.xml`),
        '<database><ItemSpec id="synthetic"/></database>',
      );
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("settings and sharing preserve every direct declaration including duplicate, blank and missing IDs", async () => {
  await withCatalogs(async (directory) => {
    const xml =
      '<database><ItemSpec id="ignored"/><Group id="same"><ItemSpec id="repeat" value="001"/><ItemSpec value="城"/><ItemSpec id="" value=""/></Group><Group id="same"><ItemSpec id="repeat" value="002"/><Other value=" text "/><Group id="nested"><ItemSpec id="hidden"/></Group></Group></database>';
    for (const name of ["setting", "fb_share"])
      await writeFile(join(directory, `${name}.xml`), xml);
    const rules = await loadRules(directory);
    const expected: Fields[] = [
      { id: sfs.string("repeat"), value: sfs.string("001") },
      { value: sfs.string("城") },
      { id: sfs.string(""), value: sfs.string("") },
      { id: sfs.string("repeat"), value: sfs.string("002") },
      { value: sfs.string(" text ") },
      { id: sfs.string("nested") },
    ];
    expect(array(settingConfig(rules).setting!)).toEqual(expected);
    expect(array(login(rules).fbShare!)).toEqual(expected);
    expect(rules.settings.get("repeat")?.value).toBe("002");
    expect(rules.configuration.facebookShare?.get("repeat")?.value).toBe("002");
    const before = structuredClone(rules.configuration);
    settingConfig(rules);
    login(rules);
    expect(rules.configuration).toEqual(before);
  });
});

test("missing and empty loaded login catalogs produce empty arrays without falling back to indexes", async () => {
  await withCatalogs(async (directory) => {
    for (const empty of [false, true]) {
      if (empty)
        for (const name of ["setting", "fb_share", "function_on", "function_star"])
          await writeFile(join(directory, `${name}.xml`), "<database/>");
      const rules = await loadRules(directory);
      rules.settings.set("decoy", { id: "decoy" });
      rules.configuration.facebookShare!.set("decoy", { id: "decoy" });
      rules.features.set("decoy", { id: "decoy", online: "all", version: "1.0.0", pf: "all" });
      rules.stars.set("decoy", { build_id: "400000", online: "all", version: "1.0.0", star: "9" });
      expect(array(settingConfig(rules).setting!)).toEqual([]);
      expect(array(login(rules).fbShare!)).toEqual([]);
      expect(array(featureConfig(rules, context).funcOn!)).toEqual([]);
      expect(rules.maxStar("400000", 1000)).toBe(0);
    }
  });
});

test("feature announcements use only the last named group while global feature lookups keep all groups", async () => {
  await withCatalogs(async (directory) => {
    await writeFile(
      join(directory, "function_on.xml"),
      '<database><ItemSpec id="ignored"/><Group id="function_on"><ItemSpec id="replaced" pf="all" version="1.0.0" online="all"/></Group><Group id="function_on"><ItemSpec id="same" pf="" version="99" online="all"/><ItemSpec id="same" pf="ios" version="1.0.0" online="close"/></Group><Group id="other"><ItemSpec id="same" pf="other" version="1.0.0" online="all"/><ItemSpec id="private"/></Group></database>',
    );
    const rules = await loadRules(directory);
    const expected = [
      {
        funcKey: sfs.string("same"),
        pf: sfs.string(""),
        version: sfs.string("99"),
        onOff: sfs.bool(true),
      },
      {
        funcKey: sfs.string("same"),
        pf: sfs.string("ios"),
        version: sfs.string("1.0.0"),
        onOff: sfs.bool(false),
      },
    ];
    expect(array(featureConfig(rules, context).funcOn!)).toEqual(expected);
    expect(array(login(rules).funcOn!)).toEqual(expected);
    expect(rules.features.get("same")?.pf).toBe("other");
    expect(rules.features.has("replaced")).toBe(true);
    expect(rules.features.has("private")).toBe(true);
    expect(rules.features.has("ignored")).toBe(false);
    for (const xml of [
      '<database><ItemSpec id="root"/></database>',
      '<database><Group id="other"><ItemSpec id="other"/></Group></database>',
    ]) {
      await writeFile(join(directory, "function_on.xml"), xml);
      expect(array(featureConfig(await loadRules(directory), context).funcOn!)).toEqual([]);
    }
  });
});

test("feature announcements reject missing wire metadata even in closed or overwritten declarations", () => {
  const rules = fresh();
  const valid = { id: "same", pf: "", version: "", online: "close" };
  for (const key of ["id", "pf", "version"]) {
    const missing: Rule = { ...valid };
    delete missing[key];
    rules.configuration.featureRecords = [missing, valid];
    rules.features.set("same", valid);
    expect(() => featureConfig(rules, context)).toThrow();
  }
  rules.configuration.featureRecords = [{ id: "", pf: "", version: "" }];
  expect(array(featureConfig(rules, context).funcOn!)).toEqual([
    {
      funcKey: sfs.string(""),
      pf: sfs.string(""),
      version: sfs.string(""),
      onOff: sfs.bool(false),
    },
  ]);
});

test("directly constructed login catalogs retain index fallback until declaration lists are supplied", () => {
  const rules = fresh();
  rules.settings.set("a", { id: "a", value: "001" });
  rules.configuration.facebookShare = new Map([["a", { id: "a", value: "002" }]]);
  rules.features.set("a", { id: "a", pf: "all", version: "1.0.0", online: "all" });
  expect(array(settingConfig(rules).setting!)[0]?.value).toEqual(sfs.string("001"));
  expect(array(login(rules).fbShare!)[0]?.value).toEqual(sfs.string("002"));
  expect(array(featureConfig(rules, context).funcOn!)[0]?.onOff).toEqual(sfs.bool(true));
  rules.configuration.settingRecords = [];
  rules.configuration.facebookShareRecords = [];
  rules.configuration.featureRecords = [];
  expect(array(settingConfig(rules).setting!)).toEqual([]);
  expect(array(login(rules).fbShare!)).toEqual([]);
  expect(array(featureConfig(rules, context).funcOn!)).toEqual([]);
});

test("star maxima traverse duplicate declarations and preserve matching invalid-row failures", async () => {
  await withCatalogs(async (directory) => {
    await writeFile(
      join(directory, "function_star.xml"),
      '<database><Group id="a"><ItemSpec id="same" build_id="400000" version="1.0.0" online="all" star="+５"/></Group><Group id="a"><ItemSpec id="same" build_id="400000" version="1.0.0" online="all" star="2"/><ItemSpec build_id="400000" version="1.0.0" online="all" star="3"/></Group></database>',
    );
    const rules = await loadRules(directory);
    expect(rules.stars.get("same")?.star).toBe("2");
    expect(rules.maxStar("400099", 1000)).toBe(5);
    await writeFile(
      join(directory, "function_star.xml"),
      '<database><ItemSpec id="same" build_id="400000" version="1.0.0" online="all" star="bad"/><ItemSpec id="same" build_id="400000" version="1.0.0" online="all" star="2"/></database>',
    );
    const malformed = await loadRules(directory);
    expect(malformed.stars.get("same")?.star).toBe("2");
    expect(() => malformed.maxStar("400000", 1000)).toThrow();
  });
});

test("star numeric parsing follows Java Int and only evaluates matching available records", () => {
  const rules = fresh();
  const rule: Rule = { build_id: "400000", version: "1.0.0", online: "all", star: "1" };
  rules.stars.set("a", rule);
  for (const [raw, expected] of [
    ["+２", 2],
    ["-1", 0],
    ["-2147483648", 0],
    ["2147483647", 2147483647],
  ] as const) {
    rule.star = raw;
    expect(rules.maxStar("400000", 1000)).toBe(expected);
  }
  for (const raw of [undefined, "", " 2", "2 ", "1.0", "1e1", "2147483648", "-2147483649"]) {
    if (raw === undefined) delete rule.star;
    else rule.star = raw;
    expect(() => rules.maxStar("400000", 1000)).toThrow();
    expect(rules.maxStar("401000", 1000)).toBe(0);
    rule.online = "close";
    expect(rules.maxStar("400000", 1000)).toBe(0);
    rule.online = "all";
  }
  rule.star = "bad";
  rule.start = "2026-10-24-00-00";
  expect(rules.maxStar("400000", 1000)).toBe(0);
  delete rule.start;
  rule.version = "99.0.0";
  expect(rules.maxStar("400000", 1000)).toBe(0);
  rule.version = "1.0.0";
  rule.build_id = "000";
  rule.star = "1";
  expect(rules.maxStar("000099", 1000)).toBe(1);
});
