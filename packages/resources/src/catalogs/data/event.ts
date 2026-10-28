import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AutomationCatalog } from "../../catalog-model.ts";

export const catalog: AutomationCatalog = {
    "kind": CatalogKind.Automation,
    "rules": [
        {
            "id": 1,
            "events": [{ "code": 1, "parameters": "2016-06-22 22:22:00" }],
            "conditions": [{ "code": 7, "parameters": "F$reward_all;>=;0" }],
            "actions": [
                { "code": 1, "parameters": "2" },
                { "code": 1, "parameters": "3" },
                { "code": 3, "parameters": "57093;1;2016-06-22 22:22:00;2018-06-22 22:22:00;100" },
            ],
        },
        {
            "id": 2,
            "events": [{ "code": 6, "parameters": "E$gold" }],
            "conditions": [],
            "actions": [
                {
                    "code": 5,
                    "branch": {
                        "conditions": [{ "code": 7, "parameters": "0.99;=;E$gold" }],
                        "onMatch": [{ "code": 9, "parameters": "P$lucky_rate;+;1" }],
                        "otherwise": [
                            {
                                "code": 5,
                                "branch": {
                                    "conditions": [{ "code": 7, "parameters": "4.99;=;E$gold" }],
                                    "onMatch": [{ "code": 9, "parameters": "P$lucky_rate;+;2" }],
                                    "otherwise": [
                                        {
                                            "code": 5,
                                            "branch": {
                                                "conditions": [{
                                                    "code": 7,
                                                    "parameters": "9.99;=;E$gold",
                                                }],
                                                "onMatch": [{
                                                    "code": 9,
                                                    "parameters": "P$lucky_rate;+;3",
                                                }],
                                                "otherwise": [
                                                    {
                                                        "code": 5,
                                                        "branch": {
                                                            "conditions": [{
                                                                "code": 7,
                                                                "parameters": "19.99;=;E$gold",
                                                            }],
                                                            "onMatch": [{
                                                                "code": 9,
                                                                "parameters": "P$lucky_rate;+;4",
                                                            }],
                                                            "otherwise": [
                                                                {
                                                                    "code": 5,
                                                                    "branch": {
                                                                        "conditions": [{
                                                                            "code": 7,
                                                                            "parameters":
                                                                                "49.99;=;E$gold",
                                                                        }],
                                                                        "onMatch": [{
                                                                            "code": 9,
                                                                            "parameters":
                                                                                "P$lucky_rate;+;5",
                                                                        }],
                                                                        "otherwise": [
                                                                            {
                                                                                "code": 5,
                                                                                "branch": {
                                                                                    "conditions": [
                                                                                        {
                                                                                            "code":
                                                                                                7,
                                                                                            "parameters":
                                                                                                "99.99;=;E$gold",
                                                                                        },
                                                                                    ],
                                                                                    "onMatch": [
                                                                                        {
                                                                                            "code":
                                                                                                9,
                                                                                            "parameters":
                                                                                                "P$lucky_rate;+;6",
                                                                                        },
                                                                                    ],
                                                                                    "otherwise": [],
                                                                                },
                                                                            },
                                                                        ],
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                { "code": 11, "parameters": "\n\t\t\t3;E$gold\n\t\t" },
            ],
        },
        {
            "id": 3,
            "events": [{ "code": 7, "parameters": "E$gold" }],
            "conditions": [{ "code": 7, "parameters": "F$reward_all;>=;0" }],
            "actions": [
                {
                    "code": 5,
                    "branch": {
                        "conditions": [{ "code": 7, "parameters": "0.99;=;E$gold" }],
                        "onMatch": [
                            {
                                "code": 5,
                                "branch": {
                                    "conditions": [{
                                        "code": 7,
                                        "parameters": "P$lucky_rate;>;S$Lucky",
                                    }],
                                    "onMatch": [{ "code": 10, "parameters": "S$lreward;1-3;1-3" }],
                                    "otherwise": [{
                                        "code": 10,
                                        "parameters": "S$lreward;1-3;1-3",
                                    }],
                                },
                            },
                        ],
                        "otherwise": [
                            {
                                "code": 5,
                                "branch": {
                                    "conditions": [{ "code": 7, "parameters": "4.99;=;E$gold" }],
                                    "onMatch": [
                                        {
                                            "code": 5,
                                            "branch": {
                                                "conditions": [{
                                                    "code": 7,
                                                    "parameters": "P$lucky_rate;>;S$Lucky",
                                                }],
                                                "onMatch": [{
                                                    "code": 10,
                                                    "parameters": "S$lreward;1-3;1-3",
                                                }],
                                                "otherwise": [{
                                                    "code": 10,
                                                    "parameters": "S$lreward;1-3;1-3",
                                                }],
                                            },
                                        },
                                    ],
                                    "otherwise": [
                                        {
                                            "code": 5,
                                            "branch": {
                                                "conditions": [{
                                                    "code": 7,
                                                    "parameters": "9.99;=;E$gold",
                                                }],
                                                "onMatch": [
                                                    {
                                                        "code": 5,
                                                        "branch": {
                                                            "conditions": [{
                                                                "code": 7,
                                                                "parameters":
                                                                    "P$lucky_rate;>;S$Lucky",
                                                            }],
                                                            "onMatch": [{
                                                                "code": 10,
                                                                "parameters": "S$lreward;1-3;1-3",
                                                            }],
                                                            "otherwise": [{
                                                                "code": 10,
                                                                "parameters": "S$lreward;1-3;1-3",
                                                            }],
                                                        },
                                                    },
                                                ],
                                                "otherwise": [
                                                    {
                                                        "code": 5,
                                                        "branch": {
                                                            "conditions": [{
                                                                "code": 7,
                                                                "parameters": "19.99;=;E$gold",
                                                            }],
                                                            "onMatch": [
                                                                {
                                                                    "code": 5,
                                                                    "branch": {
                                                                        "conditions": [
                                                                            {
                                                                                "code": 7,
                                                                                "parameters":
                                                                                    "P$lucky_rate;>;S$Lucky",
                                                                            },
                                                                        ],
                                                                        "onMatch": [{
                                                                            "code": 10,
                                                                            "parameters":
                                                                                "S$lreward;1-3;1-3",
                                                                        }],
                                                                        "otherwise": [
                                                                            {
                                                                                "code": 10,
                                                                                "parameters":
                                                                                    "S$lreward;1-3;1-3",
                                                                            },
                                                                        ],
                                                                    },
                                                                },
                                                            ],
                                                            "otherwise": [
                                                                {
                                                                    "code": 5,
                                                                    "branch": {
                                                                        "conditions": [{
                                                                            "code": 7,
                                                                            "parameters":
                                                                                "49.99;=;E$gold",
                                                                        }],
                                                                        "onMatch": [
                                                                            {
                                                                                "code": 5,
                                                                                "branch": {
                                                                                    "conditions": [
                                                                                        {
                                                                                            "code":
                                                                                                7,
                                                                                            "parameters":
                                                                                                "P$lucky_rate;>;S$Lucky",
                                                                                        },
                                                                                    ],
                                                                                    "onMatch": [
                                                                                        {
                                                                                            "code":
                                                                                                10,
                                                                                            "parameters":
                                                                                                "S$lreward;1-3;1-3",
                                                                                        },
                                                                                    ],
                                                                                    "otherwise": [
                                                                                        {
                                                                                            "code":
                                                                                                10,
                                                                                            "parameters":
                                                                                                "S$lreward;1-3;1-3",
                                                                                        },
                                                                                    ],
                                                                                },
                                                                            },
                                                                        ],
                                                                        "otherwise": [],
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
                {
                    "code": 5,
                    "branch": {
                        "conditions": [{ "code": 7, "parameters": "P$lucky_rate;>;S$Lucky" }],
                        "onMatch": [{ "code": 9, "parameters": "P$lucky_rate;-;S$Lucky" }],
                        "otherwise": [],
                    },
                },
                {
                    "code": 5,
                    "branch": {
                        "conditions": [{ "code": 7, "parameters": "E$reward;>;0" }],
                        "onMatch": [{ "code": 9, "parameters": "F$reward_all;-;E$reward" }],
                        "otherwise": [],
                    },
                },
                {
                    "code": 12,
                    "parameters":
                        "\n\t\t \topen57093Main;2;E$times;E$reward;F$lottory_gold;F$lottory_num\n\t\t",
                },
            ],
        },
    ],
    "variables": [],
};
