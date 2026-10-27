export class ChatWebsocketUrl {
  public readonly url: URL;

  public constructor(public readonly value: string) {
    try {
      if (typeof value !== "string") {throw new TypeError();}

      const url = new URL(value);

      if (
        !["ws:", "wss:"].includes(url.protocol) ||
        !url.hostname ||
        url.hostname === "cok.chat" ||
        url.hostname.endsWith(".cok.chat") ||
        url.pathname !== "/chat/ws" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      )
        {throw new TypeError();}

      this.url = url;
    } catch {
      throw new TypeError("invalid chat websocket URL");
    }
  }
}
