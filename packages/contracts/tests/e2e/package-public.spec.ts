import { describe, expect, it } from "vitest";
import { mapQuery, mapRegion, packets, type MapQuery, type MapRegion } from "@opencok/contracts";
import { encodePacket, decodePacket } from "@opencok/contracts/binary";
import fixture from "../fixtures/world.json";

describe("package-public world protocol exchange", () => {
    it("exchanges query and region fixture bytes using only public entrypoints", () => {
        const outbound: MapQuery = mapQuery.parse({
            requestId: 42,
            kingdomId: 1,
            minX: 568,
            minY: 568,
            maxX: 575,
            maxY: 575,
        });
        const queryOpcode = packets.find((packet) => packet.name === "MapQuery")!.opcode;
        const regionOpcode = packets.find((packet) => packet.name === "MapRegion")!.opcode;
        const queryBytes = encodePacket(queryOpcode, outbound);
        expect(Array.from(queryBytes)).toEqual(fixture.query);
        const inbound = decodePacket(queryBytes);
        expect(inbound.opcode).toBe(queryOpcode);
        const accepted = mapQuery.parse(inbound.value);
        const response: MapRegion = mapRegion.parse({
            requestId: accepted.requestId,
            status: 0,
            kingdomId: accepted.kingdomId,
            name: "Reino",
            columns: 1200,
            rows: 1200,
            objects: [{ id: 1, kind: 1, x: 570, y: 570, width: 2, height: 2, level: 1 }],
            blocked: [{ x: 574, y: 574 }],
        });
        const responseBytes = encodePacket(regionOpcode, response);
        expect(Array.from(responseBytes)).toEqual(fixture.region);
        const framed = Uint8Array.from([255, ...responseBytes, 255]);
        const received = decodePacket(framed.subarray(1, -1));
        expect(received.opcode).toBe(regionOpcode);
        expect(mapRegion.parse(received.value)).toEqual(response);
        expect(response.requestId).toBe(outbound.requestId);
    });

    it.each([1, 2])("preserves correlation for unsuccessful region status %i", (status) => {
        const response: MapRegion = {
            requestId: 0xffffffff,
            status,
            kingdomId: 0,
            name: "",
            columns: 0,
            rows: 0,
            objects: [],
            blocked: [],
        };
        expect(decodePacket(encodePacket(17, response))).toEqual({ opcode: 17, value: response });
    });

    it("rejects malformed input through the published codec boundary", () => {
        expect(() => encodePacket(16, { requestId: 1 })).toThrow();
        expect(() => decodePacket(Uint8Array.of(1, 255))).toThrow("Unknown packet");
        expect(() => decodePacket(Uint8Array.from([...fixture.query, 0]))).toThrow(
            "Trailing packet bytes",
        );
    });
});
