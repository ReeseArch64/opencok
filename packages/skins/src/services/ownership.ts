import type { CosmeticRecord as Row } from "../contracts/records";
import type { CosmeticCatalog, CosmeticContext } from "../contracts/context";
import type { CosmeticOwnershipRuntime } from "../contracts/runtime";
import { CosmeticKind } from "../enums/kind";

export class CosmeticOwnership<
    TCatalog extends CosmeticCatalog,
    TContext extends CosmeticContext<TCatalog>,
>
{
    public constructor(private readonly runtime: CosmeticOwnershipRuntime<TCatalog>)
    {}

    public readonly cosmeticOwnership = (
        context: TContext,
        uid: string,
        id: string,
        previous: readonly Row[],
        states: readonly Row[],
    ) => {
        const { text, long, cityInteger, serverFeature } = this.runtime;
        const target = context.state.cosmeticTarget,
            rule = context.rules.power.statuses?.get(id);

        if (
            target?.uid !== uid
            || !rule?.subgroup
            || ![
                String(CosmeticKind.City),
                String(CosmeticKind.Bubble),
                String(CosmeticKind.Overlap),
            ].includes(rule.type2 ?? "")
            || !serverFeature(context.rules, "avatar", {
                kingdomId: context.rules.kingdomId,
                version: "12.06.0",
                now: Number(context.now),
            })
        )
        {
            return;
        }

        const dirty = context.write.cosmeticTarget?.avatars ?? [];
        const avatars = [
            ...target.avatars.filter((row) =>
                !dirty.some((next) => next.avatarId === row.avatarId)
            ),
            ...dirty,
        ];
        let owned = avatars.find((row) => {
            const old = context.rules.power.statuses?.get(text(row, "avatarId"));

            return (
                (long(row, "expirationTime") === -1n || long(row, "expirationTime") > context.now)
                && old?.type2 === rule.type2
                && old?.subgroup === rule.subgroup
            );
        });
        const counter = rule.overlap === "5"
            && previous.some((row) =>
                String(row.stateId) === id && long(row, "endTime") > context.now
            );

        if (!counter)
        {
            const duration = BigInt(cityInteger(rule.time ?? 0)) * 1000n;
            const expiration =
                rule.time === undefined || (owned && long(owned, "expirationTime") === -1n)
                    ? -1n
                    : owned && rule.type2 !== String(CosmeticKind.City)
                    ? long(owned, "expirationTime")
                    : (owned ? long(owned, "expirationTime") : context.now) + duration;
            owned = {
                uid,
                avatarId: owned?.avatarId ?? id,
                expirationTime: expiration,
                effectiveSign: 0,
            };
        }

        if (owned)
        {
            for (const state of states)
            {
                state.endTime = long(owned, "expirationTime") === -1n
                    ? 9223372036854775807n
                    : long(owned, "expirationTime");
            }
        }

        return counter
            ? undefined
            : [...dirty.filter((row) => row.avatarId !== owned!.avatarId), owned!];
    };

    public readonly cosmeticTargetStates = (context: TContext) => {
        const { num } = this.runtime;
        const target = context.state.cosmeticTarget;

        if (!target)
        {
            throw new Error("Missing cosmetic target");
        }

        const write = context.write.cosmeticTarget;

        if (!write)
        {
            return target.states;
        }

        return [
            ...target.states.filter(
                (row) =>
                    !write.deleted.includes(num(row, "stateId"))
                    && !write.states.some((next) => next.stateId === row.stateId),
            ),
            ...write.states,
        ];
    };
}
