import type { Row } from "@opencok/contracts/rows";

export interface CelebrityDescriptionStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    celebrityDescription?(uid: string, kingdomId: number): Promise<Buffer | null>;
    saveCelebrityDescription?(
        uid: string,
        now: number,
        readDescription: () => Buffer | null,
    ): Promise<void>;
}

export interface CelebrityDescriptionRuntime
{
    filterBadWords?(text: string): string;
}
