import type { Row } from "@opencok/contracts/rows";

export interface HeroCalendarState
{
    activities: readonly Row[];
    events: readonly Row[];
    blocked: boolean;
}

export interface HeroCalendarPlan
{
    activities: readonly Row[];
    events: readonly Row[];
}

export interface HeroCalendarStore
{
    reconcile(build: (state: HeroCalendarState) => HeroCalendarPlan): Promise<void>;
}
