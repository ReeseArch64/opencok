import type { PushPreferenceStore } from "../contracts/push-preferences";
import type { UpdatePushPreferenceDto } from "../dtos/update-push-preference.dto";
import { PushPreferenceCommand } from "../enums/push-preference-command";
import { long, num, type Row } from "@opencok/contracts/rows";
import { errors, PUSH_SETTING_COUNT, WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { int, type Fields } from "@opencok/messages/sfs";
import { pushPreferences } from "@opencok/mappings/bootstrap";

export class PushPreferenceService
{
    constructor(readonly store: PushPreferenceStore, readonly now: () => number = Date.now)
    {}

    configuration(uid: string)
    {
        return this.store.getConfigurationByPlayerId(uid);
    }

    async initialize(uid: string, rows: readonly Row[], now: number): Promise<void>
    {
        if (
            rows.length < PUSH_SETTING_COUNT
            && !rows.some((row) => num(row, "type") === WORLD_NEWS_PUSH_TYPE)
        )
        {
            if (!this.store.initializeWorldNewsPreference)
            {
                throw new GameError(errors.unsupported, "config_record");
            }

            await this.store.initializeWorldNewsPreference(uid, now);
        }
    }

    async command(uid: string, command: string, params: Fields): Promise<Fields>
    {
        switch (command)
        {
            case PushPreferenceCommand.Read:
                return this.read(uid);
            case PushPreferenceCommand.Write:
                return this.write(uid, params);
            default:
                throw new GameError(errors.unsupported);
        }
    }

    private checkProfile(profile: Row | undefined, now: number): void
    {
        if (!profile)
        {
            throw new GameError(errors.missing);
        }

        if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
        {
            throw new GameError(errors.invalid);
        }
    }

    private async read(uid: string): Promise<Fields>
    {
        const state = await this.configuration(uid);
        const now = this.now();
        this.checkProfile(state.profile, now);
        const pushSetting = pushPreferences(state.pushSettings);
        await this.initialize(uid, state.pushSettings, now);

        return { pushSetting };
    }

    private async write(uid: string, params: Fields): Promise<Fields>
    {
        const audio = int(params, "audio", 1);
        const type = int(params, "type");
        const status = int(params, "status");

        if (
            [type, status, audio].some(
                (value) => !Number.isInteger(value) || value < -2147483648 || value > 2147483647,
            )
        )
        {
            throw new GameError(errors.invalid);
        }

        if (!this.store.setPushPreference)
        {
            throw new GameError(errors.unsupported);
        }

        this.checkProfile(await this.store.getProfileById(uid), this.now());
        const dto: UpdatePushPreferenceDto = { type, status, audio };
        await this.store.setPushPreference(uid, dto, this.now());

        return {};
    }
}
