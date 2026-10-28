import { expect, mock, test } from "bun:test";
import type { CityPersistenceSession } from "../src/contracts/persistence-session";
import { CityInitializationReader } from "../src/repositories/initialization";
import { CityInitializationCommand } from "../src/enums/initialization-command";
import { CityProgressionContextFactory } from "../src/services/context-factory";
import { createPlan } from "./support/plan";

function fixture()
{
    const plan = createPlan();
    const city = {
        profile: plan.state.profile,
        resource: { food: 9007199254740993n },
        statistics: null,
    };
    const rows = [city];
    const query = {
        from: () => query,
        innerJoin: () => query,
        leftJoin: () => query,
        where: async () => rows,
    };
    const session = {
        tx: { select: mock(() => query) },
        owner: "owner",
        now: 1000n,
        buildings: { read: mock(async () => plan.state.buildings) },
        research: { read: mock(async () => plan.state.sciences) },
        troops: { readArmies: mock(async () => plan.state.armies) },
        equipment: { read: mock(async () => plan.state.equipment) },
        quests: {
            readTasks: mock(async () => plan.state.tasks),
            readQuests: mock(async () => ({
                story: [],
                daily: [],
                legacy: [],
                lord: {},
                mixed: {},
                fresh: {},
                signIn: {},
                alliance: {},
            })),
        },
        readers: { readPrayer: mock(async () => ({ record: { prayCount: 2 } })) },
        alliance: "",
    } as unknown as CityPersistenceSession;

    return { plan, city, rows, session, reader: new CityInitializationReader(session) };
}

test("getState_prayer_loadsQuestDependenciesAndRejectsUnloadedAuthoritativeCollections", async () => {
    const h = fixture();
    const state = await h.reader.getState(CityInitializationCommand.Prayer);

    expect(state.resource.food).toBe(9007199254740993n);
    expect(state.statistics).toEqual({});
    expect(state.prayer).toEqual({ record: { prayCount: 2 } });
    expect(state.buildings).toBe(h.plan.state.buildings);
    expect(state.sciences).toBe(h.plan.state.sciences);
    expect(state.armies).toBe(h.plan.state.armies);
    expect(state.equipment).toBe(h.plan.state.equipment);
    expect(h.session.questBefore).toEqual({ tasks: [], quests: state.quests });
    expect(h.session.questBefore?.quests).not.toBe(state.quests);
    expect(() => state.effects).toThrow("Unloaded city initialization field");
    expect(() => state.hospital).toThrow("Unloaded city initialization field");
    expect(() => state.generalRoster).toThrow("Unloaded city initialization field");
});

test("supports_mutationsAndUnknownCommands_requiresTheFullSnapshot", async () => {
    const h = fixture();

    expect(h.reader.supports("user.pray")).toBe(false);
    expect(h.reader.supports("arbitrary.init")).toBe(false);
    expect(h.reader.supports()).toBe(false);
    await expect(h.reader.getState("user.pray")).rejects.toThrow(
        "Unsupported initialization projection",
    );
    expect(h.session.tx.select).not.toHaveBeenCalled();
});

test("getState_missingOwner_rejectsBeforeDependentReaders", async () => {
    const h = fixture();
    h.rows.length = 0;

    await expect(h.reader.getState(CityInitializationCommand.Prayer)).rejects.toThrow(
        "Missing city owner",
    );
    expect(h.session.buildings.read).not.toHaveBeenCalled();
});

test("getState_oversizedCollections_rejectsTheProjection", async () => {
    const h = fixture();
    h.plan.state.buildings = Array.from({ length: 257 }, () => ({ uid: "owner" }));

    await expect(h.reader.getState(CityInitializationCommand.Prayer)).rejects.toThrow(
        "City aggregate exceeds bound",
    );
});

test("create_projectedInitialization_skipsExternalEffectsAndRejectsUnexpectedEffectUse", async () => {
    const h = fixture();
    const state = await h.reader.getState(CityInitializationCommand.Prayer);
    const world = mock(async () => new Map<number, number>());
    const emperor = mock(async () => null);
    const factory = new CityProgressionContextFactory(
        () => ({ getState: async () => state, update: async () => {} }),
        h.plan.rules,
        { world, emperor },
        () => ({ kingdomId: 1, version: "12.06.0", now: 1000 }),
    );
    const { plan } = await factory.create("tx", "owner", 1000n, {
        ...h.plan.economy,
        hasPendingItemGrants: () => false,
    }, CityInitializationCommand.Prayer);

    expect(world).not.toHaveBeenCalled();
    expect(emperor).not.toHaveBeenCalled();
    expect(() => plan.effect(80)).toThrow("Unloaded city initialization field");
});

test.each([
    { pending: true, full: true },
    { pending: false, full: false },
    { pending: undefined, full: true },
])("create_pendingGrants_$pending_requestsFullSnapshot_$full", async ({ pending, full }) => {
    const h = fixture();
    const getState = mock(async () => h.plan.state);
    const factory = new CityProgressionContextFactory(
        () => ({ getState, update: async () => {} }),
        h.plan.rules,
        { world: async () => new Map<number, number>(), emperor: async () => null },
        () => ({ kingdomId: 1, version: "12.06.0", now: 1000 }),
    );
    const economy = {
        ...h.plan.economy,
        hasPendingItemGrants: pending === undefined ? undefined : () => pending,
    };

    await factory.create("tx", "owner", 1000n, economy, CityInitializationCommand.Prayer);

    expect(getState).toHaveBeenCalledWith(
        CityInitializationCommand.Prayer,
        undefined,
        undefined,
        full,
    );
});
