import type { GoldenEggDefinition } from "../types/golden_egg.ts";

export const records: readonly GoldenEggDefinition[] = [
    { "id": 9051001, "type": 0, "rate": 300, "score": 0, "max": 3 },
    { "id": 9051002, "type": 1, "reward": 249960, "rate": 2400, "score": 2 },
    { "id": 9051003, "type": 2, "reward": 249961, "rate": 500, "score": 2, "max": 5 },
    { "id": 9051004, "type": 4, "reward": 249962, "rate": 250, "score": 2, "max": 2 },
    {
        "id": 9051005,
        "type": 3,
        "status": [
            [2, 300],
            [4, 200],
        ],
        "rate": 300,
        "score": 4,
        "max": 2,
    },
];
