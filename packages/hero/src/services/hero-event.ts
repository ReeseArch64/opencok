import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { heroEventBand, heroEventRewards, nextHeroPanel } from "@opencok/hero/rules/hero-event";
import {
    heroEventEntry,
    heroEventInfo,
    heroEventReward,
    heroPanelView,
} from "@opencok/hero/mappings/hero-event";
import { eventTimestamp } from "@opencok/rules/local-events";
import { cityInteger } from "@opencok/rules/city-progression";
import { randomInt } from "node:crypto";

import { previewRewards } from "@opencok/rules/rewards";

import {
    heroRankingLookup,
    heroSelfRanking,
    heroHistoryBand,
    heroHistoryRewards,
} from "@opencok/hero/rules/hero-ranking";
import {
    heroSelfRanking as mapHeroSelfRanking,
    heroInsideRanking,
    heroHistory,
} from "@opencok/hero/mappings/hero-ranking";

import { javaDecimal } from "@opencok/rules/java-integer";

import type { GameServices, GameStore } from "@opencok/contracts/game";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import { sfs, int as wireInt, str as wireString, type Fields } from "@opencok/messages/sfs";

import type { Rules } from "@opencok/rules/game";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";

import { checkGameProfile } from "@opencok/services/game-profile";

export class HeroEventService
{
    constructor(
        readonly db: GameStore,
        readonly rules: Rules,
        readonly config: { kingdomId: number; },
        readonly now = Date.now,
        readonly services: Pick<GameServices, "heroHistoryPublication" | "heroRankingPosition"> =
            {},
    )
    {}

