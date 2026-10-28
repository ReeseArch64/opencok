import { expect, test } from "bun:test";
import { CharacterProvisioningService } from "../src/services/character-provisioning";
import { CharacterProvisioningController } from "../src/controllers/character-provisioning";
import { createCharacterCreator } from "../src/repositories/character-provisioning";
import type {
    CharacterProvisioningTransaction,
    CharacterProvisioningTransactions,
} from "../src/repositories/character-provisioning-transactions";
import type { CharacterReservation } from "@opencok/contracts/provisioning";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { provisionHash } from "@opencok/rules/provisioning";
import { loadRules } from "@opencok/resources/rules";

const reservation: CharacterReservation = {
    identityId: "00000000-0000-4000-8000-000000000001",
    gameUid: "123456",
    name: "Lord123456",
    kingdomId: 1,
    deviceUuid: "synthetic",
    country: "BR",
    language: "pt",
    createdAt: 1800000000000,
    preset: "normal-v1",
};
const receipt = {
    gameUid: reservation.gameUid,
    kingdomId: 1,
    requestHash: provisionHash(reservation),
};

function replayFixture(
    options: { fenceFailure?: boolean; readinessFailure?: boolean; conflict?: boolean; } = {},
)
{
    const calls: string[] = [];
    const tx = {
        async execute()
        {
            calls.push("lock");
        },
        select()
        {
            calls.push("read");
            return {
                from: () => ({
                    where: async () => [{
                        command: "character.create",
                        request: Buffer.from(options.conflict ? "other" : receipt.requestHash),
                        response: Buffer.from(JSON.stringify(receipt)),
                    }],
                }),
            };
        },
    } as unknown as CharacterProvisioningTransaction;
    const db = {
        async transaction<T>(run: (transaction: CharacterProvisioningTransaction) => Promise<T>)
        {
            calls.push("transaction");
            return run(tx);
        },
    } as unknown as DatabaseClient<"kingdom">;
    const transactions: CharacterProvisioningTransactions = {
        kingdomId: 1,
        async fence(current)
        {
            expect(current).toBe(tx);
            calls.push("fence");
            if (options.fenceFailure)
            {
                throw new Error("stale owner");
            }
        },
        assertReady()
        {
            calls.push("ready");
            if (options.readinessFailure)
            {
                throw new Error("draining owner");
            }
        },
        async allocateBirth()
        {
            throw new Error("Replay must not allocate");
        },
        async appendRecords()
        {
            throw new Error("Replay must not append");
        },
    };
    return { db, transactions, calls, execute: createCharacterCreator(db, transactions, 100) };
}

function unexpectedSeed(): never
{
    throw new Error("Replay must not generate a seed");
}

test("creation Controller validates input before invoking the transactional writer", async () => {
    let calls = 0;
    const service = new CharacterProvisioningService(async () => {
        calls++;
        return receipt;
    }, await loadRules());
    const controller = new CharacterProvisioningController(service);
    await expect(controller.create({ ...reservation, identityId: "invalid" })).rejects.toThrow();
    expect(calls).toBe(0);
    expect(await controller.create(reservation)).toEqual(receipt);
    expect(calls).toBe(1);
});

test("the writer's captured time defines starter timestamps without rewriting the reservation", async () => {
    const captured = reservation.createdAt + 12345;
    const service = new CharacterProvisioningService(async (selected, plan) => {
        expect(selected).toEqual(reservation);
        const seed = plan(captured);
        expect(seed.profile.regTime).toBe(BigInt(captured));
        expect(seed.resource.lastUpdateTime).toBe(BigInt(captured));
        expect(seed.shieldEnd).toBe(BigInt(captured) + 259200000n);
        return receipt;
    }, await loadRules());
    expect(await service.create(reservation)).toEqual(receipt);
    expect(reservation.createdAt).toBe(1800000000000);
});

test("receipt replay fences the exact transaction and checks readiness without new grants", async () => {
    const fixture = replayFixture();
    expect(await fixture.execute(reservation, unexpectedSeed)).toEqual(receipt);
    expect(fixture.calls).toEqual(["transaction", "fence", "lock", "read", "ready"]);
});

test("a rejected fence prevents locks, reads, seed generation and receipt replay", async () => {
    const fixture = replayFixture({ fenceFailure: true });
    await expect(fixture.execute(reservation, unexpectedSeed)).rejects.toThrow("stale owner");
    expect(fixture.calls).toEqual(["transaction", "fence"]);
});

test("wrong realm and invalid maps reject before transaction participants execute", async () => {
    const fixture = replayFixture();
    await expect(fixture.execute({ ...reservation, kingdomId: 2 }, unexpectedSeed)).rejects.toThrow(
        "Wrong provisioning realm",
    );
    expect(fixture.calls).toEqual(["transaction"]);
    for (const size of [1, 32768, 1.5, Number.NaN])
    {
        expect(() => createCharacterCreator(fixture.db, fixture.transactions, size)).toThrow(
            "Invalid realm map size",
        );
    }
    expect(fixture.calls).toEqual(["transaction"]);
});

test("receipt conflicts and a draining owner cannot return a ready character", async () => {
    const conflict = replayFixture({ conflict: true });
    await expect(conflict.execute(reservation, unexpectedSeed)).rejects.toThrow(
        "Character creation conflict",
    );
    expect(conflict.calls).toEqual(["transaction", "fence", "lock", "read"]);
    const draining = replayFixture({ readinessFailure: true });
    await expect(draining.execute(reservation, unexpectedSeed)).rejects.toThrow("draining owner");
    expect(draining.calls).toEqual(["transaction", "fence", "lock", "read", "ready"]);
});
