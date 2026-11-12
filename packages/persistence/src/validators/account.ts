import { z } from "zod";

export const firebaseUidValidator = z.string().min(1).max(128);
export const accountCreateValidator = z.strictObject({ firebaseUid: firebaseUidValidator });
