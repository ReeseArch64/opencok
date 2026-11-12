import type { KingdomDatabase } from "./kingdom-database";

export type PostgresDatabase = "global" | "payments" | KingdomDatabase;
