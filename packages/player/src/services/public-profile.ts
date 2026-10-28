import { text, num } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { Type, sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import type {
    PublicProfileStore,
    PublicProfileRuntime,
} from "../contracts/public-profile-service.ts";
import { publicProfileBase } from "../mappings/public-profile.ts";

export class PublicProfileService
{
    constructor(
        readonly store: PublicProfileStore,
        readonly rules: Rules,
        readonly config: { kingdomId: number; },
        readonly runtime: PublicProfileRuntime,
        readonly now = Date.now,
    )
    {}

    async get(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const observer = this.runtime.checkProfile(await this.store.getProfileById(uid), now);

        if (text(observer, "uid") !== uid)
        {
            throw new GameError(errors.invalid);
        }

        const target = params.uid;

        if (!target || target.type === Type.Null)
        {
            throw new GameError(errors.missing);
        }

        if (target.type !== Type.String || typeof target.value !== "string")
        {
            throw new GameError(errors.invalid);
        }

        if (!target.value.trim())
        {
            throw new GameError(errors.missing);
        }

        if (!/^[0-9]{1,40}$/.test(target.value))
        {
            throw new GameError(errors.invalid);
        }

        const result = await this.store.publicProfile(target.value, text(observer, "allianceId"));

        if (!result?.state.profile)
        {
            throw new GameError(errors.missing);
        }

        const { state, kingdomId } = result;

        if (
            !Number.isInteger(kingdomId)
            || kingdomId <= 0
            || kingdomId > 2147483647
            || text(state.profile!, "uid") !== target.value
            || num(state.profile!, "serverId") !== kingdomId
        )
        {
            throw new GameError(errors.invalid);
        }

        if (
            state.alliance
            && state.alliance.withEffects
                !== (text(observer, "allianceId") !== text(state.profile!, "allianceId"))
        )
        {
            throw new GameError(errors.invalid);
        }

        const context = { kingdomId: this.config.kingdomId, version: MOBILE_CLIENT_VERSION, now };
        const body = {
            ...publicProfileBase(state, this.rules, context, "", kingdomId),
            ...this.runtime.generals(state, this.rules, now),
            ...this.runtime.alliance(state, this.rules, kingdomId !== this.config.kingdomId),
        };
        const updates = await this.runtime.playerUpdateTimes?.(kingdomId, [target.value]);
        body.lastUpdateTime = sfs.string(updates?.get(target.value) ?? "");

        return body;
    }
}
