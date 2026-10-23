export type Parameters = Record<string, string>;

export function phpEmpty(value: unknown): boolean {
  return (
    value == null ||
    value === false ||
    value === "" ||
    value === "0" ||
    value === 0 ||
    (Array.isArray(value) && value.length === 0)
  );
}

export function phpJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/\//g, "\\/")
    .replace(
      /[\u007f-\uffff]/g,
      (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
    );
}

function addParameter(result: Parameters, name: string, value: string): void {
  const bracket = name.indexOf("[");
  const key = (bracket < 0 ? name : name.slice(0, bracket)).replace(/[ .]/g, "_");
  if (key) result[key] = bracket < 0 ? value : "Array";
}

export async function requestParameters(request: Request): Promise<Parameters> {
  const result: Parameters = Object.create(null);
  for (const [name, value] of new URL(request.url).searchParams) addParameter(result, name, value);

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.startsWith("application/x-www-form-urlencoded")) {
      for (const [name, value] of new URLSearchParams(await request.text()))
        addParameter(result, name, value);
    } else if (contentType.startsWith("multipart/form-data")) {
      for (const [name, value] of await request.formData()) {
        if (typeof value === "string") addParameter(result, name, value);
      }
    }
  }
  return result;
}

export function phpUrlDecode(value: string): string {
  const bytes: number[] = [];
  for (let i = 0; i < value.length;) {
    const part = value.slice(i, i + 3);
    if (/^%[a-f\d]{2}$/i.test(part)) {
      bytes.push(parseInt(part.slice(1), 16));
      i += 3;
    } else {
      const character = String.fromCodePoint(value.codePointAt(i)!);
      bytes.push(...Buffer.from(character === "+" ? " " : character));
      i += character.length;
    }
  }
  return Buffer.from(bytes).toString("utf8");
}