    public async heroEventDetails(uid: string, command: string, params: Fields): Promise<Fields>
    {
        const now = this.now(),
            at = BigInt(now),
            current = checkGameProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const source = current.crossFightSrcServerId,
            realm = source == null || Number(source) === -1
                ? this.config.kingdomId
                : Number(source),
            cross = command === "hero.cross.info";

        if (cross && realm === this.config.kingdomId)
        {
            return {};
        }

        if (!this.db.heroEvents)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const selection = cross
            ? { panels: true }
            : command === "hero.event.info.get"
            ? { activityId: wireString(params, "activityId") }
            : { eventId: wireString(params, "actId") };

        try
        {
            const state = await this.db.heroEvents(uid, realm, selection, now),
                profile = checkGameProfile(state.profile, now);

            if (profile.uid !== uid || num(profile, "serverId") !== realm)
            {
                throw new GameError(errors.invalid);
            }

            const preview = (id: string) =>
                id === "0"
                    ? sfs.array([])
                    : rewardPreviewArray(
                        previewRewards(
                            id,
                            this.rules,
                            { kingdomId: realm, version: MOBILE_CLIENT_VERSION, now },
                            randomInt,
                        ),
                    );

            if (cross)
            {
                const panels: Fields[] = [];

                for (const panel of this.rules.power.activityPanels?.values() ?? [])
                {
                    const type = panel.type === "10"
                        ? 1
                        : panel.type === "12"
                        ? 2
                        : panel.type === "14"
                        ? 3
                        : 0;

                    if (!type || panel.function_on === "0")
                    {
                        continue;
                    }

                    const merge = [...(this.rules.power.mergeActivities?.values() ?? [])].some(
                        (row) =>
                            row.activityId === panel.id
                            && state.lastMergeMillis > 0n
                            && at - state.lastMergeMillis
                                >= BigInt(cityInteger(row.merge_start)) * 60000n
                            && at - state.lastMergeMillis
                                < BigInt(cityInteger(row.merge_end)) * 60000n,
                    );

                    if (!merge && panel.start !== undefined && panel.end !== undefined)
                    {
                        const start = eventTimestamp(panel.start),
                            end = eventTimestamp(panel.end);

                        if (start === undefined || end === undefined || at <= start || at >= end)
                        {
                            continue;
                        }
                    }

                    let activity = state.activities.find((row) =>
                        num(row, "activityType") === type
                    );

                    if (!activity && !state.scoreManagerRunning)
                    {
                        activity = nextHeroPanel(this.rules, type, realm, at);
                    }

                    if (!activity || (type === 1 && long(activity, "startTime") - at > 86400000n))
                    {
                        continue;
                    }

                    panels.push(
                        heroPanelView(
                            activity,
                            panel,
                            at,
                            panel.rewardid ? preview(panel.rewardid) : undefined,
                            merge,
                        ),
                    );
                }

                if (panels.length > 256)
                {
                    throw new GameError(errors.invalid);
                }

                return { activity: sfs.array(panels.map(sfs.object)) };
            }

            const activity = state.activities[0];

            if (!activity)
            {
                return {};
            }

            if (command === "hero.event.ranking.get")
            {
                const event = state.events[0];

                if (!event)
                {
                    return {};
                }

                const { level } = heroEventBand(event, state, this.rules);

                if (level < 0)
                {
                    return heroEventReward([]);
                }

                const view = heroEventRewards(event, level, this.rules);

                return heroEventReward(view.ranking.map(preview), view.ranking, view.rankLevels);
            }

            const entries: Fields[] = [],
                ranked: { type: number; ranking: number; countries: Row[]; }[] = [];

            for (const event of state.events)
            {
                const { level, score } = heroEventBand(event, state, this.rules);

                if (level < 0)
                {
                    continue;
                }

                const view = heroEventRewards(event, level, this.rules),
                    query = heroRankingLookup(
                        event,
                        uid,
                        text(profile, "allianceId"),
                        this.rules,
                        realm,
                        MOBILE_CLIENT_VERSION,
                    );
                let position: number;

                if (typeof query === "number")
                {
                    position = query;
                }
                else
                {
                    if (!this.services.heroRankingPosition)
                    {
                        throw new GameError(errors.unsupported, "ranking");
                    }

                    position = await this.services.heroRankingPosition(query);
                }

                const type = cityInteger(event.type, 1, 4),
                    ids = type >= 3
                        ? text(event, "serverGroup")
                            .split("|")
                            .filter(Boolean)
                            .map((value) => cityInteger(value, 1))
                        : [];

                if (ids.length > 64 || new Set(ids).size !== ids.length)
                {
                    throw new GameError(errors.invalid);
                }

                let details: readonly Row[] = [];

                if (ids.length)
                {
                    if (!this.db.heroHistoryPresentation)
                    {
                        throw new GameError(errors.unsupported, "ranking");
                    }

                    details = (await this.db.heroHistoryPresentation([], ids)).realms;
                }

                const countries = ids.map((id, index) => {
                    const row = details.find((row) => num(row, "id") === id);

                    return {
                        id,
                        rank: index + 1,
                        ...(row ? { name: text(row, "name"), banner: text(row, "banner") } : {}),
                    };
                });
                ranked.push({ type, ranking: position, countries });
                entries.push(
                    heroEventEntry(
                        event,
                        { score: view.rule.score ?? "", value: view.value, targets: view.targets },
                        view.rewards.map(preview),
                        score,
                    ),
                );
            }

            return heroEventInfo(entries, cityInteger(activity.activityType, 1, 3), ranked);
        }
        catch (error)
        {
            if (realm !== this.config.kingdomId)
            {
                return {};
            }

            throw error;
        }
    }

    public async heroHistory(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const current = checkGameProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const source = current.crossFightSrcServerId;
        const realm = source == null || Number(source) === -1
            ? this.config.kingdomId
            : Number(source);
        const type = wireInt(params, "type");

        if (!Number.isInteger(type) || type < 0 || type > 4)
        {
            throw new GameError(errors.invalid);
        }

        if (!this.db.heroHistory)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const state = await this.db.heroHistory(uid, realm, type, now);
        const profile = checkGameProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== realm)
        {
            throw new GameError(errors.invalid);
        }

        if (!state.active || !state.events.length)
        {
            return heroHistory([]);
        }

        const alliance = type === 2 || type === 4;
        const band = heroHistoryBand(type, state.castleLevel, state.alliancePower, this.rules);

        if (band < 0 || (!alliance && band >= 40))
        {
            return heroHistory([]);
        }

        const rewards = heroHistoryRewards(this.rules, text(state.active, "eventId"), band);
        const keys = state.events.map((event) => {
            const lookup = heroRankingLookup(
                event,
                uid,
                text(profile, "allianceId"),
                this.rules,
                realm,
                MOBILE_CLIENT_VERSION,
                false,
            );

            if (typeof lookup === "number" || !lookup.keys[band])
            {
                throw new GameError(errors.invalid);
            }

            return lookup.keys[band]!;
        });

        if (!this.services.heroHistoryPublication || !this.db.heroHistoryPresentation)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const publications = await this.services.heroHistoryPublication(keys, alliance);

