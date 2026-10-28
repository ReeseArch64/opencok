import { randomUUID } from "node:crypto";
import { nicknameChangeReply } from "../mappings/nickname-change.ts";
import { validateNicknameChange } from "../rules/nickname-change.ts";
import { checkNickname } from "../rules/nickname-check.ts";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num } from "@opencok/contracts/rows";
import { Type, sfs, int as wireInt, str as wireString, type Fields } from "@opencok/messages/sfs";
import type { NicknameStore, NicknameRuntime } from "../contracts/nickname-service.ts";

export class NicknameService
{
    constructor(
        readonly store: NicknameStore,
        readonly kingdomId: number,
        readonly runtime: NicknameRuntime,
        readonly now = Date.now,
    )
    {}

    async check(uid: string, params: Fields): Promise<Fields>
    {
        const profile = this.runtime.checkProfile(await this.store.getProfileById(uid), this.now());

        if (profile.uid !== uid || num(profile, "serverId") !== this.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        const result = await checkNickname(
            wireString(params, "nickName"),
            Object.hasOwn(params, "type") ? wireInt(params, "type") : 0,
            {
                containsBadWords: (name) => {
                    if (!this.runtime.nicknameBadWords)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    return this.runtime.nicknameBadWords(name);
                },
                occupied: (name) => {
                    if (!this.store.nicknameOccupied)
                    {
                        throw new GameError(errors.unsupported);
                    }

                    return this.store.nicknameOccupied(name);
                },
            },
        );

        return {
            occupied: sfs.int(result.occupied),
            exist: sfs.int(result.exist),
            length: sfs.int(result.length),
            remainLength: sfs.int(result.remainLength),
        };
    }

    async change(owner: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const profile = await this.store.getProfileById(owner);

        if (!profile)
        {
            throw new GameError(errors.missing);
        }

        if (
            profile.uid !== owner
            || profile.serverId !== this.kingdomId
            || (profile.banFlag ?? 0) !== 0
            || typeof (profile.banTime ?? 0n) !== "bigint"
            || ((profile.banTime as bigint) ?? 0n) > BigInt(now)
        )
        {
            throw new GameError(errors.invalid);
        }

        if (params.nickName?.type !== Type.String || typeof params.nickName.value !== "string")
        {
            throw new GameError(errors.invalid);
        }

        if (
            !this.runtime.nicknameChange || !this.runtime.nicknameForbidden
            || !this.runtime.nicknameBadWords
        )
        {
            throw new GameError(errors.unsupported);
        }

        const operation = params.operationId;

        if (
            operation !== undefined
            && (operation.type !== Type.String
                || typeof operation.value !== "string"
                || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
                    .test(
                        operation.value,
                    ))
        )
        {
            throw new GameError(errors.invalid);
        }

        const name = await validateNicknameChange(params.nickName.value, {
            forbidden: this.runtime.nicknameForbidden,
            badWords: this.runtime.nicknameBadWords,
        });

        return nicknameChangeReply(
            await this.runtime.nicknameChange(
                owner,
                operation ? (operation.value as string).toLowerCase() : randomUUID(),
                name,
                now,
            ),
        );
    }
}
