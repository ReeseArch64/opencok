import { expect, mock, test } from "bun:test";
import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import type { TimedActivity } from "@opencok/contracts/timed-activity";
import type { CityProgressionStore } from "@opencok/contracts/city-progression";
import { encode, decode, sfs } from "@opencok/messages/sfs";
import type { CityDomain } from "../src/contracts/domain";
import type { CityContextProvider, CityProgressionHooks } from "../src/contracts/runtime";
import { CityProgressionService } from "../src/services/progression";
import { createPlan } from "./support/plan";

function setup(type = 0)
{
    const plan = createPlan();
    const trace: string[] = [];
    const response = { result: sfs.int(7) };
    const prepared = { response: encode(response) };
    const repository: CityProgressionStore = {
        getState: async () => plan.state,
        update: mock(async (write, economy) => {
            expect(write).toBe(plan.write);
            expect(economy).toBe(plan.economy);
            trace.push("write");
        }),
    };
    const contexts: CityContextProvider<string> = {
        create: mock(async () => {
            trace.push("context");
            return { repository, plan };
        }),
    };
    const hooks: CityProgressionHooks = {
        refreshCampaignGrants: mock(() => {
            trace.push("campaign");
        }),
        refreshGeneralUnlocks: mock(() => {
            trace.push("unlock");
        }),
        refreshQuests: mock(() => {
            trace.push("quests");
        }),
        flushExpeditionScores: mock(async () => {
            trace.push("expedition");
        }),
        flushHeroScore: mock(async () => {
            trace.push("hero");
        }),
    };
    const domain: CityDomain = {
        commands: ["build.test"],
        types: [type],
        prepare: mock(async () => {
            trace.push("prepare");
            return prepared;
        }),
        apply: mock(async () => {
            trace.push("apply");
            return response;
        }),
        accelerate: mock(async () => {
            trace.push("accelerate");
        }),
        next: mock(async () => {
            trace.push("next");
            return prepared;
        }),
    };
    const activity: TimedActivity = {
        id: "activity",
        ownerId: "owner",
        queueId: "queue",
        type,
        itemId: "unit",
        startedAt: 0n,
        dueAt: 900n,
        version: 1,
        status: 0,
    };
    const service = new CityProgressionService(contexts, [domain], hooks);

    return {
        plan,
        trace,
        response,
        prepared,
        repository,
        contexts,
        hooks,
        domain,
        activity,
        service,
    };
}

test("command aliases preserve decoded parameters and flush effects before the aggregate write", async () => {
    const value = setup();
    value.domain.handles = (command) => command === "alias";
    const params = encode({ amount: sfs.long(9007199254740993n) });
    const result = await value.service.command(
        "tx",
        "owner",
        "alias",
        params,
        1000n,
        value.plan.economy,
    );
    expect(result).toBe(value.prepared);
    expect(value.domain.prepare).toHaveBeenCalledWith(value.plan, "alias", decode(params));
    expect(value.contexts.create).toHaveBeenCalledWith(
        "tx",
        "owner",
        1000n,
        value.plan.economy,
        "alias",
        params,
    );
    expect(value.trace).toEqual([
        "context",
        "prepare",
        "campaign",
        "quests",
        "expedition",
        "hero",
        "write",
    ]);
    value.trace.length = 0;
    await expect(
        value.service.command("tx", "owner", "build.test", params, 1000n, value.plan.economy),
    ).rejects.toThrow();
    expect(value.trace).toEqual([]);
});

test("quest reward commands preserve their existing refresh exclusion", async () => {
    const value = setup();
    value.domain.commands = ["task.reward.get"];
    await value.service.command(
        "tx",
        "owner",
        "task.reward.get",
        encode({}),
        1000n,
        value.plan.economy,
    );
    expect(value.trace).toEqual(["context", "prepare", "campaign", "expedition", "hero", "write"]);
    expect(value.hooks.refreshQuests).not.toHaveBeenCalled();
});

