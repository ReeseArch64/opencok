import { text, num, long, type Row } from "@opencok/contracts/rows";
import type { CityProgressionState, QuestWrite } from "@opencok/contracts/city-progression";
import type { RewardRandom } from "@opencok/contracts/rewards";
import type { Rule, Rules } from "./game";
import { reconnectTaskPlan } from "./reconnect-tasks";
import {
    reconnectContainsBuildings,
    reconnectResourceOutput,
    reconnectTaskInitialCount,
} from "./reconnect-task-counts";
import { cityInteger } from "./city-progression";

export interface QuestAction
{
    targetCondition?: string;
    legacy?: number;
    main?: number;
    daily?: number;
    story?: number;
    key?: string;
    count: number;
}

export const questPeriod = (now: bigint, delay = 0n) => (now - delay) / 86400000n;

export function castleLevel(state: CityProgressionState)
{
    return state.buildings.reduce(
        (level, row) =>
            num(row, "itemId") === 400000
                ? Math.max(level, num(row, "level") + num(row, "star"))
                : level,
        0,
    );
}

export function questInitial(rule: Rule, state: CityProgressionState, rules: Rules)
{
    if (rule.type2 === "4")
    {
        return state.tasks.filter((row) => num(row, "state") > 0).length;
    }

    if (rule.type2 === "40")
    {
        return text(state.profile, "allianceId") ? 1 : 0;
    }

    return Math.max(
        0,
        reconnectTaskInitialCount(
            rule,
            {
                profile: state.profile,
                buildings: state.buildings,
                armies: state.armies,
                equipment: state.equipment,
                scienceLevels: new Map(
                    state.sciences.map((row) => [text(row, "itemId"), num(row, "level")]),
                ),
                resourceOutput: reconnectResourceOutput(state.buildings, rules),
                playerInfo: state.statistics,
                prestigeLevel: 0,
                civilizationCastle: undefined,
            },
            rules,
        ),
    );
}

