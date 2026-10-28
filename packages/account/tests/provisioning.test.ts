import { expect, test } from "bun:test";
import { ProvisioningService } from "../src/services/provisioning";
import { ProvisioningController } from "../src/controllers/provisioning";
import type { ProvisioningStore } from "../src/contracts/provisioning";
import type { CharacterReservation } from "@opencok/contracts/provisioning";

const input = { kingdomId: 1, deviceUuid: "synthetic", country: "BR", language: "pt" };
const identity = { issuer: "synthetic", subject: "account" };
const reservation: CharacterReservation = {
    ...input,
    identityId: "00000000-0000-4000-8000-000000000001",
    gameUid: "123456",
    name: "Lord123456",
    createdAt: 1800000000000,
    preset: "normal-v1",
};
const receipt = { gameUid: reservation.gameUid, kingdomId: 1, requestHash: "a".repeat(64) };
const ready = { gameUid: reservation.gameUid, kingdomId: 1, state: "ready" as const };

function fixture(options: { ready?: boolean; receipt?: unknown; activationError?: boolean; } = {})
{
    const calls: string[] = [];
    const store: ProvisioningStore = {
        async reserve(verified, selected)
        {
            calls.push("reserve");
            expect(verified).toEqual(identity);
            expect(selected).toEqual(input);
            return { reservation, ready: options.ready ?? false };
        },
        async activate(verified, reserved, received)
        {
            calls.push("activate");
            expect(verified).toEqual(identity);
            expect(reserved).toEqual(reservation);
            expect(received).toEqual(receipt);
            if (options.activationError)
            {
                throw new Error("activation unavailable");
            }
            return ready;
        },
    };
    const service = new ProvisioningService(
        {
            async verify(token)
            {
                calls.push("verify");
                expect(token).toBe("verified");
                return identity;
            },
        },
        store,
        new Map([[1, {
            async create(value)
            {
                calls.push("realm");
                expect(value).toEqual(reservation);
                return (options.receipt ?? receipt) as typeof receipt;
            },
        }]]),
    );
    return { calls, service, controller: new ProvisioningController(service) };
}

test("ready reservations replay without contacting or reseeding the realm", async () => {
    const { calls, controller } = fixture({ ready: true });
    expect(await controller.create("verified", input)).toEqual(ready);
    expect(calls).toEqual(["verify", "reserve"]);
});

test("activation follows verified identity, durable reservation and validated receipt", async () => {
    const { calls, controller } = fixture();
    expect(await controller.create("verified", input)).toEqual(ready);
    expect(calls).toEqual(["verify", "reserve", "realm", "activate"]);
});

test("malformed realm receipts retain the reservation as pending", async () => {
    const { calls, controller } = fixture({ receipt: { ...receipt, requestHash: "invalid" } });
    expect(await controller.create("verified", input)).toEqual({ ...ready, state: "pending" });
    expect(calls).toEqual(["verify", "reserve", "realm"]);
});

test("activation errors propagate so a later request can reconcile the reservation", async () => {
    const { calls, service } = fixture({ activationError: true });
    await expect(service.create("verified", input)).rejects.toThrow("activation unavailable");
    expect(calls).toEqual(["verify", "reserve", "realm", "activate"]);
});

test("invalid selection is rejected before identity verification or storage access", async () => {
    const { calls, controller } = fixture();
    await expect(controller.create("verified", { ...input, kingdomId: 3 })).rejects.toThrow(
        "Realm unavailable",
    );
    await expect(controller.create("verified", { ...input, country: "invalid" })).rejects.toThrow(
        "Invalid character input",
    );
    expect(calls).toEqual([]);
});
