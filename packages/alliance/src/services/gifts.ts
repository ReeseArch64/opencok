import { sfs, str, type Fields } from "@opencok/messages/sfs";
import type { AllianceGiftContext, AllianceGiftLedger } from "../contracts/gifts";
import type { AllianceGiftRuntime } from "../contracts/gift-runtime";
import { AllianceGiftMapper } from "../mappings/gifts";
import { AllianceGiftPolicy } from "../rules/gifts";
import { AllianceGiftCommand } from "../enums/gift-command";

export class AllianceGiftService<TLedger extends AllianceGiftLedger>
{
    public constructor(
        private readonly c: AllianceGiftContext<TLedger>,
        private readonly runtime: AllianceGiftRuntime<TLedger>,
        private readonly policy: AllianceGiftPolicy,
        private readonly mapper: AllianceGiftMapper,
    )
    {}

    public command(command: string, params: Fields): Fields
    {
        const { c } = this;
        const { text, num, long, cityInteger, activityEconomy } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        if (c.state.gifts.length > 2048)
        {
            allianceFailure();
        }

        if (command === AllianceGiftCommand.Show)
        {
            return {
                gifts: sfs.array(
                    c.state.gifts
                        .filter(
                            (row) =>
                                row.allianceId === c.allianceId
                                && long(row, "time") + BigInt(num(row, "expiretime")) * 3600000n
                                    > c.now,
                        )
                        .map((row) =>
                            sfs.object(this.mapper.snapshot(row, () => c.alliance(), c.now))
                        ),
                ),
            };
        }

        const id = str(params, "giftId"),
            gift = c.state.gifts.find(
                (row) => row.uuid === id && row.uid === c.owner && row.allianceId === c.allianceId,
            );

        if (!gift)
        {
            allianceFailure();
        }

        const expired =
            long(gift, "time") + BigInt(cityInteger(num(gift, "expiretime"), 1)) * 3600000n
                <= c.now;

        if (command === AllianceGiftCommand.Clear)
        {
            if (num(gift, "valid") !== 0 && !expired)
            {
                allianceFailure();
            }

            c.write.deletedGifts = [id];

            return this.mapper.cleared();
        }

        if (num(gift, "valid") !== 1 || expired)
        {
            allianceFailure();
        }

        const item = text(gift, "item"),
            quantity = cityInteger(num(gift, "num"), 1),
            experience = cityInteger(num(gift, "exp")),
            economy = activityEconomy(c.ledger);

        if (/^[0-5]$/.test(item))
        {
            const resource = ["wood", "stone", "iron", "food", "silver", "gold"][Number(item)]!;

            if (resource === "gold")
            {
                economy.gold(BigInt(quantity));
            }
            else
            {
                economy.resource(resource as "wood", BigInt(quantity));
            }
        }
        else if (item === "6")
        {
            const member = c.member();
            c.setMember({
                ...member,
                point: cityInteger(num(member, "point") + quantity),
                accPoint: cityInteger(num(member, "accPoint") + quantity),
            });
        }
        else if (/^200\d+$/.test(item))
        {
            c.ledger.add(item, quantity, cityInteger(num(gift, "para")));
        }
        else
        {
            allianceFailure();
        }

        c.write.gifts = [{ ...gift, valid: 0 }];
        c.setAlliance({
            ...c.alliance(),
            giftlevel: cityInteger(num(c.alliance(), "giftlevel") + experience),
        });

        return this.mapper.claim(gift, item, quantity, experience);
    }

    public publish(event: string, type: number): Fields
    {
        const { c } = this;
        const { text, num, cityInteger, inventoryWeighted, randomUUID } = this.runtime;
        const allianceFailure: () => never = this.runtime.allianceFailure;

        if (![30000, 30100, 30200, 30300, 30400, 30500].includes(type))
        {
            allianceFailure();
        }

        if (c.state.sharedGifts.length)
        {
            const saved = c.state.sharedGifts[0]!;

            if (saved.allianceid !== c.allianceId || num(saved, "typeId") !== type)
            {
                allianceFailure();
            }

            return this.mapper.event(event);
        }

        const level = Math.floor(num(c.alliance(), "giftlevel") / 1000) + 1;
        const rule = c.rules.alliance.gifts?.get(String(type + level))
            ?? c.rules.alliance.gifts?.get(String(type));

        if (!rule)
        {
            allianceFailure();
        }

        const { choices, quantities } = this.policy.choices(rule);

        const expires = cityInteger(rule.time, 1),
            experience = cityInteger(rule.exp);
        c.write.publishedGift = {
            uid: event,
            allianceid: c.allianceId,
            level,
            typeId: type,
            time: c.now,
            expiretime: expires,
        };
        c.write.sharedGifts = c.list().map((member) => {
            const chosen = inventoryWeighted(choices),
                item = chosen.split(":")[1]!;

            return {
                uuid: randomUUID(),
                giftId: event,
                uid: text(member, "uid"),
                allianceId: c.allianceId,
                gifttype: type + level,
                valid: 1,
                level,
                item,
                num: quantities.get(chosen)!,
                para: 0,
                time: c.now,
                expiretime: expires,
                exp: experience,
                description: "",
            };
        });

        return this.mapper.event(event);
    }
}
