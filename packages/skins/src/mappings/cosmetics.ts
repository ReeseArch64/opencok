import { cosmeticWorldFields } from "../enums/kind";
import type { CosmeticRecord as Row } from "../contracts/records";
import type { CosmeticCatalog } from "../contracts/context";
import type { CityCosmeticResponse } from "../contracts/responses/cosmetics";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { validateFields } from "@opencok/messages/validations/fields";
import { cityCosmeticSchema, cityCosmeticUpdateSchema } from "../validations/cosmetics";
import { cosmeticStatusRule } from "../rules/attributes";

export class CosmeticMapper
{
    public readonly cityCosmeticFields = (value: CityCosmeticResponse): Fields => {
        const body: Fields = {};

        if (value.sid !== undefined)
        {
            body.sid = sfs.int(value.sid);
        }

        if (value.set !== undefined)
        {
            body.set = sfs.int(value.set);
        }

        for (const key of Object.values(cosmeticWorldFields))
        {
            const status = value[key];

            if (status)
            {
                body[key] = sfs.object({
                    sid: sfs.int(status.sid),
                    set: sfs.int(status.set),
                    ...(status.count === undefined ? {} : { count: sfs.int(status.count) }),
                });
            }
        }

        return validateFields(cityCosmeticSchema, body);
    };

    public readonly cityCosmeticUpdate = (
        value: CityCosmeticResponse,
        uid: string,
        point: number,
    ): Fields => {
        return validateFields(cityCosmeticUpdateSchema, {
            ...this.cityCosmeticFields(value),
            uid: sfs.string(uid),
            worldpointid: sfs.int(point),
        });
    };

    public readonly avatarActivationResponse = (
        row: Row,
        rules: CosmeticCatalog,
        previous?: number,
    ): Fields => {
        const declaration = rules.power.statuses?.get(String(row.stateId)),
            rule = declaration ? cosmeticStatusRule(declaration) : undefined,
            end = row.endTime === 9223372036854775807n
                ? 2147000000000n
                : BigInt(String(row.endTime)),
            effects = rule?.random === "1"
                ? [[Number(row.ranEffId), Number(row.ranEffValue)]]
                : (rule?.effect ?? "")
                    .split("|")
                    .filter(Boolean)
                    .map((pair) => pair.split(";").map(Number));

        return {
            effectState: sfs.object({
                [String(row.stateId)]: sfs.long(end),
                startTime: sfs.long(BigInt(String(row.startTime))),
            }),
            statusId: sfs.int(Number(row.stateId)),
            endTime: sfs.long(end),
            ...(effects.length
                ? {
                    status: sfs.array(
                        effects.map(([id, value]) =>
                            sfs.object({
                                effNum: sfs.int(id!),
                                effVal: sfs.int(value!),
                                stateId: sfs.int(Number(row.stateId)),
                            })
                        ),
                    ),
                }
                : {}),
            ...(previous === undefined ? {} : { oldStatus: sfs.string(String(previous)) }),
            ...(rule?.type === "4"
                ? { group: sfs.string(rule.group ?? ""), count: sfs.int(Number(row.count)) }
                : {}),
        };
    };
}
