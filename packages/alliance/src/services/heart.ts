import { ActivityDomain } from "@opencok/base/domain/activity-domain";
import { encode, str, Type } from "@opencok/messages/sfs";
import type { AllianceHeartContext } from "../contracts/heart";
import type { AllianceHeartRuntime } from "../contracts/heart-runtime";
import type { AllianceHeartPolicy } from "../rules/heart";
import type { AllianceHeartMapper } from "../mappings/heart";
import { AllianceHeartCommand } from "../enums/heart";

export class AllianceHeartService extends ActivityDomain<AllianceHeartContext>
{
    public readonly commands: ActivityDomain<AllianceHeartContext>["commands"];
    public readonly types: ActivityDomain<AllianceHeartContext>["types"];
    public readonly prepare: ActivityDomain<AllianceHeartContext>["prepare"];
    public readonly apply: ActivityDomain<AllianceHeartContext>["apply"];

    public constructor(
        runtime: AllianceHeartRuntime,
        private readonly policy: AllianceHeartPolicy,
        private readonly mapper: AllianceHeartMapper,
        connected: (uid: string) => boolean = () => false,
    )
    {
        super();

        const { text, num, playerItemGiftRecipient } = runtime;
        const allianceHeartFailure: () => never = runtime.allianceHeartFailure;

        this.commands = [AllianceHeartCommand.Send, AllianceHeartCommand.Init];

        this.types = [];

        this.prepare = async (context, command, params) => {
            const state = context.state.allianceHeart;

            if (!state)
            {
                allianceHeartFailure();
            }

            if (command === AllianceHeartCommand.Init)
            {
                if (!state.pending.length)
                {
                    return { response: encode(this.mapper.login()), event: null };
                }

                const first = state.pending[0]!,
                    duration = num(first, "duration"),
                    effect = text(first, "effecttype");

                if (
                    !Number.isInteger(duration)
                    || duration <= 0
                    || !effect
                    || effect.length > 2
                    || state.pending.some((row) => row.uid !== context.owner)
                )
                {
                    allianceHeartFailure();
                }

                const until = context.now + BigInt(duration) * 1000n,
                    names = state.pending.map((row) => text(row, "senderName"));
                context.write.allianceHeart = {
                    delivered: state.pending.map((row) => num(row, "id")),
                };
                const world = state.worlds.find(
                        (row) => row.uid === context.owner && num(row, "worldId") === 0,
                    ),
                    point = world ? num(world, "pointId") : 0;

                return {
                    response: encode(this.mapper.login(names, effect, until)),
                    event: params.notify?.type === Type.Bool && params.notify.value === true
                            && point > 0
                        ? encode(this.mapper.loginEvent(context.owner, point, effect, until, names))
                        : null,
                };
            }

            const recipient = playerItemGiftRecipient(str(params, "uid")),
                alliance = state.members.find((row) => row.uid === context.owner)?.allianceId;

            if (
                !alliance
                || state.members.find((row) => row.uid === recipient)?.allianceId !== alliance
            )
            {
                runtime.foreignAllianceFailure();
            }

            if (
                state.recipient?.uid !== recipient
                || num(state.recipient, "serverId") !== context.rules.kingdomId
            )
            {
                allianceHeartFailure();
            }

            const itemId = str(params, "itemId"),
                uuid = str(params, "uuid"),
                item = context.economy.ownedItem?.(uuid),
                rule = this.policy.rule(context.rules, itemId);

            if (!item || item.itemId !== itemId || item.count < 1 || !context.economy.consumeItem)
            {
                allianceHeartFailure();
            }

            const city = (uid: string) => {
                    const world = state.worlds.find((row) => row.uid === uid);

                    if (!world || num(world, "pointId") === 0)
                    {
                        return;
                    }

                    if (num(world, "worldId") !== 0)
                    {
                        allianceHeartFailure();
                    }

                    const point = state.points.find(
                        (row) =>
                            row.id === world.pointId && row.ownerId === uid
                            && num(row, "pointType") === 1,
                    );

                    if (!point)
                    {
                        allianceHeartFailure();
                    }

                    return num(point, "id");
                },
                own = city(context.owner),
                target = city(recipient);

            if (!own)
            {
                allianceHeartFailure();
            }

            const until = context.now + BigInt(rule.duration) * 1000n,
                points = [{ id: own, uid: context.owner, until, effect: rule.effect }];

            if (target && target !== own)
            {
                points.push({ id: target, uid: recipient, until, effect: rule.effect });
            }

            context.economy.consumeItem(uuid, 1);
            const online = connected(recipient);
            context.write.allianceHeart = {
                points,
                ...(target && !online ? { pending: { uid: recipient, ...rule } } : {}),
            };

            return {
                response: encode(this.mapper.view(target ?? own)),
                event: encode(this.mapper.sendEvent({
                    owner: context.owner,
                    points,
                    target,
                    online,
                    recipient,
                    effect: rule.effect,
                    until,
                    name: () => text(context.state.profile, "name"),
                })),
            };
        };

        this.apply = async () => {
            allianceHeartFailure();
        };
    }
}
