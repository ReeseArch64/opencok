import type { WbKillDefinition } from "../types/wb_kill.ts";
export const records: readonly WbKillDefinition[] = [
  { "id": 600001, "winningStreak": 1, "BonusPoints": 0, "shutDown": 0, "show": 0, "robRate": 20 },
  { "id": 600002, "winningStreak": 3, "BonusPoints": 1, "shutDown": 1, "show": 0, "robRate": 20 },
  { "id": 600003, "winningStreak": 5, "BonusPoints": 2, "shutDown": 2, "show": 0, "robRate": 20 },
  { "id": 600004, "winningStreak": 10, "BonusPoints": 5, "shutDown": 5, "show": 1, "robRate": 20 },
  {
    "id": 600005,
    "winningStreak": 30,
    "BonusPoints": 10,
    "shutDown": 10,
    "show": 1,
    "robRate": 20,
  },
  {
    "id": 600006,
    "winningStreak": 50,
    "BonusPoints": 30,
    "shutDown": 30,
    "show": 1,
    "robRate": 20,
  },
];
