export const databaseSchemas = {
  global: ["cokdb_global", "cokdb_pay", "opencok_chat"],
  realm: ["cokdb1"],
} as const;

export type DatabaseRole = keyof typeof databaseSchemas;
