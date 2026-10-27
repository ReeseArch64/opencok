# Synthetic players for local testing

The operator seed creates 1–300 fictional players in the local first kingdom. It
is separate from normal character provisioning and never runs at startup. Names,
alliances, battle history and resources are generated; they do not represent
real people or actual game activity. The default example creates 200 players
and eight alliances of 25 members.

Each player receives a starter city expanded to a varied castle and building
level, eight catalog-backed troop types, six valid research entries, inventory,
a recruited hero, a legacy general roster, battle statistics, resources and
power calculated from the maintained rules. Cities occupy four genuinely empty
world tiles. Alliance members have a single leader per group and coherent
membership counts. Roster IDs are reserved under `simseed-1-`.

These are static test actors, not autonomous bots. The seed creates no global
login credentials or payment accounts; it cannot be used to log in as them.
It does not fabricate battles, marches, ledger history or active events. Their
figures are suitable for exercising listings and local world/player projections,
not for certifying actual combat, ranking publication or multiplayer sessions.

Run only against an authorized local development database after backing it up.
The first kingdom must use the local map with coordinates 0 through 1200 and
row stride 1201. The operation is one
PostgreSQL transaction and locks the selected world tiles. It refuses existing
synthetic IDs, matching names or alliance identities, insufficient free tiles,
and missing catalog rules. It does not update or delete existing player data.
Rerunning an existing seed fails rather than granting or overwriting anything.
The new cities and alliance memberships remain in the database until restored
from a backup or removed by a separately verified maintenance procedure.

From the repository root, with the local server container running, copy the
script and execute it once:

```sh
docker cp apps/server/scripts/synthetic-players.ts opencok-server:/workspace/apps/server/scripts/synthetic-players.ts
docker compose exec -T server bun --no-env-file apps/server/scripts/synthetic-players.ts 1 200 --apply
```

The command derives the physical `opencok_kingdom_1` database from the server's
configured database connection. It creates no other kingdom or global records.
An active realm may cache city, alliance and ranking data; restart the realm
server after seeding to reload its state. This interrupts connected clients.
Back up and restore the affected kingdom database to roll back the seed; code
rollback alone does not remove the seeded players or their world tiles.
