import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { PostboxCommands } from "@opencok/contracts/postbox-orchestration";
import type {
    MailSaveMode,
    MailGroupQuery,
    MailGroupPreview,
    MailListCommand,
} from "@opencok/contracts/mail";
import type { ServerConfig } from "@opencok/contracts/server";
import { num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { mailDeleted, mailSave, mailStatus } from "@opencok/mappings/mail";
import { Type, int as wireInt, str as wireString, type Fields } from "@opencok/messages/sfs";
import { javaDecimal } from "@opencok/rules/java-integer";
import {
    mailBlank,
    mailBatchQuery,
    mailBatchIsChat,
    mailDeleteQuery,
    mailReadQuery,
    mailSaveQuery,
    mailStatusQuery,
    calculateMailStatus,
} from "@opencok/rules/mail";
import {
    mailGroupQuery,
    mailGroupRule,
    mailGroupSenders,
    mailGroupWindow,
} from "@opencok/rules/mail-groups";
import { checkGameProfile } from "./game-profile";
import { planMailDeletion } from "./mail-delete";
import { mailGroupProjection } from "./mail-groups";
import { mailListProjection } from "./mail-list";
import { resolveMailPresentation } from "./mail-presentation";
import { systemMailProjection } from "./mail-system";
import { mailUpdateCursor, mailUpdatesProjection } from "./mail-updates";

export class PostboxOrchestrationService implements PostboxCommands
{
    constructor(
        private readonly db: Pick<
            GameStore,
            | "getProfileById"
            | "mailStatus"
            | "mailSave"
            | "mailRead"
            | "mailDelete"
            | "getSystemMailByPlayerId"
            | "mailUpdates"
            | "mailBatch"
            | "mailGroups"
        >,
        private readonly config: Pick<ServerConfig, "kingdomId" | "mailTranslationEnabled">,
        private readonly now = Date.now,
        private readonly services: Pick<
            GameServices,
            "lastSystemMail" | "systemMailPage" | "playerUpdateTimes"
        > = {},
    )
    {}

    async mailStatus(uid: string, params: Fields): Promise<Fields>
    {
        const field = params.category;
        let category: number | undefined;

        if (field !== undefined)
        {
            if (field.type !== Type.Int || typeof field.value !== "number")
            {
                throw new GameError(errors.invalid);
            }

            category = field.value;
        }

        const query = mailStatusQuery(category, this.now());
        const state = await this.db.mailStatus(uid, query);
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return mailStatus(calculateMailStatus(query, state.counts));
    }

    async mailSave(uid: string, mode: MailSaveMode, params: Fields): Promise<Fields>
    {
        const ids = mode === "batch" ? params.uids : params.uid;
        const flag = mode === "batch" ? params.flag : params.type;

        if (
            !ids
            || ids.type !== Type.String
            || typeof ids.value !== "string"
            || !flag
            || flag.type !== Type.Int
            || typeof flag.value !== "number"
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = mailSaveQuery(mode, ids.value, flag.value, this.now());
        const state = await this.db.mailSave(uid, query);
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return mailSave(state.result);
    }

    async mailRead(uid: string, batch: boolean, params: Fields): Promise<Fields>
    {
        const ids = batch ? params.uids : params.uid;
        const type = params.type;

        if (
            !ids
            || ids.type !== Type.String
            || typeof ids.value !== "string"
            || (!batch
                && (!type
                    || type.type !== Type.Int
                    || typeof type.value !== "number"
                    || !Number.isInteger(type.value)
                    || type.value < -2147483648
                    || type.value > 2147483647))
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = mailReadQuery(batch, ids.value, this.now());
        const state = await this.db.mailRead(uid, query);
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return {};
    }

    async mailDelete(uid: string, params: Fields): Promise<Fields>
    {
        const ids = params.uids;
        const legacyNum = params.num;

        if (
            !ids
            || ids.type !== Type.String
            || typeof ids.value !== "string"
            || (legacyNum !== undefined
                && (legacyNum.type !== Type.Int
                    || typeof legacyNum.value !== "number"
                    || !Number.isInteger(legacyNum.value)
                    || legacyNum.value < -2147483648
                    || legacyNum.value > 2147483647))
        )
        {
            throw new GameError(errors.invalid);
        }

        const query = mailDeleteQuery(ids.value, this.now());
        const state = await this.db.mailDelete(
            uid,
            query,
            (entries) => planMailDeletion(uid, entries),
        );
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        return mailDeleted(state.deleted);
    }

    async mailSystem(uid: string, params: Fields, legacy = false): Promise<Fields>
    {
        if (legacy && !this.services.systemMailPage)
        {
            throw new GameError(errors.unsupported);
        }

        const clientseq = params.clientseq;

        if (
            !clientseq
            || (clientseq.type !== Type.Null
                && (clientseq.type !== Type.String || typeof clientseq.value !== "string"))
        )
        {
            throw new GameError(errors.invalid);
        }

        const count = wireInt(params, "count");
        let time = 0n;

        if (params.time !== undefined)
        {
            try
            {
                time = javaDecimal(wireString(params, "time"), 64);
            }
            catch
            {
                throw new GameError(errors.invalid);
            }
        }

        const now = this.now();
        const profile = checkGameProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (!this.db.getSystemMailByPlayerId)
        {
            throw new GameError(errors.unsupported);
        }

        let anchor = clientseq.type === Type.Null ? null : (clientseq.value as string);

        if (mailBlank(anchor) || anchor === "0")
        {
            if (!this.services.lastSystemMail)
            {
                throw new GameError(errors.unsupported);
            }

            anchor = await this.services.lastSystemMail(uid);
        }

        if (mailBlank(anchor) || anchor === "0")
        {
            anchor = null;
        }

        if (
            anchor !== null
            && (anchor.length > 40 || anchor.includes("\0") || !anchor.isWellFormed())
        )
        {
            throw new GameError(errors.invalid);
        }

        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        let body: Fields | undefined;
        const state = await this.db.getSystemMailByPlayerId(
            uid,
            { anchor, time, now },
            async (entries, readers) => {
                body = await systemMailProjection(
                    uid,
                    entries,
                    readers,
                    count,
                    time,
                    envelope,
                    legacy
                        ? (ids, inspect) =>
                            this.services.systemMailPage!(uid, ids, count, time, inspect)
                        : undefined,
                );
            },
        );
        const current = checkGameProfile(state.profile, now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (!body)
        {
            throw new GameError(errors.unsupported);
        }

        return body;
    }

    async mailUpdates(uid: string, params: Fields): Promise<Fields>
    {
        const now = this.now();
        const profile = checkGameProfile(await this.db.getProfileById(uid), now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (!Object.hasOwn(params, "time"))
        {
            return {};
        }

        const time = params.time;

        if (
            !time
            || (time.type !== Type.Null
                && (time.type !== Type.String || typeof time.value !== "string"))
        )
        {
            throw new GameError(errors.invalid);
        }

        if (!this.db.mailUpdates)
        {
            throw new GameError(errors.unsupported);
        }

        const after = mailUpdateCursor(time.type === Type.Null ? null : (time.value as string));
        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        let body: Fields | undefined;
        const state = await this.db.mailUpdates(uid, { after, now }, (entries) => {
            body = mailUpdatesProjection(entries, envelope);
        });
        const current = checkGameProfile(state.profile, now);

        if (current.uid !== uid || num(current, "serverId") !== this.config.kingdomId)
        {
            throw new GameError(errors.invalid);
        }

        if (!body)
        {
            throw new GameError(errors.unsupported);
        }

        return body;
    }

    async mailBatch(uid: string, params: Fields, command: MailListCommand): Promise<Fields>
    {
        const fromUser = params.fromUser === undefined || params.fromUser.type === Type.Null
            ? null
            : wireString(params, "fromUser");

        if (fromUser !== null && typeof fromUser !== "string")
        {
            throw new GameError(errors.invalid);
        }

        const type = command === "mread.chat" && params.type === undefined
            ? 4
            : wireInt(params, "type");
        const begin = wireInt(params, "num");
        const limit = wireInt(params, "offset");
        const now = this.now();

        if (type === 10 || type === 1000)
        {
            return this.mailGroups(uid, params, mailGroupQuery(type, begin, limit, now), command);
        }

        const query = mailBatchQuery(type, begin, limit, fromUser, now);
        const chat = mailBatchIsChat(query);
        let body: Fields | undefined;
        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        const state = await this.db.mailBatch(uid, query, async (entries, readers) => {
            if (entries.length > query.limit)
            {
                throw new GameError(errors.invalid);
            }

            const presentation = await resolveMailPresentation(
                entries,
                readers,
                chat,
                this.config.mailTranslationEnabled ?? true,
                async () =>
                    (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(
                        uid,
                    ) ?? "",
            );
            const projection = mailListProjection(
                uid,
                entries,
                presentation,
                chat ? "conversation" : "ordinary",
                command,
                envelope,
            );
            body = projection.body;

            return projection.invalidIds;
        });
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }

    private async mailGroups(
        uid: string,
        params: Fields,
        query: MailGroupQuery,
        command: MailListCommand,
    ): Promise<Fields>
    {
        const envelope: Fields = {};

        for (const key of ["_cok_", "cmdBaseTime"])
        {
            if (params[key] !== undefined)
            {
                envelope[key] = params[key]!;
            }
        }

        let body: Fields | undefined;
        const state = await this.db.mailGroups(uid, query, async (groups, readers) => {
            const selected = mailGroupWindow(uid, query, groups);
            const senders = await readers.senders(mailGroupSenders(groups));
            const previews: MailGroupPreview[] = [];

            for (const group of selected)
            {
                const rule = mailGroupRule(group.groupType);
                previews.push(
                    rule && (rule.kind !== "sender" || senders.has(group.groupIndex))
                        ? await readers.preview(group, rule)
                        : { entries: [], total: 0n, unread: 0n },
                );
            }

            const chatEntries = previews.flatMap((preview, index) =>
                mailGroupRule(selected[index]!.groupType)?.kind === "uid"
                    ? []
                    : [...preview.entries]
            );
            const presentation = await resolveMailPresentation(
                chatEntries,
                readers,
                true,
                this.config.mailTranslationEnabled ?? true,
                async () =>
                    (await this.services.playerUpdateTimes?.(this.config.kingdomId, [uid]))?.get(
                        uid,
                    ) ?? "",
                senders,
            );
            const projection = mailGroupProjection(
                uid,
                query,
                { groups, previews },
                presentation,
                envelope,
                command,
            );
            body = projection.body;

            return projection.cleanup;
        });
        const profile = checkGameProfile(state.profile, query.now);

        if (profile.uid !== uid || num(profile, "serverId") !== this.config.kingdomId || !body)
        {
            throw new GameError(errors.invalid);
        }

        return body;
    }
}
