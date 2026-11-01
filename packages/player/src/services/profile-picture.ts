import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { encode, sfs, str, type Fields } from "@opencok/messages/sfs";
import { num, text } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { PreparedActivity } from "@opencok/contracts/timed-activity";
import type { ProfilePictureContext } from "../contracts/profile-picture";
import { ProfilePictureCommand } from "../enums/profile-picture-command";

const SYSTEM_VERSION_BASE = 1000000;

export class ProfilePictureDomain extends ActivityDomain<ProfilePictureContext>
{
    public readonly commands = [ProfilePictureCommand.Change];
    public readonly types: readonly number[] = [];

    public readonly prepare = async (
        context: ProfilePictureContext,
        command: string,
        params: Fields,
    ): Promise<PreparedActivity> => {
        if (command !== ProfilePictureCommand.Change)
        {
            throw new GameError(errors.unsupported);
        }
        const profile = context.state.profile;
        if (
            text(profile, "uid") !== context.owner
            || num(profile, "serverId") !== context.rules.kingdomId
        )
        {
            throw new GameError(errors.invalid);
        }
        const picture = str(params, "pic");
        const id = str(params, "picid", "");
        const rule = context.rules.profile.lordImages?.get(id);
        const previousVersion = num(profile, "picVer");
        const failure = () => ({
            response: encode({ result: sfs.bool(false), picVer: sfs.int(previousVersion) }),
            event: null,
        });
        if (!rule || rule.name !== picture)
        {
            return failure();
        }
        const body: Fields = { result: sfs.bool(true) };
        if (picture !== text(profile, "pic"))
        {
            const token = "200026";
            if ((context.economy.quantity?.(token) ?? 0) > 0)
            {
                context.economy.item(token, -1);
            }
            else
            {
                const cost = Number(rule.value);
                if (!Number.isSafeInteger(cost) || cost < 0 || !context.economy.balance)
                {
                    throw new GameError(errors.unsupported);
                }
                if (context.economy.balance("gold") < BigInt(cost))
                {
                    return failure();
                }
                context.economy.gold(-BigInt(cost));
                body.gold = sfs.long(context.economy.balance("gold"));
            }
        }
        const version = previousVersion > 0 && previousVersion < SYSTEM_VERSION_BASE
            ? previousVersion + SYSTEM_VERSION_BASE
            : previousVersion;
        context.write.appearance = { ...context.write.appearance, pic: picture, picVer: version };
        body.picVer = sfs.int(version);
        return { response: encode(body), event: null };
    };

    public readonly apply = async (): Promise<Fields> => {
        throw new GameError(errors.unsupported);
    };
}
