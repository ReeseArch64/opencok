import { CityCommandDomain } from "./city-command-domain.ts";
import { createHash, randomUUID } from "node:crypto";
import { encode, sfs, str, int } from "@opencok/messages/sfs";
import { num, long, text } from "@opencok/contracts/rows";
import {
    olympicPeriod,
    olympicDefinitions,
    olympicPayout,
    olympicDisplayedPool,
    reconcileOlympicQuestions,
} from "@opencok/rules/olympic";
import { cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { olympicQuestionView, olympicBetView } from "@opencok/mappings/olympic";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { CityDomain } from "./city-domain.ts";
import type { OlympicScheduleStore } from "@opencok/contracts/olympic";
import type { Rules } from "@opencok/rules/game";

const assets = ["wood", "stone", "iron", "food"] as const;

function invalid(): never
{
    throw new GameError(errors.invalid, "city_progression");
}

export class OlympicScheduleService
{
    constructor(
        readonly store: OlympicScheduleStore,
        readonly rules: Rules,
        readonly now = Date.now,
    )
    {}

    refresh()
    {
        const now = BigInt(this.now()),
            period = olympicPeriod(this.rules);

        return this.store.reconcile(
            olympicDefinitions(this.rules),
            !!period?.enabled && now >= period.start && now <= period.end,
            now,
        );
    }
}

export function olympicSettlementOperation(owner: string, ids: readonly string[])
{
    if (!ids.length || ids.length > 64 || new Set(ids).size !== ids.length)
    {
        invalid();
    }

    return `olympic:${
        createHash("sha256")
            .update(JSON.stringify([owner, [...ids].sort()]))
            .digest("hex")
    }`;
}

export class OlympicDomain extends CityCommandDomain
{
    public readonly commands: CityDomain["commands"] = [
        "Olympic.question.info",
        "Olympic.bet.info",
        "Olympic.bet",
        "Olympic.reward",
        "Olympic.settle",
    ];

    public readonly types: CityDomain["types"] = [];

    public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
        const state = context.state.olympic;

        if (!state)
        {
            invalid();
        }

        const period = olympicPeriod(context.rules),
            active = !!period?.enabled && context.now >= period.start && context.now <= period.end,
            definitions = olympicDefinitions(context.rules),
            configuration = new Map(definitions.map((row) => [text(row, "id"), row])),
            mail = command === "Olympic.settle";

        if (mail && (!period || context.now <= period.end))
        {
            invalid();
        }

        const questions = await reconcileOlympicQuestions(
                state.questions,
                definitions,
                active,
                context.now,
                state.winningStake,
            ),
            byId = new Map(questions.map((row) => [text(row, "id"), row])),
            bets = state.bets.map((row) => {
                const question = byId.get(text(row, "questionId"));

                if (!question || num(question, "ended") !== 1 || num(row, "ended") === 1)
                {
                    return row;
                }

                const winner = text(question, "result") === text(row, "betCountry"),
                    reward = winner && question.winningBetNum !== null
                        ? olympicPayout(cityInteger(row.betNum, 1), question)
                        : num(row, "reward");

                return { ...row, result: text(question, "result"), ended: 1, reward };
            });
        context.write.olympic = {
            questions,
            bets: bets.filter((row, index) => row !== state.bets[index]),
        };
        const amount = (type: number) =>
            type === 5
                ? context.balance("gold")
                : context.balance(assets[type]!) + context.balance(`${assets[type]!}bind`);

        if (command === "Olympic.question.info")
        {
            return {
                response: encode({
                    matchList: sfs.array(
                        questions
                            .filter((row) =>
                                num(row, "ended") !== 1 && configuration.has(text(row, "id"))
                            )
                            .map((row) => {
                                const definition = configuration.get(text(row, "id"))!,
                                    type = cityInteger(definition.type, 0, 5);

                                return sfs.object(
                                    olympicQuestionView(
                                        row,
                                        olympicDisplayedPool(row, definition, context.now),
                                        type,
                                        amount(type),
                                    ),
                                );
                            }),
                    ),
                }),
                event: null,
            };
        }

        if (command === "Olympic.bet.info")
        {
            return {
                response: encode({
                    betList: sfs.array(
                        bets.map((row) => {
                            const question = byId.get(text(row, "questionId")),
                                definition = configuration.get(text(row, "questionId"));

                            return sfs.object(
                                olympicBetView(
                                    row,
                                    question,
                                    question && definition
                                        ? olympicDisplayedPool(question, definition, context.now)
                                        : 0n,
                                ),
                            );
                        }),
                    ),
                }),
                event: null,
            };
        }

        if (command === "Olympic.bet")
        {
            const id = str(params, "questionId"),
                type = cityInteger(int(params, "resType"), 0, 5),
                count = cityInteger(int(params, "betNum"), 1),
                answer = str(params, "answer"),
                question = byId.get(id),
                definition = configuration.get(id);

            if (
                !active
                || !question
                || !definition
                || type !== num(definition, "type")
                || type === 4
                || count > cityInteger(definition.cap, 1)
                || !answer
                || answer.length > 10
                || !answer.isWellFormed()
                || answer.includes("\0")
                || num(question, "ended") === 1
                || context.now <= long(question, "startBetTime")
                || context.now >= long(question, "startTime")
            )
            {
                invalid();
            }

            if (type === 5)
            {
                context.economy.gold(-BigInt(count));
            }
            else
            {
                context.spend({ [assets[type]!]: BigInt(count) }, false);
            }

            question.betNum = long(question, "betNum") + BigInt(count);
            context.write.olympic.bets = [
                ...(context.write.olympic.bets ?? []),
                {
                    uuid: randomUUID().replaceAll("-", ""),
                    uid: context.owner,
                    questionId: id,
                    resourceType: type,
                    betNum: count,
                    betCountry: answer,
                    result: "",
                    ended: 0,
                    rewarded: 0,
                    reward: 0,
                },
            ];

            return { response: encode({ gold: sfs.long(context.balance("gold")) }), event: null };
        }

        const pending = bets
                .filter((row) => num(row, "ended") === 1 && num(row, "rewarded") !== 1)
                .slice(0, mail ? 64 : 4096),
            totals = new Map<number, bigint>();

        if (
            mail
            && str(params, "operationId")
                !== olympicSettlementOperation(
                    context.owner,
                    pending.map((row) => text(row, "uuid")),
                )
        )
        {
            invalid();
        }

        for (const bet of pending)
        {
            if (text(bet, "result") === text(bet, "betCountry"))
            {
                const type = cityInteger(bet.resourceType, 0, 5),
                    value = BigInt(cityInteger(bet.reward));

                if (type === 4)
                {
                    invalid();
                }

                totals.set(type, (totals.get(type) ?? 0n) + value);

                if (mail && value > 0n)
                {
                    const template = context.rules.mail.get("11811"),
                        contents = javaMailBytes(template?.message);

                    if (!template || !contents)
                    {
                        invalid();
                    }

                    const quests = (context.write.quests ??= {});
                    quests.mail = [
                        ...(quests.mail ?? []),
                        {
                            uid: randomUUID().replaceAll("-", "") + "00",
                            owner: context.owner,
                            fromName: template.sender ?? "",
                            title: template.title ?? "",
                            type: 2,
                            contents,
                            extra: null,
                            rewardId: `${type === 5 ? "gold" : assets[type]!},0,${value}`,
                            rewardStatus: 0,
                            reply: 0,
                            createTime: context.now,
                        },
                    ];
                }
            }

            bet.rewarded = 1;
        }

        context.write.olympic.bets = bets.filter(
            (row) => pending.includes(row) || !state.bets.includes(row),
        );

        if (mail)
        {
            return { response: encode({}), event: null };
        }

        const rewards = [];

        for (const [type, value] of [...totals].toSorted((a, b) => a[0] - b[0]))
        {
            if (type === 5)
            {
                context.economy.gold(value);
            }
            else
            {
                context.economy.resource(`${assets[type]!}bind`, value);
            }

            let remaining = value;

            while (remaining > 0n)
            {
                const next = remaining > 2147483647n ? 2147483647n : remaining;
                rewards.push(sfs.object({ type: sfs.int(type), value: sfs.int(Number(next)) }));
                remaining -= next;
            }
        }

        return { response: encode({ reward: sfs.array(rewards) }), event: null };
    };

    public readonly apply: CityDomain["apply"] = async () => {
        invalid();
    };
}

export const olympicDomain: CityDomain = new OlympicDomain();
