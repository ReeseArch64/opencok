import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { databaseNames, readLegacy, splitDefinitions, tableSql, type LegacyTable } from "./legacy-sql";

const js = JSON.stringify;
const quoted = "'(?:[^'\\\\]|\\\\.|'')*'";
const defaultPattern = new RegExp(`\\bDEFAULT\\s+(${quoted}|[^\\s]+)`, "i");
const exportName = (name: string) => name === "package" ? "packageTable" : name;

function identifiers(input: string): string[] {
  return [...input.matchAll(/`([^`]+)`/g)].map((match) => match[1]!);
}

export function renderSchema(tables: LegacyTable[]): string {
  const imports = new Set(["mysqlTable"]);
  let usesSql = false;
  let usesBinary = false;
  const declarations = tables.map((table) => {
    const definitions = splitDefinitions(table.body);
    const primary = definitions.find((part) => /^PRIMARY KEY/i.test(part));
    const primaryColumns = primary ? identifiers(primary) : [];
    const columns: string[] = [];
    const constraints: string[] = [];
    const columnRef = (name: string) => `table[${js(name)}]`;
    for (const definition of definitions) {
      if (definition.startsWith("`")) {
        const match = definition.match(/^`([^`]+)`\s+(\w+)(?:\((\d+)(?:,\s*(\d+))?\))?(\s+unsigned)?\s*([\s\S]*)$/i);
        if (!match) throw new Error(`Unsupported column in ${table.name}`);
        const [, name, sqlType, first, second, unsigned, suffix = ""] = match;
        const type = sqlType!.toLowerCase();
        let builder = type;
        const config: Record<string, string | number | boolean> = {};
        switch (type) {
          case "int": case "tinyint": case "smallint":
            if (unsigned) config.unsigned = true;
            break;
          case "bigint":
            config.mode = "bigint";
            if (unsigned) config.unsigned = true;
            break;
          case "varchar": case "char":
            if (!first) throw new Error(`Missing string length in ${table.name}`);
            config.length = Number(first);
            break;
          case "float": case "double": case "decimal":
            if (first) config.precision = Number(first);
            if (second) config.scale = Number(second);
            if (unsigned) config.unsigned = true;
            break;
          case "date": case "datetime": case "timestamp":
            config.mode = "string";
            if (first) config.fsp = Number(first);
            break;
          case "text": case "mediumtext": case "longtext": break;
          case "blob": case "mediumblob": case "longblob": case "binary": case "varbinary":
            builder = "binaryData";
            config.type = type + (first ? `(${first})` : "");
            usesBinary = true;
            break;
          default: throw new Error(`Unsupported column type in ${table.name}.${name}`);
        }
        if (builder !== "binaryData") imports.add(builder);
        let expression = `${builder}(${js(name)}${Object.keys(config).length ? `, ${js(config)}` : ""})`;
        if (/\bNOT NULL\b/i.test(suffix) || primaryColumns.includes(name!)) expression += ".notNull()";
        if (/\bAUTO_INCREMENT\b/i.test(suffix)) expression += ".autoincrement()";
        const value = suffix.match(defaultPattern)?.[1];
        if (value) {
          usesSql = true;
          expression += `.default(sql.raw(${js(value)}))`;
        }
        if (/ON UPDATE current_timestamp\(\)/i.test(suffix)) expression += ".onUpdateNow()";
        const remaining = suffix
          .replace(defaultPattern, "")
          .replace(/\b(?:NOT NULL|NULL|AUTO_INCREMENT|CHARACTER SET \w+|COLLATE \w+|ON UPDATE current_timestamp\(\))/gi, "")
          .replace(new RegExp(`COMMENT\\s+${quoted}`, "i"), "").trim();
        if (remaining) throw new Error(`Unsupported column attributes in ${table.name}.${name}`);
        columns.push(`  ${js(name)}: ${expression},`);
      } else if (/^PRIMARY KEY/i.test(definition)) {
        imports.add("primaryKey");
        constraints.push(`primaryKey({ columns: [${primaryColumns.map(columnRef).join(", ")}] })`);
      } else if (/^(?:UNIQUE )?KEY/i.test(definition)) {
        const match = definition.match(/^(UNIQUE )?KEY\s+`([^`]+)`\s*\(([\s\S]*)\)(?: USING (BTREE|HASH))?$/i);
        if (!match) throw new Error(`Unsupported index in ${table.name}`);
        const builder = match[1] ? "uniqueIndex" : "index";
        imports.add(builder);
        const fields = splitDefinitions(match[3]!).map((part) => {
          const field = part.match(/^`([^`]+)`(?:\((\d+)\))?$/);
          if (!field) throw new Error(`Unsupported index field in ${table.name}`);
          if (field[2]) {
            usesSql = true;
            return `sql.raw(${js(part)})`;
          }
          return columnRef(field[1]!);
        });
        constraints.push(`${builder}(${js(match[2])}).on(${fields.join(", ")})${match[4] ? `.using(${js(match[4].toLowerCase())})` : ""}`);
      } else if (/^CONSTRAINT/i.test(definition)) {
        const match = definition.match(/^CONSTRAINT `([^`]+)` FOREIGN KEY \(([^)]+)\) REFERENCES `([^`]+)` \(([^)]+)\)(.*)$/i);
        if (!match) throw new Error(`Unsupported foreign key in ${table.name}`);
        imports.add("foreignKey");
        let expression = `foreignKey({ name: ${js(match[1])}, columns: [${identifiers(match[2]!).map(columnRef).join(", ")}], foreignColumns: [${identifiers(match[4]!).map((name) => `${exportName(match[3]!)}[${js(name)}]`).join(", ")}] })`;
        for (const action of ["DELETE", "UPDATE"]) {
          const value = match[5]!.match(new RegExp(`ON ${action} (CASCADE|RESTRICT|NO ACTION|SET NULL|SET DEFAULT)`, "i"))?.[1];
          if (value) expression += `.on${action === "DELETE" ? "Delete" : "Update"}(${js(value.toLowerCase())})`;
        }
        constraints.push(expression);
      } else throw new Error(`Unsupported table definition in ${table.name}`);
    }
    const parameter = constraints.some((s) => s.includes("table[")) ? "table" : "_table";
    return `export const ${exportName(table.name)} = mysqlTable(${js(table.name)}, {\n${columns.join("\n")}\n}${constraints.length ? `, (${parameter}) => [\n${constraints.map((s) => `  ${s},`).join("\n")}\n]` : ""});`;
  });
  return [
    "// Generated by scripts/generate.ts from authorized local DDL; no rows or stored programs.",
    "// MariaDB-only attributes are preserved in migrations/<database>/0000_legacy.sql.",
    usesSql ? 'import { sql } from "drizzle-orm";' : "",
    `import { ${[...imports].sort().join(", ")} } from "drizzle-orm/mysql-core";`,
    usesBinary ? 'import { binaryData } from "../binary";' : "",
    "", ...declarations,
  ].filter((line) => line !== "").join("\n\n") + "\n";
}

export async function generate(directory: string, output: string, check = false) {
  const legacy = await readLegacy(directory);
  const files = new Map<string, string>();
  for (const database of databaseNames) {
    const tables = legacy.tables.filter((table) => table.database === database);
    files.set(`src/schema/${database}.ts`, renderSchema(tables));
    files.set(`migrations/${database}/0000_legacy.sql`, [
      "-- Generated schema-only baseline. Original ROW_FORMAT=COMPACT becomes DYNAMIC, as in the legacy importer.\nSET NAMES utf8mb4;",
      ...tables.map(tableSql),
    ].join("\n--> statement-breakpoint\n") + "\n");
    files.set(`migrations/${database}/meta/_journal.json`, js({
      version: "7", dialect: "mysql", entries: [{ idx: 0, version: "5", when: 1792713600000, tag: "0000_legacy", breakpoints: true }],
    }, null, 2) + "\n");
  }
  files.set("inventory.json", js({
    formatVersion: 1,
    mariadbVersion: "10.4.33",
    rowFormatPolicy: "COMPACT -> DYNAMIC (same as legacy initdb/10-import.sh)",
    databases: Object.fromEntries(databaseNames.map((db) => [db, legacy.tables.filter((t) => t.database === db).length])),
    inputs: legacy.inputs.map(({ name, sha256, statements }) => ({
      name, sha256, statements: statements.length,
      tables: legacy.tables.filter((table) => table.source === name).length,
      dataStatements: statements.filter((s) => /^(INSERT|UPDATE|DELETE)\b/i.test(s)).length,
    })),
    objects: legacy.objects,
    likeTables: legacy.tables.filter((table) => table.like).map(({ database, name, like, source }) => ({ database, name, like, source })),
  }, null, 2) + "\n");
  // Parse everything before writing any generated file.
  for (const [name, content] of files) {
    const path = join(output, name);
    if (check) {
      if (await readFile(path, "utf8") !== content) throw new Error(`Generated file differs: ${name}`);
    } else {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content);
    }
  }
  return legacy.tables.length;
}

if (import.meta.main) {
  const directory = process.env.LEGACY_SQL_DIR;
  if (!directory) throw new Error("Set LEGACY_SQL_DIR to the authorized local deploy/database directory");
  const count = await generate(directory, join(import.meta.dir, ".."), process.argv.includes("--check"));
  console.log(`${process.argv.includes("--check") ? "Verified" : "Generated"} ${count} legacy tables across four databases`);
}
