import type { Fields } from "@opencok/messages/sfs";
import type { AllianceSelection } from "./context-state";

export interface AllianceCommandRequest
{
    requestId: string;
    request: Fields;
    selection: AllianceSelection;
}

export interface AllianceCommandRuntime
{
    allianceFailure(code?: string): never;
    cityInteger(value: unknown, min?: number, max?: number): number;
    randomUUID(): string;
    unsupportedFailure(): never;
}
