import type {
    CelebrityDescriptionStore,
    CelebrityDescriptionRuntime,
} from "../contracts/celebrity-description.ts";
import { long, num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { int, str, sfs, type Fields } from "@opencok/messages/sfs";
import { mailBlank } from "@opencok/rules/mail";
import { nicknameTrim } from "@opencok/rules/nickname";
import { javaMailBytes } from "@opencok/rules/avatar-mail";

const utf8 = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

export class CelebrityDescriptionService
{
    constructor(
        readonly store: CelebrityDescriptionStore,
        readonly kingdomId: number,
        readonly runtime: CelebrityDescriptionRuntime = {},
    )
    {}

    async read(owner: string, params: Fields, now: number): Promise<Fields>
    {
        const profile = await this.store.getProfileById(owner);

        if (!profile)
        {
            throw new GameError(errors.missing);
        }

        if (
            profile.uid !== owner
            || num(profile, "serverId") !== this.kingdomId
            || num(profile, "banFlag") !== 0
            || long(profile, "banTime") > BigInt(now)
        )
        {
            throw new GameError(errors.invalid);
        }

        const uid = str(params, "uid");

        if (typeof uid !== "string")
        {
            throw new GameError(errors.invalid);
        }

        const empty = { description: sfs.string("") };

        if (mailBlank(uid))
        {
            return empty;
        }

        const serverId = int(params, "serverId");

        if (!Number.isInteger(serverId) || serverId < -2147483648 || serverId > 2147483647)
        {
            throw new GameError(errors.invalid);
        }

        if (!this.store.celebrityDescription)
        {
            throw new GameError(errors.unsupported);
        }

        const bytes = await this.store.celebrityDescription(uid, serverId);

        if (bytes === null || bytes === undefined)
        {
            return empty;
        }

        if (!Buffer.isBuffer(bytes) || bytes.length > 65535)
        {
            throw new GameError(errors.unsupported);
        }

        if (bytes.length === 0)
        {
            return empty;
        }

        let description: string;

        try
        {
            description = nicknameTrim(utf8.decode(bytes));
        }
        catch
        {
            return empty;
        }

        return mailBlank(description) ? empty : { description: sfs.string(description) };
    }

    async save(owner: string, params: Fields, now: number): Promise<Fields>
    {
        const profile = await this.store.getProfileById(owner);

        if (!profile)
        {
            throw new GameError(errors.missing);
        }

        if (
            profile.uid !== owner
            || num(profile, "serverId") !== this.kingdomId
            || num(profile, "banFlag") !== 0
            || long(profile, "banTime") > BigInt(now)
        )
        {
            throw new GameError(errors.invalid);
        }

        if (num(profile, "gmFlag") !== 11)
        {
            return {};
        }

        if (!this.store.saveCelebrityDescription)
        {
            throw new GameError(errors.unsupported);
        }

        await this.store.saveCelebrityDescription(owner, now, () => {
            const description = str(params, "description");

            if (typeof description !== "string")
            {
                throw new GameError(errors.invalid);
            }

            if (!this.runtime.filterBadWords)
            {
                throw new GameError(errors.unsupported);
            }

            const filtered = this.runtime.filterBadWords(description);

            if (typeof filtered !== "string")
            {
                throw new GameError(errors.unsupported);
            }

            if (!filtered.isWellFormed())
            {
                return null;
            }

            const bytes = javaMailBytes(filtered);

            return bytes === null ? null : Buffer.from(bytes);
        });

        return {};
    }
}
