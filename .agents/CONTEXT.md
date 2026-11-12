# OpenCoK Game Context

OpenCoK is an open-source, self-hosted persistent strategy game inspired by Clash of Kings. Communities operate independent kingdoms with configurable rules. Accounts span an installation; characters, cities and progress belong to each kingdom.

Players build cities, research, produce resources, train/heal troops, recruit heroes and join alliances. The kingdom map supports marches, gathering, scouting and combat; quests, events and rankings provide rewards.

The project's Flutter client targets Android, iOS, Linux, Windows and Web. Platform support requires implementation evidence. Elex supplies visual/gameplay references only; its client, protocols and account/progress imports are unsupported. OpenCoK distributes no proprietary Clash of Kings assets.

## Invariants

- The server decides outcomes. Retries, disconnects, restarts and updates preserve progress, accepted costs, deadlines and rewards without duplication.
- Kingdom rules explicitly define costs, limits, placement, combat and rewards; missing rules grant no permission.
- Paid Bots automate manual actions, yield to players and cannot spend premium currency, change account settings, send chat or give resources away.
- Operator-controlled NPCs are excluded from player payments, rewards, final rankings and statistics. Player-owned Farms follow normal production/combat and published ownership/transfer limits.

## Priority

Deliver entry into a kingdom, city loading and construction that charges and completes once after leaving, returning or restarting the server. Expand map, marches, gathering and combat incrementally.
