export type DatabaseRole = "global" | "realm";
export type Namespace = "cokdb1" | "cokdb_global" | "cokdb_pay" | "opencok_chat";
export interface ColumnMapping {
  name: string;
  sourceType: string;
  targetType: string;
  adapter: "number" | "bigint" | "decimal" | "text" | "bytes" | "temporal";
  notNull: boolean;
  defaultSql: string | null;
  targetDefault: string | null;
  autoIncrement: boolean;
  onUpdate: boolean;
  charset: string | null;
  collation: string | null;
  targetCollation: string | null;
  comment: string;
  checks: { name: string; expression: string }[];
}
export interface IndexMapping {
  sourceName: string;
  targetName: string;
  kind: "primary" | "unique" | "index" | "pad-unique";
  columns: { name: string; prefix: number | null }[];
  expressions: string[];
}
export interface ForeignKeyMapping {
  sourceName: string; targetName: string; columns: string[]; targetTable: string;
  targetColumns: string[]; onDelete: string; onUpdate: string;
}
export interface TableMapping {
  id: string; namespace: Namespace; name: string; role: DatabaseRole;
  sourceEngine: string; sourceCollation: string; initialSequence: string;
  columns: ColumnMapping[]; indexes: IndexMapping[]; foreignKeys: ForeignKeyMapping[];
}
export interface MigrationManifest {
  formatVersion: 1;
  postgresVersion: string;
  sourceHashes: Record<string, string>;
  tables: TableMapping[];
  programs: { database: string; kind: string; name: string; sha256: string; disposition: string }[];
}
