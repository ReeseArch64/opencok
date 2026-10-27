import { sfs, str, type Fields } from "@opencok/messages/sfs";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { generalMap, generalFeatureAvailable } from "@opencok/hero/rules/new-general-content";
import { cityInteger } from "@opencok/rules/city-progression";
import { generalFailure, generalPairs } from "@opencok/hero/rules/general-progression";
import { generalRoster, ownedGeneral, writeGeneral, generalChanges } from "./generals.ts";
import type { CityProgressionContext } from "@opencok/services/city-progression-context";

export function releasedGeneral(row: Row): Row {
  return {
    ...row,
    state: 1,
    predatoruid: "",
    buildingUuid: "",
    relivetime: 0n,
    gethomttime: 0n,
    serverid: 0,
    killtime: 0n,
    robtime: 0n,
    optime: "",
  };
}

export function recoverGenerals(context: CityProgressionContext, reconnect: boolean) {
  const marching = new Set<number>();

  if (reconnect)
    {for (const march of generalRoster(context).marches ?? []) {
      if (!Buffer.isBuffer(march.armyInfo)) {continue;}

      const general = decodeWorldMarchArmy(march.armyInfo)?.general;

      if (general) {
        if (general.owner !== context.owner) {generalFailure();}

        marching.add(general.id);
      }
    }}

  for (const row of generalRoster(context).generals) {
    if (
      [4, 5].includes(num(row, "state")) &&
      ((long(row, "relivetime") > 0n && long(row, "relivetime") <= context.now) ||
        (long(row, "gethomttime") > 0n && long(row, "gethomttime") <= context.now))
    )
      {writeGeneral(context, releasedGeneral(row));}
    else if (
      reconnect &&
      ((num(row, "state") === 3 && !marching.has(num(row, "id"))) ||
        (num(row, "state") === 2 &&
          !context.state.buildings.some((building) => building.uuid === row.buildingUuid)))
    )
      {writeGeneral(context, releasedGeneral(row));}
  }
}

function prisoner(row: Row): Fields {
  const times = generalMap(text(row, "optime"), (value) => BigInt(value), 200);

  return {
    alliancename: sfs.string(text(row, "alliancename")),
    owneruid: sfs.string(text(row, "uid")),
    ownername: sfs.string(text(row, "ownername")),
    generalid: sfs.int(num(row, "id")),
    robtime: sfs.long(long(row, "robtime")),
    killtime: sfs.long(long(row, "killtime")),
    oplist: sfs.array(
      [...times].map(([type, time]) => sfs.object({ type: sfs.int(type), time: sfs.long(time) })),
    ),
  };
}

export function generalPrison(context: CityProgressionContext, params: Fields): Fields {
  if (
    !generalFeatureAvailable(context.rules, "hero_rob", {
      kingdomId: context.rules.kingdomId,
      version: "12.06.0",
      now: Number(context.now),
    })
  )
    {generalFailure();}

  const action = str(params, "M__REQUEST_ID__H");

  if (num(context.state.profile, "crossFightSrcServerId") > 0) {generalFailure();}

  const prisoners = generalRoster(context).prisoners ?? [],
    expired = (row: Row) =>
      (long(row, "gethomttime") > 0n && long(row, "gethomttime") <= context.now) ||
      (long(row, "relivetime") > 0n && long(row, "relivetime") <= context.now);

  if (action === "openprison") {
    const stale = prisoners.filter(expired);

    if (stale.length)
      {(context.write.generalRoster ??= {}).prisoners = stale.map((row) => ({
        ...releasedGeneral(row),
        actor: context.owner,
      }));}

    return {
      prisonlist: sfs.array(
        prisoners.filter((row) => !expired(row)).map((row) => sfs.object(prisoner(row))),
      ),
    };
  }

  if (["checkrelive", "quickrelive", "suicide"].includes(action)) {
    const id = cityInteger(str(params, action === "suicide" ? "id" : "generalid"), 1),
      row = ownedGeneral(context, id);
    let next: Row = row;

    if (action === "quickrelive") {
      if (
        num(row, "state") !== 5 ||
        long(row, "relivetime") <= context.now ||
        !generalFeatureAvailable(context.rules, "hero_revival", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        {generalFailure();}

      const item = context.rules.items.get("hero_revival")?.k1;

      if (!item) {generalFailure();}

      context.spendItem(item, 1);
      next = releasedGeneral(row);
    } else if (action === "suicide") {
      const grave = context.state.buildings.find(
          (building) => building.itemId === 435000 && num(building, "level") > 0,
        ),
        item = context.rules.items.get("hero_rob")?.k9;

      if (
        num(row, "state") !== 4 ||
        long(row, "relivetime") > context.now ||
        long(row, "gethomttime") > context.now ||
        !grave ||
        !item
      )
        {generalFailure();}

      context.spendItem(item, 1);
      const duration = cityInteger(
        context.rules.building(
          "435000",
          num(grave, "level"),
          num(grave, "star"),
          num(grave, "progress"),
        ).clientParameters?.[0]?.value,
        1,
      );
      next = {
        ...row,
        state: 5,
        predatoruid: "",
        buildingUuid: "",
        relivetime: context.now + BigInt(duration) * 1000n,
      };
    }

    if (next !== row) {writeGeneral(context, next);}

    return generalChanges(context, [next]);
  }

  const uid = str(params, "owneruid"),
    idString = str(params, "generalid"),
    id = cityInteger(idString, 1),
    row = generalRoster(context).prisoners?.find((row) => row.uid === uid && row.id === id);

  if (
    !row ||
    expired(row) ||
    row.predatoruid !== context.owner ||
    num(row, "state") !== 4 ||
    uid === context.owner
  )
    {generalFailure();}

  let next: Row;

  if (action === "free") {next = releasedGeneral(row);}
  else if (action === "kill") {
    if (long(row, "killtime") > context.now) {generalFailure();}

    const duration = cityInteger(
      context.rules.building(
        "435000",
        cityInteger(num(row, "graveLevel"), 1),
        num(row, "graveStar"),
        num(row, "graveProgress"),
      ).clientParameters?.[0]?.value,
      1,
    );
    next = {
      ...row,
      state: 5,
      predatoruid: "",
      buildingUuid: "",
      relivetime: context.now + BigInt(duration) * 1000n,
    };
  } else if (action === "insult") {
    const type = cityInteger(str(params, "type"), 1, 4),
      times = generalMap(text(row, "optime"), (value) => BigInt(value), 200),
      duration = generalPairs(context.rules.items.get("hero_rob")?.k12).get(type);

    if (!duration || (times.get(type) ?? 0n) > context.now) {generalFailure();}

    times.set(type, context.now + BigInt(duration) * 1000n);
    next = { ...row, optime: [...times].map(([type, at]) => `${type};${at}`).join("|") };
  } else {generalFailure();}

  (context.write.generalRoster ??= {}).prisoners = [{ ...next, actor: context.owner }];

  return action === "insult"
    ? { prisonlist: sfs.array([sfs.object(prisoner(next))]) }
    : { owneruid: sfs.string(uid), generalid: sfs.string(idString) };
}
