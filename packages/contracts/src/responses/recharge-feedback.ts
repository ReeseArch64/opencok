import type { ResponseValue } from "@opencok/messages/contracts/response-value";

export interface RechargeFeedbackResponse
{
    daily_tab: readonly Record<string, ResponseValue>[];
    daily_bool: readonly boolean[];
}
