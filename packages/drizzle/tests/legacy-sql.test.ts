import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderSchema } from "../scripts/generate";
import { inputNames, readLegacy, splitDefinitions, splitSql, tableSql, type LegacyTable } from "../scripts/legacy-sql";

describe("legacy SQL reader", () => {
  test("keeps quoted separators, escapes, doubled quotes and executable comments", () => {
    expect(splitSql("-- ignored\n/*!40101 SET NAMES utf8 */; INSERT INTO `demo` VALUES ('a;b', 'it''s', 'a\\\'b', '/* literal */'); # ignored\n")).toEqual([
      "/*!40101 SET NAMES utf8 */", "INSERT INTO `demo` VALUES ('a;b', 'it''s', 'a\\\'b', '/* literal */')",
    ]);
  });

  test("keeps stored-program delimiters inside quotes and bodies", () => {
    expect(splitSql("DELIMITER ;;\nCREATE PROCEDURE demo() BEGIN SELECT ';;'; SELECT 1; END;;\nDELIMITER ;\nSELECT 2;")).toEqual([
      "CREATE PROCEDURE demo() BEGIN SELECT ';;'; SELECT 1; END", "SELECT 2",
    ]);
    expect(splitSql("DELIMITER ;;\r\nCREATE PROCEDURE demo()\r\nBEGIN SELECT 1; END;;\r\nDELIMITER ;\r\n")).toEqual([
      "CREATE PROCEDURE demo()\nBEGIN SELECT 1; END",
    ]);
  });

  test("rejects incomplete statements instead of silently dropping them", () => {
    for (const value of ["SELECT 'bad;", "SELECT 1", "/* missing", "SELECT 'bad\\"]) {
      expect(() => splitSql(value)).toThrow();
    }
  });

  test("splits definitions only at unquoted top-level commas", () => {
    expect(splitDefinitions("`amount` decimal(10,2) DEFAULT '1,2', PRIMARY KEY (`a`,`b`), KEY `prefix` (`a`(20))")).toEqual([
      "`amount` decimal(10,2) DEFAULT '1,2'", "PRIMARY KEY (`a`,`b`)", "KEY `prefix` (`a`(20))",
    ]);
    expect(() => splitDefinitions("`amount` decimal(10,2")).toThrow();
  });

  test("requires every input and rejects unrecognized input files/statements", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-drizzle-reader-"));
    try {
      await expect(readLegacy(directory)).rejects.toThrow("seven documented");
      for (const name of inputNames) await writeFile(join(directory, name), name.includes("-") ? "USE cokdb1;" : "");
      expect((await readLegacy(directory)).tables).toHaveLength(0);
      await writeFile(join(directory, "unexpected.sql"), "SELECT 1;");
      await expect(readLegacy(directory)).rejects.toThrow("seven documented");
      await rm(join(directory, "unexpected.sql"));
      await writeFile(join(directory, "cokdb1.sql"), "SELECT 'synthetic secret';");
      await expect(readLegacy(directory)).rejects.toThrow("Unsupported statement in cokdb1.sql");
    } finally { await rm(directory, { recursive: true }); }
  });

  test("resolves LIKE across patches, qualifies object names and preserves source files", async () => {
    const directory = await mkdtemp(join(tmpdir(), "opencok-drizzle-like-"));
    try {
      for (const name of inputNames) await writeFile(join(directory, name), name.includes("-") ? "USE cokdb1;" : "");
      const original = "CREATE TABLE `sample` (`id` bigint(20) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB ROW_FORMAT=COMPACT;\nCREATE TRIGGER `cokdb1`.`sample_trigger` BEFORE INSERT ON `sample` FOR EACH ROW SET NEW.id = 1;";
      await writeFile(join(directory, "cokdb1.sql"), original);
      await writeFile(join(directory, "2026-10-action-cost-record.sql"), "USE cokdb1; CREATE TABLE IF NOT EXISTS `sample_copy` LIKE `sample`;");
      const legacy = await readLegacy(directory);
      expect(legacy.tables[1]?.like).toBe("sample");
      expect(legacy.tables[1]?.body).toBe(legacy.tables[0]?.body);
      expect(legacy.objects[0]?.name).toBe("sample_trigger");
      expect(tableSql(legacy.tables[1]!)).toContain("ROW_FORMAT=DYNAMIC");
      expect(await readFile(join(directory, "cokdb1.sql"), "utf8")).toBe(original);
      await writeFile(join(directory, "2026-10-action-cost-record.sql"), "USE cokdb1; CREATE TABLE `sample_copy` LIKE `missing`;");
      await expect(readLegacy(directory)).rejects.toThrow("Unresolved LIKE");
    } finally { await rm(directory, { recursive: true }); }
  });
});

const table = (body: string): LegacyTable => ({ database: "cokdb1", name: "synthetic", body, options: "ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci", source: "synthetic.sql" });

describe("Drizzle schema translation", () => {
  test("preserves exact names, integer defaults, bytes, prefix keys and nullability", () => {
    const result = renderSchema([table("`id` bigint(20) NOT NULL DEFAULT 9223372036854775807, `zh-Hans` varchar(40) DEFAULT NULL, `payload` blob, PRIMARY KEY (`id`), KEY `prefix` (`zh-Hans`(20))")]);
    expect(result).toContain('bigint("id", {"mode":"bigint"}).notNull().default(sql.raw("9223372036854775807"))');
    expect(result).toContain('"zh-Hans": varchar("zh-Hans"');
    expect(result).toContain('binaryData("payload", {"type":"blob"})');
    expect(result).toContain('index("prefix").on(sql.raw("`zh-Hans`(20)"))');
  });

  test("retains dimensions, zero dates, database ON UPDATE and composite primary keys", () => {
    const result = renderSchema([table("`value` float(11,2), `price` decimal(10,2), `day` datetime DEFAULT '0000-00-00 00:00:00', `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), PRIMARY KEY (`value`,`price`)")]);
    expect(result).toContain('float("value", {"precision":11,"scale":2}).notNull()');
    expect(result).toContain('decimal("price", {"precision":10,"scale":2}).notNull()');
    expect(result).toContain('datetime("day", {"mode":"string"})');
    expect(result).toContain(".onUpdateNow()");
    expect(result).toContain('primaryKey({ columns: [table["value"], table["price"]] })');
  });

  test("rejects unhandled SQL instead of dropping semantics", () => {
    for (const body of ["`id` uuid", "`id` int GENERATED ALWAYS AS (1)", "`id` int, CHECK (`id` > 0)"]) {
      expect(() => renderSchema([table(body)])).toThrow();
    }
  });

  test("SQL-only options remain in the executable baseline", () => {
    expect(tableSql(table("`id` int(11)"))).toBe("CREATE TABLE `synthetic` (`id` int(11)) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;");
  });

  test("snapshots the synthetic schema contract", () => {
    expect(renderSchema([table("`id` bigint(20) unsigned NOT NULL, `key` varbinary(64) NOT NULL, `price` decimal(10,2) DEFAULT 0.00, `created` datetime(3) NOT NULL, PRIMARY KEY (`id`), UNIQUE KEY `key_idx` (`key`)")])).toMatchSnapshot();
  });
});
