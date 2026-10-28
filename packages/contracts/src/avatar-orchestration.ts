import type { Fields } from "@opencok/messages/sfs";

import type { AvatarCommandResponse } from "./responses/avatar";

export interface AvatarCommands
{
    avatarVersion(uid: string): Promise<Fields>;
    avatarFinish(uid: string, params: Fields): Promise<AvatarCommandResponse>;
    avatarUrl(uid: string, params: Fields): Promise<Fields>;
    avatarGrant(uid: string, params: Fields): Promise<Fields>;
}
