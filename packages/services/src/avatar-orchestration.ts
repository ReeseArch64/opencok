import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { AvatarCommands } from "@opencok/contracts/avatar-orchestration";
import type { AvatarCommandResponse } from "@opencok/contracts/responses/avatar";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { AvatarMapper } from "@opencok/mappings/avatar";
import { Type, type Fields } from "@opencok/messages/sfs";
import {
    avatarSequence,
    avatarMinimumLevel,
    checkAvatarLevel,
    checkAvatarRecord,
} from "@opencok/rules/avatar";
import type { Rules } from "@opencok/rules/game";
import { checkGameProfile } from "./game-profile";

export class AvatarOrchestrationService implements AvatarCommands
{
    constructor(
        private readonly db: Pick<GameStore, "getProfileById">,
        private readonly rules: Rules,
        private readonly config: { kingdomId: number; },
        private readonly now = Date.now,
        private readonly services: Pick<GameServices, "avatar" | "avatarFinish" | "avatarVersion"> =
            {},
        private readonly mapper = new AvatarMapper(),
    )
    {}

    async avatarVersion(uid: string): Promise<Fields>
    {
        const service = this.services.avatarVersion;

        if (!service)
        {
            throw new GameError(errors.unsupported);
        }

        if (!/^[0-9]{1,20}$/.test(uid))
        {
            throw new GameError(errors.invalid);
        }

        const now = this.now();
        const state = await service.update(uid, now);
        const profile = checkGameProfile(state.profile, now);
        const intent = state.intent;

        if (
            profile.uid !== uid
            || profile.serverId !== this.config.kingdomId
            || !intent
            || intent.ownerUid !== uid
            || !/^[a-f0-9]{32}$/.test(intent.operationId)
            || !Number.isInteger(intent.picVer)
            || intent.picVer < 1
            || intent.picVer > 2147483647
            || (intent.nextUpdateTime !== null
                && (typeof intent.nextUpdateTime !== "bigint"
                    || BigInt.asIntN(64, intent.nextUpdateTime) !== intent.nextUpdateTime))
        )
        {
            throw new GameError(errors.invalid);
        }

        try
        {
            await service.deliver(uid, intent.operationId);
        }
        catch
        {
        }

        return this.mapper.version(uid, intent);
    }

    async avatarFinish(uid: string, params: Fields): Promise<AvatarCommandResponse>
    {
        const service = this.services.avatarFinish;

        if (!service)
        {
            throw new GameError(errors.unsupported);
        }

        if (
            !/^[0-9]{1,20}$/.test(uid)
            || params.receipt?.type !== Type.String
            || typeof params.receipt.value !== "string"
            || !/^[1-9][0-9]{0,5}:[a-f0-9]{64}$/.test(params.receipt.value)
            || (params.gameuid !== undefined
                && (params.gameuid.type !== Type.String || params.gameuid.value !== uid))
        )
        {
            throw new GameError(errors.invalid);
        }

        const now = this.now();
        const receipt = params.receipt.value;
        const state = await service.finish(uid, receipt, now);
        const profile = checkGameProfile(state.profile, now);
        const sequence = Number(receipt.split(":")[0]);

        if (
            profile.uid !== uid
            || profile.serverId !== this.config.kingdomId
            || !Number.isInteger(state.picVer)
            || state.picVer! < 0
            || state.picVer! > 2147483647
            || state.picVer! % 1000000 < sequence
            || state.superseded !== sequence < state.picVer! % 1000000
        )
        {
            throw new GameError(errors.invalid);
        }

        try
        {
            await service.deliver(uid, sequence);
        }
        catch
        {
        }

        return this.mapper.finish(uid, state.picVer!, state.superseded);
    }

    async avatarUrl(uid: string, params: Fields): Promise<Fields>
    {
        const service = this.services.avatar;

        if (!service)
        {
            throw new GameError(errors.unsupported);
        }

        const now = this.now();
        const requester = checkGameProfile(await this.db.getProfileById(uid), now);

        if (requester.uid !== uid || requester.serverId !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const target = params.gameuid === undefined ? uid : params.gameuid.value;

        if (
            (params.gameuid !== undefined && params.gameuid.type !== Type.String)
            || typeof target !== "string"
            || !/^[0-9]{1,20}$/.test(target)
        )
        {
            throw new GameError(errors.invalid);
        }

        const profile = checkGameProfile(await this.db.getProfileById(target), now);

        if (profile.uid !== target || profile.serverId !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const version = profile.picVer;

        if (
            typeof version !== "number"
            || !Number.isInteger(version)
            || version < -2147483648
            || version > 2147483647
        )
        {
            throw new GameError(errors.invalid);
        }

        const sequence = Math.max(0, version % 1000000);

        return this.mapper.url(target, sequence ? await service.image(target, sequence) : "");
    }

    async avatarGrant(uid: string, params: Fields): Promise<Fields>
    {
        const service = this.services.avatar;

        if (!service)
        {
            throw new GameError(errors.unsupported);
        }

        if (
            !/^[0-9]{1,20}$/.test(uid)
            || (params.gameuid !== undefined
                && (params.gameuid.type !== Type.String || params.gameuid.value !== uid))
        )
        {
            throw new GameError(errors.invalid);
        }

        const now = this.now();
        const state = await service.read(uid, now, async (profile, readers) => {
            checkGameProfile(profile, now);

            if (profile.uid !== uid || profile.serverId !== this.config.kingdomId)
            {
                throw new GameError(errors.invalid);
            }

            const sequence = avatarSequence(profile.picVer);
            const minimum = avatarMinimumLevel(this.rules);

            if (minimum !== undefined)
            {
                checkAvatarLevel(await readers.castleLevel(), minimum);
                const record = await readers.uploadRecord();

                if (record && record.uid !== uid)
                {
                    throw new GameError(errors.invalid);
                }

                checkAvatarRecord(this.rules, record, now);
            }

            const receipt = await service.find(uid, sequence);

            if (
                receipt
                && (receipt.owner !== uid
                    || receipt.sequence !== String(sequence)
                    || !/^[a-f0-9]{64}$/.test(receipt.hash))
            )
            {
                throw new GameError(errors.invalid);
            }

            return {
                owner: uid,
                sequence,
                grant: await service.issue(uid, sequence),
                pendingHash: receipt?.hash ?? "",
            };
        });
        const profile = checkGameProfile(state.profile, now);

        if (
            profile.uid !== uid
            || profile.serverId !== this.config.kingdomId
            || !state.grant
            || state.grant.owner !== uid
        )
        {
            throw new GameError(errors.invalid);
        }

        return this.mapper.grant(state.grant);
    }
}
