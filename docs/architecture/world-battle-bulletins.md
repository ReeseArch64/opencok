# Alliance world battle archives

Reference `World.alliancebattle.GetAllianceWorldFightBulletin` authorizes the
current user's alliance and returns `result`, an SFS array of the original UTF
strings from a Redis list range. `AbstractWorldFightHandler` produces those
records. Reading an existing archive does not execute a battle or create a result.

`al.fight.bulletin` now has a separate read-only route before alliance
reconciliation and the city mutation domain. Its PostgreSQL authorization reads
the actual local principal, ban state and nonblank alliance identity. The client
cannot select another alliance. The Redis adapter uses the native key
`WORLD_BATTLE_BULLETIN_<realm><alliance>` with the configured realm, and preserves
Redis start/end semantics, inclusive endpoints, negative indices and list order.
Original strings remain opaque; the reader does not parse, rewrite, enrich or
invent a battle, winner, frequency or report.

The adapter uses an atomic read-only length/range operation so an oversized page
cannot transfer an unbounded list. Pages above 4,096 entries, strings above the
native UTF byte bound or responses above the frame bound are unavailable. They
are never silently truncated. A real absent/empty list returns the native empty
array. An absent adapter, unavailable Redis or malformed adapter response cannot
be converted into that successful empty history.

Existing battle publication and retention remain owned by their actual battle
engine. This route does not seed, consume or prune archives, and it does not
enable battle admission or synthesize historical data. Imported native archives
remain directly readable under their original realm/alliance keys. No schema,
dependency or environment variable is added.

PostgreSQL and real Redis acceptance cover local realm/alliance isolation,
positive and negative ranges, reversed/empty ranges, exact Unicode and whitespace,
banned and foreign principals, missing membership, actual empty archives,
missing adapters, excessive pages and UTF records, and Redis failure. Profile
snapshots, command receipts, outbox and the original Redis list remain unchanged
across a successful read. A test rejects entry into alliance reconciliation.
