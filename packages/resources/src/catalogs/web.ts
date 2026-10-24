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
        { "flag": [], ":@": { "open": "0", "key": "110" } },
        { "#text": "\n  " },
        { "exclude": [{ "#text": "com.elex.cok.web.ping.PaymentPingppRequest" }] },
        { "#text": "\n  " },
        { "exclude": [{ "#text": "com.elex.cok.web.ping.PaymentPingppCallback" }] },
        { "#text": "\n  " },
        { "exclude": [{ "#text": "com.elex.cok.web.pay.PaymentCallback" }] },
        { "#text": "\n" },
      ],
    },
  ]);
}
