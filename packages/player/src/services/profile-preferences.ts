import type { ProfilePreferenceStore } from "../contracts/profile-preferences";
import { ProfilePreferenceCommand } from "../enums/profile-preference-command";
import { long, num } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { int, sfs, type Fields } from "@opencok/messages/sfs";

const preferences = {
    [ProfilePreferenceCommand.Equipment]: { field: "showEquip", key: "show" },
    [ProfilePreferenceCommand.Medal]: { field: "showMedal", key: "show" },
    [ProfilePreferenceCommand.MarchSoldiers]: { field: "marchSoldierShow", key: "show" },
    [ProfilePreferenceCommand.Colorblind]: { field: "colorblind", key: "set" },
    [ProfilePreferenceCommand.EquipmentScroll]: { field: "scrollEquip", key: "setting" },
    [ProfilePreferenceCommand.Banner]: { field: "showBanner", key: "set" },
    [ProfilePreferenceCommand.SpeedCooldown]: { field: "clientSaveFlag", key: "open" },
} as const;

export class ProfilePreferenceService
{
    constructor(readonly store: ProfilePreferenceStore)
    {}

    async command(uid: string, command: string, params: Fields, now: number): Promise<Fields>
    {
        if (!Object.hasOwn(preferences, command))
        {
            throw new GameError(errors.unsupported);
        }

        const profile = await this.store.getProfileById(uid);
        const optional = command === ProfilePreferenceCommand.Banner
            || command === ProfilePreferenceCommand.SpeedCooldown;

        if (!profile)
        {
            if (optional)
            {
                return {};
            }

            throw new GameError(errors.missing);
        }

        if (long(profile, "banTime") > BigInt(now) || num(profile, "banFlag") !== 0)
        {
            throw new GameError(errors.invalid);
        }

        const { field, key } = preferences[command as ProfilePreferenceCommand];

        if (optional && !Object.hasOwn(params, key))
        {
            return {};
        }

        const readValue = () => {
            const value = int(params, key);

            if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647)
            {
                throw new GameError(errors.invalid);
            }

            return value;
        };
        const eager = optional ? undefined : readValue();

        if (command === ProfilePreferenceCommand.EquipmentScroll && eager !== 0 && eager !== 1)
        {
            return {};
        }

        if (!this.store.updateProfilePreference)
        {
            throw new GameError(errors.unsupported);
        }

        const value = await this.store.updateProfilePreference(
            uid,
            field,
            now,
            () => eager ?? readValue(),
        );

        if (command === ProfilePreferenceCommand.SpeedCooldown || value === undefined)
        {
            return {};
        }

        return command === ProfilePreferenceCommand.EquipmentScroll
            ? { scrollEquip: sfs.bool(value === 1) }
            : { show: sfs.int(value) };
    }
}
