import { describe, expect, test } from "vitest";
import { kingdomDatabase } from "../../src/factories/kingdom-database";
import { worldCellValidator } from "../../src/validators/world-cell";
import { pageQueryValidator, publicIdValidator } from "../../src/validators/repository";

describe("serialized persistence boundary snapshots", () => {
    test("routing, public identity and paging keep their published shapes", () => {
        expect({
            databases: [kingdomDatabase(1), kingdomDatabase(2_147_483_647)],
            publicId: publicIdValidator.parse("B6F84DC5-CD4E-47CC-A3C7-82A67C0C84BD"),
            defaultPage: pageQueryValidator.parse({}),
            lastCell: worldCellValidator.parse({ columnIndex: 1199, rowIndex: 1199 }),
        }).toMatchInlineSnapshot(`
          {
            "databases": [
              "kingdom_1",
              "kingdom_2147483647",
            ],
            "defaultPage": {
              "limit": 50,
              "offset": 0,
            },
            "lastCell": {
              "columnIndex": 1199,
              "rowIndex": 1199,
            },
            "publicId": "b6f84dc5-cd4e-47cc-a3c7-82a67c0c84bd",
          }
        `);
    });

    test("cell errors identify each rejected coordinate without snapshotting translated prose", () => {
        const result = worldCellValidator.safeParse({ columnIndex: -1, rowIndex: 1200 });
        expect(result.success).toBe(false);
        if (result.success)
        {
            throw new Error("Invalid coordinates were accepted");
        }
        expect(result.error.issues.map(issue => ({ code: issue.code, path: issue.path })))
            .toMatchInlineSnapshot(`
              [
                {
                  "code": "too_small",
                  "path": [
                    "columnIndex",
                  ],
                },
                {
                  "code": "too_big",
                  "path": [
                    "rowIndex",
                  ],
                },
              ]
            `);
    });
});
