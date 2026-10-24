import { type GameplayCatalogElement } from "../catalog.ts";

export function part1(): GameplayCatalogElement[] {
  return [
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758893;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758893" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "409", "name": "窗口怜悯套装礼包 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "336" }], ":@": { "type": "17", "name": "开服时间下限" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758894;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758894" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "410",
        "name": "窗口怜悯套装礼包 cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;7" }], ":@": { "type": "48", "name": "N天没登录(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758895;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758895" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "411", "name": "老玩家召回", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758895" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758895;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758896;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758896" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "412", "name": "老玩家召回 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758896" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758896;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758897;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758897" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "413", "name": "老玩家召回 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758897" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758897;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758898;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758898" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "414", "name": "老玩家召回 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758898" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758898;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758899;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758899" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "415", "name": "老玩家召回 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [{ "#text": "758899" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758899;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "24;758900;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758900" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "416", "name": "老玩家召回 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;9" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758492;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758492" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "79", "name": "8级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758492" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;9" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758492;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758493;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758493" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "81", "name": "8级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758493" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;9" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758493;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758494;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758494" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "82", "name": "8级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758495" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;9" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758495;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758496;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758496" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "84", "name": "8级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758494" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;8" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;9" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758494;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758495;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "210;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758495" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "85", "name": "8级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;11" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;12" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758497;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758497" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "86", "name": "11级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758497" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;11" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;12" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758497;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758498;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758498" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "87", "name": "11级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758498" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;11" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;12" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758498;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758499;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758499" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "88", "name": "11级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758499" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;11" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;12" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758499;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758500;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758500" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "89", "name": "11级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758500" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;11" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;12" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758500;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758501;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "220;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758501" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "90", "name": "11级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758503;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758503" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "92", "name": "14级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758503" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758503;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758504;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758504" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "93", "name": "14级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758504" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758504;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758505;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758505" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "102", "name": "14级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758505" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758505;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758506;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758506" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "103", "name": "14级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758506" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758506;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758507;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758507" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "104", "name": "14级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758507" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758507;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758508;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758508" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "105", "name": "14级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758508" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758508;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758509;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758509" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "106",
        "name": "14级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758509" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758509;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758510;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758510" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "107",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758510" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758510;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758511;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758511" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "108",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758511" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;14" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;15" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758511;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758512;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "230;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758512" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "109",
        "name": "14级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "21", "name": "收获资源" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758906;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758906" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "418", "name": "表情包1", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758513;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758513" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "110", "name": "18级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758513" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758513;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758514;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758514" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "111", "name": "18级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758514" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758514;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758515;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758515" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "112", "name": "18级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758515" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758515;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758516;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758516" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "113", "name": "18级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758516" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758516;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758517;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758517" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "114", "name": "18级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758517" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758517;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758518;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758518" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "115", "name": "18级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758518" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758518;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758519;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758519" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "116",
        "name": "18级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758519" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758519;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758520;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758520" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "117",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758520" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758520;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758521;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758521" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "118",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758521" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;18" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;19" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758521;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758522;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "240;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758522" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "119",
        "name": "18级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758523;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758523" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "120", "name": "20级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758523" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758523;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758524;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758524" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "121", "name": "20级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758524" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758524;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758525;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758525" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "122", "name": "20级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758525" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758525;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758526;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758526" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "123", "name": "20级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758526" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758526;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758527;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758527" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "124", "name": "20级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758527" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758527;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758528;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758528" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "125", "name": "20级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758528" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758528;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758529;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758529" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "126",
        "name": "20级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758529" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758529;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758530;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758530" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "127",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758530" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758530;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758531;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758531" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "128",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758531" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;20" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;21" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758531;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758532;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "250;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758532" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "129",
        "name": "20级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758533;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758533" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "130", "name": "22级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758533" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758533;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758534;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758534" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "131", "name": "22级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758534" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758534;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758535;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758535" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "132", "name": "22级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758535" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758535;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758536;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758536" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "133", "name": "22级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758536" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758536;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758537;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758537" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "134", "name": "22级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758537" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758537;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758538;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758538" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "135", "name": "22级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758538" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758538;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758539;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758539" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "136",
        "name": "22级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758539" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758539;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758540;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758540" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "137",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758540" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758540;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758541;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758541" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "138",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758541" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": ">=;22" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            { "condition": [{ "#text": "<=;23" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758541;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758542;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "260;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758542" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "139",
        "name": "22级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758543;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758543" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "140", "name": "24级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758543" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758543;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758544;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758544" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "141", "name": "24级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758544" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758544;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758545;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758545" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "142", "name": "24级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758545" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758545;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758546;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758546" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "143", "name": "24级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758546" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758546;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758547;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758547" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "144", "name": "24级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758547" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758547;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758548;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758548" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "145", "name": "24级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758548" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758548;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758549;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758549" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "146",
        "name": "24级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758549" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758549;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758550;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758550" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "147",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758550" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758550;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758551;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758551" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "148",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758551" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758551;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758552;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "270;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758552" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "149",
        "name": "24级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            {
              "event": [{ "#text": "400" }],
              ":@": { "type": "16", "name": "建造完成(指定建筑类型)" },
            },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758553;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758553" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "151", "name": "25级城堡热卖", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758553" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758553;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758554;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758554" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "152", "name": "25级城堡热卖 cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758554" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758554;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758555;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758555" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "153", "name": "25级城堡热卖 cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758555" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758555;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758556;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758556" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "154", "name": "25级城堡热卖 cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758556" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758556;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758557;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758557" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "155", "name": "25级城堡热卖 cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758557" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758557;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758558;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758558" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": { "id": "156", "name": "25级城堡热卖 cp cp cp cp cp", "state": "2", "openType": "2" },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758558" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758558;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758559;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758559" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "157",
        "name": "25级城堡热卖 cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758559" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758559;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758560;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758560" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "158",
        "name": "25级城堡热卖 cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758560" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758560;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758561;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758561" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "159",
        "name": "25级城堡热卖 cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "trigger": [
        { "#text": "\n    " },
        {
          "events": [
            { "#text": "\n      " },
            { "event": [{ "#text": "758561" }], ":@": { "type": "41", "name": "购买礼包成功" } },
            { "#text": "\n      " },
            { "event": [], ":@": { "type": "8", "name": "登陆" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "conditions": [
            { "#text": "\n      " },
            { "condition": [{ "#text": "==;24" }], ":@": { "type": "13", "name": "主城等级(值)" } },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758561;>;0" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "-1;758562;<;1" }],
              ":@": { "type": "63", "name": "多长时间内购买礼包次数" },
            },
            { "#text": "\n      " },
            {
              "condition": [{ "#text": "280;120" }],
              ":@": { "type": "11", "name": "条件出现，定时消失参数：秒（仅限礼包用）" },
            },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n    " },
        {
          "actions": [
            { "#text": "\n      " },
            { "action": [{ "#text": "758562" }], ":@": { "type": "15", "name": "推送礼包" } },
            { "#text": "\n    " },
          ],
        },
        { "#text": "\n  " },
      ],
      ":@": {
        "id": "160",
        "name": "25级城堡热卖 cp cp cp cp cp cp cp cp cp",
        "state": "2",
        "openType": "2",
      },
    },
    { "#text": "\n  " },
    {
      "vars": [
        { "#text": "\n    " },
        {
          "P": [],
          ":@": {
            "id": "long_killmonster_count",
            "name": "击杀XX怪物计数",
            "value_type": "long",
            "default_value": "0",
          },
        },
        { "#text": "\n    " },
        {
          "S": [],
          ":@": {
            "id": "long_param",
            "name": "测试参数1",
            "value_type": "long",
            "default_value": "12",
            "refresh_type": "2",
            "refresh_interval": "1",
          },
        },
        { "#text": "\n  " },
      ],
    },
    { "#text": "\n" },
  ];
}
