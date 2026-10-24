import { opencok_chat, opencok_global } from "./namespaces";

export const sharedUserSequence = opencok_global.sequence("shared_user_publication_seq", {
  minValue: "1",
  maxValue: "9223372036854775807",
  startWith: "1",
  increment: 1,
  cycle: false,
});

export const chatMessageSequence = opencok_chat.sequence("chat_message_sequence_id_seq", {
  minValue: "-9223372036854775807",
  maxValue: "9223372036854775807",
  startWith: "-9223372036854775807",
  increment: 1,
  cycle: false,
});
