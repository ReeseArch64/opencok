import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { databaseNames, sha256 } from "../legacy-sql";
import type { ColumnMapping, DatabaseRole, TableMapping } from "../../src/postgresql/model";
import { buildManifest, collationSql, ident, literal } from "./model";
import { foundationSql } from "./foundation";
import { transferMigrationSql } from "./transfer-migration";

const js = JSON.stringify;
const exportName = (name: string) => name === "package" ? "packageTable" : name;

function columnBuilder(column: ColumnMapping, table: TableMapping, imports: Set<string>, custom: Set<string>) {
  let expression: string;
  const name = js(column.name);
  if (column.adapter === "text") {
    custom.add("legacyText"); expression = `legacyText(${name}, ${js({ sqlType: column.targetType, collation: column.targetCollation })})`;
  } else if (column.adapter === "bytes" || column.adapter === "temporal") {
    const type = column.adapter === "bytes" ? "legacyBytes" : "legacyTemporal";
    custom.add(type); expression = `${type}(${name})`;
  } else if (column.sourceType === "bigint unsigned") {
    custom.add("unsignedBigint"); expression = `unsignedBigint(${name})`;
  } else if (column.adapter === "bigint") {
    imports.add("bigint"); expression = `bigint(${name}, { mode: "bigint" })`;
  } else if (column.adapter === "decimal") {
    imports.add("numeric");
    const dimensions = column.targetType.match(/\((\d+),(\d+)\)/)!;
    expression = `numeric(${name}, { precision: ${dimensions[1]}, scale: ${dimensions[2]} })`;
  } else if (column.targetType === "integer" || column.targetType === "smallint" || column.targetType === "bigint") {
    const type = column.targetType === "integer" ? "integer" : column.targetType;
    imports.add(type); expression = `${type}(${name}${type === "bigint" ? ', { mode: "number" }' : ""})`;
  } else {
    custom.add("legacyNumber"); expression = `legacyNumber(${name}, ${js({ sqlType: column.targetType })})`;
  }
  if (column.notNull) expression += ".notNull()";
  if (column.autoIncrement && column.sourceType !== "bigint unsigned") expression += `.generatedByDefaultAsIdentity({ name: ${js(`${table.name}_${column.name}_seq`.length <= 63 ? `${table.name}_${column.name}_seq` : `seq_${sha256(`${table.id}.${column.name}`).slice(0, 40)}`)}, startWith: ${table.initialSequence} })`;
  else if (column.targetDefault !== null) expression += `.default(sql.raw(${js(column.targetDefault)}))`;
  return expression;
}

export function renderTable(table: TableMapping) {
  const imports = new Set<string>();
  const custom = new Set<string>();
  const columns = table.columns.map((column) => `  ${js(column.name)}: ${columnBuilder(column, table, imports, custom)},`);
  const extra: string[] = [];
  for (const index of table.indexes) {
    if (index.kind === "primary") {
      imports.add("primaryKey");
      extra.push(`primaryKey({ name: ${js(index.targetName)}, columns: [${index.columns.map((column) => `table[${js(column.name)}]`).join(", ")}] })`);
    } else {
      const type = index.kind === "index" ? "index" : "uniqueIndex";
      imports.add(type);
      extra.push(`${type}(${js(index.targetName)}).on(${index.expressions.map((expression) => `sql.raw(${js(expression)})`).join(", ")})`);
    }
  }
  for (const column of table.columns) for (const check of column.checks) {
    imports.add("check"); extra.push(`check(${js(check.name)}, sql.raw(${js(check.expression)}))`);
  }
  const references = new Set<string>();
  for (const key of table.foreignKeys) {
    references.add(key.targetTable); imports.add("foreignKey");
    extra.push(`foreignKey({ name: ${js(key.targetName)}, columns: [${key.columns.map((name) => `table[${js(name)}]`).join(", ")}], foreignColumns: [${key.targetColumns.map((name) => `${exportName(key.targetTable)}[${js(name)}]`).join(", ")}] }).onDelete(${js(key.onDelete)}).onUpdate(${js(key.onUpdate)})`);
  }
  const usesTable = extra.some((expression) => expression.includes("table["));
  return ["// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.",
    [...columns, ...extra].some((line) => line.includes("sql.")) ? 'import { sql } from "drizzle-orm";' : "",
    imports.size ? `import { ${[...imports].sort().join(", ")} } from "drizzle-orm/pg-core";` : "",
    custom.size ? `import { ${[...custom].sort().join(", ")} } from "../../types";` : "",
    `import { ${table.namespace} } from "../namespaces";`,
    ...[...references].map((name) => `import { ${exportName(name)} } from "./${name}";`),
    `export const ${exportName(table.name)} = ${table.namespace}.table(${js(table.name)}, {\n${columns.join("\n")}\n}${extra.length ? `, (${usesTable ? "table" : "_table"}) => [\n${extra.map((expression) => `  ${expression},`).join("\n")}\n]` : ""});`, ""].filter((line) => line !== "").join("\n") + "\n";
}

