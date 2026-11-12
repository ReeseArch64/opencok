import { describe, expect, it } from "vitest";
import { encodePacket, decodePacket } from "../../src/binary";
import { createQuery, createRegion } from "../support/world-fixtures";
import fixture from "../fixtures/world.json";

expect.addSnapshotSerializer({
    test: (value) => value instanceof Uint8Array,
    serialize: (value) => `WorldPacket<${Buffer.from(value as Uint8Array).toString("hex")}>`,
});

describe("reviewable world protocol snapshots", () => {
    it("pins query header, integer endianness and field order", () => {
        expect(encodePacket(16, createQuery())).toMatchInlineSnapshot(
            `WorldPacket<01100000002a0000000100000238000002380000023f0000023f>`,
        );
    });

    it("pins region field order, string bytes and collection counts", () => {
        expect(encodePacket(17, createRegion())).toMatchInlineSnapshot(
            `WorldPacket<01110000002a0000000000000001000000055265696e6f000004b0000004b00000000100000001000000010000023a0000023a000000020000000200000001000000010000023e0000023e>`,
        );
    });

    it("pins the decoded cross-language response shape", () => {
        expect(decodePacket(Uint8Array.from(fixture.region))).toMatchInlineSnapshot(`
          {
            "opcode": 17,
            "value": {
              "blocked": [
                {
                  "x": 574,
                  "y": 574,
                },
              ],
              "columns": 1200,
              "kingdomId": 1,
              "name": "Reino",
              "objects": [
                {
                  "height": 2,
                  "id": 1,
                  "kind": 1,
                  "level": 1,
                  "width": 2,
                  "x": 570,
                  "y": 570,
                },
              ],
              "requestId": 42,
              "rows": 1200,
              "status": 0,
            },
          }
        `);
    });
});
