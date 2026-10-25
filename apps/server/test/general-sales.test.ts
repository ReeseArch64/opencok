import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dataConfig } from "@opencok/mappings/bootstrap";
import { decode, encode, fields, sfs } from "@opencok/messages/sfs";
import { loadRules } from "@opencok/resources/rules";
import { Rules, type Rule } from "@opencok/rules/game";
import { dataConfigItems } from "./fixtures/data-config.ts";

const catalog = () => new Rules(new Map(), new Map(), new Map(), new Map(), dataConfigItems());
const project = (rules: Rules) =>
  fields(fields(decode(encode(dataConfig(rules, { now: 1000 }))).dataConfig).general_buy);

test("general-sale metadata preserves ordered declarations, final duplicate values and literal strings", () => {
  const rules = catalog();
  const records: Rule[] = [
    { id: "same", limit: "old" },
    { id: "", limit: "" },
    { id: " ", limit: " 003 " },
    { id: "same", limit: "not-a-number", hidden: "not-exposed" },
    { id: "__proto__", limit: "literal-key" },
    { id: "constructor", limit: "another-key" },
  ];
  const before = structuredClone(records);
  rules.configuration.generalSaleRecords = records;
  rules.configuration.generalSales = new Map([["same", { id: "same", limit: "indexed-decoy" }]]);
  const result = project(rules);
  expect(Object.keys(result)).toHaveLength(5);
  expect(result.same).toEqual(sfs.string("not-a-number"));
  expect(result[""]).toEqual(sfs.string(""));
  expect(result[" "]).toEqual(sfs.string(" 003 "));
  expect(Object.hasOwn(result, "__proto__")).toBe(true);
  expect(result.__proto__).toEqual(sfs.string("literal-key"));
  expect(Object.entries(result).find(([key]) => key === "constructor")?.[1]).toEqual(
    sfs.string("another-key"),
  );
  expect(result.hidden).toBeUndefined();
  expect(records).toEqual(before);
});

test("general-sale invalid declarations fail even when the final index would hide them", () => {
  const rules = catalog();
  const invalid: Rule[] = [{ limit: "1" }, { id: "same" }, { id: "x".repeat(256), limit: "1" }];
  for (const first of invalid) {
    rules.configuration.generalSaleRecords = [first, { id: "same", limit: "valid" }];
    rules.configuration.generalSales = new Map([["same", { id: "same", limit: "valid" }]]);
    expect(() => project(rules)).toThrow();
  }
  const maximum = "x".repeat(255);
  rules.configuration.generalSaleRecords = [{ id: maximum, limit: "1" }];
  expect(project(rules)[maximum]).toEqual(sfs.string("1"));
  rules.configuration.generalSaleRecords = [
    { id: "same", limit: "x".repeat(40000) },
    { id: "same", limit: "final" },
  ];
  expect(project(rules).same).toEqual(sfs.string("final"));
});

test("an explicit empty sale declaration list wins over an index while direct constructed indexes remain supported", () => {
  const rules = catalog();
  expect(project(rules)).toEqual({});
  rules.configuration.generalSales = new Map([["one", { id: "one", limit: "003" }]]);
  expect(project(rules).one).toEqual(sfs.string("003"));
  rules.configuration.generalSaleRecords = [];
  expect(project(rules)).toEqual({});
});

test("synthetic XML sale declarations reach configuration without flattening duplicates or omitted attributes", async () => {
  const directory = await mkdtemp(join(tmpdir(), "opencok-general-sale-"));
  try {
    for (const name of ["building", "role", "position"])
      await writeFile(
        join(directory, `${name}.xml`),
        name === "building"
          ? '<database><ItemSpec id="400001" level="1"/></database>'
          : '<database><ItemSpec id="synthetic"/></database>',
      );
    const items = [...dataConfigItems().values()]
      .map(
        (rule) =>
          `<ItemSpec ${Object.entries(rule)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")}/>`,
      )
      .join("");
    await writeFile(
      join(directory, "item.xml"),
      `<database><Group id="data_config">${items}</Group></database>`,
    );
    const absent = await loadRules(directory);
    expect(absent.configuration.generalSaleRecords).toEqual([]);
    expect(project(absent)).toEqual({});
    await writeFile(
      join(directory, "general_sale.xml"),
      '<database><ItemSpec id="ignored-root"/><Group id="a"><ItemSpec id="same" limit="001"/><ItemSpec id="" limit=""/></Group><Group id="a"><ItemSpec id="same" limit=" 009 "/></Group></database>',
    );
    const rules = await loadRules(directory);
    expect(rules.configuration.generalSaleRecords).toEqual([
      { id: "same", limit: "001" },
      { id: "", limit: "" },
      { id: "same", limit: " 009 " },
    ]);
    expect(rules.configuration.generalSales?.get("same")?.limit).toBe(" 009 ");
    expect(rules.configuration.generalSales?.has("ignored-root")).toBe(false);
    expect(project(rules)).toEqual({ same: sfs.string(" 009 "), "": sfs.string("") });
    await writeFile(
      join(directory, "general_sale.xml"),
      '<database><ItemSpec id="same"/><ItemSpec id="same" limit="valid"/></database>',
    );
    const malformed = await loadRules(directory);
    expect(malformed.configuration.generalSales?.get("same")?.limit).toBe("valid");
    expect(() => project(malformed)).toThrow();
    await writeFile(join(directory, "general_sale.xml"), "<database/>");
    expect(project(await loadRules(directory))).toEqual({});
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
