import type { Rules, Rule } from "@opencok/rules/game";
export const eggActivityNow = Date.UTC(2030, 0, 2, 12);
export function configureEggActivity(rules: Rules)
{
    const controls = (rules.configuration.payControl ??= new Map());
    controls.set("69007", {
        id: "69007",
        k2: "132500|132501",
        k3: "1|1",
        k4: "3;6",
        k5: "990013;990014",
        k7: "14",
        k8: "2030-01-01-00-00",
        k9: "2030-01-04-00-00",
    });
    rules.advanced.eggs = new Map<string, Rule>([
        [
            "132500",
            {
                id: "132500",
                time: "30",
                cost: "150",
                reward: "990011",
                exp_finish: "3",
                exp: "7",
                full: "990012",
                dark: "200001",
                question_mark: "200002",
            },
        ],
        [
            "132501",
            {
                id: "132501",
                time: "60",
                cost: "200",
                reward: "990015",
                exp_finish: "3",
                exp: "7",
                full: "990012",
                dark: "200002",
                question_mark: "200002",
            },
        ],
    ]);
    rules.reconnect.rewards!.set("990011", {
        id: "990011",
        rate: "50;50",
        item: "200001;200002",
        num: "1;1",
        circle: "1",
    });
    rules.reconnect.rewards!.set("990012", { id: "990012", gold: "5" });
    rules.reconnect.rewards!.set("990013", { id: "990013", gold: "2" });
    rules.reconnect.rewards!.set("990014", {
        id: "990014",
        rate: "100",
        item: "200004",
        num: "5",
        circle: "1",
    });
    rules.reconnect.rewards!.set("990015", {
        id: "990015",
        rate: "100",
        item: "200002",
        num: "1",
        circle: "1",
    });
    rules.mail.set("11724", {
        id: "11724",
        sender: "Synthetic",
        title: "Synthetic closed egg",
        message: "Synthetic pending egg",
    });
    rules.advanced.campaignRules = [
        {
            id: "egg-goods",
            state: 2,
            openType: 2,
            events: [{ code: 40, parameters: "200001" }],
            conditions: [],
            actions: [{ code: 9, parameters: "P$long_egg_grants;+;$key_itemNum" }],
        },
    ];
    rules.advanced.campaignVariables!.set("P$long_egg_grants", {
        scope: "P",
        id: "long_egg_grants",
        initialValue: 0,
    });
}
