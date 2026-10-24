# Basic mailbox migration acceptance

[Issue #273](https://github.com/ReeseArch64/opencok/issues/273) completes the basic
mailbox slice from discussion 27, topic 4: list, read, mark, save and delete owned
messages. The work started from `origin/develop` at `dda44f7` and was rebased onto `f6749a7`,
including its Controller/Service separation. The maintained runtime uses
no private Java source or legacy chat service. Attachment redemption is a separate
slice; this change never grants rewards or consumes an attachment.

## Command inventory

The audit used the registered request IDs, mailbox handlers, `MailFunction`, group
comparators and owned mapper predicates in the read-only server reference. Names
and spelling below are wire contracts, including `betch`.

| Basic mailbox command                                               | Maintained behavior                                                                                 |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `mread.batch`                                                       | Ordinary or grouped lists, previews, counters, paging and group-specific corruption cleanup         |
| `mread.batch.category`                                              | Category lists, exact sender filters, offsets and counts                                            |
| `mail.category.status`                                              | Owned category totals and unread counts                                                             |
| `mail.read`                                                         | Bounded content retrieval with inline/auxiliary bodies and atomic corrupt-primary cleanup           |
| `mread.chat`                                                        | Conversation mail list and source-specific read marking                                             |
| `mail.read.status`, `mail.read.status.betch`                        | Owned single/batch read flag assignments                                                            |
| `chatMail.read`                                                     | Type/sender plans; local marking and durable chat read effects                                      |
| `mail.save`, `mail.save.batch`, `mail.cancel.save`, `chatMail.save` | Owned absolute saved flags, conversation/type selectors and legacy precedence                       |
| `mail.delete`                                                       | Owned deletion and source-specific group/invitation cleanup                                         |
| `mail.delete.batch`                                                 | Explicit IDs, category deletion, markers, invitation repair, group expansion and mixed chat effects |
| `chatMail.delete`, `chatMail.delete.batch`                          | Scalar type, sender and batch conversation deletion, including moderation and bottle branches       |
| `chat.get.system.mails`, `chat.get.system.mails.v2`                 | System-message synchronization with their distinct pagination contracts                             |
| `chat.get.update.mails`                                             | Owned synchronization markers and missing-message invalidation                                      |

The remaining registered mail-related commands are deliberately separate:
`mail.reward` and `mail.reward.batch` redeem attachments; `mail.send`,
`mail.gift.send`, `mail.reinforce.thank` and `bottle.mail.send` create/send messages;
`mail.translate` invokes translation. Existing gift-opening behavior is preserved,
not extended by this slice.

`chat.get.new.mails` is a mixed room/private-chat synchronization command. Its
response requires country/alliance rooms, joined custom rooms, room founders,
private conversations and their sequence cursors in addition to system mail.
It remains outside this basic-mailbox acceptance and belongs to the private-chat
integration work in topic 24. It does not return a fabricated empty room response.
The dedicated V1/V2 system readers and update reader provide the migrated mailbox
synchronization contracts; this is not a claim that every command containing
`mail` or every private-chat feature is complete.

## Conversation semantics and recovery

Authentication supplies owner and realm; request-supplied identity grants no access.
Mutations lock and revalidate the owner profile. A complete correlated response must
encode before the database transaction commits. Sender selection takes precedence
in scalar conversation commands. Null senders retain SQL `= NULL` semantics locally
and the literal `null` peer in the chat request; empty peers select all matching
remote conversations, as the reference proxy does.

Personal local deletion covers types 20–22; moderation covers 23–24. Conversation
deletion bypasses saved and reward protections, unlike ordinary/category deletion.
It removes the matching sender group but leaves auxiliary bodies and update markers
unchanged. Batch bottle deletion covers 43–44 and leaves groups unchanged. With both
moderation and bottle flags, the source chooses bottle mail locally and moderation
chat remotely. Java comma splitting drops trailing empty tokens but retains leading
and interior empty tokens. Limits reject oversized requests before writes.

Explicit-ID mixed deletion aggregates all affected peers and remote chat categories
into the source's cross-product. Local group expansion remains per selected peer and
comparator: personal 20–22, moderation 23–24/39–40. Personal media/express IDs still
produce remote deletion but do not invent a local comparator absent from the source.
Reward-pending selected chat IDs produce no chat effect. Other owned cleanup and
category counting remain in the same transaction.

The kingdom outbox `mail_chat_read_intent` now contains read and delete actions.
Admission is serialized by owner with at most 1,000 pending effects. Missing
`GAME_MAIL_CHAT_URL` rejects chat-dependent mutations before any state changes;
mail-only operations remain available. When enabled, local changes and intent
insertion commit atomically. The acknowledgment means durable acceptance; remote
convergence follows through the background relay, including while the player is
offline. It retries every five seconds and drains at most 50 effects per cycle.

The private `POST /_internal/mailbox` boundary authenticates an exact, bounded body
with a domain-separated HMAC and timestamp. The chat consumer changes owned message
copies and records a payload-bound receipt in one PostgreSQL transaction. A lost
acknowledgment leaves the realm intent retryable; replay returns unchanged. A reused
operation ID/index with a different payload fails. No remote failure is silently
converted into successful delivery. The relay removes the intent only after a
matching committed acknowledgment.

The consumer limits changes to messages at or before the request cutoff. This
intentional recovery safeguard prevents a delayed delete/read from changing newly
arrived messages. Read and delete effects are monotonic, so separate workers may
apply independent intents out of order without resurrecting or unreading messages.
Receipts are retained; no automatic pruning or private-message sending/retention
policy is introduced. The mailbox reader queries the same message-copy rows. Public
room history and another owner's copy are untouched.

## Content and synchronization boundaries

Existing content behavior is retained and regression-tested across all 50 stored
mail types: strict UTF-8 conversion, Java trimming, inline/owned extra bodies,
structured/plain/scout branches, exact large integers, permissive legacy JSON,
report repairs, conditional fields and 5,000 UTF-16-unit chunks. Invalid structured
content may remove only its owned primary row. Missing auxiliary storage, transport
bounds and a malformed correlated response reject the whole operation rather than
turning a dependency problem into destructive cleanup. Isolated surrogate halves
at chunk boundaries become `?`, matching the maintained Java-compatible serializer.

V1 and V2 share bounded snapshot selection and deterministic timestamp/UID ordering.
V1 additionally keeps timestamp-scoped sent IDs and its wrapped send counter in the
existing realm-scoped Redis hash. Atomic compare-and-set retries prevent concurrent
pages from reserving the same IDs. Encoding occurs before that write. V2 is read-only
and keeps its timestamp-bucket and `lastUid` quirks. Cache loss can widen selection or
resend mail; authoritative mail remains in PostgreSQL. A lost V1 response can advance
the ephemeral sent set, matching the reference. Reconnecting with a new timestamp
starts a new pagination cycle.

## Deployment and recovery

1. Back up authoritative global and kingdom databases and preserve pending intents.
2. Apply global migration `0005_chat_mailbox_effects.sql`, then deploy the chat
   receiver. It adds `chat_mailbox_message` and `chat_mailbox_receipt` in `opencok_chat`.
3. Apply kingdom migration `0011_mailbox_chat_actions.sql` to every participating
   kingdom. Existing read intents retain action `read`; owner/peer widths stay 40.
4. Before historical cutover, import authorized private message copies with correct
   owner, realm, peer, category and original creation timestamps. Creating empty
   tables does not migrate old private messages. Resolve any cache-only mail bodies
   into owned persisted content. This implementation does not execute that import.
5. Set `GAME_MAIL_CHAT_URL` to the maintained chat service's `/_internal/mailbox`
   URL and set the matching `CHAT_SIGNING_SECRET`. Keep the endpoint on the private
   service network. Existing Redis configuration supports V1 bookkeeping.
6. Deploy the realm, observe `mail_chat_relay_failed` and pending intent counts, and
   verify that backlog drains. Failures log realm/operation metadata, not bodies or
   signing secrets. No new external package is required.

For rollback, stop admitting new chat-dependent mutations, drain intents with the
compatible receiver, then revert binaries while retaining additive tables and
receipts. If delivery cannot drain, preserve the queue and consumer for later replay;
do not delete it to clear a health symptom. Retain backups because actual message
copy deletion cannot be undone by reverting application code. Do not replay a legacy
message import after receipts were recorded without a coordinated cutover plan:
receipts intentionally suppress duplicate effects.

## Verification and limits

`apps/server/test` and `apps/chat/test` cover command envelopes, all existing mailbox
families, ownership, wire validation, content cleanup, chat authentication and failure
paths. `apps/server/integration/mailbox-effects.test.ts` runs real migrations and adapters against
disposable PostgreSQL: local rollback, saved/reward bypass, remote owner/realm/cutoff
isolation, lost acknowledgment, database restart, duplicate delivery and conflicting
replay. `apps/server/integration/mail-system-v1.test.ts` exercises real Redis concurrency,
source pagination quirks, malformed state, counter wrap and outages. The existing
system-mail integration checks the shared authoritative selection.

Package tests, affected TypeScript checks, schema fixture/snapshot checks, lint and
formatting are required alongside these suites. Tests use synthetic data and disposable
services. No operator database, production Redis, original mobile files or ADB device
is changed. Native v12.06.0 rendering and historical-data cutover remain unverified;
older client tracks are not newly claimed. This is implementation and automated
acceptance evidence, not a production deployment or native-client certification.
