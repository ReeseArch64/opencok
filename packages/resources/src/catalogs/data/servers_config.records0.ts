import type { ServersConfigDefinition } from "../types/servers_config.ts";

export const records: readonly ServersConfigDefinition[] = [
    { "id": "castle_upgrade", "level": 30, "prestige": 6, "enabled": 1 },
    { "id": "auto_science", "enabled": 1 },
    { "id": "saga_science_max", "enabled": 1 },
    { "id": "foreign_science_max", "enabled": 0 },
    { "id": "auto_level", "enabled": 1, "level": 100 },
    { "id": "add_user_equip", "enabled": 1 },
    { "id": "auto_hero", "enabled": 1, "unlockAll": 1, "levelMax": 0, "maxStar": 1 },
    { "id": "auto_dragon", "enabled": 1, "unlockAll": 1, "levelMax": 1 },
    { "id": "auto_civilization_science", "enabled": 1 },
    {
        "id": "power_limit",
        "enabled": 1,
        "maxPower": 5000000000,
        "gmBypass": 1,
        "rankingHideGm": 1,
    },
    { "id": "newbie_items", "enabled": 1 },
    {
        "id": "global_rank",
        "attackPercent": 1,
        "attackWins": 1,
        "defenceWins": 1,
        "UnitHP": 1,
        "honorPoint": 1,
        "kill": 1,
        "militaryPoint": 1,
        "power": 1,
    },
];
