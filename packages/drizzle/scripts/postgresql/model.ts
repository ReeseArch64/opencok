import { readFile } from "node:fs/promises";
import { databaseNames, sha256, splitDefinitions, splitSql } from "../legacy-sql";
import type { ColumnMapping, IndexMapping, MigrationManifest, TableMapping } from "../../src/postgresql/model";
import inventory from "../../inventory.json";

export const ident = (value: string) => {
  if (!value || Buffer.byteLength(value) > 63 || value.includes("\0")) throw new Error("Invalid PostgreSQL identifier");
  return `"${value.replaceAll('"', '""')}"`;
};
export const literal = (value: string) => {
  if (value.includes("\0")) throw new Error("NUL in SQL literal requires an explicit mapping");
  return `'${value.replaceAll("'", "''")}'`;
};
export function objectName(table: string, original: string) {
  const value = `${table}_${original}`;
  return Buffer.byteLength(value) <= 63 ? value : `${value.slice(0, 48)}_${sha256(value).slice(0, 12)}`;
}
export function mysqlLiteral(value: string) {
  if (!value.startsWith("'") || !value.endsWith("'")) throw new Error("Expected a quoted SQL literal");
  const escapes: Record<string, string> = { "0": "\0", n: "\n", r: "\r", t: "\t", b: "\b", Z: "\x1a" };
  return value.slice(1, -1).replace(/''|\\(.)/gs, (match, escaped?: string) => match === "''" ? "'" : escapes[escaped!] ?? escaped!);
}
const defaultPattern = /\bDEFAULT\s+('(?:[^'\\]|\\.|'')*'|[^\s]+)/i;
const names = (value: string) => [...value.matchAll(/`([^`]+)`/g)].map((match) => match[1]!);
export function collationName(source: string) {
  if (source.endsWith("_bin")) return "C";
  if (["utf8_general_ci", "utf8_unicode_ci", "utf8mb4_general_ci", "utf8mb4_unicode_ci", "latin1_general_ci"].includes(source)) return "legacy_meta.ci";
  if (source === "latin1_swedish_ci") return "legacy_meta.sv_ci";
  throw new Error(`Unmapped collation ${source}`);
}
export const collationSql = (value: string) => value === "C" ? '"C"' : value.split(".").map(ident).join(".");
export function keyExpression(column: ColumnMapping, prefix: number | null) {
  let expression = ident(column.name);
  if (prefix !== null) expression = column.adapter === "bytes"
    ? `substring(${expression} from 1 for ${prefix})` : `left(${expression}, ${prefix})`;
  if (column.adapter === "text") expression = `rtrim(${expression}, ' ') COLLATE ${collationSql(column.targetCollation!)}`;
  return expression;
}

function columnMapping(definition: string, table: TableMapping, primary: string[]): ColumnMapping {
  const match = definition.match(/^`([^`]+)`\s+(\w+)(?:\((\d+)(?:,\s*(\d+))?\))?(\s+unsigned)?\s*([\s\S]*)$/i);
  if (!match) throw new Error(`Unsupported column in ${table.id}`);
  const [, name, rawType, size, scale, unsigned, suffix = ""] = match;
  ident(name!);
  const type = rawType!.toLowerCase();
  const sourceType = `${type}${size && !["bigint", "int", "smallint", "tinyint"].includes(type) ? `(${size}${scale ? `,${scale}` : ""})` : ""}${unsigned ? " unsigned" : ""}`;
  const collation = /COLLATE\s+(\w+)/i.exec(suffix)?.[1] ?? (/char|text/.test(type) ? table.sourceCollation : null);
  const charset = /CHARACTER SET\s+(\w+)/i.exec(suffix)?.[1] ?? (collation ? collation.split("_")[0]! : null);
  const result: ColumnMapping = {
    name: name!, sourceType, targetType: "", adapter: "text",
    notNull: /\bNOT NULL\b/.test(suffix) || primary.includes(name!), defaultSql: suffix.match(defaultPattern)?.[1] ?? null,
    targetDefault: null, autoIncrement: /AUTO_INCREMENT/.test(suffix), onUpdate: /ON UPDATE current_timestamp\(\)/i.test(suffix),
    charset, collation, targetCollation: collation ? collationName(collation) : null,
    comment: /COMMENT\s+('(?:[^'\\]|\\.|'')*')/i.exec(suffix)?.[1] ? mysqlLiteral(/COMMENT\s+('(?:[^'\\]|\\.|'')*')/i.exec(suffix)![1]!) : "",
    checks: [],
  };
  const check = (suffix: string, expression: string) => result.checks.push({ name: objectName(table.name, `${name}_${suffix}`), expression });
  const ref = ident(result.name);
  if (["int", "tinyint", "smallint", "bigint"].includes(type)) {
    result.adapter = type === "bigint" ? "bigint" : "number";
    result.targetType = type === "bigint" ? unsigned ? "numeric(20,0)" : "bigint"
      : type === "int" ? unsigned ? "bigint" : "integer" : "smallint";
    if (unsigned) check("range", `${ref} >= 0 AND ${ref} <= ${type === "bigint" ? "18446744073709551615" : type === "int" ? "4294967295" : type === "smallint" ? "65535" : "255"}`);
    else if (type === "tinyint") check("range", `${ref} BETWEEN -128 AND 127`);
  } else if (["float", "double", "decimal"].includes(type)) {
    result.adapter = type === "decimal" ? "decimal" : "number";
    result.targetType = size ? `numeric(${size},${scale ?? "0"})` : type === "float" ? "real" : "double precision";
  } else if (/^(?:var)?char$|text/.test(type)) {
    // varchar preserves raw trailing spaces; lookup/index helpers implement PAD SPACE.
    result.targetType = size ? `character varying(${size})` : "text";
  } else if (/blob|^(?:var)?binary$/.test(type)) {
    result.adapter = "bytes"; result.targetType = "bytea";
    if (size) check("length", `octet_length(${ref}) ${type === "binary" ? "=" : "<="} ${size}`);
    else if (type === "blob") check("length", `octet_length(${ref}) <= 65535`);
    else if (type === "mediumblob") check("length", `octet_length(${ref}) <= 16777215`);
  } else if (["date", "datetime", "timestamp"].includes(type)) {
    result.adapter = "temporal"; result.targetType = "text";
    check("temporal", `legacy_meta.valid_temporal(${ref}, ${literal(type)}, ${size ?? "0"})`);
  } else throw new Error(`Unmapped type in ${table.id}.${name}`);
  if (result.defaultSql && result.defaultSql.toLowerCase() !== "null") {
    if (/^current_timestamp\(\)$/i.test(result.defaultSql)) result.targetDefault = `legacy_meta.utc_now(${size ?? "0"})`;
    else if (result.defaultSql.startsWith("'")) result.targetDefault = literal(mysqlLiteral(result.defaultSql));
    else if (/^-?\d+(?:\.\d+)?$/.test(result.defaultSql)) result.targetDefault = result.defaultSql;
    else throw new Error(`Unmapped default in ${table.id}.${name}`);
  }
  if (result.autoIncrement && sourceType === "bigint unsigned") result.targetDefault = `legacy_meta.next_unsigned(${literal(table.id)})`;
  return result;
}