test("building completion pins the original deadline before unlocks, quests and score persistence", async () => {
    const value = setup();
    value.domain.apply = mock(async (plan) => {
        expect(plan.completing).toBe(value.activity);
        expect(plan.scoreAt).toBe(900n);
        plan.write.buildings = [{ uuid: "building", level: 2 }];
        value.trace.push("apply");
        return value.response;
    });
    const result = await value.service.domains.get(0)!(
        "tx",
        TimedActivityAction.Finish,
        value.activity,
        1000n,
        value.plan.economy,
    );
    expect(decode(Buffer.from(result))).toEqual(value.response);
    expect(value.hooks.refreshQuests).toHaveBeenCalledWith(value.plan, {
        legacy: 3,
        daily: 26,
        main: 31,
        count: 1,
    });
    expect(value.trace).toEqual([
        "context",
        "apply",
        "campaign",
        "unlock",
        "quests",
        "expedition",
        "hero",
        "write",
    ]);
});

test("military completion counts the actual written delta for training, forts and healing", async () => {
    for (const [type, main, count] of [[1, 2, 3], [2, 22, 4], [3, 44, 5]])
    {
        const value = setup(type);
        value.plan.state.armies = [{ armyId: "unit", free: 2 }];
        value.plan.state.forts = [{ armyId: "unit", num: 2 }];
        value.plan.state.hospital = [{ armyId: "unit", heal: 7 }];
        value.plan.write.armies = [{ armyId: "unit", free: 5 }];
        value.plan.write.forts = [{ armyId: "unit", num: 6 }];
        value.plan.write.hospital = [{ armyId: "unit", heal: 2 }];
        await value.service.domains.get(type!)!(
            "tx",
            TimedActivityAction.Finish,
            value.activity,
            1000n,
            value.plan.economy,
        );
        expect(value.hooks.refreshQuests).toHaveBeenLastCalledWith(value.plan, {
            main,
            count,
            key: "unit",
        });
        expect(value.hooks.refreshGeneralUnlocks).not.toHaveBeenCalled();
    }
});

test("acceleration and next keep their dedicated ordering and preserve absent-domain behavior", async () => {
    const value = setup();
    await value.service.accelerate("tx", value.activity, 100n, 1000n, value.plan.economy);
    expect(value.domain.accelerate).toHaveBeenCalledWith(value.plan, value.activity, 100n);
    expect(value.trace).toEqual(["context", "accelerate", "expedition", "hero", "write"]);
    value.trace.length = 0;
    expect(await value.service.next("tx", value.activity, 1000n, value.plan.economy)).toBe(
        value.prepared,
    );
    expect(value.trace).toEqual(["context", "next", "expedition", "hero", "write"]);
    value.trace.length = 0;
    value.activity.type = 99;
    expect(await value.service.next("tx", value.activity, 1000n, value.plan.economy))
        .toBeUndefined();
    await expect(value.service.accelerate("tx", value.activity, 100n, 1000n, value.plan.economy))
        .rejects.toThrow();
    expect(value.trace).toEqual([]);
});

test("callback and repository failures propagate without returning a successful result", async () => {
    const value = setup();
    value.hooks.flushExpeditionScores = async () => {
        throw new Error("score failed");
    };
    await expect(
        value.service.command("tx", "owner", "build.test", encode({}), 1000n, value.plan.economy),
    ).rejects.toThrow("score failed");
    expect(value.repository.update).not.toHaveBeenCalled();
    expect(value.hooks.flushHeroScore).not.toHaveBeenCalled();
    const failedWrite = setup();
    failedWrite.repository.update = async () => {
        throw new Error("write failed");
    };
    await expect(
        failedWrite.service.command(
            "tx",
            "owner",
            "build.test",
            encode({}),
            1000n,
            failedWrite.plan.economy,
        ),
    ).rejects.toThrow("write failed");
});

test("duplicate activity ownership is rejected before any context is loaded", () => {
    const value = setup();
    expect(() =>
        new CityProgressionService(value.contexts, [value.domain, value.domain], value.hooks)
    ).toThrow("Duplicate city activity domain");
    expect(value.contexts.create).not.toHaveBeenCalled();
});
