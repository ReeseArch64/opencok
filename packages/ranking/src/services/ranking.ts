import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { int as wireInt, type Fields } from "@opencok/messages/sfs";
import { num } from "../contracts/rows";
import type { PlayerRankingKind } from "../contracts/ranking";
import type { AllianceRankingKind } from "../contracts/alliance-ranking";
import type {
    RankingCommands,
    RankingPublications,
    RankingRuntime,
    RankingStore,
} from "../contracts/runtime";
import { playerRanking } from "../mappings/ranking";
import { attributeRanking, publishedRanking } from "../mappings/published-ranking";
import { playerRankingQuery, selectPlayerRanking } from "../rules/ranking";
import { allianceRankingQuery, selectAllianceRanking } from "../rules/alliance-ranking";

export class RankingService implements RankingCommands
{
    constructor(
        readonly store: RankingStore,
        readonly runtime: RankingRuntime,
        readonly publications: RankingPublications = {},
    )
    {}

    async publishedRanking(uid: string, kind: "payment" | "consumption"): Promise<Fields>
    {
        const now = this.runtime.now();
        const profile = this.runtime.checkProfile(await this.store.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.runtime.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const key = kind === "payment" ? "new_rank_recharge" : "new_rank_cost";

        if (
            !this.runtime.featureEnabled(key, now)
        )
        {
            return {};
        }

        if (!this.runtime.versionAllowed(key))
        {
            return {};
        }

        if (!this.publications.publishedGlobalRanking || !this.store.rankingPrivacy)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const hide = await this.store.rankingPrivacy(uid, kind);

        return publishedRanking(await this.publications.publishedGlobalRanking(kind), uid, hide);
    }

    async attributeRanking(uid: string, params: Fields): Promise<Fields>
    {
        if (this.runtime.kingdomId > 999999)
        {
            return {};
        }

        if (!this.store.normalRankingRealm)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        if (!(await this.store.normalRankingRealm()))
        {
            return {};
        }

        const type = wireInt(params, "rankType");
        const profile = this.runtime.checkProfile(
            await this.store.getProfileById(uid),
            this.runtime.now(),
        );

        if (profile.uid !== uid || num(profile, "serverId") !== this.runtime.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (![0, 1, 2].includes(type))
        {
            return {};
        }

        if (!this.publications.attributeRanking)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        return attributeRanking(await this.publications.attributeRanking(type), type);
    }

    async allianceRanking(uid: string, kind: AllianceRankingKind): Promise<Fields>
    {
        if (this.runtime.catalog.kingdomId !== this.runtime.kingdomId)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const query = allianceRankingQuery(kind, this.runtime.catalog, this.runtime.now());
        const snapshot = await this.store.allianceRanking(uid, query);
        const profile = this.runtime.checkProfile(snapshot.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.runtime.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return this.runtime.mapAlliance(
            kind,
            selectAllianceRanking(query, snapshot, this.runtime.scienceEffects),
        );
    }

    async ranking(uid: string, kind: PlayerRankingKind): Promise<Fields>
    {
        if (this.runtime.catalog.kingdomId !== this.runtime.kingdomId)
        {
            throw new GameError(errors.unsupported, "ranking");
        }

        const query = playerRankingQuery(kind, this.runtime.catalog, this.runtime.now());
        const snapshot = await this.store.playerRanking(uid, query);
        const profile = this.runtime.checkProfile(snapshot.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.runtime.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return playerRanking(kind, selectPlayerRanking(uid, query, snapshot));
    }
}
