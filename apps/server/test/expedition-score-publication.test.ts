import { test, expect } from "bun:test";
import { expeditionDiscovery } from "@opencok/rules/expedition-score-publication";
import { ExpeditionLiveViewService } from "@opencok/services/expedition-score-publication";
import { Cache } from "@opencok/storage/session";
import { sfs, type Fields } from "@opencok/messages/sfs";
const clock = {
    serverId: 1,
    periodId: "period",
    stage: 7,
    startTime: 1n,
    endTime: 100n,
    opponent: 2,
    revision: 1n,
};
test("expedition discovery retains exact authority versions and exposes waiting when the feature is disabled", () => {
    const version = { kingdomId: 1, ownerEpoch: 9007199254740993n, sequence: 9007199254740995n },
        record = expeditionDiscovery(clock, version, 50n),
        data = JSON.parse(record.value);
    expect(data.ownerEpoch).toBe("9007199254740993");
    expect(data.sequence).toBe("9007199254740995");
    expect(data.status).toBe("TRAIN_ARMY_STATE");
    expect(data.matchServerId).toBe(2);
    const closed = JSON.parse(expeditionDiscovery(clock, version, 50n, false).value);
    expect(closed.status).toBe("WAITING_STATE");
    expect(closed.matchServerId).toBe(-1);
    expect(() => expeditionDiscovery(clock, { ...version, kingdomId: 2 }, 50n)).toThrow();
});
test("a shared expedition read outage preserves owned fields and marks rank unavailable without merging another phase", async () => {
    let queries = 0;
    const view = {
            periodId: "period",
            stage: 7,
            kingdomId: 1,
            opponent: 2,
            member: "owner",
            allianceId: "guild",
            startTime: 1n,
            endTime: 100n,
        },
        service = new ExpeditionLiveViewService(
            {
                owned: async () => view,
                shared: async () => {
                    queries++;
                    throw new Error("synthetic unavailable projection");
                },
            },
            () => 50,
        ),
        base: Fields = {
            state: sfs.int(7),
            startTime: sfs.long(1n),
            endTime: sfs.long(100n),
            score: sfs.string("25"),
            rank: sfs.int(1),
            alliancescore: sfs.double(25),
        };
    const stale = { ...base, state: sfs.int(6) };
    expect(await service.enrich("owner", stale)).toBe(stale);
    expect(queries).toBe(0);
    const result = await service.enrich("owner", base);
    expect(result.rank).toEqual(sfs.int(-1));
    expect(result.score).toEqual(base.score);
    expect(result.alliancescore).toEqual(base.alliancescore);
    expect(queries).toBe(1);
});
test("discovery rejects foreign metadata and invalid decimal versions before issuing a Redis write", async () => {
    const cache = new Cache({ redisUrl: "redis://unused", kingdomId: 1, timeoutMs: 1000 });
    let writes = 0;
    cache.command = async () => {
        writes++;
        return 1;
    };
    const value = expeditionDiscovery(clock, { kingdomId: 1, ownerEpoch: 1n, sequence: 1n }, 50n);
    expect(await cache.publishExpeditionDiscovery(value)).toBe(true);
    await expect(cache.publishExpeditionDiscovery({ ...value, sequence: "1e3" })).rejects.toThrow();
    await expect(
        cache.publishExpeditionDiscovery({
            ...value,
            value: JSON.stringify({ ...JSON.parse(value.value), serverId: 2 }),
        }),
    ).rejects.toThrow();
    expect(writes).toBe(1);
});
