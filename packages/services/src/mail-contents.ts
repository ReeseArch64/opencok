import type { MailContentsEntry } from "@opencok/contracts/mail";
import {
  decodeLegacyJsonObject,
  legacyJsonEntries,
  LegacyJsonError,
} from "@opencok/messages/legacy-json";
import {
  encode,
  extension,
  fields,
  ProtocolError,
  sfs,
  Type,
  type Fields,
  type Value,
} from "@opencok/messages/sfs";

const structured = new Set([5, 7, 8, 9, 10, 12, 17, 18, 25, 26, 27, 30, 31, 32, 33, 36, 42]);

export function storedMailText(data: Buffer | null, trim = true): string {
  if (!data) return "";

  try {
    const text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(data);

    if (!trim) return text;

    let start = 0;
    let end = text.length;

    while (start < end && text.charCodeAt(start) <= 32) start++;

    while (end > start && text.charCodeAt(end - 1) <= 32) end--;

    return text.slice(start, end);
  } catch {
    return "";
  }
}

function array(value: Value | undefined): Value[] | undefined {
  if (value === undefined) return undefined;

  if (value.type !== Type.Array) throw new LegacyJsonError();

  return value.value as Value[];
}

function oldHelpers(body: Fields, name: string) {
  const value = body[name];

  if (value?.type !== Type.Object) return;

  body[name] = sfs.array(
    legacyJsonEntries(fields(value)).map(([key, entry]) => {
      if (entry.type !== Type.Array) throw new LegacyJsonError();

      return sfs.object({ name: sfs.string(key), armyInfo: entry });
    }),
  );
}

function removeGeneralSkills(value: Value | undefined, skipNull = true) {
  for (const general of array(value) ?? []) {
    if (general.type === Type.Null && skipNull) continue;

    const object = fields(general);
    delete object.skill;
    delete object.ability;
  }
}

function repairFight(body: Fields) {
  oldHelpers(body, "defHelpReport");
  oldHelpers(body, "atkHelpReport");

  try {
    removeGeneralSkills(body.defGen);
    removeGeneralSkills(body.atkGen);

    for (const key of ["atkHelpReport", "defHelpReport"])
      for (const helper of array(body[key]) ?? []) {
        if (helper.type === Type.Null) continue;

        removeGeneralSkills(fields(helper).genInfo, false);
      }
  } catch {}
}

function repairScout(body: Fields) {
  try {
    for (const ability of array(body.ability) ?? []) {
      const object = fields(ability);

      for (const key of ["622300", "622200", "622100", "622000", "620700"]) delete object[key];
    }
  } catch {}
}

export function decodeMailContent(
  entry: MailContentsEntry,
): { body: Fields; contents: string } | undefined {
  if (!Number.isInteger(entry.type) || entry.type < 0 || entry.type > 49) throw new ProtocolError();

  let contents = storedMailText(entry.contents);

  if (contents.toLowerCase() === "extra") {
    if (entry.extra === null) throw new Error("Missing persisted mail contents");

    contents = storedMailText(entry.extra);
  }

  if (!structured.has(entry.type) || (entry.type === 8 && !contents.startsWith("{")))
    return { body: { contents: sfs.string(contents.replaceAll("\\n", "\n")) }, contents };

  try {
    const body = decodeLegacyJsonObject(contents);

    if (entry.type === 7) repairFight(body);

    if (entry.type === 8) repairScout(body);

    return { body, contents };
  } catch (error) {
    if (!(error instanceof LegacyJsonError)) throw error;

    return undefined;
  }
}

export function mailContentsProjection(
  entries: readonly MailContentsEntry[],
  envelope: Fields = {},
): {
  body: Fields;
  invalidIds: string[];
} {
  const result: Value[] = [];
  const invalidIds: string[] = [];

  for (const entry of entries) {
    const decoded = decodeMailContent(entry);

    if (!decoded) {
      invalidIds.push(entry.uid);
      continue;
    }

    const { body, contents } = decoded;
    body.createTime = sfs.long(entry.createTime);
    body.u = sfs.string(entry.uid);
    body.contentStr = sfs.string("");
    const chunks: Value[] = [];

    for (let index = 0; index < contents.length; index += 5000)
      chunks.push(
        sfs.string(
          contents
            .slice(index, index + 5000)
            .replace(
              /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
              "?",
            ),
        ),
      );

    body.contentsArr = sfs.array(chunks);
    result.push(sfs.object(body));
  }

  const body = { result: sfs.array(result) };
  encode(extension("mail.read", { ...body, ...envelope }));

  return { body, invalidIds };
}
