import { opencok_chat } from "./namespaces";

// Offset into numeric(20,0) spans uint64 while retaining native sequence allocation.
export const chatMessageSequence = opencok_chat.sequence("chat_message_sequence_id_seq", {
  minValue: "-9223372036854775807", maxValue: "9223372036854775807",
  startWith: "-9223372036854775807", increment: 1, cycle: false,
});
