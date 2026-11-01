import type { CosmeticRecord as Row } from "../contracts/records";
import type { CosmeticCatalog } from "../contracts/context";
import type { CosmeticPolicyRuntime } from "../contracts/runtime";
import type {
    CityCosmeticResponse,
    CosmeticStatusResponse,
} from "../contracts/responses/cosmetics";
import { CosmeticKind, cosmeticWorldFields } from "../enums/kind";

export class CosmeticPolicy<TCatalog extends CosmeticCatalog>
{
    public constructor(private readonly runtime: CosmeticPolicyRuntime)
    {}

    public readonly cityCosmeticProjection = (
        states: readonly Row[],
        rules: TCatalog | undefined,
        now: bigint,
    ): CityCosmeticResponse => {
        const { num, long, cityInteger } = this.runtime;
        const active = states.filter((row) => long(row, "endTime") > now);
        const select = (type: number): CosmeticStatusResponse | undefined => {
            const group = active.filter((row) => num(row, "type2") === type);
            const special = group.find((row) =>
                    ["3", "4"].includes(
                        rules?.power.statuses?.get(String(row.stateId))?.overlap ?? "",
                    )
                ),
                row = special ?? group[0];

            if (!row)
            {
                return;
            }

            let end = long(row, "endTime");

            if (end === 9223372036854775807n)
            {
                end = now > 2147000000000n ? now + 86400000n : 2147000000000n;
            }

            return {
                sid: cityInteger(row.stateId, 1),
                set: Number(BigInt.asIntN(32, end / 1000n)),
                ...(type === CosmeticKind.Overlap && !special
                    ? { count: cityInteger(row.count ?? 1) }
                    : {}),
            };
        };
        const skin = select(CosmeticKind.City);
        const result: CityCosmeticResponse = skin ? { sid: skin.sid, set: skin.set } : {};
        for (const [type, field] of Object.entries(cosmeticWorldFields))
        {
            const value = select(Number(type));
            if (value)
            {
                result[field] = value;
            }
        }
        return result;
    };
}
