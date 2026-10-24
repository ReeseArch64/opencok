import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeWorldSearch(rows: readonly Row[]): Fields {
  if (rows.length > 8) throw new GameError(errors.invalid);
  const ids = new Set<string>();
  return {
    list: sfs.array(
      rows.map((row) => {
        const value: Fields = { pointId: sfs.int(1203) };
        for (const [key, limit] of [
          ["uid", 255],
          ["name", 255],
          ["pic", 40],
          ["abbr", 10],
        ] as const) {
          const field = row[key];
          if (key === "pic" && field == null) continue;
          if (
            typeof field !== "string" ||
            field.length > limit ||
            !field.isWellFormed() ||
            field.includes("\0")
          )
            throw new GameError(errors.invalid);
          value[key] = sfs.string(field);
        }
        const uid = row.uid as string;
        if (!uid || ids.has(uid)) throw new GameError(errors.invalid);
        ids.add(uid);
        if (row.picVer != null) {
          if (
            typeof row.picVer !== "number" ||
            !Number.isInteger(row.picVer) ||
            row.picVer < -2147483648 ||
            row.picVer > 2147483647
          )
            throw new GameError(errors.invalid);
          value.picVer = sfs.int(row.picVer);
        }
        if (row.power != null) {
          if (typeof row.power !== "bigint" || BigInt.asIntN(64, row.power) !== row.power)
            throw new GameError(errors.invalid);
          value.power = sfs.long(row.power);
        }
        return sfs.object(value);
      }),
    ),
  };
}

const searchText = (maximum: number) =>
  wire.string.refine(
    ({ value }) => value.length <= maximum && value.isWellFormed() && !value.includes("\0"),
  );

export class WorldSearchDto extends createZodDto(
  z.strictObject({
    list: wire
      .array(
        wire.object(
          z.strictObject({
            uid: searchText(255).refine(({ value }) => value.length > 0),
            name: searchText(255),
            pic: searchText(40).optional(),
            abbr: searchText(10),
            pointId: wire.int.refine(({ value }) => value === 1203),
            picVer: wire.int.optional(),
            power: wire.long.optional(),
          }),
        ),
      )
      .refine(
        ({ value }) =>
          value.length <= 8 &&
          new Set(value.map((entry) => entry.value.uid.value)).size === value.length,
      ),
  }),
) {}

export function worldSearch(...args: Parameters<typeof serializeWorldSearch>): Fields {
  return new WorldSearchDto(serializeWorldSearch(...args));
}
