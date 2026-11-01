import type { CosmeticRecord as Row } from "../contracts/records";
import type { CosmeticCatalog, CosmeticContext } from "../contracts/context";
import type { CosmeticOwnershipRuntime } from "../contracts/runtime";
import { CosmeticKind, cosmeticKinds } from "../enums/kind";

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
        count = 1,
        extendOwned = false,
    ) => {
        const { text, long, cityInteger, serverFeature } = this.runtime;
        const target = context.state.cosmeticTarget,
            rule = context.rules.power.statuses?.get(id);

        if (
            target?.uid !== uid
            || !rule?.subgroup
            || !cosmeticKinds.includes(Number(rule.type2))
            || !serverFeature(context.rules, "avatar", {
                kingdomId: context.rules.kingdomId,
                version: "12.06.0",
                now: Number(context.now),
            })
        )
        {
            return;
        }

        const dirty = [...(context.write.cosmeticTarget?.avatars ?? [])];
        for (const row of extendOwned ? previous : [])
        {
            const priorId = String(row.stateId);
            const prior = context.rules.power.statuses?.get(priorId);
            if (
                row.uid !== uid || long(row, "endTime") <= context.now || !prior?.subgroup
                || prior.overlap === "5" || !cosmeticKinds.includes(Number(prior.type2))
            )
            {
                continue;
            }
            const saved = [...target.avatars, ...dirty].some((entry) => {
                const entryRule = context.rules.power.statuses?.get(text(entry, "avatarId"));
                return entryRule?.type2 === prior.type2 && entryRule?.subgroup === prior.subgroup
                    && (long(entry, "expirationTime") === -1n
                        || long(entry, "expirationTime") > context.now);
            });
            if (!saved)
            {
                dirty.push({
                    uid,
                    avatarId: priorId,
                    expirationTime: long(row, "endTime") === 9223372036854775807n
                        ? -1n
                        : long(row, "endTime"),
                    effectiveSign: 0,
                });
            }
        }
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
            const duration = BigInt(cityInteger(rule.time ?? 0)) * 1000n
                * BigInt(cityInteger(count, 1));
            const expiration =
                rule.time === undefined || (owned && long(owned, "expirationTime") === -1n)
                    ? -1n
                    : owned && !extendOwned && rule.type2 !== String(CosmeticKind.City)
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
