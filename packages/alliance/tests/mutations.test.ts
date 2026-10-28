import { expect, test } from "bun:test";
import { decode, sfs, type Fields } from "@opencok/messages/sfs";
import { inventoryResponse } from "@opencok/economy/mappings/inventory";
import type { InventoryPlan } from "@opencok/economy/contracts/inventory-planning";
import type { MutationCommand } from "@opencok/ledger/contracts/mutation";
import { AllianceService } from "../src/services/alliance";
import { AllianceIdentity } from "../src/services/identity";
import { AllianceCommandValidation } from "../src/validations/command";
import { AllianceMutationMapper } from "../src/mappings/mutation";
import { AllianceMembershipPolicy } from "../src/rules/membership";
import type {
    AllianceContextState,
    AllianceContextWrite,
    AllianceSelection,
} from "../src/contracts/context-state";
import type { AllianceContextCatalog } from "../src/contracts/context-catalog";
import type { AlliancePlan, AllianceRepository } from "../src/contracts/mutation";
import type { AllianceContextFactory } from "../src/contracts/context";
import type { AllianceRecord } from "../src/contracts/records";

const operationId = "11111111-1111-4111-8111-111111111111";

function fixture()
{
    const state: AllianceContextState = {
        now: 1000n,
        inventory: { profile: { uid: "owner", allianceId: "guild" }, resource: {} },
        selection: {},
        profiles: [],
        alliances: [],
        members: [],
        powers: [],
        cities: [],
        helps: [],
        queues: [],
        activities: [],
        gifts: [],
        sharedGifts: [],
        sciences: [],
        research: [],
        donations: [],
        history: [],
        blacklist: [],
        applications: [],
        mails: [],
        lords: [],
        points: [],
        marches: [],
        directory: [],
        directoryTotal: 0n,
        candidates: [],
    };
    const rules: AllianceContextCatalog = {
        kingdomId: 1,
        mail: new Map(),
        items: new Map(),
        alliance: {},
        power: {},
    };
    const calls: string[] = [];
    const inputs: { input: MutationCommand; selection: AllianceSelection; }[] = [];
    const plans: AlliancePlan[] = [];
    const receipts = new Map<string, Buffer>();
    const options = { failCommand: "", forbidden: "", publishGift: true, writeCommand: true };
    let uuid = 0;
    const readers = {
        text: (row: AllianceRecord, key: string) => String(row[key] ?? ""),
        num: (row: AllianceRecord, key: string) => Number(row[key] ?? 0),
        long: (row: AllianceRecord, key: string) => BigInt(String(row[key] ?? 0)),
    };
    const createInventoryPlanner = () => {
        calls.push("planner");

        return {
            pushes: [] as { command: string; body: Fields; }[],
            total: () => 0n,
            add: () => undefined,
            result: (body: Fields): InventoryPlan => ({
                response: inventoryResponse(body, []),
                postings: [],
                items: [],
                profile: {},
                resource: {},
                cooldowns: new Map(),
                events: [{ id: "existing", type: "other.changed", payload: new Uint8Array() }],
            }),
        };
    };
    const runtime = {
        ...readers,
        errors: { locked: "locked", full: "full" },
        allianceFailure: (code = "invalid"): never => {
            throw new Error(code);
        },
        cityInteger: (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER) => {
            const n = Number(value);

            if (!Number.isSafeInteger(n) || n < min || n > max)
            {
                throw new Error("invalid integer");
            }

            return n;
        },
        randomUUID: () => {
            calls.push("uuid");

            return `00000000-0000-4000-8000-${String(++uuid).padStart(12, "0")}`;
        },
        unsupportedFailure: (): never => {
            throw new Error("unsupported");
        },
        createInventoryPlanner,
    };
    const policy = new AllianceMembershipPolicy(runtime);
    const validation = new AllianceCommandValidation(runtime, policy, async (value) => {
        calls.push("moderate:" + value);

        return value === options.forbidden;
    });
    const repository: AllianceRepository<AllianceContextState> = {
        execute: async (input, selection, plan) => {
            calls.push("execute:" + input.command);
            inputs.push({ input, selection });
            const prior = receipts.get(input.requestId);

            if (prior)
            {
                return prior;
            }

            const result = await plan(state);
            plans.push(result);
            const response = Buffer.from(result.inventory.response);
            receipts.set(input.requestId, response);

            return response;
        },
    };
    const contextFactory: AllianceContextFactory<
        AllianceContextState,
        AllianceContextCatalog,
        ReturnType<typeof createInventoryPlanner>,
        object
    > = (owner, state, rules, ledger) => {
        const write: AllianceContextWrite = {};
        const productionOwners = new Set<string>();

        return {
            owner,
            state,
            rules,
            ledger,
            write,
            productionOwners,
            now: state.now,
            allianceId: readers.text(state.inventory.profile, "allianceId"),
            productionAt: 77n,
            alliance: () => ({ uid: "guild" }),
            member: () => ({ uid: owner, rank: 5 }),
            list: () => [],
            setMember: () => undefined,
            setAlliance: () => undefined,
            command: async (command, params) => {
                calls.push("command:" + command);

                if (command === options.failCommand)
                {
                    throw new Error("command failed");
                }

                if (command !== "alliance.tick" && options.writeCommand)
                {
                    write.alliances = [{ uid: "created" }];
                    write.memberships = [{ uid: owner, allianceId: "created" }];
                    productionOwners.add(owner);
                }

                return { success: sfs.bool(true), value: params.key ?? sfs.string(command) };
            },
        };
    };
    const service = new AllianceService(
        repository,
        rules,
        {},
        contextFactory,
        (context) => ({
            command: () => ({}),
            publish: (event, type) => {
                calls.push(`gift:${event}:${type}`);

                if (options.publishGift)
                {
                    context.write.publishedGift = { uid: event };
                }

                return { gift: sfs.string(event) };
            },
        }),
        runtime,
        validation,
        new AllianceMutationMapper(runtime),
        policy,
    );

    return { state, calls, inputs, plans, options, validation, service };
}

