import { ReconnectTaskCounts } from "@opencok/tasks/rules/reconnect-counts";
import { javaDecimal } from "./java-integer";

export const { reconnectContainsBuildings, reconnectResourceOutput, reconnectTaskInitialCount } =
    new ReconnectTaskCounts({ javaDecimal });
