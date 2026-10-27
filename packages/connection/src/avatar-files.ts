import type { AvatarFiles, AvatarTickets } from "@opencok/contracts/files";

export function createAvatarFiles(options: {
  origin: string;
  tickets: AvatarTickets;
  timeoutMs: number;
  fetch?: (url: string, options: RequestInit) => Promise<Response>;
}): AvatarFiles {
  const url = new URL(options.origin);

  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname !== "/" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !Number.isInteger(options.timeoutMs) ||
    options.timeoutMs < 100 ||
    options.timeoutMs > 30000
  )
    throw new Error("Invalid avatar files configuration");

  const request = options.fetch ?? fetch;
  const exchange = async (
    owner: string,
    sequence: number,
    image: boolean,
  ): Promise<string | null> => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort();
        reject(new Error("Avatar files unavailable"));
      }, options.timeoutMs);
    });
    let reader: Pick<ReadableStreamDefaultReader<Uint8Array>, "read" | "cancel"> | undefined;
    const operation = async () => {
      const token = await options.tickets.issue(owner, sequence, image ? "image" : "confirm");

      if (controller.signal.aborted) throw new Error();

      const response = await request(
        `${url.origin}/_internal/avatars/${owner}/${sequence}${image ? "/url" : ""}`,
        {
          method: "GET",
          headers: { "X-Avatar-Confirmation": token },
          redirect: "error",
          signal: controller.signal,
        },
      );
      reader = response.body?.getReader();
      const limit = image ? 4096 : 128;

      if (response.redirected || ![200, 404].includes(response.status) || controller.signal.aborted)
        throw new Error();

      if (
        response.status === 200 &&
        !/^text\/plain(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")
      )
        throw new Error();

      const length = response.headers.get("content-length");

      if (length !== null && (!/^\d+$/.test(length) || Number(length) > limit)) throw new Error();

      const chunks: Uint8Array[] = [];
      let size = 0;

      while (reader) {
        const chunk = await reader.read();

        if (chunk.done) break;

        size += chunk.value.length;

        if (size > limit || controller.signal.aborted) throw new Error();

        chunks.push(chunk.value);
      }

      const body = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));

      if (response.status === 404 && body === "") return null;

      if (response.status !== 200 || controller.signal.aborted) throw new Error();

      return body;
    };

    try {
      return await Promise.race([operation(), timeout]);
    } catch {
      throw new Error("Avatar files unavailable");
    } finally {
      clearTimeout(timer);
      controller.abort();
      void reader?.cancel().catch(() => {});
    }
  };

  return {
    issue: (owner, sequence) => options.tickets.issue(owner, sequence, "upload"),
    async image(owner, sequence) {
      const body = await exchange(owner, sequence, true);

      if (!body) throw new Error("Avatar image unavailable");

      const image = new URL(body);

      if (
        !["http:", "https:"].includes(image.protocol) ||
        image.username ||
        image.password ||
        image.hash ||
        image.searchParams.get("X-Amz-Algorithm") !== "AWS4-HMAC-SHA256" ||
        !/^[a-f0-9]{64}$/.test(image.searchParams.get("X-Amz-Signature") ?? "")
      )
        throw new Error("Invalid avatar image URL");

      return image.href;
    },
    async find(owner, sequence) {
      const body = await exchange(owner, sequence, false);

      if (body === null) return null;

      const fields = body.split("\n");

      if (
        fields.length !== 5 ||
        fields[0] !== "v1" ||
        fields[1] !== owner ||
        fields[2] !== String(sequence) ||
        !/^[a-f0-9]{64}$/.test(fields[3]!) ||
        fields[4] !== ""
      )
        throw new Error("Avatar files unavailable");

      return { owner, sequence: String(sequence), hash: fields[3]! };
    },
  };
}