export function progressQuests(
    state: CityProgressionState,
    rules: Rules,
    now: bigint,
    random: RewardRandom,
    action?: QuestAction,
): QuestWrite
{
    const uid = text(state.profile, "uid"),
        q = state.quests;
    const plan = reconnectTaskPlan(state.tasks, rules.reconnect.quests ?? [], {
        platform: text(state.profile, "pf"),
        registrationPlatform: text(state.profile, "pf"),
        chinaPlatform: text(state.profile, "pf").startsWith("cn_"),
        level: num(state.profile, "level"),
        castleLevel: castleLevel(state),
        containsBuildings: (requirements) =>
            reconnectContainsBuildings(state.buildings, requirements),
        initialCount: (rule) => questInitial(rule, state, rules),
        random,
    });
    const catalog = new Map((rules.reconnect.quests ?? []).map((rule) => [rule.id, rule]));
    const tasks = plan.tasks.map((task) => {
        const row = { uid, id: task.id, num: task.num, state: task.state, type: task.type };

        if (row.state !== 0)
        {
            return row;
        }

        const rule = catalog.get(task.id)!;
        const total = (rule.para2 ?? "0").split("|").reduce((sum, n) => sum + cityInteger(n), 0);
        const matches = action?.main === Number(rule.type2)
            && (!rule.para1 || rule.para1 === action.key);
        const initial = questInitial(rule, state, rules);
        row.num = Math.min(
            2147483647,
            Math.max(
                row.num,
                initial,
                matches ? (rule.add === undefined ? action.count : row.num + action.count) : 0,
            ),
        );

        if (row.num >= total)
        {
            row.state = 1;
        }

        return row;
    });

    if (!q)
    {
        return { tasks };
    }

    const story = q.story.map((row) => ({ ...row }));

    for (const rule of rules.progression.story?.values() ?? [])
    {
        if (!story.some((row) => String(row.id) === rule.id))
        {
            story.push({
                uid,
                id: Number(rule.id),
                type: rule.type === "0" ? 1 : 0,
                num: 0,
                state: 0,
            });
        }
    }

    for (const row of story)
    {
        if (num(row, "state") !== 0)
        {
            continue;
        }

        const rule = rules.progression.story?.get(String(row.id));

        if (!rule || rule.type === "0")
        {
            continue;
        }

        const kinds: Record<string, string> = {
            "1": "0",
            "2": "12",
            "4": "8",
            "5": "1",
            "6": "15",
            "8": "40",
            "15": "39",
        };
        const initial = kinds[rule.type ?? ""] === undefined
            ? 0
            : questInitial(
                { ...rule, type2: kinds[rule.type!]!, para2: rule.target ?? "0" },
                state,
                rules,
            );
        const matches = action?.story === Number(rule.type)
            && (!rule.para1 || action.key === rule.para1);
        row.num = Math.min(
            cityInteger(rule.target),
            Math.max(
                num(row, "num"),
                initial,
                matches ? (rule.set === "1" ? num(row, "num") + action.count : action.count) : 0,
            ),
        );

        if (num(row, "num") >= cityInteger(rule.target))
        {
            row.state = 1;
        }
    }

    for (const row of story.filter((row) => num(row, "type") === 1 && num(row, "state") === 0))
    {
        const group = rules.progression.story?.get(String(row.id))?.group;

        if (
            story
                .filter(
                    (other) =>
                        num(other, "type") === 0
                        && rules.progression.story?.get(String(other.id))?.group === group,
                )
                .every((other) => num(other, "state") === 2)
        )
        {
            row.num = 1;
            row.state = 1;
        }
    }

    const reset = questPeriod(now, 300000n) > questPeriod(long(q.lord, "newDailyTaskFlushTime"));
    let daily = q.daily.map((row) => ({ ...row }));

    if (reset || !daily.length)
    {
        daily = [];
        const level = num(state.profile, "level"),
            castle = castleLevel(state),
            inAlliance = !!text(q.alliance, "uid");
        const candidates = [...(rules.progression.daily?.values() ?? [])].filter((rule) =>
            (rule.cond ?? "")
                .split("|")
                .filter(Boolean)
                .every((pair) => {
                    const [kind, value] = pair.split(";").map(Number);

                    switch (kind)
                    {
                        case 0:
                            return level >= value!;
                        case 1:
                            return level <= value!;
                        case 2:
                            return castle >= value!;
                        case 3:
                            return castle <= value!;
                        case 4:
                            return inAlliance;
                        default:
                            return false;
                    }
                })
        );
        const take = (type: number, count: number) => {
            const pool = [...candidates];

            for (let n = 0; n < count && pool.length; n++)
            {
                const total = pool.reduce((sum, rule) => sum + cityInteger(rule.weight), 0);

                if (!total)
                {
                    break;
                }

                let draw = random(total),
                    index = 0;

                while (index < pool.length - 1 && draw >= cityInteger(pool[index]!.weight))
                {
                    draw -= cityInteger(pool[index++]!.weight);
                }

                const [rule] = pool.splice(index, 1);
                daily.push({ uid, id: Number(rule!.id), type, num: 0, state: 0 });
            }
        };
        const info = rules.items.get("dailytasks_info");

        if (random(100) <= Number(info?.k2 ?? 0))
        {
            take(1, 1);
        }

        take(0, cityInteger(info?.k1 ?? 5));
    }

    if (
        action?.daily !== undefined
        && questPeriod(now, 300000n) >= questPeriod(long(q.lord, "newDailyTaskFlushTime"))
        && text(q.alliance, "uid")
    )
    {
        for (const row of daily)
        {
            if (num(row, "state") !== 0)
            {
                continue;
            }

            const rule = rules.progression.daily?.get(String(row.id)),
                parts = rule?.num?.split(";") ?? [];

            if (
                Number(rule?.type) !== action.daily
                || parts
                    .slice(0, -1)
                    .some((key, index) =>
                        key !== "0" && key !== (action.key ?? "").split(";")[index]
                    )
            )
            {
                continue;
            }

            row.num = Math.min(cityInteger(parts.at(-1)), num(row, "num") + action.count);

            if (num(row, "num") >= cityInteger(parts.at(-1)))
            {
                row.state = 1;
            }
        }
    }

    const resetLegacy = questPeriod(now) > questPeriod(long(q.lord, "dailyTaskFlushTime"));
    const legacy = [...(rules.progression.legacyDaily?.values() ?? [])]
        .filter((rule) => castleLevel(state) >= Number(rule.accept1))
        .map((rule) => {
            const previous = resetLegacy ? undefined : q.legacy.find((row) => row.id === rule.id);
            const matches = questPeriod(now) >= questPeriod(long(q.lord, "dailyTaskFlushTime"))
                && action?.legacy === Number(rule.type1)
                && (!rule.para1 || rule.para1 === (action.key ?? "1"));
            const count = Math.min(
                cityInteger(rule.para2) * cityInteger(rule.para3),
                num(previous ?? {}, "num") + (matches ? action.count : 0),
            );

            return {
                uid,
                id: rule.id!,
                num: count,
                times: Math.min(
                    cityInteger(rule.para3),
                    Math.floor(count / cityInteger(rule.para2, 1)),
                ),
            };
        });

    return {
        tasks,
        story,
        daily,
        legacy,
        resetLegacy,
        legacyPeriod: resetLegacy ? now : long(q.lord, "dailyTaskFlushTime"),
        dailyClaims: resetLegacy ? "" : text(q.mixed, "dailyTaskId"),
        resetDaily: reset,
        lord: {
            newDailyTaskFlushTime: reset ? now - 300000n : long(q.lord, "newDailyTaskFlushTime"),
            newDailyTaskBoxRewardState: reset ? 0 : num(q.lord, "newDailyTaskBoxRewardState"),
        },
    };
}

export function storySection(rows: readonly Row[], rules: Rules)
{
    const groups = rows
        .filter((row) => num(row, "type") === 1 && num(row, "state") !== 2)
        .map((row) => Number(rules.progression.story?.get(String(row.id))?.group));

    return groups.length ? Math.min(...groups) : 0;
}

export function rewardAtLevel(raw: string | undefined, level: number)
{
    if (!raw?.includes(";"))
    {
        return raw;
    }

    return raw
        .split("|")
        .map((pair) => pair.split(";"))
        .find(([key]) => Number(key) === level)?.[1];
}
