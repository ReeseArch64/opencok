# OpenCoK Product Definition

## Purpose and audience

This document defines the product scope, player/operator expectations, priorities and success criteria independently of implementation choices.

OpenCoK is a Clash of Kings mod with an open-source server implementation and a progressively developed Flutter game client for Android, iOS, Linux, Windows and Web. The project develops and supports its own Flutter client; the Elex client is a reference for observed appearance and behavior, not a runtime dependency or supported gameplay client. OpenCoK supplies independently operated servers, configurable gameplay and a multiplatform client that preserves the recognizable appearance and interaction of the game. It lets communities operate independent kingdoms, customize their rules and preserve player progress without depending on the original online service. Organizers need understandable setup, daily management and recovery; players need reliable access, fair progression and clear outcomes.

Monetization is a core product requirement, with payments and subscriptions handled through an integrated payment provider. Players manage their account, purchases and subscriptions in an account console; organizers manage running kingdoms through an admin panel; a public wiki explains the game and a landing page presents the project.

Each installation can operate any number of kingdoms, with separate characters and progress in each kingdom and shared community access. New kingdoms can be added whenever communities need them, without a product-defined limit. Clash of Kings provides the gameplay and visual reference; OpenCoK has its own server implementation, accounts, configurable rules, Flutter client and release lifecycle. OpenCoK does not distribute proprietary Clash of Kings assets. Users who choose to supply external assets are responsible for obtaining them lawfully and ensuring that they have the rights required to use them. Only supported releases of the OpenCoK Flutter client connect to the OpenCoK service. The project defines its own client-server contracts without a requirement to preserve Elex protocols, message formats or historical client compatibility. Imports of accounts or progress from the original service are outside scope.

## Dependable play and progression

- New organizers can open, manage, expand and restore kingdoms through clear guidance without hidden repairs or specialist knowledge.
- The mod covers entry, city management and kingdom activities through its own Flutter client. Supported platform builds use the same authoritative rules and preserve the same OpenCoK accounts and kingdom progress. Optional-feature interruptions explain what is unavailable and leave essential play usable.
- Maintenance and recovery preserve accounts, kingdom history, progress and personal images with minimal disruption.
- New players start at level 1 with a basic level-1 city, 100,000 wood, 100,000 food and 1,000 gold; stone, iron, silver and crystals start at zero. Faster progression does not grant completed upgrades, heroes or extra starting currency.
- Characters keep separate progress in each kingdom. Each character receives its starting package once; returning to creation never resets existing progress.
- Hua Mulan is an infantry combat hero with three branching talent trees, target maximum level 99 and talents of one or ten levels. Maximum percentage bonuses range from 50% to 500%; basic attributes/striking distance keep stated values. Recruitment/learning use usual fragments/points; portrait framing matches neighboring heroes.
- Other heroes display white rarity without a Legendary ribbon; Hua Mulan retains her own rarity/ribbon. Visual changes preserve ownership, levels, talents and assignments.

## Timed activities and rewards

- Construction, basic research, training, healing, fortifications, forging and workshop jobs have clear costs/deadlines/outcomes and survive interruptions. Workshop deliveries and waiting lists advance together without lost work or queue position.
- Production accumulates to a stated cap until collected. Rate, VIP, talent, bonus and equipment changes preserve already earned resources and partial progress.
- Quest/sign-in rewards reflect actual progress and reward periods. Activity rewards belong to the earning character, honor stated costs/progression/alliance contributions and remain claimable when confirmation fails.
- Exchanges show current offers, accepted tokens and daily limits before spending; refresh happens once per day. Define exchange rules explicitly and preserve accepted OpenCoK transactions through updates.
- Rewards/experience honor bonus order and level caps. Repeated claims/actions never create extra rewards or levels.

## Placement, gathering and scouting

- New cities, random relocations and returning lost cities follow verified kingdom placement rules and require enough free space. Older cities/progress remain; unresolved policy blocks new placement without charging players.
- Gathering parties may share a resource point without attacking or taking exclusive ownership. They use owned troops/companions, respect march limits and earn shares of remaining resources.
- Joining/leaving preserves other parties' earned cargo. Parties return when full or the destination becomes unavailable; interruptions preserve cargo and extra rewards. Repeated returns cannot duplicate cargo, reroll rewards or commit troops twice. Preserve prior journeys, allowances and intentionally unavailable offers.
- Scouting preview is free and does not commit an army. Departure uses chosen troops/companions and the stated cost; reports respect discoverability/protection and reach the correct player. Unavailable special targets explain why; interruptions cannot create duplicate charges, missing reports or invented victories/casualties/loot.
- Spending rankings count confirmed expenditure, including large amounts, excluding previews, income and unverified history. Ties use a consistent player order; realm visibility applies. Eligible final prizes, including mailed prizes, are delivered once after closure.

## Automation: NPCs, Bots and Farms

