# Avatar integration

Topic 7 connects the realm's authenticated grant, verified completion and legacy version
commands to media in the shared API. JPEG/PNG upload, immutable S3 receipts and SDK-presigned S3
JPEG delivery use the [media contract](../api/README.md#avatar-media). No Files listener,
new storage provider or player-facing moderation endpoint is introduced.

## Versions and restored profiles

`user.avatar.grant` reads the durable owner under lock. Signed negative profile versions
start at upload sequence 1, as in the reference. Null, fractional and out-of-range
versions fail closed instead of silently resetting state. Upload sequences remain 1–999999;
exhaustion rejects rather than overwriting immutable object keys. Eligibility, cooldown
and report bans keep their established ordering. A known completion for the proposed
sequence blocks a grant even if only the profile was restored to an earlier version.

`user.avatar.finish` verifies owner, sequence, hash and actual object integrity before
updating the profile. A negative version can advance to sequence 1 only without an
existing completion. Matching and older receipts remain replayable without another
moderation reset or mail. A matching receipt after rejection returns the rejected
version and does not clear its ban. Completion history must never be removed to make
an old sequence reusable.

`user.update.picVer` remains a distinct legacy allocation command; it does not certify
an uploaded asset. Negative/zero versions allocate 1. Positive versions below one
million increment; larger versions increment their signed remainder modulo one million.
The exact disabled-check branch adds 2,000,000. Thus 999,999 can allocate 1,000,000
(or 3,000,000 with checks disabled), retaining the legacy zero-sequence boundary.
This behavior must not be used to authorize an upload outside the media range.

## Moderation

Operators run the maintained command from a checkout with workspace dependencies
installed. Set `DATABASE_ROLE=kingdom` and `DATABASE_URL` to the selected realm write
database through the normal protected environment configuration. Supply realm ID,
numeric owner UID, expected current picture version, decision and a stable lowercase
32-hex operation ID:

```sh
bun run --cwd apps/server avatar:moderate 1 1001 2000004 reject 1234567890abcdef1234567890abcdef
bun run --cwd apps/server avatar:moderate 1 1001 3000004 approve abcdef1234567890abcdef1234567890
```

The example identifiers are synthetic. Database access is the operator authorization
boundary. The command is not exposed through SFS, the public API or the gateway. It
requires the expected current version so a delayed review cannot reject a newer upload.
Reuse the same operation ID and arguments after a timeout or unknown commit result.
A conflicting reuse rejects. Output contains the operation ID, resulting version and
whether the picture version changed; failures omit database credentials and player data.

Approval sets the moderation record to APPROVED and clears its upload ban. It does not
rewrite the picture version, existing report count, ban count or upload timestamp.
For a missing record it creates the legacy zero-history record. In particular, approving
a previously rejected picture does not change its Failed version back to Normal; it
allows a later eligible upload.

Rejection sets the version's Failed state, preserving its signed remainder. A version
already in Failed state is a no-op. Unknown positive state ordinals at or above four
million reject, matching the reference's invalid-state boundary. The existing record
keeps its upload version and report count. Ban count increments with signed 32-bit
wrapping; `hero.k8` seconds and the escalating deadline use signed 64-bit wrapping.
New records initialize the rejected version, zero reports and first ban. Profile,
moderation record, operation receipt and required delivery intents commit together.
Report submission remains separately available as `report.picVer`. Rejection does not
delete or rewrite the image; replacement deletion follows the API
media policy, while profile consumers receive the Failed picture state.

## Durable delivery and ordering

`avatar_publication` allocates a strictly increasing signed-64-bit revision under the
same transaction and owner lock as each changing operation. Both verified completion
and direct allocation store the revision in their existing journals. Rejection uses
the version journal; approval and no-op rejection use acknowledged operation receipts
with no publication revision. Integer exhaustion fails and rolls back; revisions never
wrap. This ordering is independent of wall-clock rollback and the legacy sequence reset.

Chat's signed internal payload accepts the optional exact decimal revision. New
publications outrank legacy revision-zero rows; lower revisions are superseded, and an
equal revision must agree with the captured state. Legacy payloads retain the existing
sequence ordering until the first revised publication. This prevents delayed completion
from replacing a moderation decision or a later wrapped version. Revision-zero imported
intents cannot overwrite revised Chat state. Names still follow nickname authority.

Existing completion bits remain mail 1, cache marker 2 and Chat 4. Version/moderation
intents also use bit 8 for `push.picVer.update`. Independent failures retain their bits;
publication runs under a bounded deadline. The relay retries after restart. Configured realm commands and relays check the
existing realm-authority fence before starting work. Rejection
notifications use the current version check, so superseded intents cannot push an old
picture. Socket pushes are best effort: an offline owner sees authoritative state at
reconnect. Approval does not invent a picture-change push or mail. Existing completion
mail behavior remains unchanged.

## Deployment and recovery

Apply global migration `0008_avatar_lifecycle` and kingdom migration
`0012_avatar_lifecycle` before enabling these binaries. They add the per-owner revision
counter and default-zero revision columns, and explicitly admit the legacy zero-sequence
boundary and no-effect moderation receipts. Existing rows retain revision zero.
Deploy the new Chat receiver before producing revised realm publications.

Use the existing `GAME_FILES_URL`, `GAME_AVATAR_CHAT_URL`
and `CHAT_SIGNING_SECRET` configuration. The files URL targets the shared API's private
confirmation origin; the Chat URL ends in `/_internal/avatar-profile`. The API needs
the five S3 settings; realm authorization uses the existing shared Redis. Configured
startup checks the completion, version, moderation and publication stores.
Development Compose provides the private API origin and S3 settings directly;
production uses its own environment configuration. Completion and version allocation require media but do not require Chat.
When Chat is unconfigured, local mail/cache/notification effects proceed and Chat
publication bits remain pending without acknowledgment. Configuring Chat later
allows the existing relays to deliver them.

Back up realm profiles, upload records, completion/version journals and publication
counters together, with the global Chat state and immutable object store. A restored
profile alone may safely fail on known history collisions. Independently rolling back
a revision counter, deleting receipts, or mixing unrelated global/realm/S3 snapshots
is not an automatic repair path. Reconcile those snapshots before admitting uploads.
No task here deletes objects or reconstructs a missing historical filesystem marker.

To roll back binaries, stop new uploads, allocations and moderation, then drain pending
effects. Preserve all additive tables, columns and receipts. Do not run an old Chat
receiver against new revised publications, or resume mutations with an old allocator
that cannot maintain revisions. A committed approval/rejection requires a new explicit
operator decision, not deletion of its receipt. Monitor the existing sanitized avatar
delivery failure events and pending bits; repair the dependency and let the relay retry.

## Transitional Android image reads

Uploading and committing a picture does not connect native image readers to S3.
The legacy `/cok/img/` read route rejects unauthenticated requests; the client must
request `user.avatar.url` through its authenticated realm session and use the
returned temporary URL. Native and Lua profile consumers need the same adapter,
including thumbnails and player-information views. Do not persist presigned URLs
as permanent avatar locations.

Local Android patch 030 adapts the arm64 native image readers through a loopback
JPEG bridge and Lua SFS URL requests. It validates the requested owner and sequence
against the signed object path, bounds downloads and caches authorized URLs for
less than their five-minute lifetime. The prepared base/split, source, tests and
validation evidence remain in the ignored Android patch area. The connected arm64
device rendered the uploaded thumbnail; armv7 remains unmodified and unverified.

Local patch 031 connects the initial HUD refresh to the login snapshot and waits
for the current native player identity. It retries the existing picture-change
notification until the matching JPEG is delivered, then refreshes the thumbnail
and stops. Every login resets this bounded bootstrap, so opening sovereign
information is no longer required to start image loading. Java delivery and Lua
login/reconnect tests cover this path; the operator confirmed the installed fix.

## Evidence

Synthetic unit cases cover signed allocation, upload exhaustion, approval/rejection,
report preservation, Java overflow and exact revision serialization. Four deliberate
mutations to repeat-rejection protection, approval ban reset, ban escalation and signed
counter wrapping are killed by `scripts/mutate-avatar.ts`.

Disposable PostgreSQL tests cover concurrent replay, stale review, foreign realms,
uncertain commit retry, transaction rollback, revision exhaustion, ban preservation and
Chat ordering beyond Number precision. The TCP/SFS acceptance test uses two realm
processes, PostgreSQL, Redis, ZooKeeper, actual Chat HTTP and the API media handler with
MinIO. It uploads a generated PNG, reads the encoded JPEG, rejects unauthorized
confirmation and duplicate storage, restarts storage and realm before completion,
replays completion, rejects and approves through the operator command, and blocks
receipt reuse after a profile-only restore. All inputs are synthetic.

Native Android/iOS rendering, GIF support, automatic content classification, an operator
review UI, orphan collection and production-scale performance remain outside this slice.
