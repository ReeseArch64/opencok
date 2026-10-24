import type {
  MailCategoryQuery,
  MailListEntry,
  MailContentsQuery,
  MailConversationSaveQuery,
  MailDeleteEntry,
  MailDeleteGroup,
  MailDeleteQuery,
  MailReadQuery,
  MailSaveMode,
  MailSaveQuery,
  MailStatusCount,
  MailStatusQuery,
  MailStatusResult,
} from "@opencok/contracts/mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

const categories: readonly (readonly number[])[] = [
  [2, 14, 11, 28, 29, 34],
  [13, 15, 16],
  [32],
  [21, 22, 20, 37, 38, 45, 46],
  [17, 25, 26, 27, 33, 10, 34, 35, 36],
  [6, 7, 8, 18, 30, 48, 9, 12, 5, 42],
  [23, 24, 39, 40],
  [43, 44],
];
const combinedCategories = new Map(
  categories.flatMap((types, index) => types.map((type) => [type, index] as const)),
);
function invalid(): never {
  throw new GameError(errors.unsupported, "mail");
}
function int(value: number): boolean {
  return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
}

export function mailContentsQuery(value: string, now: number): MailContentsQuery {
  if (
    typeof value !== "string" ||
    new TextEncoder().encode(value).length > 65535 ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    return invalid();
  const ids = value.split("|").filter(Boolean);
  if (
    !ids.length ||
    ids.length > 1000 ||
    ids.some((id) => id.length > 40 || id.includes("\0") || !id.isWellFormed())
  )
    return invalid();
  return { ids: [...new Set(ids)], now };
}

export function mailConversationSaveQuery(
  input: { mod: number; fromUser?: string; type?: number; flag?: number },
  now: number,
): MailConversationSaveQuery {
  if (!int(input.mod) || !Number.isSafeInteger(now) || now < 0) return invalid();
  if (input.fromUser === undefined && input.type === undefined) return { scope: "none", now };
  if (input.flag === undefined || !int(input.flag)) return invalid();
  if (input.fromUser !== undefined) {
    if (
      typeof input.fromUser !== "string" ||
      input.fromUser.length > 40 ||
      input.fromUser.includes("\0") ||
      !input.fromUser.isWellFormed()
    )
      return invalid();
    return {
      scope: "sender",
      fromUser: input.fromUser,
      moderation: input.mod === 1,
      flag: input.flag,
      now,
    };
  }
  if (input.type === undefined || !int(input.type)) return invalid();
  const types = new Map([
    [0, 21],
    [1, 22],
    [4, 7],
    [10, 14],
    [14, 12],
    [21, 10],
  ]);
  return { scope: "type", type: types.get(input.type) ?? input.type, flag: input.flag, now };
}

export function mailBlank(value: string | null | undefined): boolean {
  if (value == null) return true;
  return Array.from(value).every((character) => {
    const code = character.charCodeAt(0);
    return (
      (code >= 9 && code <= 13) ||
      (code >= 28 && code <= 32) ||
      code === 0x1680 ||
      code === 0x180e ||
      (code >= 0x2000 && code <= 0x2006) ||
      (code >= 0x2008 && code <= 0x200a) ||
      [0x2028, 0x2029, 0x205f, 0x3000].includes(code)
    );
  });
}

export function mailCategoryQuery(
  category: number,
  begin: number,
  offset: number,
  now: number,
): MailCategoryQuery {
  if (![category, begin, offset].every(int) || !Number.isSafeInteger(now) || now < 0)
    return invalid();
  return { category, begin, offset, now };
}

export function mailCategoryWindow(query: MailCategoryQuery): number | undefined {
  mailCategoryQuery(query.category, query.begin, query.offset, query.now);
  if (!categories[query.category - 1]) return undefined;
  return query.begin > 0 ? 0 : Math.max(0, (query.begin + query.offset) | 0);
}

export function selectMailCategory<T extends Pick<MailListEntry, "type" | "title">>(
  query: MailCategoryQuery,
  window: readonly T[],
): T[] {
  const limit = mailCategoryWindow(query);
  if (limit === undefined) {
    if (window.length) return invalid();
    return [];
  }
  if (window.length > limit || window.length > 1000) return invalid();
  const types = categories[query.category - 1]!;
  return window.filter((entry) =>
    entry.title === "115429"
      ? query.category === 5 || (query.category !== 1 && types.includes(entry.type))
      : types.includes(entry.type),
  );
}

export function mailClientType(type: number): number {
  const mapped = new Map([
    [7, 4],
    [10, 21],
    [12, 14],
    [14, 10],
    [21, 0],
    [22, 1],
  ]);
  return mapped.get(type) ?? type;
}

export function mailCategorySenders(
  entries: readonly Pick<MailListEntry, "type" | "fromUser">[],
): string[] {
  const types = new Set([
    22, 21, 20, 17, 25, 6, 10, 24, 23, 26, 27, 28, 29, 34, 33, 38, 37, 45, 46, 40, 39, 43, 44,
  ]);
  return [
    ...new Set(
      entries
        .filter((entry) => types.has(entry.type) && !mailBlank(entry.fromUser))
        .map((entry) => entry.fromUser!),
    ),
  ];
}

export function mailTranslationRequest(
  translationId: string | null,
  lang: string | null,
): { id: string; fromLang: string; toLang: string } | undefined {
  if (lang === null || mailBlank(translationId)) return undefined;
  const [fromLang, id] = translationId!.split("|").filter(Boolean);
  if (mailBlank(fromLang) || mailBlank(id)) return undefined;
  const lower = lang.toLowerCase();
  let target = lang;
  if (["cn", "zh-chs", "zh_cn", "zh-cn"].includes(lower)) target = "zh-Hans";
  else if (["zh-cht", "tw", "zh_tw"].includes(lower)) target = "zh-Hant";
  else if (["id", "in"].includes(lower)) target = "ms";
  else if (lower === "jp") target = "ja";
  else if (lang === "en_gb") target = "en";
  else if (lang === "fr_fr") target = "fr";
  else if (lang === "it_it") target = "it";
  const allowed = [
    "en",
    "zh-Hans",
    "zh-Hant",
    "ja",
    "ko",
    "ru",
    "es",
    "ms",
    "fr",
    "de",
    "it",
    "pt",
  ];
  return { id: id!, fromLang: fromLang!, toLang: allowed.includes(target) ? target : "en" };
}

function mailIds(value: string, batch: boolean): string[] {
  if (typeof value !== "string" || new TextEncoder().encode(value).length > 65535) return invalid();
  const blank = mailBlank(value);
  const parts = batch ? (blank ? [] : value.split(",").filter(Boolean)) : [value];
  if (
    parts.length > 1000 ||
    parts.some((id) => id.length > 40 || id.includes("\0") || !id.isWellFormed())
  )
    return invalid();
  return [...new Set(parts)];
}

export function mailReadQuery(batch: boolean, value: string, now: number): MailReadQuery {
  if (typeof batch !== "boolean" || !Number.isSafeInteger(now) || now < 0) return invalid();
  return { batch, ids: mailIds(value, batch), now };
}

export function mailDeleteQuery(value: string, now: number): MailDeleteQuery {
  if (!Number.isSafeInteger(now) || now < 0) return invalid();
  if (typeof value !== "string" || new TextEncoder().encode(value).length > 65535) return invalid();
  const ids = value.split(",").filter(Boolean);
  if (
    ids.length > 1000 ||
    ids.some((id) => id.length > 40 || id.includes("\0") || !id.isWellFormed())
  )
    return invalid();
  return { ids: [...new Set(ids)], now };
}

export function mailDeleteGroups(
  entries: readonly Pick<MailDeleteEntry, "uid" | "type" | "fromUser">[],
): MailDeleteGroup[] {
  const groups = new Map<string, MailDeleteGroup>();
  for (const entry of entries) {
    let group: MailDeleteGroup | undefined;
    if ([2, 11, 12, 17, 25, 26, 27, 28, 29, 33, 34].includes(entry.type))
      group = { groupType: entry.type, groupIndex: entry.uid, types: [] };
    else if ([20, 21, 22].includes(entry.type) && entry.fromUser !== null)
      group = {
        groupType: 100,
        groupIndex: entry.fromUser,
        fromUser: entry.fromUser,
        types: [20, 21, 22],
      };
    else if ([23, 24, 39, 40].includes(entry.type) && entry.fromUser !== null)
      group = {
        groupType: 500,
        groupIndex: entry.fromUser,
        fromUser: entry.fromUser,
        types: [23, 24],
      };
    else if (entry.type === 5) group = { groupType: 200, groupIndex: "", types: [5] };
    else if (entry.type === 10) group = { groupType: 400, groupIndex: "", types: [10] };
    else if (entry.type === 18) group = { groupType: 300, groupIndex: "", types: [18] };
    if (group) groups.set(JSON.stringify([group.groupType, group.groupIndex]), group);
  }
  return [...groups.values()];
}

export function mailSaveQuery(
  mode: MailSaveMode,
  value: string,
  flag: number,
  now: number,
): MailSaveQuery {
  if (
    !["save", "cancel", "batch"].includes(mode) ||
    !int(flag) ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    return invalid();
  return {
    mode,
    ids: mailIds(value, mode === "batch"),
    flag: mode === "save" || (mode === "batch" && flag === 1) ? 1 : 0,
    now,
  };
}

export function mailStatusQuery(category: number | undefined, now: number): MailStatusQuery {
  if ((category !== undefined && !int(category)) || !Number.isSafeInteger(now)) return invalid();
  return { category, now };
}

export function calculateMailStatus(
  query: MailStatusQuery,
  counts: readonly MailStatusCount[],
): MailStatusResult {
  if (query.category !== undefined && (query.category < 1 || query.category > 8))
    return { mode: "unknown" };
  if (counts.length > 32767) return invalid();
  const totals = Array.from({ length: 8 }, () => ({ total: 0n, unread: 0n }));
  const selected = query.category === undefined ? undefined : categories[query.category - 1]!;
  const seen = new Set<string>();
  for (const group of counts) {
    if (
      !int(group.type) ||
      !int(group.status) ||
      typeof group.allianceNotice !== "boolean" ||
      typeof group.count !== "bigint" ||
      group.count < 1n ||
      group.count > 9223372036854775807n
    )
      return invalid();
    const key = `${group.type}:${group.status}:${group.allianceNotice}`;
    if (seen.has(key)) return invalid();
    seen.add(key);
    const index = selected
      ? selected.includes(group.type)
        ? query.category! - 1
        : undefined
      : group.allianceNotice
        ? 4
        : combinedCategories.get(group.type);
    if (index === undefined) continue;
    if (group.status !== 0 && group.status !== 1) {
      if (!selected) return invalid();
      continue;
    }
    totals[index]!.total += group.count;
    if (group.status === 0) totals[index]!.unread += group.count;
  }
  if (query.category === undefined)
    return {
      mode: "all",
      categories: totals.map(({ total, unread }) => ({
        total: Number(BigInt.asIntN(32, total)),
        unread: Number(BigInt.asIntN(32, unread)),
      })),
    };
  const { total, unread } = totals[query.category - 1]!;
  return { mode: "category", total: BigInt.asIntN(64, total), unread: BigInt.asIntN(64, unread) };
}
