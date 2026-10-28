export const databaseSchemas = {
    global: ["opencok_global", "opencok_pay", "opencok_chat"],
    kingdom: ["opencok_kingdom"],
} as const;

export type DatabaseRole = keyof typeof databaseSchemas;
