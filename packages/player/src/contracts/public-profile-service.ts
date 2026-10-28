import type { Row } from "@opencok/contracts/rows";
import type { Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import type { PublicProfileState, RoutedPublicProfile } from "./public-profile.ts";

export interface PublicProfileStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    publicProfile(
        uid: string,
        observerAllianceId: string,
    ): Promise<RoutedPublicProfile | undefined>;
}

export interface PublicProfileRuntime
{
    checkProfile(profile: Row | undefined, now: number): Row;
    generals(state: PublicProfileState, rules: Rules, now: number): Fields;
    alliance(state: PublicProfileState, rules: Rules, remote: boolean): Fields;
    playerUpdateTimes?(
        kingdomId: number,
        uids: string[],
    ): Promise<ReadonlyMap<string, string> | undefined>;
}
