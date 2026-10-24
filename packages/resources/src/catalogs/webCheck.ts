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
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.ping.PaymentPingppRequest" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.ping.PaymentPingppCallback" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.ping.PaymentPingppSend" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.pay.PaymentInit" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.pay.PaymentSystem" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.pay.PaymentServerValidate" } },
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "com.elex.cok.web.pay.PaymentSendGoods" } },
            { "#text": "\n  " },
          ],
          ":@": { "id": "payClass" },
        },
        { "#text": "\n  " },
        {
          "Group": [
            { "#text": "\n     " },
            { "ItemSpec": [], ":@": { "id": "127.0.0.1" } },
            { "#text": "\n\t \n  " },
          ],
          ":@": { "id": "normalWhiteList" },
        },
        { "#text": "\n  " },
        {
          "Group": [
            { "#text": "\n    " },
            { "ItemSpec": [], ":@": { "id": "127.0.0.1" } },
            { "#text": "\n\t\n  " },
          ],
          ":@": { "id": "payWhiteList" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
