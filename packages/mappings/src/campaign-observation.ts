import { sfs, fields, int, str, Type, type Fields, type Value } from "@opencok/messages/sfs";
import type { CampaignObservation } from "@opencok/contracts/campaign-observation";

const keys = new Set([
  "key_itemId",
  "key_itemNum",
  "key_shopId",
  "key_shopBuyNum",
  "key_shopSaleType",
  "key_mailTitle",
]);

export function campaignObservationFields(events: readonly CampaignObservation[]): Fields {
  if (events.length > 129) {throw new Error("Campaign observation bound exceeded");}

  return {
    events: sfs.array(
      events.map((event) =>
        sfs.object({
          code: sfs.int(event.code),
          selector: sfs.string(event.selector),
          attributes: sfs.object(
            Object.fromEntries(
              Object.entries(event.attributes).map(([key, value]) => [
                key,
                sfs.string(String(value)),
              ]),
            ),
          ),
        }),
      ),
    ),
  };
}

export function readCampaignObservations(params: Fields): readonly CampaignObservation[] {
  const events = params.events;

  if (events?.type !== Type.Array || !Array.isArray(events.value) || events.value.length > 129)
    {throw new Error("Invalid confirmed campaign observations");}

  return events.value.map((value: Value) => {
    const event = fields(value),
      code = int(event, "code"),
      selector = str(event, "selector"),
      raw = fields(event.attributes),
      attributes: Record<string, string> = {};

    if (![40, 61, 68].includes(code) || selector.length > 255 || Object.keys(raw).length > 8)
      {throw new Error("Invalid confirmed campaign event");}

    for (const [key, entry] of Object.entries(raw)) {
      if (
        !keys.has(key) ||
        entry.type !== Type.String ||
        typeof entry.value !== "string" ||
        entry.value.length > 255
      )
        {throw new Error("Invalid confirmed campaign attribute");}

      attributes[key] = entry.value;
    }

    return { code: code as 40 | 61 | 68, selector, attributes };
  });
}
