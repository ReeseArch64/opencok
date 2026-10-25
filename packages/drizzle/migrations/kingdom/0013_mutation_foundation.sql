CREATE TABLE opencok_kingdom.command_receipt (
  "kingdomId" integer NOT NULL,
  "ownerUid" character varying(40) NOT NULL,
  "requestId" character varying(128) NOT NULL,
  "command" character varying(128) NOT NULL,
  "request" bytea NOT NULL,
  "response" bytea NOT NULL,
  "ownerEpoch" bigint NOT NULL,
  "createdAt" bigint NOT NULL,
  CONSTRAINT "command_receipt_PRIMARY" PRIMARY KEY ("kingdomId", "ownerUid", "requestId"),
  CONSTRAINT "command_receipt_epoch" CHECK ("ownerEpoch" > 0),
  CONSTRAINT "command_receipt_bounds" CHECK (octet_length("request") <= 65536 AND octet_length("response") <= 1048576)
);

CREATE TABLE opencok_kingdom.economy_posting (
  "kingdomId" integer NOT NULL,
  "ownerUid" character varying(40) NOT NULL,
  "requestId" character varying(128) NOT NULL,
  "entry" integer NOT NULL,
  "accountUid" character varying(40) NOT NULL,
  "asset" character varying(64) NOT NULL,
  "delta" bigint NOT NULL,
  "before" bigint NOT NULL,
  "after" bigint NOT NULL,
  "reason" character varying(128) NOT NULL,
  CONSTRAINT "economy_posting_PRIMARY" PRIMARY KEY ("kingdomId", "ownerUid", "requestId", "entry"),
  CONSTRAINT "economy_posting_balance" CHECK ("before" >= 0 AND "after" >= 0 AND "after"::numeric - "before"::numeric = "delta"::numeric),
  CONSTRAINT "economy_posting_entry" CHECK ("entry" >= 0)
);

CREATE TABLE opencok_kingdom.mutation_outbox (
  "kingdomId" integer NOT NULL,
  "ownerUid" character varying(40) NOT NULL,
  "requestId" character varying(128) NOT NULL,
  "eventId" character varying(40) NOT NULL,
  "eventType" character varying(128) NOT NULL,
  "payload" bytea NOT NULL,
  "createdAt" bigint NOT NULL,
  "publishedAt" bigint NOT NULL,
  CONSTRAINT "mutation_outbox_PRIMARY" PRIMARY KEY ("kingdomId", "ownerUid", "requestId", "eventId"),
  CONSTRAINT "mutation_outbox_payload" CHECK (octet_length("payload") <= 65536),
  CONSTRAINT "mutation_outbox_delivery" CHECK ("publishedAt" >= 0)
);

CREATE INDEX mutation_outbox_pending ON opencok_kingdom.mutation_outbox ("kingdomId", "publishedAt", "createdAt");
