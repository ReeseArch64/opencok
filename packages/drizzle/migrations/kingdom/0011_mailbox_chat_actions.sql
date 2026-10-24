ALTER TABLE "opencok_kingdom"."mail_chat_read_intent" DROP CONSTRAINT "mail_chat_read_intent_types";
ALTER TABLE "opencok_kingdom"."mail_chat_read_intent" ALTER COLUMN "chatTypes" SET DATA TYPE varchar(8);
ALTER TABLE "opencok_kingdom"."mail_chat_read_intent" ADD COLUMN "action" varchar(6) DEFAULT 'read' NOT NULL;
ALTER TABLE "opencok_kingdom"."mail_chat_read_intent" ADD CONSTRAINT "mail_chat_read_intent_action" CHECK ("action" IN ('read', 'delete'));
ALTER TABLE "opencok_kingdom"."mail_chat_read_intent" ADD CONSTRAINT "mail_chat_read_intent_types" CHECK ("chatTypes" IN ('1,20', '2', '3', '1,2,20'));