import type { Row } from "@opencok/contracts/rows";

export type GeneralAbility = Readonly<Record<string, string | number | null>>;

export interface GeneralPreview
{
    uuid: string;
    generalId: string;
    level: number;
    status: number;
    attack: number;
    defence: number;
    plusSkillPoint: number;
    ability: readonly GeneralAbility[];
    skills: readonly Row[];
}