test("unsupported commands stop before recovery and malformed requests validate after recovery", async () => {
    const h = fixture();
    await expect(h.service.command("owner", "unknown", {})).rejects.toThrow("unsupported");
    expect(h.calls).toEqual([]);
    await expect(h.service.command("owner", "al.search", { page: sfs.string("2") })).rejects
        .toThrow("invalid");
    expect(h.calls).toEqual(["uuid", "execute:alliance.tick", "planner", "command:alliance.tick"]);
    expect(h.inputs).toHaveLength(1);
    const failed = fixture();
    failed.options.failCommand = "alliance.tick";
    await expect(failed.service.command("owner", "al.search", {})).rejects.toThrow(
        "command failed",
    );
    expect(failed.inputs.map((entry) => entry.input.command)).toEqual(["alliance.tick"]);
});

test("native field validation preserves type, integer and string bounds with correlation bypass", async () => {
    const h = fixture();
    const malformed: readonly Fields[] = [
        { rank: sfs.long(1n) },
        { name: sfs.int(1) },
        { scienceId: sfs.string("100") },
        { value: sfs.object({}) },
        { value: sfs.string("x".repeat(501)) },
        { value: sfs.string("\ud800") },
        { page: sfs.int(1.5) },
        { value: sfs.int(2147483648) },
    ];

    for (const params of malformed)
    {
        await expect(h.validation.prepare("al.search", params)).rejects.toThrow("invalid");
    }
    const target = await h.validation.prepare("al.targetscience.set", {
        scienceId: sfs.string("100;200"),
        _cok_: sfs.object({ ignored: sfs.string("value") }),
    });
    expect(target.request.scienceId).toEqual(sfs.string("100;200"));
    expect(target.request._cok_).toBeUndefined();
    await expect(h.validation.prepare("al.targetscience.set", { scienceId: sfs.int(100) })).rejects
        .toThrow("invalid");
    const scalar = await h.validation.prepare("al.search", {
        custom: sfs.long(9007199254740993n),
        flag: sfs.bool(true),
    });
    expect(scalar.request.custom).toEqual(sfs.long(9007199254740993n));
});

test("moderation stays sequential and operation identity validation follows it", async () => {
    const h = fixture();
    h.options.forbidden = "blocked";
    await expect(
        h.validation.prepare("al.create", {
            intro: sfs.string("blocked"),
            name: sfs.string("Name"),
            abbr: sfs.string("ABC"),
            operationId: sfs.string("bad"),
        }),
    ).rejects.toThrow("invalid");
    expect(h.calls).toEqual(["moderate:Name", "moderate:ABC", "moderate:blocked"]);
    const invalid = fixture();
    await expect(
        invalid.validation.prepare("al.create", {
            name: sfs.string("Name"),
            operationId: sfs.string("bad"),
        }),
    ).rejects.toThrow("invalid");
    expect(invalid.calls).toEqual(["moderate:Name"]);
    expect(
        (await invalid.validation.prepare("alliance.init", { operationId: sfs.string("legacy") }))
            .requestId,
    ).toBe("legacy");
    expect(
        (await invalid.validation.prepare("alliance.tick", { operationId: sfs.string("internal") }))
            .requestId,
    ).toBe("internal");
});

test("canonical requests exclude transport identifiers and selection retains existing aliases", async () => {
    const h = fixture();
    const request = await h.validation.prepare("al.search", {
        z: sfs.int(1),
        operationId: sfs.string(operationId),
        name: sfs.string("Guild"),
        type: sfs.int(2),
        page: sfs.int(0),
        language: sfs.string("en"),
        _cok_: sfs.object({}),
        a: sfs.bool(true),
    });
    expect(Object.keys(request.request)).toEqual(["a", "language", "name", "page", "type", "z"]);
    expect(request.requestId).toBe(operationId);
    expect(request.selection).toMatchObject({
        key: "Guild",
        pageSize: 5,
        page: 1,
        language: "en",
        searchPlayers: false,
    });
    expect(
        (await h.validation.prepare("al.view", { uid: sfs.string("selected") })).selection
            .allianceId,
    ).toBe("selected");
    expect(
        (await h.validation.prepare("al.check", { uid: sfs.string("player") })).selection.playerId,
    ).toBe("player");
    expect((await h.validation.prepare("al.abbr", { abbr: sfs.string("ABC") })).selection.key).toBe(
        "ABC",
    );
    expect(
        (await h.validation.prepare("al.searchuser", {
            lang: sfs.string("pt"),
            language: sfs.string("en"),
        })).selection,
    )
        .toMatchObject({ language: "pt", searchPlayers: true, pageSize: 10, page: 1 });
    await expect(h.validation.prepare("al.view", { uid: sfs.string("x".repeat(41)) })).rejects
        .toThrow("invalid");
    await expect(h.validation.prepare("al.search", { page: sfs.int(1001) })).rejects.toThrow(
        "invalid integer",
    );
});

