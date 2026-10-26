ALTER TABLE "opencok_kingdom"."command_receipt" ADD COLUMN "expiresAt" bigint;
ALTER TABLE "opencok_kingdom"."mutation_outbox" ADD COLUMN "expiresAt" bigint;
ALTER TABLE "opencok_kingdom"."mutation_outbox" ADD COLUMN "nextAttemptAt" bigint DEFAULT 0 NOT NULL;
CREATE INDEX "command_receipt_expiry" ON "opencok_kingdom"."command_receipt" USING btree ("expiresAt");
CREATE INDEX "mutation_outbox_retry" ON "opencok_kingdom"."mutation_outbox" USING btree ("kingdomId","publishedAt","nextAttemptAt","createdAt");
CREATE INDEX "mutation_outbox_expiry" ON "opencok_kingdom"."mutation_outbox" USING btree ("expiresAt");