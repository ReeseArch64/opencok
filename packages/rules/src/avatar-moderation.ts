import type { Row } from "@opencok/contracts/rows";
import { javaDecimal } from "./java-integer.ts";

export function avatarModerationPlan(
    version: number,
    record: Row | undefined,
    decision: "approve" | "reject",
    now: number,
    banSeconds: string | undefined,
)
{
    if (
        !Number.isInteger(version)
        || version < -2147483648
        || version > 2147483647
        || !Number.isSafeInteger(now)
        || now < 0
        || !["approve", "reject"].includes(decision)
    )
    {
        throw new Error("Invalid avatar moderation input");
    }

    if (decision === "approve")
    {
        return {
            picVer: version,
            changed: false,
            record: record
                ? { banTime: 0n, stat: 1 }
                : {
                    picVer: version,
                    report: 0,
                    banCount: 0,
                    banTime: 0n,
                    updateTime: BigInt(now),
                    stat: 1,
                },
        };
    }

    if (version >= 4000000)
    {
        throw new Error("Invalid restored avatar state");
    }

    if (version >= 3000000)
    {
        return { picVer: version, changed: false, record: null };
    }

    const picVer = (version % 1000000) + 3000000;
    const savedCount = record?.banCount ?? 0;

    if (
        typeof savedCount !== "number"
        || !Number.isInteger(savedCount)
        || savedCount < -2147483648
        || savedCount > 2147483647
    )
    {
        throw new Error("Invalid avatar ban count");
    }

    const banCount = Number(BigInt.asIntN(32, BigInt(savedCount) + 1n));
    const interval = BigInt.asIntN(64, javaDecimal(banSeconds, 64) * 1000n);
    const values = {
        banCount,
        banTime: BigInt.asIntN(64, BigInt(now) + BigInt(banCount) * interval),
        updateTime: BigInt(now),
        stat: 2,
    };

    return {
        picVer,
        changed: picVer !== version,
        record: record ? values : { ...values, picVer, report: 0 },
    };
}
