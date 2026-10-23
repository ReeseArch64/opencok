import { connect, type Socket } from "node:net";
import { createHash } from "node:crypto";
import { FrameReader, frame } from "../src/protocol/frame.ts";
import { envelope, extension, fields, sfs, str, type Fields } from "../src/protocol/sfs.ts";

export class Client {
  readonly socket: Socket;
  private packets: Fields[] = [];
  private waiting?: { resolve: (packet: Fields) => void; reject: (error: Error) => void };
  constructor(
    port: number,
    readonly kingdomId = 1,
  ) {
    this.socket = connect(port, "127.0.0.1");
    const reader = new FrameReader();
    this.socket.on("data", (data) => {
      for (const packet of reader.feed(Buffer.from(data))) {
        if (this.waiting) {
          const waiting = this.waiting;
          this.waiting = undefined;
          waiting.resolve(packet);
        } else this.packets.push(packet);
      }
    });
    this.socket.on("error", () => this.waiting?.reject(new Error("Test socket failed")));
    this.socket.on("close", () => this.waiting?.reject(new Error("Test socket closed")));
  }
  send(packet: Fields) {
    this.socket.write(frame(packet));
  }
  async next(): Promise<Fields> {
    if (this.packets.length) return this.packets.shift()!;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waiting = undefined;
        reject(new Error("Test response timeout"));
      }, 10000);
      this.waiting = {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      };
    });
  }
  async handshake() {
    this.send(envelope(0, 0, { api: sfs.string("1.7.1"), cl: sfs.string("Android") }));
    return fields((await this.next()).p);
  }
  async login(
    secret: string,
    uid = "synthetic-player",
    deviceUuid = "synthetic-device",
    version = "12.06.0",
    timestamp = String(Date.now()),
    platform = "csmod_games",
  ) {
    this.send(
      envelope(0, 1, {
        zn: sfs.string(`COK${this.kingdomId}`),
        un: sfs.string(uid),
        pw: sfs.string(""),
        p: sfs.object({
          gameUid: sfs.string(uid),
          uuid: sfs.string(deviceUuid),
          deviceId: sfs.string("synthetic-hardware"),
          appVersion: sfs.string(version),
          pf: sfs.string(platform),
          cmdBaseTime: sfs.string(timestamp),
          SecurityCode: sfs.string(
            createHash("md5")
              .update(timestamp + secret + uid)
              .digest("hex"),
          ),
        }),
      }),
    );
    return fields((await this.next()).p);
  }
  async command(name: string, params: Fields = {}): Promise<Fields> {
    this.send(extension(name, params));
    for (let i = 0; i < 20; i++) {
      const packet = fields((await this.next()).p);
      if (str(packet, "c") === name) return fields(packet.p);
    }
    throw new Error("Too many unexpected test responses");
  }
  close() {
    this.socket.destroy();
  }
}
