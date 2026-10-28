import type { Rules } from "@opencok/rules/game";

export async function moderateAvatar(
    request: {
        owner: string;
        operationId: string;
        expectedPicVer: number;
        decision: "approve" | "reject";
    },
    rules: Pick<Rules, "items">,
    now: number,
    commit: (
        input: typeof request,
        now: number,
        banSeconds: string | undefined,
    ) => Promise<{ operationId: string; picVer: number; changed: boolean; }>,
)
{
    const captured = Object.freeze({ ...request });

    return commit(captured, now, rules.items.get("hero")?.k8);
}
