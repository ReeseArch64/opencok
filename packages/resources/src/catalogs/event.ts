import { createGameplayCatalog, type GameplayCatalogDocument } from "../catalog.ts";

export function createCatalog(): GameplayCatalogDocument {
  return createGameplayCatalog([
    {
      "?xml": [{ "#text": "" }],
      ":@": { "version": "1.0", "encoding": "UTF-8", "standalone": "no" },
    },
    {
      "database": [
        { "#text": "\n" },
        {
          "event": [
            { "#text": "\n\t" },
            {
              "triggers": [
                { "#text": "\n\t\t" },
                { "trigger": [{ "#text": "2016-06-22 22:22:00" }], ":@": { "type": "1" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n\t" },
            {
              "conditions": [
                { "#text": "\n\t\t" },
                { "condition": [{ "#text": "F$reward_all;>=;0" }], ":@": { "type": "7" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n\t" },
            {
              "actions": [
                { "#text": "\n\t\t" },
                { "action": [{ "#text": "2" }], ":@": { "type": "1" } },
                { "#text": "\n\t\t" },
                { "action": [{ "#text": "3" }], ":@": { "type": "1" } },
                { "#text": "\n\t\t" },
                {
                  "action": [{ "#text": "57093;1;2016-06-22 22:22:00;2018-06-22 22:22:00;100" }],
                  ":@": { "type": "3" },
                },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n" },
          ],
          ":@": { "id": "1" },
        },
        { "#text": "\n" },
        {
          "event": [
            { "#text": "\n\t" },
            {
              "triggers": [
                { "#text": "\n\t\t" },
                { "trigger": [{ "#text": "E$gold" }], ":@": { "type": "6" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n\t" },
            { "conditions": [{ "#text": "\n\t" }] },
            { "#text": "\n\t" },
            {
              "actions": [
                { "#text": "\n\t\t" },
                {
                  "action": [
                    { "#text": "\n\t\t\t" },
                    {
                      "if": [
                        { "#text": "\n\t\t\t    " },
                        { "condition": [{ "#text": "0.99;=;E$gold" }], ":@": { "type": "7" } },
                        { "#text": "\n\t\t\t    " },
                        { "action": [{ "#text": "P$lucky_rate;+;1" }], ":@": { "type": "9" } },
                        { "#text": "\n\t\t\t" },
                      ],
                    },
                    { "#text": "\n\t\t\t" },
                    {
                      "else": [
                        { "#text": "\n\t\t\t\t" },
                        {
                          "action": [
                            { "#text": "\n\t\t\t\t" },
                            {
                              "if": [
                                { "#text": "\n\t\t\t\t    " },
                                {
                                  "condition": [{ "#text": "4.99;=;E$gold" }],
                                  ":@": { "type": "7" },
                                },
                                { "#text": "\n\t\t\t\t    " },
                                {
                                  "action": [{ "#text": "P$lucky_rate;+;2" }],
                                  ":@": { "type": "9" },
                                },
                                { "#text": "\n\t\t\t\t" },
                              ],
                            },
                            { "#text": "\n\t\t\t\t" },
                            {
                              "else": [
                                { "#text": "\n\t\t\t\t\t" },
                                {
                                  "action": [
                                    { "#text": "\n\t\t\t\t\t" },
                                    {
                                      "if": [
                                        { "#text": "\n\t\t\t\t    \t" },
                                        {
                                          "condition": [{ "#text": "9.99;=;E$gold" }],
                                          ":@": { "type": "7" },
                                        },
                                        { "#text": "\n\t\t\t\t\t\t" },
                                        {
                                          "action": [{ "#text": "P$lucky_rate;+;3" }],
                                          ":@": { "type": "9" },
                                        },
                                        { "#text": "\n\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t" },
                                    {
                                      "else": [
                                        { "#text": "\n\t\t\t\t\t\t" },
                                        {
                                          "action": [
                                            { "#text": "\n\t\t\t\t\t\t" },
                                            {
                                              "if": [
                                                { "#text": "\n\t\t\t\t\t    \t" },
                                                {
                                                  "condition": [{ "#text": "19.99;=;E$gold" }],
                                                  ":@": { "type": "7" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [{ "#text": "P$lucky_rate;+;4" }],
                                                  ":@": { "type": "9" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\n\t\t\t\t\t\t" },
                                            {
                                              "else": [
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [
                                                    { "#text": "\n\t\t\t\t\t\t\t" },
                                                    {
                                                      "if": [
                                                        { "#text": "\n\t\t\t\t\t    \t\t" },
                                                        {
                                                          "condition": [
                                                            { "#text": "49.99;=;E$gold" },
                                                          ],
                                                          ":@": { "type": "7" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "action": [
                                                            { "#text": "P$lucky_rate;+;5" },
                                                          ],
                                                          ":@": { "type": "9" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t" },
                                                      ],
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t\t" },
                                                    {
                                                      "else": [
                                                        { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "action": [
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "if": [
                                                                {
                                                                  "#text": "\n\t\t\t\t\t\t    \t\t",
                                                                },
                                                                {
                                                                  "condition": [
                                                                    { "#text": "99.99;=;E$gold" },
                                                                  ],
                                                                  ":@": { "type": "7" },
                                                                },
                                                                { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                                {
                                                                  "action": [
                                                                    { "#text": "P$lucky_rate;+;6" },
                                                                  ],
                                                                  ":@": { "type": "9" },
                                                                },
                                                                { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                              ],
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "else": [
                                                                { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                              ],
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                          ],
                                                          ":@": { "type": "5" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t" },
                                                      ],
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t" },
                                                  ],
                                                  ":@": { "type": "5" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\n\t\t\t\t\t\t" },
                                          ],
                                          ":@": { "type": "5" },
                                        },
                                        { "#text": "\n\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t" },
                                  ],
                                  ":@": { "type": "5" },
                                },
                                { "#text": "\n\t\t\t\t" },
                              ],
                            },
                            { "#text": "\n\t\t\t\t" },
                          ],
                          ":@": { "type": "5" },
                        },
                        { "#text": "\n\t\t\t" },
                      ],
                    },
                    { "#text": "\n\t\t" },
                  ],
                  ":@": { "type": "5" },
                },
                { "#text": "\n\t\t" },
                { "action": [{ "#text": "\n\t\t\t3;E$gold\n\t\t" }], ":@": { "type": "11" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n" },
          ],
          ":@": { "id": "2" },
        },
        { "#text": " \t\n" },
        {
          "event": [
            { "#text": "\n\t" },
            {
              "triggers": [
                { "#text": "\n\t\t" },
                { "trigger": [{ "#text": "E$gold" }], ":@": { "type": "7" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n\t" },
            {
              "conditions": [
                { "#text": "\n\t\t" },
                { "condition": [{ "#text": "F$reward_all;>=;0" }], ":@": { "type": "7" } },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n\t" },
            {
              "actions": [
                { "#text": "\n\t\t" },
                {
                  "action": [
                    { "#text": "\n\t\t\t" },
                    {
                      "if": [
                        { "#text": "\n\t\t\t" },
                        { "condition": [{ "#text": "0.99;=;E$gold" }], ":@": { "type": "7" } },
                        { "#text": "\n\t\t\t\t " },
                        {
                          "action": [
                            { "#text": "\n\t\t\t\t     " },
                            {
                              "if": [
                                { "#text": "\n\t\t\t\t\t " },
                                {
                                  "condition": [{ "#text": "P$lucky_rate;>;S$Lucky" }],
                                  ":@": { "type": "7" },
                                },
                                { "#text": "\n\t\t\t\t\t\t" },
                                {
                                  "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                  ":@": { "type": "10" },
                                },
                                { "#text": "\n\t\t\t\t\t " },
                              ],
                            },
                            { "#text": "\n\t\t\t\t\t " },
                            {
                              "else": [
                                { "#text": "\n\t\t\t\t\t\t" },
                                {
                                  "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                  ":@": { "type": "10" },
                                },
                                { "#text": "\n\t\t\t\t\t " },
                              ],
                            },
                            { "#text": "\n\t\t\t\t " },
                          ],
                          ":@": { "type": "5" },
                        },
                        { "#text": "\n\t\t\t" },
                      ],
                    },
                    { "#text": "\n\t\t\t" },
                    {
                      "else": [
                        { "#text": "\n\t\t\t \t" },
                        {
                          "action": [
                            { "#text": "\n\t\t\t\t" },
                            {
                              "if": [
                                { "#text": "\n\t\t\t\t" },
                                {
                                  "condition": [{ "#text": "4.99;=;E$gold" }],
                                  ":@": { "type": "7" },
                                },
                                { "#text": "\n\t\t\t\t\t" },
                                {
                                  "action": [
                                    { "#text": "\n\t\t\t\t\t    " },
                                    {
                                      "if": [
                                        { "#text": "\n\t\t\t\t\t\t" },
                                        {
                                          "condition": [{ "#text": "P$lucky_rate;>;S$Lucky" }],
                                          ":@": { "type": "7" },
                                        },
                                        { "#text": "\n\t\t\t\t\t\t\t" },
                                        {
                                          "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                          ":@": { "type": "10" },
                                        },
                                        { "#text": "\n\t\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t\t" },
                                    {
                                      "else": [
                                        { "#text": "\n\t\t\t\t\t\t\t" },
                                        {
                                          "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                          ":@": { "type": "10" },
                                        },
                                        { "#text": "\n\t\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t" },
                                  ],
                                  ":@": { "type": "5" },
                                },
                                { "#text": "\n\t\t\t\t" },
                              ],
                            },
                            { "#text": "\n\t\t\t\t" },
                            {
                              "else": [
                                { "#text": "\n\t\t\t\t\t" },
                                {
                                  "action": [
                                    { "#text": "\n\t\t\t\t\t" },
                                    {
                                      "if": [
                                        { "#text": "\n\t\t\t\t    " },
                                        {
                                          "condition": [{ "#text": "9.99;=;E$gold" }],
                                          ":@": { "type": "7" },
                                        },
                                        { "#text": "\n\t\t\t\t    \t" },
                                        {
                                          "action": [
                                            { "#text": "\n\t\t\t\t\t\t\t" },
                                            {
                                              "if": [
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                                {
                                                  "condition": [
                                                    { "#text": "P$lucky_rate;>;S$Lucky" },
                                                  ],
                                                  ":@": { "type": "7" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                                  ":@": { "type": "10" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\n\t\t\t\t\t\t\t" },
                                            {
                                              "else": [
                                                { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [{ "#text": "S$lreward;1-3;1-3" }],
                                                  ":@": { "type": "10" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\n\t\t\t\t\t\t" },
                                          ],
                                          ":@": { "type": "5" },
                                        },
                                        { "#text": "\n\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t" },
                                    {
                                      "else": [
                                        { "#text": "\n\t\t\t\t\t\t" },
                                        {
                                          "action": [
                                            { "#text": "\n\t\t\t\t\t\t\t" },
                                            {
                                              "if": [
                                                { "#text": "\n\t\t\t\t\t\t    " },
                                                {
                                                  "condition": [{ "#text": "19.99;=;E$gold" }],
                                                  ":@": { "type": "7" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [
                                                    { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                    {
                                                      "if": [
                                                        { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "condition": [
                                                            { "#text": "P$lucky_rate;>;S$Lucky" },
                                                          ],
                                                          ":@": { "type": "7" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "action": [
                                                            { "#text": "S$lreward;1-3;1-3" },
                                                          ],
                                                          ":@": { "type": "10" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                      ],
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                    {
                                                      "else": [
                                                        { "#text": "\n\t\t\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "action": [
                                                            { "#text": "S$lreward;1-3;1-3" },
                                                          ],
                                                          ":@": { "type": "10" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                      ],
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                  ],
                                                  ":@": { "type": "5" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\t\t\t\n\t\t\t\t\t\t\t" },
                                            {
                                              "else": [
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                                {
                                                  "action": [
                                                    { "#text": "\n\t\t\t\t\t\t\t" },
                                                    {
                                                      "if": [
                                                        { "#text": "\n\t\t\t\t\t    \t" },
                                                        {
                                                          "condition": [
                                                            { "#text": "49.99;=;E$gold" },
                                                          ],
                                                          ":@": { "type": "7" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t    \t\t" },
                                                        {
                                                          "action": [
                                                            { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "if": [
                                                                { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                                {
                                                                  "condition": [
                                                                    {
                                                                      "#text":
                                                                        "P$lucky_rate;>;S$Lucky",
                                                                    },
                                                                  ],
                                                                  ":@": { "type": "7" },
                                                                },
                                                                {
                                                                  "#text": "\n\t\t\t\t\t\t\t\t\t\t",
                                                                },
                                                                {
                                                                  "action": [
                                                                    {
                                                                      "#text": "S$lreward;1-3;1-3",
                                                                    },
                                                                  ],
                                                                  ":@": { "type": "10" },
                                                                },
                                                                { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                              ],
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "else": [
                                                                {
                                                                  "#text": "\n\t\t\t\t\t\t\t\t\t\t",
                                                                },
                                                                {
                                                                  "action": [
                                                                    {
                                                                      "#text": "S$lreward;1-3;1-3",
                                                                    },
                                                                  ],
                                                                  ":@": { "type": "10" },
                                                                },
                                                                { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                              ],
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                          ],
                                                          ":@": { "type": "5" },
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t" },
                                                      ],
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t\t" },
                                                  ],
                                                  ":@": { "type": "5" },
                                                },
                                                { "#text": "\n\t\t\t\t\t\t\t" },
                                                {
                                                  "else": [
                                                    { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                    {
                                                      "action": [
                                                        { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "if": [
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "condition": [
                                                                { "#text": "99.99;=;E$gold" },
                                                              ],
                                                              ":@": { "type": "7" },
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                            {
                                                              "action": [
                                                                {
                                                                  "#text": "\n\t\t\t\t\t\t\t\t\t\t",
                                                                },
                                                                {
                                                                  "if": [
                                                                    {
                                                                      "#text":
                                                                        "\n\t\t\t\t\t\t\t\t\t\t",
                                                                    },
                                                                    {
                                                                      "condition": [
                                                                        {
                                                                          "#text":
                                                                            "P$lucky_rate;>;S$Lucky",
                                                                        },
                                                                      ],
                                                                      ":@": { "type": "7" },
                                                                    },
                                                                    {
                                                                      "#text":
                                                                        "\n\t\t\t\t\t\t\t\t\t\t\t",
                                                                    },
                                                                    {
                                                                      "action": [
                                                                        {
                                                                          "#text":
                                                                            "S$lreward;1-3;1-3",
                                                                        },
                                                                      ],
                                                                      ":@": { "type": "10" },
                                                                    },
                                                                    {
                                                                      "#text":
                                                                        "\n\t\t\t\t\t\t\t\t\t\t",
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  "#text": "\n\t\t\t\t\t\t\t\t\t\t",
                                                                },
                                                                {
                                                                  "else": [
                                                                    {
                                                                      "#text":
                                                                        "\n\t\t\t\t\t\t\t\t\t\t\t",
                                                                    },
                                                                    {
                                                                      "action": [
                                                                        {
                                                                          "#text":
                                                                            "S$lreward;1-3;1-3",
                                                                        },
                                                                      ],
                                                                      ":@": { "type": "10" },
                                                                    },
                                                                    {
                                                                      "#text":
                                                                        "\n\t\t\t\t\t\t\t\t\t\t",
                                                                    },
                                                                  ],
                                                                },
                                                                { "#text": "\n\t\t\t\t\t\t\t\t\t" },
                                                              ],
                                                              ":@": { "type": "5" },
                                                            },
                                                            { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                          ],
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                        {
                                                          "else": [
                                                            {
                                                              "#text":
                                                                "\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t\t",
                                                            },
                                                          ],
                                                        },
                                                        { "#text": "\n\t\t\t\t\t\t\t\t" },
                                                      ],
                                                      ":@": { "type": "5" },
                                                    },
                                                    { "#text": "\n\t\t\t\t\t\t\t" },
                                                  ],
                                                },
                                                { "#text": "\n\t\t\t\t\t\t" },
                                              ],
                                            },
                                            { "#text": "\n\t\t\t\t\t\t" },
                                          ],
                                          ":@": { "type": "5" },
                                        },
                                        { "#text": "\n\t\t\t\t\t" },
                                      ],
                                    },
                                    { "#text": "\n\t\t\t\t\t" },
                                  ],
                                  ":@": { "type": "5" },
                                },
                                { "#text": "\n\t\t\t\t" },
                              ],
                            },
                            { "#text": "\n\t\t\t\t" },
                          ],
                          ":@": { "type": "5" },
                        },
                        { "#text": "\n\t\t\t" },
                      ],
                    },
                    { "#text": "\n\t\t" },
                  ],
                  ":@": { "type": "5" },
                },
                { "#text": "\n\t\t" },
                {
                  "action": [
                    { "#text": "\n\t\t \t " },
                    {
                      "if": [
                        { "#text": "\n\t\t\t\t" },
                        {
                          "condition": [{ "#text": "P$lucky_rate;>;S$Lucky" }],
                          ":@": { "type": "7" },
                        },
                        { "#text": "\n\t\t\t\t" },
                        {
                          "action": [{ "#text": "P$lucky_rate;-;S$Lucky" }],
                          ":@": { "type": "9" },
                        },
                        { "#text": "\n\t\t\t " },
                      ],
                    },
                    { "#text": "\n\t\t\t " },
                    { "else": [{ "#text": "\n\t\t\t " }] },
                    { "#text": "\n\t\t" },
                  ],
                  ":@": { "type": "5" },
                },
                { "#text": "\n\t\t" },
                {
                  "action": [
                    { "#text": "\n\t\t \t " },
                    {
                      "if": [
                        { "#text": "\n\t\t\t\t" },
                        { "condition": [{ "#text": "E$reward;>;0" }], ":@": { "type": "7" } },
                        { "#text": "\n\t\t\t\t" },
                        {
                          "action": [{ "#text": "F$reward_all;-;E$reward" }],
                          ":@": { "type": "9" },
                        },
                        { "#text": "\n\t\t\t " },
                      ],
                    },
                    { "#text": "\n\t\t\t " },
                    { "else": [{ "#text": "\n\t\t\t " }] },
                    { "#text": "\n\t\t" },
                  ],
                  ":@": { "type": "5" },
                },
                { "#text": "\n\t\t" },
                {
                  "action": [
                    {
                      "#text":
                        "\n\t\t \topen57093Main;2;E$times;E$reward;F$lottory_gold;F$lottory_num\n\t\t",
                    },
                  ],
                  ":@": { "type": "12" },
                },
                { "#text": "\n\t" },
              ],
            },
            { "#text": "\n" },
          ],
          ":@": { "id": "3" },
        },
        { "#text": "\n" },
      ],
    },
  ]);
}
