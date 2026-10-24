import { getTableConfig } from "drizzle-orm/pg-core";
import * as schemas from "../../src/schema";
import type { DatabaseRole } from "../../src/roles";
import artifact from "../fixtures/schema.json";

export interface ColumnContract {
  name: string;
  type: string;
  value: "number" | "bigint" | "string" | "buffer";
  notNull: boolean;
  default: string | null;
  identity: { name: string; startWith: number; maxValue?: number } | null;
  calendar: string | null;
  onUpdate: boolean;
  bytes: number | null;
}
export interface TableContract {
  role: DatabaseRole;
  columns: ColumnContract[];
  indexes: {
    name: string;
    where?: string;
    kind: "primary" | "unique" | "index";
    columns: { name: string; prefix: number | null }[];
  }[];
  checks: [string, string][];
  foreignKeys: {
    name: string;
    columns: string[];
    table: string;
    targetColumns: string[];
    onDelete: string;
    onUpdate: string;
  }[];
}
export const contract = artifact as unknown as Record<string, TableContract>;
export const catalog = Object.entries(schemas)
  .flatMap(([namespace, entries]) =>
    Object.values(entries).map((table) => {
      const config = getTableConfig(table);
      const id = `${namespace}.${config.name}`;
      if (!contract[id]) throw new Error(`Unexpected table ${id}`);
      return { id, namespace, table, config, spec: contract[id]! };
    }),
  )
  .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
export const normalizeType = (value: string) =>
  value.replace(/^varchar\(/, "character varying(").replaceAll(", ", ",");
