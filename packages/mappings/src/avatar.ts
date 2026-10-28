import type { AvatarCommandResponse } from "@opencok/contracts/responses/avatar";
import type { AvatarVersionIntent } from "@opencok/contracts/avatar-version";
import { UPLOAD_PATH, type AvatarGrant } from "@opencok/contracts/files";
import { sfs, type Fields } from "@opencok/messages/sfs";

export class AvatarMapper
{
    version(uid: string, intent: Pick<AvatarVersionIntent, "picVer" | "nextUpdateTime">): Fields
    {
        const body: Fields = { uid: sfs.string(uid), picVer: sfs.int(intent.picVer) };

        if (intent.nextUpdateTime !== null)
        {
            body.nextUpdateTime = sfs.long(intent.nextUpdateTime);
        }

        return body;
    }

    finish(uid: string, picVer: number, superseded: boolean): AvatarCommandResponse
    {
        const body: Fields = {
            uid: sfs.string(uid),
            picVer: sfs.int(picVer),
            superseded: sfs.bool(superseded),
        };

        return { body, pushes: [{ command: "push.picVer.update", body: { ...body } }] };
    }

    url(owner: string, path: string): Fields
    {
        return { owner: sfs.string(owner), path: sfs.string(path) };
    }

    grant(grant: AvatarGrant): Fields
    {
        return {
            owner: sfs.string(grant.owner),
            sequence: sfs.int(grant.sequence),
            grant: sfs.string(grant.grant),
            uploadPath: sfs.string(`${UPLOAD_PATH}?grant=${grant.grant}`),
            pendingHash: sfs.string(grant.pendingHash),
        };
    }
}
