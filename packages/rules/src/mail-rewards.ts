import type { MailRewardEntry, MailRewardSelection } from "@opencok/contracts/mail-rewards";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { inventoryCount } from "./inventory.ts";

export function mailRewardSelection(
    uid: string | undefined,
    uids: string,
    types: string,
    batch: boolean,
): MailRewardSelection
{
    const ids = batch ? uids.split(",").filter(Boolean) : [uid ?? ""];

    if (
        ids.length > 64
        || ids.some((id) => !id || id.length > 40 || !id.isWellFormed() || id.includes("\0"))
    )
    {
        throw new GameError(errors.invalid);
    }

    const labels = types
        .split(",")
        .filter(Boolean)
        .map((raw) => {
            if (
                !/^[+-]?\d+$/.test(raw)
                || !Number.isInteger(Number(raw))
                || Number(raw) < -2147483648
                || Number(raw) > 2147483647
            )
            {
                throw new GameError(errors.invalid);
            }

            const label = Number(raw);

            return label >= 0 && label <= 5 ? label : 6;
        });

    if (labels.length > 64 || (!batch && labels.length))
    {
        throw new GameError(errors.invalid);
    }

    return { ids: [...new Set(ids)], labels: [...new Set(labels)], batch };
}

export function mailRewardEntries(raw: string | null): readonly MailRewardEntry[]
{
    if (!raw || Buffer.byteLength(raw) > 65535 || !raw.isWellFormed())
    {
        throw new GameError(errors.invalid);
    }

    const entries = raw.split("|").filter(Boolean);

    if (!entries.length || entries.length > 64)
    {
        throw new GameError(errors.invalid);
    }

    const merged = new Map<string, MailRewardEntry>();

    for (const entry of entries)
    {
        const parts = entry.split(",").map((part) => part.trim());

        if (
            parts.length !== 3
            || !/^[a-z_]+$/.test(parts[0]!)
            || !/^\d+$/.test(parts[1]!)
            || !/^\d+$/.test(parts[2]!)
        )
        {
            throw new GameError(errors.invalid);
        }

        const category = parts[0]!,
            itemId = parts[1]!,
            count = inventoryCount(Number(parts[2]));
        const key = `${category},${itemId}`;
        const previous = merged.get(key);
        merged.set(key, {
            category,
            itemId,
            count: inventoryCount((previous?.count ?? 0) + count),
        });
    }

    return [...merged.values()];
}
