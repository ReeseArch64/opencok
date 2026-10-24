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
          "Group": [
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "901001",
                "priority": "1",
                "type": "0",
                "ios_md5": "321b0514ab7252d7f4ddf0ffdfcc2e02",
                "a_md5": "321b0514ab7252d7f4ddf0ffdfcc2e02",
                "function_on": "1",
              },
            },
            { "#text": "\n    " },
            {
              "ItemSpec": [],
              ":@": {
                "id": "901002",
                "priority": "1",
                "type": "0",
                "ios_md5": "3e3f05f6e7654e49cecb9367dc6eb63c",
                "a_md5": "d33ff346235ba39436ba556be696c1fc",
                "function_on": "0",
              },
            },
            { "#text": "\n\n  " },
          ],
          ":@": { "id": "auto_updata" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
