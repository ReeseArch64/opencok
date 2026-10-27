export type HttpRequest = (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
