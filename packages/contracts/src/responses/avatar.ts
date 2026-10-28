import type { Fields } from "@opencok/messages/sfs";

export interface AvatarCommandResponse
{
    body: Fields;
    pushes: { command: string; body: Fields; }[];
}
