export class SocketClient {
  readonly socket: WebSocket;
  private frames: Record<string, any>[] = [];
  constructor(url: string, uid: string, session: string) {
    this.socket = new WebSocket(url, { headers: { uid, session } });
    this.socket.onmessage = (event) => this.frames.push(JSON.parse(String(event.data)));
    this.socket.onerror = () => {};
  }
  async next(cmd: string) {
    const end = Date.now() + 5000;
    while (Date.now() < end) {
      const index = this.frames.findIndex((frame) => frame.cmd === cmd);
      if (index >= 0) return this.frames.splice(index, 1)[0]!;
      await Bun.sleep(10);
    }
    throw new Error(`Synthetic chat response timeout: ${cmd}`);
  }
  async command(cmd: string, params: Record<string, unknown>, sendTime = Date.now()) {
    this.socket.send(JSON.stringify({ cmd, params, sendTime }));
    return this.next(cmd);
  }
  close() {
    this.socket.close();
  }
}
