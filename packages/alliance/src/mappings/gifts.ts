import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AllianceRecord } from "../contracts/records";
import type { AllianceRecordReaders } from "../contracts/readers";

export class AllianceGiftMapper
{
    public constructor(private readonly runtime: AllianceRecordReaders)
    {}

    public snapshot(row: AllianceRecord, alliance: () => AllianceRecord, now: bigint): Fields
    {
        const { text, num, long } = this.runtime;

        return {
            giftId: sfs.string(text(row, "uuid")),
            uuid: sfs.string(text(row, "uuid")),
            type: sfs.int(num(row, "gifttype")),
            gifttype: sfs.int(num(row, "gifttype")),
            giftlevel: sfs.int(num(row, "level")),
            alliancegfitexp: sfs.int(num(alliance(), "giftlevel")),
            alliancegiftlevel: sfs.int(
                Math.floor(num(alliance(), "giftlevel") / 1000),
            ),
            nextlevelexp: sfs.int(
                (Math.floor(num(alliance(), "giftlevel") / 1000) + 1) * 1000,
            ),
            timeleft: sfs.long(
                long(row, "time") + BigInt(num(row, "expiretime")) * 3600000n
                    - now,
            ),
            level: sfs.int(num(row, "level")),
            valid: sfs.int(num(row, "valid")),
            item: sfs.string(text(row, "item")),
            num: sfs.int(num(row, "num")),
            para: sfs.int(num(row, "para")),
            exp: sfs.int(num(row, "exp")),
            time: sfs.long(long(row, "time")),
            expiretime: sfs.int(num(row, "expiretime")),
        };
    }

    public claim(gift: AllianceRecord, item: string, quantity: number, experience: number): Fields
    {
        const { num } = this.runtime;

        return {
            item: sfs.string(item),
            num: sfs.int(quantity),
            exp: sfs.int(experience),
            para: sfs.int(num(gift, "para")),
        };
    }

    public cleared(): Fields
    {
        return { stats: sfs.int(1) };
    }

    public event(event: string): Fields
    {
        return { giftId: sfs.string(event) };
    }
}
