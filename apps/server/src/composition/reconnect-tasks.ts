import { ReconnectTaskPolicy } from "@opencok/tasks/rules/reconnect-task";
import { ReconnectTaskCounts } from "@opencok/tasks/rules/reconnect-counts";
import { ReconnectTaskMapper } from "@opencok/tasks/mappings/reconnect";
import type { Rules } from "@opencok/rules/game";
import { javaDecimal } from "@opencok/rules/java-integer";
import { javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { mailBlank } from "@opencok/rules/mail";
import { signed, invalid } from "@opencok/mappings/reconnect-values";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";

export function createRealmReconnectTaskPolicy()
{
    return new ReconnectTaskPolicy({ javaDecimal, javaIntHashMapOrder, mailBlank });
}

export function createRealmReconnectTaskCounts()
{
    return new ReconnectTaskCounts({ javaDecimal });
}

export function createRealmReconnectTaskMapper()
{
    return new ReconnectTaskMapper<Rules>({ signed, invalid, previewRewards, rewardPreviewArray });
}
