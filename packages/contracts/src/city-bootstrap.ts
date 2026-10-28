import type { CityState } from "./game";
import type { Row } from "./rows";
import type { Fields } from "@opencok/messages/sfs";

export type ReadyCity = CityState & { profile: Row; resource: Row; };

export interface CityBootstrapResult
{
    body: Fields;
    pushes: { command: string; body: Fields; }[];
}

export interface CityBootstrapRuntime
{
    state(uid: string): Promise<ReadyCity>;
    info(state: ReadyCity): Fields;
    initialize(
        uid: string,
        correlation?: Fields,
        signal?: AbortSignal,
    ): Promise<CityBootstrapResult>;
}

export interface CityBootstrapHooks
{
    power(uid: string): Promise<Fields>;
    features(profile: Row): Fields;
}

export type CityBootstrapFactory = (hooks: CityBootstrapHooks) => CityBootstrapRuntime;
