import { z } from "zod";

// UIDs are opaque: do not trim, lowercase or substitute provider/email identifiers.
export const firebaseUidValidator = z.string().min(1).max(128);
export const accountCreateValidator = z.strictObject({ firebaseUid: firebaseUidValidator });
