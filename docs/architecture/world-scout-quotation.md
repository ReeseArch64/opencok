# Resident scout quotation

Reference `World.GetScoutInfo` and `WorldPoint.getScoutInfo/getScoutCost` expose
`world.scout.detail` as a quotation. It returns the caller's UTF picture,
integer point ID, integer travel milliseconds and integer scout cost, in native
order. Reading the quotation does not require a scout report, an army fight or a
successful battle. Actual scout deployment and target intelligence reports keep
their separate admission and actor requirements.

A dedicated repeatable-read, read-only store validates the local resident
principal, ban state and world before supplying its actual city, target, buildings
and effect snapshot. A known target profile must belong to this realm. The
command routes before alliance reconciliation and the city mutation domain, so
it cannot grant production, adopt a checkpoint, normalize a city, charge the
price, break a shield or create a march or receipt. The origin's native or proven
legacy footprint determines the route while every physical cell and identity
remain unchanged. A missing or ambiguous origin cannot authorize an assumed
placement.

`WorldMarchRoute.getTime` uses investigation speed and the watchtower addition
for this route; ordinary march speed does not change the scout estimate. The
Source black-ground speed modifier applies to scout speed even outside black
land, with the usual terrain time multiplier still applied to black segments.
The quotation uses the Source target footprint list rather than treating every
four-cell reservation as a four-cell travel destination. Shared type 37 targets
its main anchor, and the throne has its native nine-cell destination.

The ordinary price uses the target's actual stored stronghold level and
`worldmap_city.k9/k10/k11`, with Java narrowing and float expenditure modifier 404. The map's cached city level cannot substitute for the building. Blank
ownership uses the Source default price before the same modifier. Barbarian
prices use the second `para4` field and bypass the expenditure modifier. A
null-owner barbarian only permits the quotation when the actual point remains
live and its actual saved actor has positive derived health. The read-only
`barbarianCurrentHP` helper follows `BarbarionManager.getCurrentHP`: saved HP,
`para2` fire duration, `para11` fire speed, whole-second arithmetic and native
signed integer reduction. It neither creates an actor nor writes that derived HP.

PostgreSQL acceptance checks native field types and caller picture, actual castle
price distinct from the map level, unchanged troops/resources/shields/receipts
and outbox, investigation and expenditure modifiers, ignored ordinary march
speed, proven legacy geometry, missing targets, banned and foreign principals,
foreign targets and live/missing/fire-depleted barbarian actors. The command stays
available when ordinary march admission is closed. Unit cases verify cost
rounding, barbarian price independence and stored fire decay. No schema,
dependency or environment variable is added.
