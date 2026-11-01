import type { CityProgressionWrite } from "@opencok/contracts/city-progression";
import { text, num, long, type Row } from "@opencok/contracts/rows";

export function validateCityWrite(write: CityProgressionWrite, owner: string)
{
    if (write.appearance)
    {
        for (const [key, value] of Object.entries(write.appearance))
        {
            if (key === "pic")
            {
                if (
                    typeof value !== "string" || value.length === 0 || value.length > 40
                    || value.includes("\0")
                )
                {
                    throw new Error("Invalid profile appearance");
                }
            }
            else if (
                (key !== "picVer" && key !== "picfraId") || !Number.isInteger(value)
                || Number(value) < 0 || Number(value) > 2147483647
            )
            {
                throw new Error("Invalid profile appearance");
            }
        }
    }

    for (
        const [rows, identity, fields] of [
            [
                write.buildings,
                "uuid",
                [
                    "itemId",
                    "pos",
                    "level",
                    "star",
                    "progress",
                    "opType",
                    "reward",
                    "unlockFlag",
                    "costUnlockTimes",
                ],
            ],
            [write.sciences, "itemId", ["level"]],
            [write.armies, "armyId", ["level", "free", "pve", "march", "defence", "train"]],
            [write.hospital, "armyId", ["dead", "heal"]],
            [write.forts, "armyId", ["level", "num", "build"]],
        ] as const
    )
    {
        if (!rows)
        {
            continue;
        }

        if (rows.length > 1024 || new Set(rows.map((row) => row[identity])).size !== rows.length)
        {
            throw new Error("Invalid city write set");
        }

        for (const row of rows)
        {
            if (row.uid !== owner || !text(row, identity) || text(row, identity).length > 40)
            {
                throw new Error("Invalid city owner");
            }

            for (const key of fields)
            {
                const value = num(row as Row, key);

                if (!Number.isInteger(value) || value < 0 || value > 2147483647)
                {
                    throw new Error("Invalid city quantity");
                }
            }

            for (const key of ["finishTime", "cd", "refreshTime", "updateTime", "foodCostTime"])
            {
                if (long(row as Row, key) < 0n || long(row as Row, key) > 9223372036854775807n)
                {
                    throw new Error("Invalid city deadline");
                }
            }
        }
    }
}
