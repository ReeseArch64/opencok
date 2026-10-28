import type { Row } from "@opencok/contracts/rows";
import type { PublicAllianceProfile } from "@opencok/contracts/profile";

export interface RoutedPublicProfile
{
    state: PublicProfileState;
    kingdomId: number;
}

export interface PublicProfileState extends PublicAllianceProfile
{
    statistics: Row | undefined;
    vip: Row | undefined;
    lord: Row | undefined;
    mixed: Row | undefined;
    military: Row | undefined;
    office: Row | undefined;
    flowers: Row | undefined;
    taverns: readonly Row[];
    generals: readonly Row[];
    skills: readonly Row[];
    equipment: readonly Row[];
    honors: readonly Row[];
    completedAchievements: number;
}
