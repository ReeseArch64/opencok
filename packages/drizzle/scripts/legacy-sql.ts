import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export const databaseNames = ["cokdb1", "cokdb_global", "cokdb_pay", "opencok_chat"] as const;
export type DatabaseName = (typeof databaseNames)[number];
export const inputNames = [
  ...databaseNames.map((name) => `${name}.sql`),
  "2026-10-action-cost-record.sql",
  "2026-10-goods-cost-record.sql",
  "99-single-kingdom.sql",
];
export const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
export const quoteIdentifier = (name: string) => `\`${name.replaceAll("`", "``")}\``;

// A bounded dump reader, not a general SQL parser. Preserve executable comments,
// quoted delimiters and stored-program bodies; never evaluate input as JavaScript.
export function splitSql(input: string): string[] {
  // The legacy importer invokes mysql in text mode, which normalizes CRLF to LF.
  input = input.replaceAll("\r\n", "\n");
  const statements: string[] = [];
  let delimiter = ";";
  let buffer = "";
  let quote = "";
  for (let i = 0; i < input.length;) {
    const char = input[i]!;
    if (quote) {
      buffer += char;
      i++;
      if (char === "\\" && quote !== "`") {
        if (i >= input.length) throw new Error("Unterminated SQL escape");
        buffer += input[i++];
      } else if (char === quote) {
        if (input[i] === quote) buffer += input[i++];
        else quote = "";
      }
      continue;
    }
    if ((i === 0 || input[i - 1] === "\n") && !buffer.trim()) {
      const directive = input.slice(i).match(/^[ \t]*DELIMITER[ \t]+(\S+)[ \t]*(?:\r?\n|$)/i);
      if (directive) {
        delimiter = directive[1]!;
        i += directive[0].length;
        continue;
      }
    }
    if (input.startsWith(delimiter, i)) {
      if (buffer.trim()) statements.push(buffer.trim());
      buffer = "";
      i += delimiter.length;
    } else if (input.startsWith("/*", i)) {
      const end = input.indexOf("*/", i + 2);
      if (end < 0) throw new Error("Unterminated SQL comment");
      buffer += input[i + 2] === "!" ? input.slice(i, end + 2) : " ";
      i = end + 2;
    } else if (char === "#" || (input.startsWith("--", i) && /\s/.test(input[i + 2] ?? ""))) {
      const end = input.indexOf("\n", i);
      i = end < 0 ? input.length : end;
      buffer += " ";
    } else {
      if (char === "'" || char === '"' || char === "`") quote = char;
      buffer += char;
      i++;
    }
  }
  if (quote || buffer.trim()) throw new Error("Unterminated SQL statement");
  return statements;
}

export function splitDefinitions(body: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let depth = 0;
  let quote = "";
  for (let i = 0; i < body.length; i++) {
    const char = body[i]!;
    if (quote) {
      if (char === "\\" && quote !== "`") i++;
      else if (char === quote) {
        if (body[i + 1] === quote) i++;
        else quote = "";
      }
    } else if (char === "'" || char === '"' || char === "`") quote = char;
    else if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      parts.push(body.slice(start, i).trim());
      start = i + 1;
    }
    if (depth < 0) throw new Error("Unbalanced SQL definition");
  }
  if (quote || depth) throw new Error("Unbalanced SQL definition");
  parts.push(body.slice(start).trim());
  return parts;
}

export interface LegacyTable {
  database: DatabaseName;
  name: string;
  body: string;
  options: string;
  source: string;
  like?: string;
}

export interface LegacyInput {
  name: string;
  sha256: string;
  statements: string[];
}

export async function readLegacy(directory: string) {
  const actual = (await readdir(directory)).filter((name) => name.endsWith(".sql")).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...inputNames].sort())) {
    throw new Error("Expected exactly the seven documented legacy SQL inputs");
  }
  const inputs: LegacyInput[] = [];
  const tables: LegacyTable[] = [];
  const objects: { database: DatabaseName; kind: string; name: string; source: string; sha256: string }[] = [];
  for (const name of inputNames) {
    const content = await readFile(join(directory, name), "utf8");
    const statements = splitSql(content);
    inputs.push({ name, sha256: sha256(content), statements });
    let database = databaseNames.find((db) => name === `${db}.sql`);
    for (const statement of statements) {
      const use = statement.match(/^USE\s+`?(\w+)`?$/i);
      if (use) {
        if (!databaseNames.includes(use[1] as DatabaseName)) throw new Error(`Unknown database in ${name}`);
        database = use[1] as DatabaseName;
        continue;
      }
      if (!database) throw new Error(`Missing database selection in ${name}`);
      const qualified = statement.match(/^CREATE TABLE(?: IF NOT EXISTS)?\s+`(\w+)`\.`/i);
      if (qualified && qualified[1] !== database) throw new Error(`Unexpected table database in ${name}`);
      const create = statement.replace(/^((?:CREATE TABLE)(?: IF NOT EXISTS)?\s+)`\w+`\./i, "$1")
        .match(/^CREATE TABLE(?: IF NOT EXISTS)?\s+`(\w+)`\s*\(([\s\S]*)\)\s*(ENGINE[\s\S]*)$/i);
      const like = statement.match(/^CREATE TABLE(?: IF NOT EXISTS)?\s+`(\w+)`\s+LIKE\s+`(\w+)`$/i);
      if (create || like) {
        const tableName = (create ?? like)![1]!;
        if (tables.some((t) => t.database === database && t.name === tableName)) {
          throw new Error(`Duplicate table ${database}.${tableName}`);
        }
        if (create) tables.push({ database, name: tableName, body: create[2]!, options: create[3]!, source: name });
        else {
          const template = tables.find((t) => t.database === database && t.name === like![2]);
          if (!template) throw new Error(`Unresolved LIKE in ${name}`);
          // This input set contains no foreign keys or auto-increment counters in LIKE templates.
          if (/FOREIGN KEY|AUTO_INCREMENT/i.test(template.body + template.options)) {
            throw new Error(`Unsupported LIKE template ${template.name}`);
          }
          tables.push({ ...template, name: tableName, source: name, like: template.name });
        }
        continue;
      }
      const object = statement.match(/^CREATE\s+(?:DEFINER\s*=\s*\S+\s+)?(TRIGGER|PROCEDURE|FUNCTION|EVENT)\s+(?:`?(\w+)`?\.)?`?(\w+)`?/i);
      if (object) {
        if (object[2] && object[2] !== database) throw new Error(`Unexpected object database in ${name}`);
        objects.push({ database, kind: object[1]!.toLowerCase(), name: object[3]!, source: name, sha256: sha256(statement) });
      }
      else if (!/^(?:DROP (?:TABLE|TRIGGER|PROCEDURE|FUNCTION|EVENT)|CREATE DATABASE|INSERT INTO|DELETE FROM|SET\s|\/\*!\d+ SET\s)/i.test(statement)) {
        // Do not put potentially private SQL in errors.
        throw new Error(`Unsupported statement in ${name}`);
      }
    }
  }
  return { inputs, tables, objects };
}

export function tableSql(table: LegacyTable): string {
  // Match the existing deployment importer: COMPACT cannot hold its widest rows.
  return `CREATE TABLE ${quoteIdentifier(table.name)} (${table.body}) ${table.options.replaceAll("ROW_FORMAT=COMPACT", "ROW_FORMAT=DYNAMIC")};`;
}
