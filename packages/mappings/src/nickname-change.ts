import type {
    NicknameChangeRecord,
    NicknameNotification,
} from "@opencok/contracts/nickname-change";
import { sfs, type Fields } from "@opencok/messages/sfs";
import {
    nicknameItemDeleteSchema,
    nicknameItemAddSchema,
    nicknameMobileGoldSchema,
    nicknameDmmGoldSchema,
    nicknameChangeReplySchema,
} from "@opencok/validations/nickname-change";
import type { Rules } from "@opencok/rules/game";
import { mailBlank } from "@opencok/rules/mail";
import { validateFields } from "@opencok/messages/validations/fields";

export function nicknameNotification(
    snapshot: NicknameNotification,
    rules: Pick<Rules, "goods">,
): { command: string; body: Fields; }
{
    if (snapshot.kind === "gold")
    {
        const balance = snapshot.balances;

        if (snapshot.platform === "dmm")
        {
            return {
                command: "push.dmm.gold.change",
                body: validateFields(nicknameDmmGoldSchema, {
                    dmmGold: sfs.long(balance.dmmGold),
                    dmmPaidGold: sfs.long(balance.dmmPaidGold),
                    dmmPaidSpecialGold: sfs.long(balance.dmmPaidSpecialGold),
                }),
            };
        }

        return {
            command: "push.mobile.gold.change",
            body: validateFields(nicknameMobileGoldSchema, {
                freeGold: sfs.long(balance.gold),
                paidGold: sfs.long(balance.paidGold),
                paidSpecialGold: sfs.long(balance.paidSpecialGold),
            }),
        };
    }

    const item = snapshot.item;
    const body: Fields = {
        uuid: sfs.string(item.uuid),
        itemId: sfs.string("200021"),
        count: sfs.int(item.count),
    };

    if (snapshot.stage === "debit" || item.count === 0)
    {
        return { command: "push.item.del", body: validateFields(nicknameItemDeleteSchema, body) };
    }

    body.vanishTime = sfs.long(item.vanishTime);
    const goods = rules.goods.get("200021");

    if (!goods)
    {
        throw new Error("Nickname item catalog unavailable");
    }

    for (let index = 1; index < 10; index++)
    {
        const key = `para${index}`,
            value = goods[key];

        if (value !== undefined && value !== null && typeof value !== "string")
        {
            throw new Error("Invalid nickname item parameter");
        }

        if (value !== undefined && value !== null && !mailBlank(value))
        {
            body[key] = sfs.string(value);
        }
    }

    return { command: "push.item.add", body: validateFields(nicknameItemAddSchema, body) };
}

export function nicknameChangeReply(
    record: Pick<NicknameChangeRecord, "state" | "responseGold">,
): Fields
{
    if (record.state !== "committed" && record.state !== "refunded")
    {
        throw new Error("Nickname change is pending");
    }

    const body: Fields = {};

    if (record.responseGold !== null)
    {
        body.gold = sfs.long(record.responseGold);
    }

    body.status = sfs.bool(record.state === "committed");

    return validateFields(nicknameChangeReplySchema, body);
}
