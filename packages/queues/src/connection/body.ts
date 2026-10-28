export async function readActivityDeadlineBody(
    stream: ReadableStream<Uint8Array> | null,
    signal: AbortSignal,
): Promise<string>
{
    if (!stream)
    {
        throw new Error("Missing activity deadline body");
    }
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    const aborted = Promise.withResolvers<never>();
    const stop = () => {
        aborted.reject(new Error("Activity deadline body timeout"));
        void reader.cancel().catch(() => undefined);
    };
    signal.addEventListener("abort", stop, { once: true });
    try
    {
        signal.throwIfAborted();
        for (;;)
        {
            const next = await Promise.race([reader.read(), aborted.promise]);
            if (next.done)
            {
                break;
            }
            size += next.value.byteLength;
            if (size > 4096)
            {
                void reader.cancel().catch(() => undefined);
                throw new Error("Activity deadline body exceeds bound");
            }
            chunks.push(next.value);
        }
        signal.throwIfAborted();

        return new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
    }
    finally
    {
        signal.removeEventListener("abort", stop);
        reader.releaseLock();
    }
}
