export async function fetchChatJson(
  url: string,
  options: RequestInit,
  timeoutMs: number,
  request: (url: string, options: RequestInit) => Promise<Response>,
): Promise<unknown> {
  const controller = new AbortController();
  const signal = options.signal
    ? AbortSignal.any([options.signal, controller.signal])
    : controller.signal;
  signal.throwIfAborted();
  let abort: (() => void) | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cancel: (() => Promise<void>) | undefined;
  const exchange = async () => {
    const response = await request(url, {
      ...options,
      redirect: "error",
      signal,
    });
    if (
      signal.aborted ||
      !response.ok ||
      response.redirected ||
      !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "") ||
      !response.body
    ) {
      void response.body?.cancel().catch(() => {});
      throw new Error("Invalid chat response");
    }
    const reader = response.body.getReader();
    cancel = () => reader.cancel();
    const length = response.headers.get("content-length");
    if (length !== null && (!/^\d+$/.test(length) || Number(length) > 16384))
      throw new Error("Invalid chat response");
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 16384) throw new Error("Invalid chat response");
      chunks.push(chunk.value);
    }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
  };
  try {
    return await Promise.race([
      exchange(),
      new Promise<never>((_, reject) => {
        abort = () => reject(new Error("Chat request aborted"));
        signal.addEventListener("abort", abort, { once: true });
        if (signal.aborted) abort();
      }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error("Chat request timed out"));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (abort) signal.removeEventListener("abort", abort);
    clearTimeout(timer);
    controller.abort();
    void cancel?.().catch(() => {});
  }
}
