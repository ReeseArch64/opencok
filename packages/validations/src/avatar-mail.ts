import { z } from "zod";
import type { AvatarMailPushResponse } from "@opencok/contracts/responses/avatar-mail";
import { field } from "./response.ts";

export const avatarMailPushSchema = z.strictObject({
    title: field.string,
    rewardId: field.string,
    uid: field.string,
    fromUid: field.string,
    fromName: field.string,
    oldName: field.string,
    contentsLocal: field.string.optional(),
    toUser: field.string.optional(),
    translationId: field.string.optional(),
    fromUser: field.string.optional(),
    type: field.int,
    itemIdFlag: field.int,
    unread: field.int.optional(),
    totalNum: field.int.optional(),
    rewardStatus: field.int.optional(),
    status: field.int.optional(),
    saveFlag: field.int.optional(),
    reply: field.int.optional(),
    createTime: field.long,
}) satisfies z.ZodType<AvatarMailPushResponse>;
