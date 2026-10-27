import { expect, test } from "bun:test";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { generalRequest } from "@opencok/hero/mappings/generals";
import { sfs, type Fields } from "@opencok/messages/sfs";

const routes = [
  [
    "newgeneral",
    [
      "recruit",
      "skilluse",
      "addexp",
      "garrison",
      "canclegarrison",
      "activatetalent",
      "resettalent",
      "activaterefine",
      "refinevalue",
      "refinerollback",
      "refinelock",
      "refinetype",
      "breach",
      "star",
      "baseskillup",
    ],
  ],
  ["heroOffice", ["info", "appoint", "remove", "refreshExp"]],
  ["robgeneral", ["openprison", "insult", "free", "kill", "suicide", "checkrelive", "quickrelive"]],
  ["generaltrun", ["openui", "openwheel"]],
] as const;

test("native hero action names reach the existing owner transaction and retain request identity", async () => {
  let calls = 0;
  let expectedCommand = "";
  let expectedAction = "";
  const input: Fields = {
    id: sfs.int(53501),
    talentid: sfs.int(5520050),
    full: sfs.int(0),
    operationId: sfs.string("native-operation"),
    _cok_: sfs.int(73),
    cmdBaseTime: sfs.long(1000n),
  };
  const original = structuredClone(input);
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (owner, command, params) => {
        calls++;
        expect(owner).toBe("owner");
        expect(command).toBe(expectedCommand);
        expect(params).toEqual({ ...input, M__REQUEST_ID__H: sfs.string(expectedAction) });
        return { body: { success: sfs.bool(true) }, pushes: [] };
      },
    },
  );
  for (const [prefix, actions] of routes) {
    for (const action of actions) {
      expectedCommand = prefix;
      expectedAction = action;
      const response = await game.execute("owner", `${prefix}.${action}`, input);
      expect(response.body).toMatchObject({ _cok_: input._cok_, cmdBaseTime: input.cmdBaseTime });
    }
  }
  expect(calls).toBe(28);
  expect(input).toEqual(original);
});

test("canonical requests and direct purchase stay intact while spoofed and unknown actions fail", async () => {
  const params = { M__REQUEST_ID__H: sfs.string("activatetalent"), id: sfs.int(53501) };
  expect(generalRequest("newgeneral", params)).toEqual({ command: "newgeneral", params });
  expect(generalRequest("newgeneral.buy", params)).toEqual({ command: "newgeneral.buy", params });
  expect(() => generalRequest("newgeneral.resettalent", params)).toThrow();
  const game = new GameService({} as GameStore, new Rules(new Map(), new Map(), new Map()), {
    kingdomId: 1,
  });
  for (const command of ["newgeneral.admin", "newgeneral.activatetalent.extra", "constructor.info"])
    await expect(game.execute("owner", command, {})).rejects.toThrow();
});