export function tableDDL(table: TableMapping): string[] {
  const qualified = `${ident(table.namespace)}.${ident(table.name)}`;
  const definitions = table.columns.map((column) => {
    let expression = `${ident(column.name)} ${column.targetType}${column.targetCollation ? ` COLLATE ${collationSql(column.targetCollation)}` : ""}`;
    if (column.autoIncrement && column.sourceType !== "bigint unsigned") expression += ` GENERATED BY DEFAULT AS IDENTITY (START WITH ${table.initialSequence})`;
    else if (column.targetDefault !== null) expression += ` DEFAULT ${column.targetDefault}`;
    if (column.notNull) expression += " NOT NULL";
    return expression;
  });
  for (const column of table.columns) for (const check of column.checks) definitions.push(`CONSTRAINT ${ident(check.name)} CHECK (${check.expression})`);
  for (const index of table.indexes.filter((index) => index.kind === "primary")) definitions.push(`CONSTRAINT ${ident(index.targetName)} PRIMARY KEY (${index.expressions.join(", ")})`);
  const result = [`CREATE TABLE ${qualified} (\n  ${definitions.join(",\n  ")}\n);`];
  for (const column of table.columns) if (column.comment) result.push(`COMMENT ON COLUMN ${qualified}.${ident(column.name)} IS ${literal(column.comment)};`);
  for (const index of table.indexes.filter((index) => index.kind !== "primary")) result.push(`CREATE ${index.kind !== "index" ? "UNIQUE " : ""}INDEX ${ident(index.targetName)} ON ${qualified} (${index.expressions.map((expression) => `(${expression})`).join(", ")});`);
  for (const column of table.columns.filter((column) => column.autoIncrement && column.sourceType === "bigint unsigned")) {
    result.push(`INSERT INTO legacy_meta.unsigned_sequences VALUES (${literal(table.id)}, ${table.initialSequence});`);
    // Keep loop variable meaningful: only the declared unsigned identity is permitted.
    if (column.name !== "sequence_id") throw new Error("Unreviewed unsigned auto-increment");
  }
  for (const column of table.columns.filter((column) => column.sourceType.startsWith("timestamp") && column.notNull)) {
    const functionName = `ts_${sha256(`${table.id}.${column.name}`).slice(0, 20)}`;
    if (column.onUpdate) {
      result.push(`CREATE TRIGGER a_reset BEFORE UPDATE ON ${qualified} FOR EACH ROW EXECUTE FUNCTION legacy_meta.reset_explicit_timestamp();`);
      result.push(`CREATE TRIGGER b_explicit BEFORE UPDATE OF ${ident(column.name)} ON ${qualified} FOR EACH ROW EXECUTE FUNCTION legacy_meta.mark_explicit_timestamp();`);
    }
    result.push(`CREATE FUNCTION legacy_meta.${ident(functionName)}() RETURNS trigger LANGUAGE plpgsql AS $body$
BEGIN
  IF NEW.${ident(column.name)} IS NULL${column.onUpdate ? ` OR (TG_OP='UPDATE' AND current_setting('legacy_meta.explicit_timestamp',true)='off' AND (to_jsonb(NEW)-${literal(column.name)}) IS DISTINCT FROM (to_jsonb(OLD)-${literal(column.name)}))` : ""} THEN
    NEW.${ident(column.name)} := legacy_meta.utc_now(0);
  END IF;
  RETURN NEW;
END $body$;`);
    result.push(`CREATE TRIGGER c_${functionName} BEFORE INSERT OR UPDATE ON ${qualified} FOR EACH ROW EXECUTE FUNCTION legacy_meta.${ident(functionName)}();`);
  }
  return result;
}

