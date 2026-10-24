import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n" },
        { "server": [], ":@": { "ip": "tcp -h 10.1.6.242", "port": "10000" } },
        { "#text": "\n" },
        { "p": [{ "#text": "0" }], ":@": { "id": "lucky_rate" } },
        { "#text": "\n" },
        { "s": [{ "#text": "10" }], ":@": { "id": "Lucky" } },
        { "#text": "\n" },
        { "s": [{ "#text": "100" }], ":@": { "id": "lreward" } },
        { "#text": "\n" },
        { "f": [{ "#text": "10000" }], ":@": { "id": "reward_all" } },
        { "#text": "\n" },
        { "f": [{ "#text": "0" }], ":@": { "id": "lottory_num" } },
        { "#text": "\n" },
        { "f": [{ "#text": "0" }], ":@": { "id": "lottory_gold" } },
        { "#text": "\n" },
      ],
    },
  ]);
}