- NPCs are organizer-controlled automated inhabitants that keep a kingdom active with everyday activity such as gathering, attacking and building. Organizers choose where they operate and how many, and can pause or remove them at any time. NPC activity never counts toward payments, rewards, final rankings or reported player statistics.
- A Bot is a purchasable service that carries out routine actions for a player while the player is offline, for example collections and queue upkeep. It acts only on the buyer's own accounts, offers automation rather than extra power and can do only what the player could do manually under the same rules. It does not spend premium currency, change account settings, send chat messages or give resources away. When the player connects, the player's own session takes priority, and the player can pause or stop the Bot at any time.
- A Farm is a castle owned by a player that exists only to gather resources and to be attacked so its resources can be looted. With a Bot, gathering and the owner's raids can run automatically, and the Farm can send resources to its owner within published limits. Farm resources come from normal production, battles and losses are real, and loot and transfers appear in history. Unless a kingdom states otherwise, Farms do not count toward rankings, event rewards or alliance strength, each player has a limited number of Farms, and whether other players may attack a Farm follows the kingdom's rules.
- Each plan states what its Bots can do, its limits and its price before purchase. Benefits start only after the payment provider confirms payment, end when a subscription ends or is refunded, and in-progress actions finish or stop safely without losing resources or troops.
- Organizers can see Bot, NPC and Farm activity, pause it for one kingdom or everywhere, and recover from problems without losing player progress.

## Personalization, status and support

Support static profile images and animated GIFs with clear size limits, eligibility and replacement rules. Images normally change once every three days; successful replacement removes the previous image and keeps a private confirmation without interrupting browsing/play.

Players see purchases, subscriptions and active Bots and Farms in their account console, and never lose a purchase because a redirect or confirmation failed. Every administrative action on a running kingdom is attributed to a named operator with a reason and can be reviewed later. The public wiki lists units, buildings, research, events and mechanics supported by the OpenCoK release in use, and leaves out content whose behavior is not yet established.

Organizers can see health, unfinished activities and slow actions; players distinguish pending from completed outcomes. Accounts and personal information remain private, and players can change only what they own. Support history explains resource changes, purchases and rewards without exposing private information.

## Multiplatform client, fidelity and continuity

Develop the project's own Flutter gameplay client for Android, iOS, Linux, Windows and Web. The Elex client is used only as a reference for analysis; it is not shipped or used to deliver gameplay. Deliver the port in complete, playable flows rather than attempting to recreate every historical feature before release. Platform support is a delivery target, not a claim that all builds are already available or verified. Browser gameplay is part of the target alongside the account console, admin panel, wiki and landing page.

Aim for approximately 70–80% fidelity to the reference game's visual presentation and core interactions in the supported flows. This is an initial qualitative target, not a measured percentage of all historical content or code reuse. Judge fidelity through side-by-side scenes and recorded interactions: composition, sprite scale and anchors, layer ordering, camera movement, selection feedback, contextual actions, transitions, environmental animation and the continuity between screens. A static collection of reference images is insufficient. Reuse available assets and configuration data only within their applicable permissions; implement the required behavior in the OpenCoK client without depending on the original client binaries.

Begin with one representative city area: correctly composed scenery and buildings, animated water and ambient effects, responsive pan/zoom, building selection and contextual actions, and a construction flow backed by the server. Validate the experience in desktop and narrow mobile viewports before expanding to the world map, marches and additional systems. Establish performance budgets and verify frame timing, input response, loading and resource use on representative target devices; a Web preview alone does not establish native or production readiness. Environmental effects must respect reduced-motion preferences.

Server storage and internal data models may evolve independently of client presentation. Define explicit, versioned contracts between the Flutter client and the authoritative server. Elex protocol compatibility is outside scope. Changes to client-facing fields, types, units, identifiers or local configurations require coordinated compatibility validation and, when necessary, a client update. Switching between supported platforms or client versions must not reset progress, duplicate rewards or give different economic outcomes.

The first playable milestone is entering a kingdom, loading a city, starting a construction, leaving and returning, and completing the construction without duplicate charges or rewards, including after a server restart. Updates preserve identity and valid progress through explicit migration plans. Release continuity covers OpenCoK accounts, progress and supported client versions; imports of accounts or progress from the original service remain outside scope.

## Priorities and success

1. Deliver the first playable city and construction flow with OpenCoK servers, using the project's own Flutter client with faithful composition, animation, interaction, reconnection and recovery.
2. Protect core activities and explain unavailable optional features.
3. Reduce waits/stuck activities and preserve work through interruptions.
4. Complete reliable profile personalization.
5. Make kingdom management and recovery approachable.
6. Offer purchasable Bots and Farms that automate play without privileges beyond manual play, with reliable purchase, entitlement and refund handling.

Success means organizers can open kingdoms using available guidance, players can enter/build/complete core activities without repeated long waits, and maintenance preserves accounts/progress. The Flutter port must feel responsive and recognizable beside the reference client, with animated scenes and coherent interactions verified on each released platform. Purchased automation is predictable: players know what they bought, it ends when payment ends, and it never alters other players' fair progression beyond what manual play allows. Each improvement has an owner, affected editions, an observable player/operator benefit and a progress-preservation plan. Releases explain changes, support scope and recovery options; investigate unclear impact with the community before committing.

## Boundaries

OpenCoK is an independent Clash of Kings mod and is not endorsed by Elex or the original rights holders. Original OpenCoK server and Flutter client code and documentation that contributors have authority to license are available under the MIT License. The Elex client and other third-party materials are not relicensed by OpenCoK. The project does not distribute Clash of Kings assets, original materials or trademarks. These remain subject to their owners' terms; users are responsible for obtaining any external assets lawfully and ensuring that they have the rights required to use them. The project license grants no third-party rights.

The focus is independently managed communities, without promises of worldwide publisher-service parity or public hosting for unrelated communities. Support covers explicitly released OpenCoK Flutter client versions with OpenCoK servers. Elex clients, protocols and official services are outside the supported product scope.
