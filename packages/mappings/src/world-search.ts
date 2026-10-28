import { validateFields } from "@opencok/messages/validations/fields";
import { worldSearchSchema } from "@opencok/validations/world-search";

import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeWorldSearch(rows: readonly Row[]): Fields
{
    if (rows.length > 8)
    {
        throw new GameError(errors.invalid);
    }

    const ids = new Set<string>();

    return {
        list: sfs.array(
            rows.map((row) => {
                const value: Fields = { pointId: sfs.int(1203) };

                for (
                    const [key, limit] of [
                        ["uid", 255],
                        ["name", 255],
                        ["pic", 40],
                        ["abbr", 10],
                    ] as const
                )
                {
                    const field = row[key];

                    if (key === "pic" && field == null)
                    {
                        continue;
                    }

                    if (
                        typeof field !== "string"
                        || field.length > limit
                        || !field.isWellFormed()
                        || field.includes("\0")
                    )
                    {
                        throw new GameError(errors.invalid);
                    }

                    value[key] = sfs.string(field);
                }

                const uid = row.uid as string;

                if (!uid || ids.has(uid))
                {
                    throw new GameError(errors.invalid);
                }

                ids.add(uid);

                if (row.picVer != null)
                {
                    if (
                        typeof row.picVer !== "number"
                        || !Number.isInteger(row.picVer)
                        || row.picVer < -2147483648
                        || row.picVer > 2147483647
                    )
                    {
                        throw new GameError(errors.invalid);
                    }

                    value.picVer = sfs.int(row.picVer);
                }

                if (row.power != null)
                {
                    if (typeof row.power !== "bigint" || BigInt.asIntN(64, row.power) !== row.power)
                    {
                        throw new GameError(errors.invalid);
                    }

                    value.power = sfs.long(row.power);
                }

                return sfs.object(value);
            }),
        ),
    };
}

export function worldSearch(...args: Parameters<typeof serializeWorldSearch>): Fields
{
    return validateFields(worldSearchSchema, serializeWorldSearch(...args));
}
