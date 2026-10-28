import type { Row } from "@opencok/contracts/rows";
import type { LoginConfigurationState } from "@opencok/contracts/game";

export interface PushPreference
{
    type: number;
    status: number;
    audio: number;
}

export interface PushPreferenceStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    getConfigurationByPlayerId(uid: string): Promise<LoginConfigurationState>;
    initializeWorldNewsPreference?(uid: string, now: number): Promise<void>;
    setPushPreference?(uid: string, preference: PushPreference, now: number): Promise<void>;
}