export async function generatePostgres(check = false) {
  const manifest = await buildManifest();
  const hash = sha256(js(manifest));
  const files = new Map<string, string>();
  files.set("postgresql/manifest.json", js(manifest, null, 2) + "\n");
  files.set("src/postgresql/schema/namespaces.ts", 'import { pgSchema } from "drizzle-orm/pg-core";\n' + databaseNames.map((database) => `export const ${database} = pgSchema(${js(database)});`).join("\n") + "\n");
  files.set("src/postgresql/schema/index.ts", databaseNames.map((database) => `export * as ${database} from "./${database}";`).join("\n") + "\n");
  for (const database of databaseNames) {
    const tables = manifest.tables.filter((table) => table.namespace === database);
    files.set(`src/postgresql/schema/${database}.ts`, tables.map((table) => `export { ${exportName(table.name)} } from "./${database}/${table.name}";`).join("\n") + "\n");
    for (const table of tables) files.set(`src/postgresql/schema/${database}/${table.name}.ts`, renderTable(table));
  }
  for (const role of ["global", "realm"] as DatabaseRole[]) {
    const tables = manifest.tables.filter((table) => table.role === role);
    const ddl = [foundationSql,
      ...databaseNames.filter((database) => tables.some((table) => table.namespace === database)).map((database) => `CREATE SCHEMA ${ident(database)};`),
      `INSERT INTO legacy_meta.manifest VALUES (${literal(hash)}, ${literal(role)});`,
      ...tables.flatMap(tableDDL),
      ...tables.flatMap((table) => table.foreignKeys.map((key) => `ALTER TABLE ${ident(table.namespace)}.${ident(table.name)} ADD CONSTRAINT ${ident(key.targetName)} FOREIGN KEY (${key.columns.map(ident).join(", ")}) REFERENCES ${ident(table.namespace)}.${ident(key.targetTable)} (${key.targetColumns.map(ident).join(", ")}) ON DELETE ${key.onDelete.toUpperCase()} ON UPDATE ${key.onUpdate.toUpperCase()};`)),
    ];
    files.set(`postgresql/migrations/${role}/0000_compatibility.sql`, ddl.join("\n--> statement-breakpoint\n") + "\n");
    files.set(`postgresql/migrations/${role}/0001_transfer.sql`, transferMigrationSql + "\n");
    files.set(`postgresql/migrations/${role}/meta/_journal.json`, js({ version: "7", dialect: "postgresql", entries: [
      { idx: 0, version: "7", when: 1792771200000, tag: "0000_compatibility", breakpoints: true },
      { idx: 1, version: "7", when: 1792771200001, tag: "0001_transfer", breakpoints: true },
    ] }, null, 2) + "\n");
  }
  // No private inputs, live databases or Drizzle runtime definitions are needed.
  for (const [path, content] of files) {
    const url = new URL(`../../${path}`, import.meta.url);
    if (check) {
      if (await readFile(url, "utf8") !== content) throw new Error(`Generated PostgreSQL artifact differs: ${path}`);
    } else { await mkdir(dirname(url.pathname), { recursive: true }); await writeFile(url, content); }
  }
  if (check) for (const namespace of databaseNames) {
    const actual = (await readdir(new URL(`../../src/postgresql/schema/${namespace}/`, import.meta.url))).sort();
    const expected = manifest.tables.filter((table) => table.namespace === namespace).map((table) => `${table.name}.ts`).sort();
    if (js(actual) !== js(expected)) throw new Error(`Unexpected PostgreSQL modules in ${namespace}`);
  }
  return manifest;
}

if (import.meta.main) {
  const manifest = await generatePostgres(process.argv.includes("--check"));
  console.log(`${process.argv.includes("--check") ? "Verified" : "Generated"} ${manifest.tables.length} PostgreSQL tables / 6316 fields`);
}
