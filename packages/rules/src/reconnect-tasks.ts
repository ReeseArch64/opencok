import { ReconnectTaskPolicy } from "@opencok/tasks/rules/reconnect-task";
import { javaDecimal } from "./java-integer";
import { javaIntHashMapOrder } from "./java-hash-map-order";
import { mailBlank } from "./mail";

export const { reconnectTaskPlan } = new ReconnectTaskPolicy({
    javaDecimal,
    javaIntHashMapOrder,
    mailBlank,
});
