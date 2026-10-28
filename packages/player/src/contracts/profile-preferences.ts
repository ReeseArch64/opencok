import type { Row } from "@opencok/contracts/rows";

export type ProfilePreferenceField =
    | "showEquip"
    | "showMedal"
    | "marchSoldierShow"
    | "colorblind"
    | "scrollEquip"
    | "showBanner"
    | "clientSaveFlag";

export interface ProfilePreferenceStore
{
    getProfileById(uid: string): Promise<Row | undefined>;
    updateProfilePreference?(
        uid: string,
        field: ProfilePreferenceField,
        now: number,
        readValue: () => number,
    ): Promise<number | undefined>;
}
