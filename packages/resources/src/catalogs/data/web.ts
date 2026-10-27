import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { WebRoutingCatalog } from "../../catalog-model.ts";

export const catalog: WebRoutingCatalog = {
  "kind": CatalogKind.WebRouting,
  "enabled": false,
  "key": 110,
  "excludedHandlers": [
    "com.elex.cok.web.ping.PaymentPingppRequest",
    "com.elex.cok.web.ping.PaymentPingppCallback",
    "com.elex.cok.web.pay.PaymentCallback",
  ],
};
