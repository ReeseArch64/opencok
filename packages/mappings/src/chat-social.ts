import { Type, sfs, type Fields, type Value } from "@opencok/messages/sfs";

export function chatSocialInput(params: Fields): Record<string, unknown> {
  const value = (entry: Value): unknown => {
    if (entry.type === Type.Object) return chatSocialInput(entry.value as Fields);

    if (entry.type === Type.Array) return (entry.value as Value[]).map(value);

    if (entry.type === Type.Long) {
      const number = Number(entry.value);

      if (!Number.isSafeInteger(number)) throw new TypeError("Chat integer exceeds precision");

      return number;
    }

    return entry.value;
  };

  return Object.fromEntries(Object.entries(params).map(([key, entry]) => [key, value(entry)]));
}

export function chatSocialResponse(data: Record<string, unknown>): Fields {
  const value = (item: unknown, key: string): Value => {
    if (item === null || item === undefined) return sfs.null();

    if (typeof item === "string") return sfs.string(item);

    if (typeof item === "boolean") return sfs.bool(item);

    if (typeof item === "number") {
      if (!Number.isSafeInteger(item)) throw new TypeError("Invalid chat integer");

      return /time|until|seq|cursor/i.test(key) || item > 2147483647
        ? sfs.long(item)
        : sfs.int(item);
    }

    if (Array.isArray(item)) return sfs.array(item.map((entry) => value(entry, key)));

    if (typeof item === "object")
      return sfs.object(chatSocialResponse(item as Record<string, unknown>));

    throw new TypeError("Invalid chat response");
  };

  return Object.fromEntries(Object.entries(data).map(([key, item]) => [key, value(item, key)]));
}
