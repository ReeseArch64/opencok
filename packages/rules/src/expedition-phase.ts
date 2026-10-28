import { expeditionCalendarPhases } from "./expedition-calendar";
import { expeditionPhase } from "./new-expedition";
import { num, text, type Row } from "@opencok/contracts/rows";
import { eventTimestamp } from "./local-events";
import { cityInteger } from "./city-progression";
import { expeditionOpen } from "./new-expedition";
import type { Rules } from "./game";

export function expeditionPhaseView(
    period: Row,
    state: { manifest?: Row; admission?: Row; },
    now: bigint,
): Row
{
    const active = expeditionPhase(state.manifest, now);

    if (active)
    {
        return {
            periodId: text(state.manifest!, "periodId"),
            ...active,
            opponent: num(state.manifest!, "matchServerId"),
        };
    }

    const phases = expeditionCalendarPhases(period),
        global = phases.find((row) => now >= row.startTime && now < row.endTime),
        waiting = phases.find((row) => row.stage === 0),
        matching = phases.find((row) => row.stage === 1),
        admitted = state.admission?.periodId === period.id;
    const phase = global && global.stage !== 0 && admitted && matching
        ? matching
        : (waiting ?? { stage: 0, startTime: 0n, endTime: 9223372036854775807n });

    return { periodId: text(period, "id"), ...phase, opponent: 0 };
}

export function expeditionPhaseOperation(revision: bigint)
{
    return `expedition-phase:${revision}`;
}

export function expeditionPanelDefinitions(rules: Rules, now: bigint, lastMergeMillis: bigint)
{
    if (!expeditionOpen(rules, now))
    {
        return [];
    }

    return [...(rules.power.activityPanels?.values() ?? [])].flatMap((rule) => {
        if (rule.type !== "37" || rule.function_on === "0")
        {
            return [];
        }

        const merge = lastMergeMillis > 0n
            && [...(rules.power.mergeActivities?.values() ?? [])].some(
                (row) =>
                    row.activityId === rule.id
                    && now - lastMergeMillis >= BigInt(cityInteger(row.merge_start)) * 60000n
                    && now - lastMergeMillis < BigInt(cityInteger(row.merge_end)) * 60000n,
            );

        if (!merge && rule.start !== undefined && rule.end !== undefined)
        {
            const start = eventTimestamp(rule.start),
                end = eventTimestamp(rule.end);

            if (start !== undefined && end !== undefined && (now <= start || now >= end))
            {
                return [];
            }
        }

        return [{ rule, merge }];
    });
}