        if (publications.length !== state.events.length)
        {
            throw new GameError(errors.invalid);
        }

        const ids = [...new Set(publications.flatMap((row) => [...row.members]))];
        const realmIds = [
            ...new Set(
                state.events.flatMap((event) =>
                    type >= 3 && event.kingdomRank
                        ? String(event.kingdomRank)
                            .split("|")
                            .map((id) => Number(javaDecimal(id, 32)))
                        : []
                ),
            ),
        ];
        const presentation = await this.db.heroHistoryPresentation(alliance ? ids : [], realmIds);
        const players = new Map<string, Row>();

        if (!alliance)
        {
            for (let offset = 0; offset < ids.length; offset += 50)
            {
                const summaries = await this.db.getPlayerSummariesByIds(
                    ids.slice(offset, offset + 50),
                    true,
                );

                for (const summary of summaries)
                {
                    players.set(text(summary.data, "uid"), {
                        ...summary.data,
                        server: summary.kingdomId,
                    });
                }
            }
        }

        return heroHistory(
            state.events.map((event, index) => {
                const publication = publications[index]!;
                const members = publication.members.flatMap((id, position) => {
                    const rewardId = rewards[position];

                    if (rewardId === undefined)
                    {
                        return [];
                    }

                    const member: Row = {
                        [alliance ? "allianceId" : "uid"]: id,
                        rewardId,
                        rank: position + 1,
                    };

                    if (alliance)
                    {
                        const raw = publication.alliances[position];
                        const data: unknown = raw
                            ? JSON.parse(raw)
                            : presentation.alliances.find((row) => row.allianceId === id);

                        if (data != null && (typeof data !== "object" || Array.isArray(data)))
                        {
                            throw new GameError(errors.invalid);
                        }

                        if (data)
                        {
                            for (const key of ["name", "server", "abbr", "icon"])
                            {
                                if ((data as Row)[key] != null)
                                {
                                    member[key] = (data as Row)[key]!;
                                }
                            }
                        }
                    }
                    else
                    {
                        const data = players.get(id);

                        if (data && text(data, "name").trim())
                        {
                            member.name = text(data, "name");
                            member.server = data.server!;
                            member.pic = text(data, "pic");
                            member.picVer = num(data, "picVer");
                            member.picfraId = num(data, "picfraId");
                            member.abbr = text(data, "abbr");
                        }
                    }

                    return [member];
                });
                const realms = type >= 3 && members.length && event.kingdomRank
                    ? String(event.kingdomRank)
                        .split("|")
                        .map((raw, rank) => {
                            const id = Number(javaDecimal(raw, 32));

                            return {
                                ...presentation.realms.find((row) => Number(row.id) === id),
                                id,
                                rank: rank + 1,
                            };
                        })
                    : [];

                return { event, members, realms };
            }),
        );
    }

    public async heroInsideRanking(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const current = checkGameProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const source = current.crossFightSrcServerId;
        const realm = source == null || Number(source) === -1
            ? this.config.kingdomId
            : Number(source);

        if (!this.db.heroInsideRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const state = await this.db.heroInsideRanking(uid, realm, wireString(params, "actId"), now);
        const profile = checkGameProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== realm)
        {
            throw new GameError(errors.invalid);
        }

        return heroInsideRanking(state.rows);
    }

    public async heroSelfRanking(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const current = checkGameProfile(await this.db.getProfileById(uid), now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const source = current.crossFightSrcServerId;
        const realm = source == null || Number(source) === -1
            ? this.config.kingdomId
            : Number(source);
        const activityId = wireString(params, "activityId");

        if (!this.db.heroRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const state = await this.db.heroRanking(uid, realm, activityId, now);
        const profile = checkGameProfile(state.profile, now);

        if (profile.uid !== uid || num(profile, "serverId") !== realm)
        {
            throw new GameError(errors.invalid);
        }

        const positions: number[] = [];

        for (const event of state.events)
        {
            const query = heroRankingLookup(
                event,
                uid,
                text(profile, "allianceId"),
                this.rules,
                realm,
                MOBILE_CLIENT_VERSION,
            );

            if (typeof query === "number")
            {
                positions.push(query);
            }
            else
            {
                if (!this.services.heroRankingPosition)
                {
                    throw new GameError(errors.unsupported, "ranking");
                }

                positions.push(await this.services.heroRankingPosition(query));
            }
        }

        return mapHeroSelfRanking(heroSelfRanking(state.events, positions));
    }
}
