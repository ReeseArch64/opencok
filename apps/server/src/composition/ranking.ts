import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import type { Rules } from "@opencok/rules/game";
import { serverFeature } from "@opencok/rules/power-context";
import { versionAtLeast } from "@opencok/rules/availability";
import { allianceScienceEffects } from "@opencok/rules/power-memberships";
import { allianceVideo } from "@opencok/mappings/profile-alliance";
import { allianceVideoSchema } from "@opencok/validations/profile-alliance";
import { checkGameProfile } from "@opencok/services/game-profile";
import { RankingService } from "@opencok/ranking/services/ranking";
import type { RankingStore, RankingPublications } from "@opencok/ranking/contracts/runtime";
import type {
    AllianceRankingKind,
    AllianceRankingQuery,
    AllianceRankingSnapshot,
} from "@opencok/ranking/contracts/alliance-ranking";
import {
    allianceRankingQuery,
    selectAllianceRanking,
} from "@opencok/ranking/rules/alliance-ranking";
import { createAllianceRankingMapper } from "@opencok/ranking/mappings/alliance-ranking";

export function createRealmAllianceRankingPolicy(rules: Rules)
{
    return {
        query: (kind: AllianceRankingKind, now: number) => allianceRankingQuery(kind, rules, now),
        select: (query: AllianceRankingQuery, snapshot: AllianceRankingSnapshot) =>
            selectAllianceRanking(query, snapshot, (rows) => allianceScienceEffects(rows, rules)),
    };
}

export function createRealmAllianceRankingMapper()
{
    return createAllianceRankingMapper(allianceVideo, allianceVideoSchema);
}

export function createRealmRankingService(
    store: RankingStore,
    rules: Rules,
    config: { kingdomId: number; },
    now = Date.now,
    publications: RankingPublications = {},
): RankingService
{
    return new RankingService(store, {
        kingdomId: config.kingdomId,
        catalog: rules,
        now,
        checkProfile: checkGameProfile,
        scienceEffects: (rows) => allianceScienceEffects(rows, rules),
        mapAlliance: createRealmAllianceRankingMapper(),
        featureEnabled: (key, instant) =>
            serverFeature(rules, key, {
                kingdomId: config.kingdomId,
                version: MOBILE_CLIENT_VERSION,
                now: instant,
            }),
        versionAllowed: (key) =>
            versionAtLeast(MOBILE_CLIENT_VERSION, rules.features.get(key)!.version!),
    }, publications);
}
