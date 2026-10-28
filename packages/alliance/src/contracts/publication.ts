import type { Fields } from "@opencok/messages/sfs";
import type { AllianceRecord as Row } from "./records";

export interface AlliancePublicationSnapshot
{
    profiles: readonly Row[];
    record?: Row;
    members: readonly Row[];
    queues: readonly Row[];
    helps: readonly Row[];
    sciences: readonly Row[];
    research: readonly Row[];
}

export type AlliancePublicationReader = (
    id: string,
    players?: readonly string[],
) => Promise<AlliancePublicationSnapshot>;

export type AlliancePublisher = (
    owner: string,
    command: string,
    body: Fields,
) => Promise<unknown>;
