import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { provisionHash } from "@opencok/rules/provisioning";
import { signProvisioning, verifyProvisioning } from "@opencok/identity/provisioning";
import {
  characterProvisioningHandler,
  provisioningHandler,
  realmProvisioner,
} from "@opencok/connection/provisioning";
import { ProvisioningService } from "@opencok/services/provisioning";
import { HttpError } from "@opencok/errors/http";
import type { CharacterReservation, ProvisioningStore } from "@opencok/contracts/provisioning";

const reservation: CharacterReservation = {
  identityId: randomUUID(),
  gameUid: "123456",
  name: "Lord123456",
  kingdomId: 1,
  deviceUuid: "synthetic",
  country: "BR",
  language: "pt",
  createdAt: 1800000000000,
  preset: "normal-v1",
};
const secret = "synthetic-provisioning-signing-secret";
const receipt = {
  gameUid: reservation.gameUid,
  kingdomId: 1,
  requestHash: provisionHash(reservation),
};

test("signed creation messages reject tampering, expiry and response/request reflection", () => {
  const body = JSON.stringify(reservation),
    timestamp = String(reservation.createdAt);
  const signature = signProvisioning(body, timestamp, secret);
  expect(verifyProvisioning(body, timestamp, signature, secret, reservation.createdAt)).toBe(true);
  for (const invalid of [null, "", "a".repeat(64), "ff"])
    {expect(verifyProvisioning(body, timestamp, invalid, secret, reservation.createdAt)).toBe(false);}
  expect(verifyProvisioning(body + " ", timestamp, signature, secret, reservation.createdAt)).toBe(
    false,
  );
  expect(verifyProvisioning(body, timestamp, signature, "other", reservation.createdAt)).toBe(
    false,
  );
  expect(
    verifyProvisioning(body, timestamp, signature, secret, reservation.createdAt + 30001),
  ).toBe(false);
  expect(
    verifyProvisioning(body, timestamp, signature, secret, reservation.createdAt - 30001),
  ).toBe(false);
  expect(verifyProvisioning(body, timestamp, signature, secret, reservation.createdAt, true)).toBe(
    false,
  );
  for (const key of Object.keys(reservation) as (keyof CharacterReservation)[])
    {expect(
      provisionHash({
        ...reservation,
        [key]:
          typeof reservation[key] === "number"
            ? Number(reservation[key]) + 1
            : `${reservation[key]}x`,
      }),
    ).not.toBe(receipt.requestHash);}
});

test("internal transport authenticates before execution and accepts only signed realm receipts", async () => {
  let calls = 0;
  const internal = characterProvisioningHandler(
    {
      async create() {
        calls++;
        return receipt;
      },
    },
    secret,
    () => reservation.createdAt,
  );
  const send = async (url: URL, init?: RequestInit) => internal(new Request(url.href, init));
  const connector = realmProvisioner(
    "http://realm/_internal/characters",
    secret,
    500,
    send,
    () => reservation.createdAt,
  );
  expect(await connector.create(reservation)).toEqual(receipt);
  expect(calls).toBe(1);
  const unauthorized = await internal(
    new Request("http://realm/_internal/characters", {
      method: "POST",
      body: JSON.stringify(reservation),
    }),
  );
  expect(unauthorized.status).toBe(401);
  expect(calls).toBe(1);
  const unsigned = realmProvisioner(
    "http://realm/_internal/characters",
    secret,
    500,
    async () => Response.json(receipt),
    () => reservation.createdAt,
  );
  await expect(unsigned.create(reservation)).rejects.toThrow("Invalid realm receipt");
  expect(() => realmProvisioner("http://realm/other", secret, 500)).toThrow();
  expect(() =>
    realmProvisioner("http://name:password@realm/_internal/characters", secret, 500),
  ).toThrow();
});

test("public provisioning rejects untrusted input and never reserves without a verified identity", async () => {
  let reservations = 0,
    activations = 0;
  const store: ProvisioningStore = {
    async reserve() {
      reservations++;
      return { reservation, ready: false };
    },
    async activate() {
      activations++;
      return { ...receipt, state: "ready" };
    },
  };
  const application = new ProvisioningService(
    {
      async verify() {
        throw new HttpError(401, "invalid");
      },
    },
    store,
    new Map([[1, { create: async () => receipt }]]),
  );
  const api = provisioningHandler(application);
  const input = { kingdomId: 1, deviceUuid: "synthetic", country: "BR", language: "pt" };
  const request = (body: unknown, auth = "Bearer invalid") =>
    new Request("http://api/api/v1/characters", {
      method: "POST",
      headers: { Authorization: auth },
      body: JSON.stringify(body),
    });
  expect((await api(request(input))).status).toBe(401);
  expect((await api(request(input, ""))).status).toBe(401);
  expect((await api(request({ ...input, gold: 99999 }))).status).toBe(400);
  expect((await api(request({ ...input, gameUid: "1" }))).status).toBe(400);
  expect((await api(request({ ...input, kingdomId: 3 }))).status).toBe(400);
  expect((await api(request({ ...input, deviceUuid: "x".repeat(9000) }))).status).toBe(413);
  expect(reservations).toBe(0);
  expect(activations).toBe(0);
  const pending = new ProvisioningService(
    { verify: async () => ({ issuer: "synthetic", subject: "synthetic" }) },
    store,
    new Map([
      [
        1,
        {
          async create() {
            throw new Error("timeout");
          },
        },
      ],
    ]),
  );
  expect((await pending.create("valid", input)).state).toBe("pending");
  expect(reservations).toBe(1);
  expect(activations).toBe(0);
});
