import type { Row } from "@opencok/contracts/rows";
import type { NicknameChangeRecord } from "./nickname-change.ts";

export interface NicknameStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    nicknameOccupied?(name: string): Promise<boolean>;
}

export interface NicknameRuntime
{
    checkProfile(profile: Row | undefined, now: number): Row;
    nicknameChange?(
        owner: string,
        operationId: string,
        validatedName: string,
        now: number,
    ): Promise<NicknameChangeRecord>;
    nicknameForbidden?(name: string): boolean | Promise<boolean>;
    nicknameBadWords?(name: string): boolean | Promise<boolean>;
}