export async function buildManifest(): Promise<MigrationManifest> {
  const tables: TableMapping[] = [];
  const sourceHashes: Record<string, string> = {};
  for (const namespace of databaseNames) {
    const content = await readFile(new URL(`../../migrations/${namespace}/0000_legacy.sql`, import.meta.url), "utf8");
    sourceHashes[namespace] = sha256(content);
    for (const statement of splitSql(content.replace(/^--> statement-breakpoint$/gm, ""))) {
      if (/^SET NAMES /i.test(statement)) continue;
      const match = statement.match(/^CREATE TABLE `([^`]+)`\s*\(([\s\S]*)\)\s*(ENGINE[\s\S]*)$/i);
      if (!match) throw new Error(`Unsupported baseline statement in ${namespace}`);
      const [, name, body, options] = match;
      ident(name!);
      const table: TableMapping = { id: `${namespace}.${name}`, namespace, name: name!, role: namespace === "cokdb1" ? "realm" : "global",
        sourceEngine: /ENGINE=(\w+)/i.exec(options!)![1]!, sourceCollation: /COLLATE=(\w+)/i.exec(options!)?.[1] ??
          (!/CHARSET=/i.test(options!) && namespace === "opencok_chat" ? "utf8mb4_unicode_ci" : /CHARSET=(\w+)/i.exec(options!)?.[1] === "latin1" ? "latin1_swedish_ci" : `${/CHARSET=(\w+)/i.exec(options!)?.[1] ?? (namespace === "opencok_chat" ? "utf8mb4" : "utf8")}_general_ci`),
        initialSequence: /AUTO_INCREMENT=(\d+)/i.exec(options!)?.[1] ?? "1", columns: [], indexes: [], foreignKeys: [] };
      const definitions = splitDefinitions(body!);
      const primary = definitions.find((part) => /^PRIMARY KEY/.test(part));
      table.columns = definitions.filter((part) => part.startsWith("`")).map((definition) => columnMapping(definition, table, primary ? names(primary) : []));
      for (const definition of definitions.filter((part) => !part.startsWith("`"))) {
        const key = definition.match(/^(PRIMARY KEY|(?:UNIQUE )?KEY(?: `([^`]+)`))\s*\(([\s\S]*)\)(?: USING (BTREE|HASH))?$/i);
        if (key) {
          if (key[4] && key[4] !== "BTREE") throw new Error(`Unmapped index method in ${table.id}`);
          const kind = key[1] === "PRIMARY KEY" ? "primary" : key[1]!.startsWith("UNIQUE") ? "unique" : "index";
          const sourceName = kind === "primary" ? "PRIMARY" : key[2]!;
          const columns = splitDefinitions(key[3]!).map((part) => {
            const column = part.match(/^`([^`]+)`(?:\((\d+)\))?$/);
            if (!column) throw new Error(`Unmapped index in ${table.id}`);
            return { name: column[1]!, prefix: column[2] ? Number(column[2]) : null };
          });
          const mapped: IndexMapping = { sourceName, targetName: objectName(table.name, sourceName), kind, columns,
            expressions: columns.map((part) => kind === "primary" ? ident(part.name) : keyExpression(table.columns.find((c) => c.name === part.name)!, part.prefix)) };
          table.indexes.push(mapped);
          if (kind === "primary" && columns.some((part) => table.columns.find((c) => c.name === part.name)!.adapter === "text")) {
            table.indexes.push({ ...mapped, kind: "pad-unique", targetName: objectName(table.name, "PRIMARY_pad"),
              expressions: columns.map((part) => keyExpression(table.columns.find((c) => c.name === part.name)!, part.prefix)) });
          }
        } else {
          const fk = definition.match(/^CONSTRAINT `([^`]+)` FOREIGN KEY \(([^)]+)\) REFERENCES `([^`]+)` \(([^)]+)\)(.*)$/i);
          if (!fk) throw new Error(`Unmapped constraint in ${table.id}`);
          table.foreignKeys.push({ sourceName: fk[1]!, targetName: objectName(table.name, fk[1]!), columns: names(fk[2]!),
            targetTable: fk[3]!, targetColumns: names(fk[4]!),
            onDelete: /ON DELETE (CASCADE|RESTRICT|NO ACTION|SET NULL)/i.exec(fk[5]!)?.[1]?.toLowerCase() ?? "restrict",
            onUpdate: /ON UPDATE (CASCADE|RESTRICT|NO ACTION|SET NULL)/i.exec(fk[5]!)?.[1]?.toLowerCase() ?? "restrict" });
        }
      }
      tables.push(table);
    }
  }
  tables.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  if (tables.length !== 772 || tables.reduce((n, t) => n + t.columns.length, 0) !== 6316) throw new Error("Incomplete source inventory");
  if (new Set(tables.map((t) => t.id)).size !== tables.length) throw new Error("Duplicate source table");
  const dispositions: Record<string, string> = {
    DAILY: "TypeScript daily progression/reward use case; legacy business trigger not installed",
    kill_moster_event: "TypeScript event/progression use case; legacy business trigger not installed",
    DAilYEVENT: "TypeScript durable scheduler; legacy event not installed",
    DAILYEVENT: "TypeScript durable scheduler; legacy event not installed",
    before_insert_user: "TypeScript identity/provisioning workflow across global and realm; legacy trigger not installed",
    generatepassword: "Identity provider/TypeScript auth rewrite; legacy password generation not installed",
    Resetpassword: "Identity provider/TypeScript recovery workflow; legacy procedure not installed",
    buy: "TypeScript purchase/grant workflow with durable receipts; legacy procedure not installed",
    sendmissingitems: "TypeScript audited grant/reconciliation workflow; legacy procedure not installed",
    update_usd_after_payment: "TypeScript payment/accounting workflow; legacy trigger not installed",
  };
  return { formatVersion: 1, postgresVersion: "17.11", sourceHashes, tables,
    programs: inventory.objects.map(({ database, kind, name, sha256 }) => {
      if (!dispositions[name]) throw new Error(`Unclassified program ${name}`);
      return { database, kind, name, sha256, disposition: dispositions[name]! };
    }) };
}
