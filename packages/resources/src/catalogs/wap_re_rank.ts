import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100013", "rank": "1", "reward": "239947", "tpye": "1|3", "num": "20|1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100014", "rank": "2", "reward": "239948", "tpye": "1|4", "num": "10|1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100015", "rank": "3", "reward": "239949", "tpye": "5", "num": "1" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100016", "rank": "4", "reward": "239950", "tpye": "0", "num": "0" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100017", "rank": "5", "reward": "239951", "tpye": "0", "num": "0" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100018", "rank": "6", "reward": "239952", "tpye": "0", "num": "0" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100019", "rank": "7", "reward": "239953", "tpye": "0", "num": "0" },
        },
        { "#text": "\n  " },
        {
          "ItemSpec": [],
          ":@": { "id": "7100020", "rank": "8", "reward": "239954", "tpye": "0", "num": "0" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
