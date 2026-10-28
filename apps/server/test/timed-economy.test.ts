import { expect, test } from "bun:test";
import { activityState, transitionActivity, idleDeadline } from "@opencok/rules/timed-activity";
import type { TimedActivity } from "@opencok/contracts/timed-activity";

const activity: TimedActivity = {
    id: "activity",
    ownerId: "owner",
    queueId: "queue",
    type: 0,
    itemId: "building",
    startedAt: 1000n,
    dueAt: 20000n,
    version: 1,
    status: 0,
};
test("activity deadlines preserve the legacy tolerance and reject stale or conflicting transitions", () => {
    expect(activityState(idleDeadline, 1000n)).toBe("idle");
    expect(activityState(20000n, 14999n)).toBe("running");
    expect(activityState(20000n, 15000n)).toBe("due");
    expect(() => transitionActivity(activity, "finish", 14999n, 1)).toThrow();
    expect(() => transitionActivity(activity, "cancel", 15000n, 1)).toThrow();
    const finished = transitionActivity(activity, "finish", 15000n, 1);
    expect(finished.status).toBe(1);
    expect(finished.version).toBe(2);
    expect(() => transitionActivity(finished, "finish", 20000n, 2)).toThrow();
    expect(() => transitionActivity(activity, "cancel", 10000n, 2)).toThrow();
    expect(() => transitionActivity(activity, "reschedule", 10000n, 1, 30000n)).toThrow();
    expect(transitionActivity(activity, "reschedule", 10000n, 1, 12000n).dueAt).toBe(12000n);
});
