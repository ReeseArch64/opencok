import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "43",
            "name": "effsound",
            "checksize": "1024",
            "iosmd5": "f3957985f35a4845810187aad3c66b69",
            "androidmd5": "3a7afc6a6b3ca236da878c3e6f51d911",
            "version": "1.0.1",
          },
        },
        { "#text": "\n    " },
        {
          "ItemSpec": [],
          ":@": {
            "id": "44",
            "name": "effsound",
            "checksize": "1024",
            "iosmd5": "c1464ad9eebb7b7a0d257fc02a7faa15",
            "androidmd5": "2f407cc00ac635dc16553733f63b62b7",
            "version": "1.0.1",
          },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