test("ordinary mutation appends the native event and returns production and replay metadata", async () => {
    const h = fixture();
    h.state.inventory.profile.allianceId = "";
    const result = await h.service.command("owner", "al.create", {
        operationId: sfs.string(operationId),
        name: sfs.string("Guild"),
        _cok_: sfs.object({}),
    });
    expect(h.inputs.map((entry) => entry.input.command)).toEqual(["alliance.tick", "al.create"]);
    expect(decode(Buffer.from(h.inputs[1]!.input.request))).toEqual({ name: sfs.string("Guild") });
    const plan = h.plans[1]!;
    expect(plan.productionOwners).toEqual(["owner"]);
    expect(plan.productionAt).toBe(77n);
    expect(plan.inventory.events?.map((event) => event.type)).toEqual([
        "other.changed",
        "alliance.changed",
    ]);
    const event = plan.inventory.events![1]!;
    expect(event.id).toBe("alliance");
    const payload = decode(Buffer.from(event.payload));
    expect(Object.keys(payload)).toEqual(["allianceId", "members", "command"]);
    expect(payload.allianceId).toEqual(sfs.string("created"));
    expect(payload.members).toEqual(
        sfs.array([sfs.object({ uid: sfs.string("owner"), allianceId: sfs.string("created") })]),
    );
    expect(payload.command).toEqual(sfs.string("al.create"));
    expect(result.body.operationId).toEqual(sfs.string(operationId));
    expect(result.pushes).toEqual([]);
    const repeated = await h.service.command("owner", "al.create", {
        operationId: sfs.string(operationId),
        name: sfs.string("Guild"),
    });
    expect(repeated).toEqual(result);
    expect(h.plans).toHaveLength(3);
});

test("read-only plans retain unrelated events and a failed command cannot produce a plan", async () => {
    const h = fixture();
    h.options.writeCommand = false;
    await h.service.command("owner", "al.search", {});
    expect(h.plans[1]!.inventory.events?.map((event) => event.type)).toEqual(["other.changed"]);
    const failed = fixture();
    failed.options.failCommand = "al.search";
    await expect(failed.service.command("owner", "al.search", {})).rejects.toThrow(
        "command failed",
    );
    expect(failed.plans).toHaveLength(1);
    expect(failed.plans[0]!.inventory.events?.map((event) => event.type)).toEqual([
        "other.changed",
    ]);
});

test("trusted gift production preserves deterministic receipts and does not trigger command recovery", async () => {
    const h = fixture();
    const id = AllianceIdentity.stableId("alliance-gift:event");
    const first = await h.service.publishGift("owner", "event", 30000);
    expect(h.inputs.map((entry) => entry.input.command)).toEqual(["alliance.reward"]);
    expect(h.inputs[0]!.input.requestId).toBe("alliance-gift:" + id);
    expect(h.inputs[0]!.selection).toEqual({ giftEvent: id });
    expect(decode(Buffer.from(h.inputs[0]!.input.request))).toEqual({
        eventId: sfs.string("event"),
        type: sfs.int(30000),
    });
    expect(decode(Buffer.from(h.plans[0]!.inventory.events![1]!.payload))).toEqual({
        allianceId: sfs.string("guild"),
        members: sfs.array([]),
        command: sfs.string("alliance.reward"),
    });
    expect(first.body.operationId).toEqual(sfs.string("alliance-gift:" + id));
    expect(await h.service.publishGift("owner", "event", 30000)).toEqual(first);
    expect(h.calls.filter((call) => call.startsWith("gift:"))).toHaveLength(1);
    const noPublication = fixture();
    noPublication.options.publishGift = false;
    await noPublication.service.publishGift("owner", "event", 30000);
    expect(noPublication.plans[0]!.inventory.events).toHaveLength(1);
    await expect(noPublication.service.publishGift("owner", "event", 29999)).rejects.toThrow(
        "invalid integer",
    );
    await expect(noPublication.service.publishGift("owner", "<event>", 30000)).rejects.toThrow(
        "invalid",
    );
    expect(noPublication.inputs).toHaveLength(1);
});

test("stable alliance identities retain the SHA-256 prefix used by saved receipts and mails", () => {
    expect(AllianceIdentity.stableId("")).toBe("e3b0c44298fc1c149afbf4c8996fb924");
    expect(AllianceIdentity.stableId("abc")).toBe("ba7816bf8f01cfea414140de5dae2223");
});
