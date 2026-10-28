import type { WbSkillDefinition } from "../types/wb_skill.ts";

export const records: readonly WbSkillDefinition[] = [
    { "id": 600001, "winningStreak": 1, "BonusPoints": 0, "shutDown": 0, "show": 0, "robRate": 20 },
    { "id": 600002, "winningStreak": 3, "BonusPoints": 1, "shutDown": 1, "show": 0, "robRate": 20 },
    { "id": 600003, "winningStreak": 5, "BonusPoints": 2, "shutDown": 2, "show": 0, "robRate": 20 },
    {
        "id": 600004,
        "winningStreak": 10,
        "BonusPoints": 5,
        "shutDown": 5,
        "show": 1,
        "robRate": 20,
    },
];
