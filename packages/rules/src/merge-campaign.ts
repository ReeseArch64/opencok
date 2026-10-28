import type { RewardPreview } from "@opencok/contracts/rewards";
import type { CampaignRule } from "@opencok/contracts/local-campaign";

export const mergeEffectIds = [307, 308, 309, 310] as const;

export interface MergeEffect
{
    id: number;
    sourceMergeAt: number;
    start: number;
    end: number;
    value: number;
}

export interface MergeEffectSnapshot
{
    version: 1;
    effects: MergeEffect[];
    notified: number[];
}

export interface MergeTimer
{
    name: string;
    interval: number;
    conditions: { operator: string; hours: number; }[];
    effects: { id: number; duration: number; value: number; }[];
}

const effectNames = new Map([
    ["TRIGGER_WHOLE_WORLD_RESOURCE_MAX", 307],
    ["TRIGGER_WHOLE_WORLD_COLLECT_SPEED_SKILl", 308],
    ["TRIGGER_MONSTER_FIGHT_REWARD", 309],
    ["TRIGGER_SIGN_IN", 310],
]);

function invalid(): never
{
    throw new Error("Invalid merge campaign state");
}

export function mergeTimers(rules: readonly CampaignRule[]): MergeTimer[]
{
    const selected = rules.filter(
        (rule) => ["656", "748", "749"].includes(String(rule.id)) && rule.state === 2,
    );

    if (
        selected.length > 3
        || new Set(selected.map((rule) => String(rule.id))).size !== selected.length
    )
    {
        invalid();
    }

    const timers = selected.map((rule) => {
        if (
            rule.openType !== 2
            || !rule.name
            || rule.name.length > 200
            || !rule.name.isWellFormed()
            || rule.name.includes("\0")
            || rule.events.length !== 1
            || rule.events[0]?.code !== 43
            || rule.events[0].parameters !== "-1;600"
            || !!rule.events[0].conditions?.length
            || !rule.conditions.length
            || rule.conditions.length > 4
            || !rule.actions.length
            || rule.actions.length > 4
        )
        {
            invalid();
        }

        const conditions = rule.conditions.map((clause) => {
            const match = /^(<=|>=);(\d{1,4})$/.exec(clause.parameters ?? "");

            if (clause.code !== 90 || clause.conditions?.length || !match)
            {
                invalid();
            }

            return { operator: match[1]!, hours: Number(match[2]) };
        });
        const effects = rule.actions.map((action) => {
            const parts = (action.parameters ?? "").split(";");
            const id = effectNames.get(parts[0] ?? "");

            if (
                action.code !== 53
                || action.actions?.length
                || action.conditions?.length
                || action.branch
                || parts.length !== 3
                || !id
                || parts[1] !== "600"
                || !/^\d{1,6}$/.test(parts[2] ?? "")
            )
            {
                invalid();
            }

            return { id, duration: 600000, value: Number(parts[2]) };
        });

        if (new Set(effects.map((effect) => effect.id)).size !== effects.length)
        {
            invalid();
        }

        return { name: rule.name, interval: 600000, conditions, effects };
    });
    const ids = timers.flatMap((timer) => timer.effects.map((effect) => effect.id));

    if (new Set(ids).size !== ids.length)
    {
        invalid();
    }

    return timers;
}

export function mergeTimerEligible(timer: MergeTimer, mergeAt: number, now: number)
{
    if (!Number.isSafeInteger(now) || now <= 0)
    {
        invalid();
    }

    if (!Number.isSafeInteger(mergeAt) || mergeAt <= 0 || mergeAt > now)
    {
        return false;
    }

    return timer.conditions.every(({ operator, hours }) =>
        operator === "<=" ? now - mergeAt <= hours * 3600000 : now - mergeAt >= hours * 3600000
    );
}

export function decodeMergeEffects(raw?: string): MergeEffectSnapshot
{
    if (raw === undefined)
    {
        return { version: 1, effects: [], notified: [] };
    }

    if (Buffer.byteLength(raw) > 4096)
    {
        invalid();
    }

    const parsed = JSON.parse(raw) as MergeEffectSnapshot;

    if (
        !parsed
        || parsed.version !== 1
        || !Array.isArray(parsed.effects)
        || parsed.effects.length > 4
        || !Array.isArray(parsed.notified)
        || parsed.notified.length > 4
        || new Set(parsed.effects.map((effect) => effect?.id)).size !== parsed.effects.length
        || new Set(parsed.notified).size !== parsed.notified.length
        || parsed.notified.some((id) => !mergeEffectIds.some((known) => known === id))
    )
    {
        invalid();
    }

    for (const effect of parsed.effects)
    {
        if (
            !effect
            || !mergeEffectIds.some((id) => id === effect.id)
            || ![effect.sourceMergeAt, effect.start, effect.end, effect.value].every(
                Number.isSafeInteger,
            )
            || effect.sourceMergeAt <= 0
            || effect.start < effect.sourceMergeAt
            || effect.end <= effect.start
            || effect.end - effect.start !== 600000
            || effect.value < 0
            || effect.value > 999999
        )
        {
            invalid();
        }
    }

    return parsed;
}

export function currentMergeEffects(snapshot: MergeEffectSnapshot, mergeAt: number, now: number)
{
    if (!Number.isSafeInteger(now) || now <= 0)
    {
        invalid();
    }

    return snapshot.effects
        .filter(
            (effect) =>
                effect.sourceMergeAt === mergeAt
                && mergeAt > 0
                && mergeAt <= now
                && effect.start <= now
                && effect.end > now
                && effect.value !== 0,
        )
        .sort((a, b) => a.id - b.id);
}

export function overlayMergeEffects(
    cached: ReadonlyMap<string, string>,
    effects: readonly MergeEffect[],
): ReadonlyMap<string, string>
{
    const result = new Map(cached);

    for (const id of mergeEffectIds)
    {
        result.delete(String(id));
    }

    for (const effect of effects)
    {
        result.set(String(effect.id), `{"value":"${effect.value}","endTime":${effect.end}}`);
    }

    return result;
}

export function mergeSignInRewards(
    rewards: readonly RewardPreview[],
    percent: number,
): readonly RewardPreview[]
{
    if (!Number.isFinite(percent))
    {
        invalid();
    }

    const factor = Math.max(Math.fround(Math.fround(100 + Math.fround(percent)) / 100), 0);

    return rewards.map((reward) =>
        reward.kind === "item" && reward.type === 7
            ? {
                ...reward,
                count: Math.min(
                    2147483647,
                    Math.max(
                        -2147483648,
                        Math.trunc(Math.fround(Math.fround(reward.count) * factor)),
                    ),
                ),
            }
            : reward
    );
}
