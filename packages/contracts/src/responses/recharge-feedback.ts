import type { ResponseValue } from "./value";

export interface RechargeFeedbackResponse
{
    daily_tab: readonly Record<string, ResponseValue>[];
    daily_bool: readonly boolean[];
}
