import { CatalogKind } from "@opencok/enums/catalog-kind";
import type { AutomationCatalog } from "../../catalog-model.ts";
export const catalog: AutomationCatalog = {
  "kind": CatalogKind.Automation,
  "version": "e82cac44f930536b4c5e5fce133a1fbd",
  "rules": [
    {
      "id": 2465,
      "name": "SKN-世界BOSS",
      "state": 1,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "9400;9401;9402;9403;9404;9405;9406;9407;9408;9409;9410;9411;9412;9413;9414;9415;9416;9417;9418;9419;9420;9421;9422;9423;9424;9425;9426;9427;9428;9429",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-30 00:00:00;2024-12-01 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;<;500",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;+;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$worldboss_icedragon_count;==;500",
              },
            ],
            "onMatch": [
              { "code": 60, "name": "这个BOSS是一个及其特殊的世界BOSS(3Special)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;500;false;1",
        },
      ],
    },
    {
      "id": 2427,
      "name": "VIP升级",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 69, "name": "VIP升级", "group": 1, "parameters": "1" },
        { "code": 69, "name": "VIP升级", "group": 1, "parameters": "6" },
        { "code": 69, "name": "VIP升级", "group": 1, "parameters": "11" },
        { "code": 69, "name": "VIP升级", "group": 1, "parameters": "16" },
      ],
      "conditions": [
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-10000" },
        {
          "code": 52,
          "name": "或 - 2",
          "group": 1,
          "conditions": [
            { "code": 86, "name": "加入联盟时间(小时)", "group": 1, "parameters": "<;1" },
            { "code": 88, "name": "合服时间限制(天)", "group": 1, "parameters": "==;5" },
          ],
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$vip_level;==;1",
              },
            ],
            "onMatch": [{ "code": 15, "name": "推送礼包", "group": 1, "parameters": "761570;360" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$vip_level;==;6",
              },
            ],
            "onMatch": [{ "code": 15, "name": "推送礼包", "group": 1, "parameters": "761571;360" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$vip_level;==;11",
              },
            ],
            "onMatch": [{ "code": 15, "name": "推送礼包", "group": 1, "parameters": "761572;360" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$vip_level;==;16",
              },
            ],
            "onMatch": [{ "code": 15, "name": "推送礼包", "group": 1, "parameters": "761573;360" }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 817,
      "name": "test_test",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-03-07 11:08:18;2024-03-08 11:08:24",
        },
        {
          "code": 52,
          "name": "或 - 2",
          "group": 1,
          "conditions": [
            { "code": 86, "name": "加入联盟时间(小时)", "group": 1, "parameters": "<;1" },
            { "code": 88, "name": "合服时间限制(天)", "group": 1, "parameters": "==;5" },
          ],
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2611,
      "name": "红包_99.99红包礼包测试",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-11-23 00:00:00;2024-11-29 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_5" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;12000;30;1440;152842;1;12000",
        },
      ],
    },
    {
      "id": 565,
      "name": "刷BOSS",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211319" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-24 17:00:00;2024-09-09 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$use_item_server;<;50",
        },
      ],
      "actions": [
        {
          "code": 57,
          "name": "修改变量为使用物品的数量",
          "group": 1,
          "parameters": "$use_item_server;+",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item_server;==;10",
              },
            ],
            "onMatch": [
              { "code": 52, "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item_server;==;50",
              },
            ],
            "onMatch": [
              { "code": 52, "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        { "code": 21, "name": "执行多个操作 2", "group": 1 },
      ],
    },
    {
      "id": 921,
      "name": "test2",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 21, "name": "收获资源", "group": 1 },
        { "code": 8, "name": "登陆", "group": 1 },
        { "code": 68, "name": "商店购买", "group": 1, "parameters": "10" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-03-09 17:29:19;2024-03-10 17:29:24",
        },
        { "code": 19, "name": "玩家VIP等级(值)", "group": 1, "parameters": ">=;1" },
        { "code": 41, "name": "VIP等级(值)", "group": 1, "parameters": "<=;5" },
      ],
      "actions": [
        { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "249161" },
        { "code": 21, "name": "执行多个操作", "group": 1 },
      ],
    },
    {
      "id": 688,
      "name": "ee",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-19 16:48:18;2024-02-21 16:48:21",
        },
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;15" },
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;20" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [{ "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" }],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 41, "name": "VIP等级(值)", "group": 1, "parameters": ">=;15" },
                  ],
                  "onMatch": [
                    {
                      "code": 55,
                      "name": "给全服发送离线推送",
                      "group": 1,
                      "parameters": "ACTIVITY;1111;LOVE_PUSH",
                    },
                  ],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>;100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters":
            "$newplayer_1day_kill-3;$newplayer_1day_kill-1;$newplayer_1day_kill-2;1;claim|info",
        },
      ],
    },
    {
      "id": 2527,
      "name": "xjhtest001",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 52,
          "name": "或 - 2",
          "group": 1,
          "conditions": [
            { "code": 48, "name": "天没登录", "group": 1, "parameters": ">;14" },
            {
              "code": 7,
              "name": "数值的比较(变量 vs 数值)",
              "group": 1,
              "parameters": "$last_login_exchange;==;1",
            },
          ],
        },
      ],
      "actions": [
        { "code": 24, "name": "变量赋值", "group": 1, "parameters": "$last_login_exchange;1" },
      ],
    },
    {
      "id": 689,
      "name": "变量测试V2",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 43, "name": "定时器", "group": 1, "parameters": "-1;5" },
        { "code": 52, "name": "红包领取触发", "group": 1 },
      ],
      "conditions": [{ "code": 32, "name": "服务器编号", "group": 1, "parameters": "111" }],
      "actions": [
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$var_test_v2;+;5" },
        {
          "code": 30,
          "name": "打印一个Log 带参数",
          "group": 1,
          "parameters":
            "---------------------------------------------------${S$long_var_test_v2}----------------------------------------------",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$key_rewardId;<;$key_trial_field_sequence",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2460,
      "name": "1-10级怪",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-11-15 00:00:00;2024-11-16 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;100;900907;30;15;100",
        },
      ],
    },
    {
      "id": 2462,
      "name": "11-20级怪 cp cp",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-26 00:00:00;2024-11-07 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900908;30;15;100",
        },
      ],
    },
    {
      "id": 2463,
      "name": "21-30级野怪 cp",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-26 00:00:00;2024-11-07 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900909;30;15;100",
        },
      ],
    },
    {
      "id": 2065,
      "name": "周年蛋糕_1",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 57, "name": "请求领取道具(指定ID)", "group": 1, "parameters": "212023" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_cake_taken;==;0",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 变量)",
                      "group": 1,
                      "parameters": "$3th_anniversary_cake_count;<;$3th_anniversary_cake_count_max",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_anniversary_cake_taken}",
        },
      ],
    },
    {
      "id": 2066,
      "name": "周年蛋糕_2",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "45" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-10-31 00:00:00",
        },
        {
          "code": 73,
          "name": "验证要消耗的物品ID，并删除通过验证",
          "group": 1,
          "parameters": "212024;1",
        },
      ],
      "actions": [
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "509877;86400",
        },
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "509876;3600",
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "509877;50" },
            ],
            "onMatch": [
              {
                "code": 33,
                "name": "添加状态status,持续时间不填默认读表",
                "group": 1,
                "parameters": "509878;3600",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
      ],
    },
    {
      "id": 2067,
      "name": "周年蛋糕_3",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 59, "name": "城堡皮肤变化(指定ID)", "group": 1, "parameters": "509878" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12290" },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_avatar_cake_count;<;$3th_anniversary_avatar_cake_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_anniversary_avatar_cake_count}",
        },
      ],
    },
    {
      "id": 2068,
      "name": "集画换好礼_1",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212025" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_a_count;<;$3th_avviversary_paint_a_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;7",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_a_count;<;$3th_avviversary_paint_a_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_avviversary_paint_a_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_avviversary_paint_a_count}",
        },
      ],
    },
    {
      "id": 2069,
      "name": "集画换好礼_2",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212026" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_b_count;<;$3th_avviversary_paint_b_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;15",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_b_count;<;$3th_avviversary_paint_b_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_avviversary_paint_b_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_avviversary_paint_b_count}",
        },
      ],
    },
    {
      "id": 2070,
      "name": "集画换好礼_3",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212027" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_c_count;<;$3th_avviversary_paint_c_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;30",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_c_count;<;$3th_avviversary_paint_c_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_avviversary_paint_c_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_avviversary_paint_c_count}",
        },
      ],
    },
    {
      "id": 2071,
      "name": "集画换好礼_4",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212028" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_d_count;<;$3th_avviversary_paint_d_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;150",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_avviversary_paint_d_count;<;$3th_avviversary_paint_d_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_avviversary_paint_d_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_avviversary_paint_d_count}",
        },
      ],
    },
    {
      "id": 2072,
      "name": "登录送福利",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$3th_anniversary_mail_send_count;==;0",
        },
      ],
      "actions": [
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12286" },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_mail_send_count;+;1",
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_anniversary_mail_send_count}",
        },
      ],
    },
    {
      "id": 2073,
      "name": "周年龙BOSS_1",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 64, "name": "攻击世界BOSS一次(指定boss_id)", "group": 1, "parameters": "930013" },
        { "code": 64, "name": "攻击世界BOSS一次(指定boss_id)", "group": 1, "parameters": "930014" },
        { "code": 64, "name": "攻击世界BOSS一次(指定boss_id)", "group": 1, "parameters": "930015" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_boss_killed_count;<;$3th_anniversary_dragon_boss_killed_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;20",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_boss_killed_count;<;$3th_anniversary_dragon_boss_killed_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_dragon_boss_killed_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2074,
      "name": "周年龙BOSS_2",
      "state": 2,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900821;900822;900823;900824;900825;900826;900827;900828;900829;900830;900831;900832;900833;900834;900835;900836;900837;900838;900839;900840;900841;900842;900843;900844;900845;900846;900847;900848;900849;900850",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_enemy_killed_count;<;$3th_anniversary_dragon_enemy_killed_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;3",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_enemy_killed_count;<;$3th_anniversary_dragon_enemy_killed_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_dragon_enemy_killed_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2075,
      "name": "周年龙BOSS_3",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212031" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_item_count;<;$3th_anniversary_dragon_item_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_item_count;<;$3th_anniversary_dragon_item_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_anniversary_dragon_item_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2076,
      "name": "周年龙BOSS_4",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 62, "name": "兑换活动奖励", "group": 1, "parameters": "-1;-1" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_exchange_count;<;$3th_anniversary_dragon_exchange_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;30",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_dragon_exchange_count;<;$3th_anniversary_dragon_exchange_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_dragon_exchange_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2077,
      "name": "龙之宝藏_1",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 63, "name": "探索遗迹", "group": 1, "parameters": "1;true" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_time_count;<;$3th_anniversary_treasure_time_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2078,
      "name": "龙之宝藏_2",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 63, "name": "探索遗迹", "group": 1, "parameters": "1;false" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_explore_time;+;180",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_1;0",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_2;0",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_3;0",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_1;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_explore_time;>=;14400",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_2;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_treasure_hour_var_1;==;1",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_treasure_hour_var_2;==;1",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;30",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 24,
                "name": "给整数变量赋值",
                "group": 1,
                "parameters": "$3th_anniversary_explore_time;0",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2079,
      "name": "龙之宝藏_3",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212032" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_getitem_count;<;$3th_anniversary_treasure_getitem_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;25",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_getitem_count;<;$3th_anniversary_treasure_getitem_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_getitem_count;+;$key_itemNum",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2080,
      "name": "龙之宝藏_4",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "212032" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_useitem_count;<;$3th_anniversary_treasure_useitem_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;55",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_useitem_count;<;$3th_anniversary_treasure_useitem_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_useitem_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2081,
      "name": "周年福袋_1",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 67, "name": "福袋操作", "group": 1, "parameters": "1" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_blessingbag_open_count;<;$3th_anniversary_blessingbag_open_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2082,
      "name": "周年福袋_2",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 67, "name": "福袋操作", "group": 1, "parameters": "2" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_blessingbag_refresh_count;<;$3th_anniversary_blessingbag_refresh_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2083,
      "name": "周年福袋_3",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 67, "name": "福袋操作", "group": 1, "parameters": "3" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_blessingbag_goldopen_count;<;$3th_anniversary_blessingbag_goldopen_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2084,
      "name": "烟花灿烂_1",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 68, "name": "商店购买", "group": 1, "parameters": "10" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$key_shopId;==;1000152",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters":
            "$3th_anniversary_fire_buy_time_count;<;$3th_anniversary_fire_buy_time_count_max",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_fire_buy_time_count;<;$3th_anniversary_fire_buy_time_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2085,
      "name": "烟花灿烂_2",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 64, "name": "攻击世界BOSS一次", "group": 1, "parameters": "930016" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters":
            "$3th_anniversary_fire_attack_boss_count;<;$3th_anniversary_fire_attack_boss_count_max",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week3_score_count;+;15",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_fire_attack_boss_count;+;1",
        },
      ],
    },
    {
      "id": 2086,
      "name": "烟花灿烂_3",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "212033" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$3th_anniversary_get_fire_count;<;$3th_anniversary_get_fire_count_max",
        },
      ],
      "actions": [
        {
          "code": 24,
          "name": "变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count;0",
        },
        {
          "code": 24,
          "name": "变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count_1;0",
        },
        {
          "code": 24,
          "name": "变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count_2;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count;+;$key_itemNum",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count_1;+;$3th_anniversary_get_fire_count_max",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_anniversary_shop_fixed_count_1;-;$3th_anniversary_get_fire_count",
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_shop_fixed_count;>=;$3th_anniversary_shop_fixed_count_1",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters":
                  "$3th_anniversary_shop_fixed_count_2;+;$3th_anniversary_shop_fixed_count_1",
              },
            ],
            "otherwise": [
              {
                "code": 9,
                "name": "修改变量为其他变量的值",
                "group": 1,
                "parameters":
                  "$3th_anniversary_shop_fixed_count_2;+;$3th_anniversary_shop_fixed_count",
              },
            ],
          },
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_anniversary_get_fire_count;+;$3th_anniversary_shop_fixed_count_2",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week3_score_count;+;$3th_anniversary_shop_fixed_count_2",
        },
      ],
    },
    {
      "id": 2091,
      "name": "反叛军的阴谋_1",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9400;9401;9402" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_shadow_kill_candle_count;<;$3th_anniversary_shadow_kill_candle_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2092,
      "name": "反叛军的阴谋_2",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "930004" },
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "930005" },
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "930006" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_shadow_kill_boss_count;<;$3th_anniversary_shadow_kill_boss_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2093,
      "name": "试炼场_1",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 66, "name": "试炼场事件", "group": 1, "parameters": "1" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$3th_anniversary_trial_count;<;$3th_anniversary_trial_count_max",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_trial_count;+;1",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week3_score_count;+;20",
        },
      ],
    },
    {
      "id": 2349,
      "name": "修复积分错误-第一周",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_score_count;0",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_anniversary_cake_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;45",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_anniversary_use_cake_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;1",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_anniversary_avatar_cake_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;150",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_a_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;7",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_b_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;15",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_c_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;30",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_d_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;150",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_avviversary_paint_abcd_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;550",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;+;$3th_anniversary_mail_recived_count",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;*;150",
        },
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$3th_week1_score_count;+;$3th_week1_fix_box_score",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_week1_fix_box_score;0",
        },
      ],
    },
    {
      "id": 2094,
      "name": "试炼场_2",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 66, "name": "试炼场事件", "group": 1, "parameters": "2" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$3th_anniversary_trial_pass_count;<;$3th_anniversary_trial_pass_count_max",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$key_trial_field_sequence;==;8",
        },
      ],
      "actions": [
        {
          "code": 30,
          "name": "打印一个Log 带参数",
          "group": 1,
          "parameters": "------------${C$key_trial_field_sequence}------------------",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_trial_pass_count;+;1",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week3_score_count;+;150",
        },
      ],
    },
    {
      "id": 2350,
      "name": "龙之宝藏_2 cp",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 63, "name": "探索遗迹", "group": 1, "parameters": "1;false" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-01 00:00:00;2024-09-30 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_explore_time;+;180",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_1;0",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_2;0",
        },
        {
          "code": 24,
          "name": "给整数变量赋值",
          "group": 1,
          "parameters": "$3th_anniversary_treasure_hour_var_3;0",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_treasure_hour_count;<;$3th_anniversary_treasure_hour_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_1;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_explore_time;>=;$3th_anniversary_explore_request_time",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_2;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_treasure_hour_var_1;==;1",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_treasure_hour_var_2;==;1",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week2_score_count;+;30",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_treasure_hour_var_3;==;1",
              },
            ],
            "onMatch": [
              {
                "code": 24,
                "name": "给整数变量赋值",
                "group": 1,
                "parameters": "$3th_anniversary_explore_time;0",
              },
            ],
            "otherwise": [],
          },
        },
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "123456" },
      ],
    },
    {
      "id": 2351,
      "name": "修复邮件错误-第一周",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters":
                      "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_mail_send_count;==;1",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;150",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters":
                      "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_mail_send_count;==;1",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_mail_recived_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2354,
      "name": "周年蛋糕_活动版",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "45" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
        {
          "code": 73,
          "name": "验证要消耗的物品ID，并删除通过验证",
          "group": 1,
          "parameters": "212024;1",
        },
      ],
      "actions": [
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "509877;86400",
        },
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "509876;3600",
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "509877;50" },
            ],
            "onMatch": [
              {
                "code": 33,
                "name": "添加状态status,持续时间不填默认读表",
                "group": 1,
                "parameters": "509878;3600",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_use_cake_count;<;$3th_anniversary_use_cake_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_use_cake_total_count;+;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_use_cake_total_count;==;30",
              },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "12288" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_use_cake_total_count;==;100",
              },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "12289" }],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_anniversary_use_cake_count}",
        },
      ],
    },
    {
      "id": 2356,
      "name": "试炼场_3",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 66, "name": "试炼场事件", "group": 1, "parameters": "2" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters":
            "$3th_avviversary_trial_pass6_count;<;$3th_avviversary_trial_pass6_count_max",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$key_trial_field_sequence;==;6",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_avviversary_trial_pass6_count;+;1",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_week3_score_count;+;40",
        },
      ],
    },
    {
      "id": 2367,
      "name": "烟花灿烂_4",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;7200" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 00:00:00",
        },
      ],
      "actions": [
        { "code": 52, "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": 1 },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;152829;SAN_ZHOU_NIAN_BOSS",
        },
      ],
    },
    {
      "id": 2385,
      "name": "三周年_第一周积分宝箱_补发",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-10-10 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>=;100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>=;300",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>=;600",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>=;1100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week1_score_count;>=;1900",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2386,
      "name": "三周年_第二周积分宝箱_补发",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-10-10 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week2_score_count;>=;100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week2_score_count;>=;300",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week2_score_count;>=;600",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week2_score_count;>=;1100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week2_score_count;>=;1900",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2387,
      "name": "三周年_第三周积分宝箱_补发",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-27 02:00:00;2024-10-10 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week3_score_count;>=;100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week3_score_count;>=;300",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week3_score_count;>=;600",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week3_score_count;>=;1100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week3_score_count;>=;1900",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2388,
      "name": "三周年_第四周积分宝箱_补发",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-04 02:00:00;2024-10-10 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week4_score_count;>=;100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week4_score_count;>=;300",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week4_score_count;>=;600",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week4_score_count;>=;1100",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_week4_score_count;>=;1900",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2390,
      "name": "红包_0.99礼包红包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_8" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;250;5;1440;152842;1;250",
        },
      ],
    },
    {
      "id": 2391,
      "name": "恶龙-消灭恶龙",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "900881" },
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "900882" },
        { "code": 65, "name": "击杀世界BOSS(指定boss_id)", "group": 1, "parameters": "900883" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$3th_anniversary_ajatar_killed;<;$3th_anniversary_ajatar_killed_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2392,
      "name": "恶龙-领取联盟邮件",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 61, "name": "邮件领奖(指定title)", "group": 1, "parameters": "137456" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-10-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_ajatar_get_mail;<;$3th_anniversary_ajatar_get_mail_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2393,
      "name": "恶龙-获得任意皮肤",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203036" },
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203037" },
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203038" },
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203039" },
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203040" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_avviversary_get_dragon_face;<;$3th_avviversary_get_dragon_face_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2394,
      "name": "恶龙-获得30天皮肤",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "203040" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_avviversary_get_30day_dragon_face;<;$3th_avviversary_get_30day_dragon_face_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2148,
      "name": "登录送福利~",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 61, "name": "邮件领奖(指定title)", "group": 1, "parameters": "152625" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;150",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_mail_recived_count;<;$3th_anniversary_mail_recived_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_mail_recived_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_anniversary_mail_recived_count}",
        },
      ],
    },
    {
      "id": 2207,
      "name": "第一周_积分宝箱_领取",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250080" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250081" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250082" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250083" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250084" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-04 00:00:00;2024-09-13 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250080",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250080" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250080",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week1_box_1_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250081",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250081" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250081",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week1_box_2_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250082",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250082" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250082",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week1_box_3_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250083",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250083" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250083",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week1_box_4_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250084",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250084" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250084",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week1_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week1_box_5_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        { "code": 42, "name": "打印一个行为Log", "group": 1, "parameters": "${$key_rewardId}" },
      ],
    },
    {
      "id": 2211,
      "name": "第二周_积分宝箱_领取",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250085" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250086" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250087" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250088" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250089" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250085",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250085" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250085",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week2_box_1_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250086",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250086" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250086",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week2_box_2_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250087",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250087" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250087",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week2_box_3_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250088",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250088" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250088",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week2_box_4_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250089",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250089" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250089",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week2_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week2_box_5_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        { "code": 42, "name": "打印一个行为Log", "group": 1, "parameters": "${$key_rewardId}" },
      ],
    },
    {
      "id": 2212,
      "name": "第三周_积分宝箱_领取",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250090" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250091" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250092" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250093" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250094" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-19 00:00:00;2024-09-27 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250090",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250090" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250090",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week3_box_1_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250091",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250091" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250091",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week3_box_2_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250092",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250092" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250092",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week3_box_3_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250093",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250093" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250093",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week3_box_4_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250094",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250094" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250094",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week3_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_anniversary_week3_box_5_flag;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        { "code": 42, "name": "打印一个行为Log", "group": 1, "parameters": "${$key_rewardId}" },
      ],
    },
    {
      "id": 2213,
      "name": "第四周_积分宝箱_领取",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250095" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250096" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250097" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250098" },
        { "code": 58, "name": "请求奖励或预览奖励(指定ID)", "group": 1, "parameters": "1;250099" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250095",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_1_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250096",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_2_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250097",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_3_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250098",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_4_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 2",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_rewardId;==;250099",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$3th_anniversary_week4_box_5_flag;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 30,
          "name": "打印一个Log 带参数",
          "group": 1,
          "parameters":
            "----------------------------------key_rewardId--------${$key_rewardId}-------------------",
        },
      ],
    },
    {
      "id": 2236,
      "name": "集画换好礼_5",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "44" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-13 00:00:00;2024-09-20 00:00:00",
        },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "212025;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "212026;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "212027;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "212028;1" },
      ],
      "actions": [
        {
          "code": 46,
          "name": "物品兑换",
          "group": 1,
          "parameters": "212025,1|212026,1|212027,1|212028,1;2;250151",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_avviversary_paint_abcd_count;<;$3th_avviversary_paint_abcd_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_week1_score_count;+;550",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_avviversary_paint_abcd_count;<;$3th_avviversary_paint_abcd_count_max",
              },
            ],
            "onMatch": [
              {
                "code": 9,
                "name": "修改变量为具体值",
                "group": 1,
                "parameters": "$3th_avviversary_paint_abcd_count;+;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${$3th_avviversary_paint_abcd_count}",
        },
      ],
    },
    {
      "id": 2243,
      "name": "蛋糕BOSS-进度条",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$3th_anniversary_cake_boss_count;800;true;2",
        },
      ],
    },
    {
      "id": 2244,
      "name": "蛋糕BOSS-召唤",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9400;9401;9402" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-01 00:00:00;2024-09-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$3th_anniversary_cake_boss_count;+;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$3th_anniversary_cake_boss_count;==;800",
              },
            ],
            "onMatch": [{ "code": 38, "name": "这个BOSS是一个及其特殊的世界BOSS", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$3th_anniversary_cake_boss_count;800;false;2",
        },
      ],
    },
    {
      "id": 2246,
      "name": "红包_购买1次红包礼包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_redpacket_buy_time_count;<;$3th_anniversary_redpacket_buy_time_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2247,
      "name": "红包_在红包中抢到XX金币",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 52, "name": "红包领取触发", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 81, "name": "验证领取红包的大小", "group": 1, "parameters": "true;>=;500" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_redpacket_get_more_money_number;<;$3th_anniversary_redpacket_get_more_money_number_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2248,
      "name": "红包_抢到红包XX次 ",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 52, "name": "红包领取触发", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 81, "name": "验证领取红包的大小", "group": 1, "parameters": "true;>=;1" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters":
                  "$3th_anniversary_redpacket_get_money_count;<;$3th_anniversary_redpacket_get_money_count_max",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 2", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2249,
      "name": "红包_4.99礼包红包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_1" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;750;8;1440;152842;1;750",
        },
      ],
    },
    {
      "id": 2250,
      "name": "红包_9.99红包礼包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_2" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;1500;10;1440;152842;1;1500",
        },
      ],
    },
    {
      "id": 2251,
      "name": "红包_19.99红包礼包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_3" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;2400;15;1440;152842;1;2400",
        },
      ],
    },
    {
      "id": 2252,
      "name": "红包_49.99红包礼包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_4" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;6000;20;1440;152842;1;6000",
        },
      ],
    },
    {
      "id": 2253,
      "name": "红包_99.99红包礼包",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 56, "name": "购买任意礼包成功", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-09-26 00:00:00;2024-10-04 00:00:00",
        },
        { "code": 104, "name": "验证购买礼包的档次", "group": 1, "parameters": "gold_5" },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "0;0;12000;30;1440;152842;1;12000",
        },
      ],
    },
    {
      "id": 1359,
      "name": "冰龙世界BOSS",
      "state": 2,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900705;900706;900707;900708;900709;900710;900711;900712;900713;900714;900715;900716;900717;900718;900719;900720;900721;900722;900723;900724;900725;900726;900727;900728;900729;900730;900731;900732;900733;900734",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-21 00:00:00;2024-11-11 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;<;500",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;+;100",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$worldboss_icedragon_count;==;500",
              },
            ],
            "onMatch": [
              { "code": 60, "name": "这个BOSS是一个及其特殊的世界BOSS(3Special)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;500;false;1",
        },
      ],
    },
    {
      "id": 1373,
      "name": "冰龙-怪物进度条显示",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-08-21 00:00:00;2024-11-11 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;500;true;1",
        },
      ],
    },
    {
      "id": 1901,
      "name": "冰龙世界BOSS cp",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;+;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$worldboss_icedragon_count;==;1",
              },
            ],
            "onMatch": [{ "code": 38, "name": "这个BOSS是一个及其特殊的世界BOSS", "group": 1 }],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$worldboss_icedragon_count;1;false;1",
        },
      ],
    },
    {
      "id": 1419,
      "name": "冰龙-野怪刷新规则_1",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9400" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900705;15;5;100",
        },
      ],
    },
    {
      "id": 1420,
      "name": "冰龙-野怪刷新规则_2",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9401" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900706;15;5;100",
        },
      ],
    },
    {
      "id": 1421,
      "name": "冰龙-野怪刷新规则_3",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9402" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900707;15;5;100",
        },
      ],
    },
    {
      "id": 1422,
      "name": "冰龙-野怪刷新规则_4",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9403" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900708;15;5;100",
        },
      ],
    },
    {
      "id": 1423,
      "name": "冰龙-野怪刷新规则_5",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9404" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900709;15;5;100",
        },
      ],
    },
    {
      "id": 1424,
      "name": "冰龙-野怪刷新规则_6",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9405" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900710;15;5;100",
        },
      ],
    },
    {
      "id": 1425,
      "name": "冰龙-野怪刷新规则_7",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9406" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900711;15;5;100",
        },
      ],
    },
    {
      "id": 1426,
      "name": "冰龙-野怪刷新规则_8",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9407" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900712;15;5;100",
        },
      ],
    },
    {
      "id": 1427,
      "name": "冰龙-野怪刷新规则_9",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9408" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900713;15;5;100",
        },
      ],
    },
    {
      "id": 1428,
      "name": "冰龙-野怪刷新规则_10",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9409" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900714;15;5;100",
        },
      ],
    },
    {
      "id": 1429,
      "name": "冰龙-野怪刷新规则_11",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9410" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900715;15;5;100",
        },
      ],
    },
    {
      "id": 1430,
      "name": "冰龙-野怪刷新规则_12",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9411" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900716;15;5;100",
        },
      ],
    },
    {
      "id": 1431,
      "name": "冰龙-野怪刷新规则_13",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9412" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900717;15;5;100",
        },
      ],
    },
    {
      "id": 1432,
      "name": "冰龙-野怪刷新规则_14",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9413" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900718;15;5;100",
        },
      ],
    },
    {
      "id": 1433,
      "name": "冰龙-野怪刷新规则_15",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9414" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900719;15;5;100",
        },
      ],
    },
    {
      "id": 1436,
      "name": "冰龙-野怪刷新规则_16",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9415" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900720;15;5;100",
        },
      ],
    },
    {
      "id": 1437,
      "name": "冰龙-野怪刷新规则_17",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9416" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900721;15;5;100",
        },
      ],
    },
    {
      "id": 1438,
      "name": "冰龙-野怪刷新规则_18",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9417" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900722;15;5;100",
        },
      ],
    },
    {
      "id": 1439,
      "name": "冰龙-野怪刷新规则_19",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9418" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900723;15;5;100",
        },
      ],
    },
    {
      "id": 1440,
      "name": "冰龙-野怪刷新规则_20",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9419" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900724;15;5;100",
        },
      ],
    },
    {
      "id": 1441,
      "name": "冰龙-野怪刷新规则_21",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9420" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900725;15;5;100",
        },
      ],
    },
    {
      "id": 1442,
      "name": "冰龙-野怪刷新规则_22",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9421" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900726;15;5;100",
        },
      ],
    },
    {
      "id": 1443,
      "name": "冰龙-野怪刷新规则_23",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9422" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900727;15;5;100",
        },
      ],
    },
    {
      "id": 1444,
      "name": "冰龙-野怪刷新规则_24",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9423" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900728;15;5;100",
        },
      ],
    },
    {
      "id": 1445,
      "name": "冰龙-野怪刷新规则_25",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9424" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900729;15;5;100",
        },
      ],
    },
    {
      "id": 1446,
      "name": "冰龙-野怪刷新规则_26",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9425" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900730;15;5;100",
        },
      ],
    },
    {
      "id": 1447,
      "name": "冰龙-野怪刷新规则_27",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9426" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900731;15;5;100",
        },
      ],
    },
    {
      "id": 1448,
      "name": "冰龙-野怪刷新规则_28",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9427" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900732;15;5;100",
        },
      ],
    },
    {
      "id": 1450,
      "name": "冰龙-野怪刷新规则_29",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9428" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900733;15;5;100",
        },
      ],
    },
    {
      "id": 1451,
      "name": "冰龙-野怪刷新规则_30",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "9429" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900734;15;5;100",
        },
      ],
    },
    {
      "id": 1460,
      "name": "冰龙-击杀活动怪",
      "state": 0,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900705;900706;900707;900708;900709;900710;900711;900712;900713;900714;900715;900716;900717;900718;900719;900720;900721;900722;900723;900724;900725;900726;900727;900728;900729;900730;900731;900732;900733;900734",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2013-05-06 00:00:00;2024-07-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${trigger_icedragon_boss}${monster_id}",
        },
      ],
    },
    {
      "id": 1952,
      "name": "军魂_丰收时代",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;600" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-06-13 02:00:00;2024-07-25 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-5000" },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;600;100",
        },
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "101003" },
      ],
    },
    {
      "id": 1728,
      "name": "军魂-进度条",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-06-13 02:00:00;2024-07-25 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-5000" },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$activity_troops_count;500;true;1",
        },
      ],
    },
    {
      "id": 1734,
      "name": "军魂_杀怪计数",
      "state": 0,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900736;900737;900738;900739;900740;900741;900742;900743;900744;900745;900746;900747;900748;900749;900750;900751;900752;900753;900754;900755;900756;900757;900758;900759;900760;900761;900762;900763;900764;900765",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-06-13 02:00:00;2024-07-25 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-5000" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$activity_troops_count;+;1",
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$activity_troops_count;500;false;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$activity_troops_count;==;500",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 9,
                      "name": "时间区间",
                      "group": 1,
                      "parameters": "2024-07-19 00:00:00;2024-07-19 23:59:59",
                    },
                  ],
                  "onMatch": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
                  "otherwise": [
                    {
                      "code": 58,
                      "name": "添加作用于整个服的作用号(持续到当天24点)",
                      "group": 1,
                      "parameters": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;100",
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
    {
      "id": 541,
      "name": "CN活动中心-微博",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "51" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-20 02:00:00;2024-01-29 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$cn_activity_panel_weibo",
        },
      ],
    },
    {
      "id": 542,
      "name": "CN分享发奖-微信",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall_weixin" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-20 02:00:00;2024-01-29 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$cn_activity_panel_wechat;<;1",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$cn_activity_panel_wechat;+;1",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11932" },
      ],
    },
    {
      "id": 550,
      "name": "CN分享发奖-微博",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall_weibo" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-20 02:00:00;2024-01-29 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$cn_activity_panel_weibo;<;1",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$cn_activity_panel_weibo;+;1",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11932" },
      ],
    },
    {
      "id": 552,
      "name": "CN活动中心-微信",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "52" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-20 02:00:00;2024-01-29 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$cn_activity_panel_wechat",
        },
      ],
    },
    {
      "id": 882,
      "name": "TW/HK/KR活动中心",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "50" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-14 02:00:00;2024-04-01 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$thk_share",
        },
      ],
    },
    {
      "id": 883,
      "name": "TW/HK/KR活动中心分享发奖",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-14 02:00:00;2024-04-01 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$thk_share;<;1",
        },
      ],
      "actions": [
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$thk_share;+;1" },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11932" },
      ],
    },
    {
      "id": 429,
      "name": "KR活动中心",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "50" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-01 00:00:00;2024-03-10 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$KR_activity_pannel;<;1",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$KR_activity_pannel",
        },
      ],
    },
    {
      "id": 430,
      "name": "KR分享发奖",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-01 00:00:00;2024-03-10 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$KR_activity_pannel;<;1",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$KR_activity_pannel;+;1",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11886" },
      ],
    },
    {
      "id": 431,
      "name": "HKTW活动中心",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "50" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-01 00:00:00;2024-03-10 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$HKTW_activity_pannel",
        },
      ],
    },
    {
      "id": 432,
      "name": "HKTW分享发奖",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-03-01 00:00:00;2024-03-10 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$HKTW_activity_pannel;<;1",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$HKTW_activity_pannel;+;1",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11886" },
      ],
    },
    {
      "id": 439,
      "name": "MO活动中心",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "50" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-22 02:00:00;2024-01-01 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 43,
          "name": "给客户端返回活动中心的请求的时间消息",
          "group": 1,
          "parameters": "$MO_activity_pannel",
        },
      ],
    },
    {
      "id": 440,
      "name": "MO分享发奖",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "recall" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-22 02:00:00;2024-01-01 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$MO_activity_pannel;<;1",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$MO_activity_pannel;+;1",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11886" },
      ],
    },
    {
      "id": 421,
      "name": "许愿签使用",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "46" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-20 02:00:00;2024-01-03 23:59:59",
        },
      ],
      "actions": [
        {
          "code": 36,
          "name": "许愿树活动执行,匹配消耗物品，添加数据库记录",
          "group": 1,
          "parameters": "211197;1",
        },
      ],
    },
    {
      "id": 423,
      "name": "首次许愿客户端分享",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 47, "name": "客户端分享成功", "group": 1, "parameters": "wishing" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-20 02:00:00;2024-01-03 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$wish_share;<;1",
        },
      ],
      "actions": [
        { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$wish_share;1" },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11879" },
      ],
    },
    {
      "id": 424,
      "name": "扔雪球",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "45" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-20 02:00:00;2024-09-09 00:00:00",
        },
        {
          "code": 73,
          "name": "验证要消耗的物品ID，并删除通过验证",
          "group": 1,
          "parameters": "211218;1",
        },
      ],
      "actions": [
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "505589;86400",
        },
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "505601;3600",
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;10" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;151460;SNOWMAN_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;30" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;151461;SNOWMAN_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;60" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;151462;SNOWMAN_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;60" },
            ],
            "onMatch": [
              {
                "code": 33,
                "name": "添加状态status,持续时间不填默认读表",
                "group": 1,
                "parameters": "505607;3600",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;10" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11895" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;30" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11894" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505589;60" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11893" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
      ],
    },
    {
      "id": 425,
      "name": "界面怪物进度条显示",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-05 00:00:00;2024-01-06 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$kill_monster;1;true",
        },
      ],
    },
    {
      "id": 426,
      "name": "双旦世界boss出现逻辑",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 48, "name": "击杀普通的放置世界BOSS", "group": 1, "parameters": "900633" },
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900600;900601;900602;900603;900604;900605;900606;900607;900608;900609;900610;900611;900612;900613;900614;900615;900616;900617;900618;900619;900620;900621;900622;900623;900624;900625;900626;900627;900628;900629;900630;900631;900632;900634",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-05 00:00:00;2024-01-06 00:00:00",
        },
      ],
      "actions": [
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$kill_monster;+;1" },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$kill_monster;==;1",
              },
            ],
            "onMatch": [{ "code": 38, "name": "这个BOSS是一个及其特殊的世界BOSS", "group": 1 }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$kill_monster;80;false;1",
        },
      ],
    },
    {
      "id": 428,
      "name": "许愿最终发奖",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2024-01-06 02:00:00;2024-01-13 02:00:00",
        },
        { "code": 74, "name": "验证许愿树是否领奖", "group": 1 },
      ],
      "actions": [{ "code": 37, "name": "许愿树活动执行发送奖励", "group": 1 }],
    },
    {
      "id": 434,
      "name": "击杀放置boss与活动怪计数",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 48, "name": "击杀普通的放置世界BOSS", "group": 1, "parameters": "900633" },
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "900600;900601;900602;900603;900604;900605;900606;900607;900608;900609;900610;900611;900612;900613;900614;900615;900616;900617;900618;900619;900620;900621;900622;900623;900624;900625;900626;900627;900628;900629;900630;900631;900632;900634",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间(具体日期)",
          "group": 1,
          "parameters": "2016-12-20 02:00:00;2024-01-03 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${trigger_xmas_boss}${monster_id}",
        },
      ],
    },
    {
      "id": 656,
      "name": "合服后的丰收时代",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;600" }],
      "conditions": [
        { "code": 90, "name": "合服时间限制(小时)", "group": 1, "parameters": "<=;120" },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;600;100",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_WHOLE_WORLD_COLLECT_SPEED_SKILl;600;30",
        },
      ],
    },
    {
      "id": 1203,
      "name": "合服打怪掉落双倍 cp",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;1" }],
      "conditions": [{ "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_MONSTER_FIGHT_REWARD;600;100",
        },
      ],
    },
    {
      "id": 748,
      "name": "合服打怪掉落双倍",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;600" }],
      "conditions": [
        { "code": 90, "name": "合服时间限制(小时)", "group": 1, "parameters": ">=;24" },
        { "code": 90, "name": "合服时间限制(小时)", "group": 1, "parameters": "<=;120" },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_MONSTER_FIGHT_REWARD;600;100",
        },
      ],
    },
    {
      "id": 749,
      "name": "合服签到奖励双倍",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;600" }],
      "conditions": [
        { "code": 90, "name": "合服时间限制(小时)", "group": 1, "parameters": "<=;168" },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_SIGN_IN;600;100",
        },
      ],
    },
    {
      "id": 650,
      "name": "祈祷-花束",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211429" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 04:00:00;2024-02-28 04:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$flower;<;500",
        },
      ],
      "actions": [
        { "code": 57, "name": "修改变量为使用物品的数量", "group": 1, "parameters": "$flower;+" },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;1",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower1;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11982" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;1",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower1;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;10",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower10;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11983" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;10",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower10;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;50",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower50;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11984" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;50",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower50;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;100",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower100;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11985" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;100",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower100;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;200",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower200;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11986" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;200",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower200;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;350",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower350;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11987" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;350",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower350;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed_max;==;0",
                    },
                  ],
                  "onMatch": [
                    {
                      "code": 24,
                      "name": "给整数变量赋值",
                      "group": 1,
                      "parameters": "$flower_max;1",
                    },
                  ],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_bleed;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11989" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;500",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower_bleed;1" },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 651,
      "name": "献祭-鲜血",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211430" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 04:00:00;2024-02-28 04:00:00",
        },
        { "code": 7, "name": "数值的比较(变量 vs 数值)", "group": 1, "parameters": "$bleed;<;500" },
      ],
      "actions": [
        { "code": 57, "name": "修改变量为使用物品的数量", "group": 1, "parameters": "$bleed;+" },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;1",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed1;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11974" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;1",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed1;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;10",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed10;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11975" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;10",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed10;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;50",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed50;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11976" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;50",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed50;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;100",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed100;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11977" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;100",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed100;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;200",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed200;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11978" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;200",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed200;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;350",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$bleed350;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11979" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;350",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$bleed350;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_max;==;0",
                    },
                  ],
                  "onMatch": [
                    {
                      "code": 24,
                      "name": "给整数变量赋值",
                      "group": 1,
                      "parameters": "$bleed_max;1",
                    },
                  ],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_bleed;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11981" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;500",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower_bleed;1" },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 652,
      "name": "最终获奖",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211429" },
        { "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211430" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 10:00:00;2024-02-28 10:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$flower_bleed;==;0",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_bleed;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11989" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower;>=;500",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower_bleed;1" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_bleed;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11981" }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$bleed;>=;500",
              },
            ],
            "onMatch": [
              { "code": 24, "name": "给整数变量赋值", "group": 1, "parameters": "$flower_bleed;1" },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 655,
      "name": "杀野怪出邪神16-30",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 04:00:00;2024-02-28 04:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;60;900701;100;5;100",
        },
      ],
    },
    {
      "id": 660,
      "name": "W-祈祷-花束",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211429" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-13 08:00:00;2024-02-28 08:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$blood_count;<;500",
        },
      ],
      "actions": [
        {
          "code": 57,
          "name": "修改变量为使用物品的数量",
          "group": 1,
          "parameters": "$blood_count;+",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;1",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;10",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;1",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;50",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;2",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;100",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;3",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;200",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;4",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;350",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$blood_rank;==;5",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 662,
      "name": "W-献祭-鲜血",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211430" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-13 08:00:00;2024-02-28 08:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$flower_count;<;500",
        },
      ],
      "actions": [
        {
          "code": 57,
          "name": "修改变量为使用物品的数量",
          "group": 1,
          "parameters": "$flower_count;+",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;1",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;10",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;1",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;50",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;2",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;100",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;3",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;200",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;4",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;350",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_rank;==;5",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 663,
      "name": "W-最终唯一奖励",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211429" },
        { "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211430" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-13 08:00:00;2024-02-28 08:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$flower_blood;==;0",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$flower_count;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_blood;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$blood_count;>=;500",
              },
            ],
            "onMatch": [
              {
                "code": 41,
                "name": "if (",
                "group": 1,
                "branch": {
                  "conditions": [
                    {
                      "code": 7,
                      "name": "数值的比较(变量 vs 数值)",
                      "group": 1,
                      "parameters": "$flower_blood;==;0",
                    },
                  ],
                  "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
                  "otherwise": [],
                },
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 687,
      "name": "怪物打点",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 4, "name": "击杀怪物检查", "group": 1, "parameters": "900701" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 04:00:00;2024-02-28 04:00:00",
        },
      ],
      "actions": [
        {
          "code": 30,
          "name": "打印一个Log 带参数",
          "group": 1,
          "parameters": "${trigger_cantabra_monster}${monster_id}",
        },
      ],
    },
    {
      "id": 690,
      "name": "杀野怪出邪神1-15",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-21 04:00:00;2024-02-28 04:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900701;100;5;100",
        },
      ],
    },
    {
      "id": 2498,
      "name": "发送测试道具",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-01 02:00:00;2024-11-03 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$kingwar_testitem_sent;==;0",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": "==;30" },
            ],
            "onMatch": [
              { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250580" },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$kingwar_testitem_sent;+;1",
        },
      ],
    },
    {
      "id": 2500,
      "name": "正式_发送测试道具",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-11-08 00:00:00;2024-11-09 11:30:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-500" },
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;20" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$kingwar_testitem_sent_2;<;2",
        },
      ],
      "actions": [
        { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250580" },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$kingwar_testitem_sent_2;+;1",
        },
      ],
    },
    {
      "id": 2510,
      "name": "正式_发送测试道具 8小时行军",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-11-01 02:00:00;2024-11-07 12:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-80" },
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;20" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$kingwar_testitem_sent_1;<;2",
        },
      ],
      "actions": [
        { "code": 48, "name": "触发reward奖励", "group": 1, "parameters": "250580" },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$kingwar_testitem_sent_1;+;1",
        },
      ],
    },
    {
      "id": 570,
      "name": "击杀1-15级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-14 02:00:00;2024-02-21 08:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900694;30;5;100",
        },
      ],
    },
    {
      "id": 571,
      "name": "击杀16-30级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-14 02:00:00;2024-02-21 08:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;70;900695;30;5;100",
        },
      ],
    },
    {
      "id": 572,
      "name": "获得名牌公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "211390" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-14 08:00:00;2024-02-21 08:00:00",
        },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(2个参)",
          "group": 1,
          "parameters": "152093;NOTICE_TYPE_USER;0;NOTICE_TYPE_ITEM;1",
        },
      ],
    },
    {
      "id": 587,
      "name": "送爱意",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "45" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-02-14 02:00:00;2024-02-21 08:00:00",
        },
        {
          "code": 73,
          "name": "验证要消耗的物品ID，并删除通过验证",
          "group": 1,
          "parameters": "211427;1",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$use_item211427;<;200",
        },
      ],
      "actions": [
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$use_item211427;+;1" },
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "505679;86400",
        },
        {
          "code": 33,
          "name": "添加状态status,持续时间不填默认读表",
          "group": 1,
          "parameters": "505678;3600",
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;10" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;152097;LOVE_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;30" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;152098;LOVE_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;50" },
            ],
            "onMatch": [
              {
                "code": 39,
                "name": "离线推送",
                "group": 1,
                "parameters": "ACTIVITY;152099;LOVE_PUSH",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;50" },
            ],
            "onMatch": [
              {
                "code": 33,
                "name": "添加状态status,持续时间不填默认读表",
                "group": 1,
                "parameters": "500527;3600",
              },
            ],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;50" },
            ],
            "onMatch": [
              {
                "code": 45,
                "name": "世界滚屏公告(2个参)",
                "group": 1,
                "parameters": "152110;NOTICE_TYPE_USER;0;NOTICE_TYPE_TARGET_USER;1",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;10" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11955" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;30" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11956" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 13,
          "name": "If Else",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 72, "name": "验证status叠加层数", "group": 1, "parameters": "505679;50" },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11957" }],
            "otherwise": [{ "code": 27, "name": "Do Nothing", "group": 1 }],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item211427;==;50",
              },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11958" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item211427;==;100",
              },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11959" }],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item211427;==;200",
              },
            ],
            "onMatch": [{ "code": 4, "name": "发送邮件", "group": 1, "parameters": "11960" }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 1844,
      "name": "斋月-城内收集",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 21, "name": "收获资源", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-06-14 00:00:00;2024-06-27 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$activity_ramadan_count;+;1",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$activity_ramadan_count;>;2",
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2560,
      "name": "新玩家活动_第一天_大本",
      "state": 0,
      "openType": 2,
      "events": [],
      "conditions": [],
      "actions": [],
    },
    {
      "id": 2561,
      "name": "新玩家活动_第一天_消灭野怪",
      "state": 1,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters":
            "9400;9401;9402;9403;9404;9405;9406;9407;9408;9409;9410;9411;9412;9413;9414;9415;9416;9417;9418;9419;9420;9421;9422;9423;9424;9425;9426;9427;9428;9429",
        },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180002_process;<;$newbie_180002_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180002_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180002_process;$newbie_180002_reward;$newbie_180002_max;1;update",
        },
      ],
    },
    {
      "id": 2564,
      "name": "新玩家活动_推送变量",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 89, "name": "客户端完成登录所有加载事件", "group": 1 },
        { "code": 51, "name": "客户端请求变量", "group": 2, "parameters": "53;2" },
      ],
      "conditions": [{ "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" }],
      "actions": [
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters":
            "$newbie_180000_process;$newbie_180000_reward;$newbie_180001_process;$newbie_180001_reward;$newbie_180002_process;$newbie_180002_reward;$newbie_180003_process;$newbie_180003_reward;$newbie_180004_process;$newbie_180004_reward;$newbie_180005_process;$newbie_180005_reward;$newbie_180006_process;$newbie_180006_reward;$newbie_180007_process;$newbie_180007_reward;$newbie_180008_process;$newbie_180008_reward;$newbie_180009_process;$newbie_180009_reward;$newbie_180010_process;$newbie_180010_reward;$newbie_180011_process;$newbie_180012_process;$newbie_180012_reward;$newbie_180013_process;$newbie_180013_reward;$newbie_180014_process;$newbie_180014_reward;$newbie_180015_process;$newbie_180015_reward;$newbie_180016_process;$newbie_180016_reward;$newbie_180017_process;$newbie_180017_reward;$newbie_180018_process;$newbie_180018_reward;$newbie_180019_process;$newbie_180019_reward;$newbie_180020_process;$newbie_180020_reward;$newbie_180021_process;$newbie_180021_reward;$newbie_180022_process;$newbie_180022_reward;$newbie_180023_process;$newbie_180023_reward;$newbie_180024_process;$newbie_180024_reward;$newbie_180025_process;$newbie_180025_reward;$newbie_180026_process;$newbie_180026_reward;$newbie_180027_process;$newbie_180027_reward;$newbie_180028_process;$newbie_180028_reward;$newbie_180029_process;$newbie_180029_reward;$newbie_180030_process;$newbie_180030_reward;$newbie_180031_process;$newbie_180031_reward;$newbie_180032_process;$newbie_180032_reward;$newbie_register_starttime;$newbie_180000_max;$newbie_180001_max;$newbie_180002_max;$newbie_180003_max;$newbie_180004_max;$newbie_180005_max;$newbie_180006_max;$newbie_180007_max;$newbie_180008_max;$newbie_180010_max;$newbie_180009_max;$newbie_180011_max;$newbie_180011_reward;$newbie_180012_max;$newbie_180013_max;$newbie_180014_max;$newbie_180015_max;$newbie_180017_max;$newbie_180016_max;$newbie_180018_max;$newbie_180019_max;$newbie_180020_max;$newbie_180021_max;$newbie_180022_max;$newbie_180023_max;$newbie_180024_max;$newbie_180025_max;$newbie_180026_max;$newbie_180027_max;$newbie_180029_max;$newbie_180028_max;$newbie_180030_max;$newbie_180031_max;$newbie_180032_max;1;info",
        },
      ],
    },
    {
      "id": 2572,
      "name": "新玩家活动_第一天_造兵",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 12, "name": "点击造兵", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180003_process;<;$newbie_180003_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180003_process;+;$key_soilder_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180003_process;$newbie_180003_max;$newbie_180003_reward;1;update",
        },
      ],
    },
    {
      "id": 2573,
      "name": "新玩家活动_开启活动",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 16, "name": "建造完成(指定建筑类型、等级)", "group": 1, "parameters": "400;6" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;==;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 62,
          "name": "变量赋值为当前时间",
          "group": 1,
          "parameters": "$newbie_register_starttime",
        },
      ],
    },
    {
      "id": 2576,
      "name": "新玩家活动_领奖",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件（无参）", "group": 1, "parameters": "54" }],
      "conditions": [
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;6" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_got_finial_reward;==;0",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180000",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180000_process;>=;$newbie_180000_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180000_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2577,
      "name": "新玩家活动_第一天_大本升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 16, "name": "建造完成(指定建筑类型)", "group": 1, "parameters": "400" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180001_process;<;$newbie_180001_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180001_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180001_process;$newbie_180001_reward;$newbie_180001_max;1;update",
        },
      ],
    },
    {
      "id": 2579,
      "name": "新玩家活动_第一天_领时间礼包",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 74, "name": "领取时间礼包", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180004_process;<;$newbie_180004_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180004_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180004_process;$newbie_180004_reward;$newbie_180004_max;1;update",
        },
      ],
    },
    {
      "id": 2580,
      "name": "新玩家活动_第一天_加入联盟",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 76, "name": "加入联盟", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180005_process;<;$newbie_180005_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180005_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180005_process;$newbie_180005_reward;$newbie_180005_max;1;update",
        },
      ],
    },
    {
      "id": 2581,
      "name": "新玩家活动_第二天_登录",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180006_process;<;$newbie_180006_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180006_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180006_process;$newbie_180006_reward;$newbie_180006_max;1;update",
        },
      ],
    },
    {
      "id": 2582,
      "name": "新玩家活动_第二天_大本升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 16, "name": "建造完成(指定建筑类型)", "group": 1, "parameters": "400" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180007_process;<;$newbie_180007_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180007_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180007_process;$newbie_180007_reward;$newbie_180007_max;1;update",
        },
      ],
    },
    {
      "id": 2583,
      "name": "新玩家活动_第二天_许愿",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 11, "name": "许愿", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180008_process;<;$newbie_180008_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180008_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180008_process;$newbie_180008_reward;$newbie_180008_max;1;update",
        },
      ],
    },
    {
      "id": 2584,
      "name": "新玩家活动_第二天_采集资源",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 55, "name": "世界采集", "group": 1, "parameters": "0;1" },
        { "code": 55, "name": "世界采集", "group": 1, "parameters": "3;1" },
        { "code": 55, "name": "世界采集", "group": 1, "parameters": "2;1" },
        { "code": 55, "name": "世界采集", "group": 1, "parameters": "1;1" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180009_process;<;$newbie_180009_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180009_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180009_process;$newbie_180009_reward;$newbie_180009_max;1;update",
        },
      ],
    },
    {
      "id": 2585,
      "name": "新玩家活动_第二天_拥有好友",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 88, "name": "添加好友成功", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180010_process;<;$newbie_180010_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180010_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180010_process;$newbie_180010_reward;$newbie_180010_max;1;update",
        },
      ],
    },
    {
      "id": 2586,
      "name": "新玩家活动_第二天_科技研究",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 17, "name": "点击升级科技", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180011_process;<;$newbie_180011_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180011_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180011_process;$newbie_180011_max;$newbie_180011_reward;1;update",
        },
      ],
    },
    {
      "id": 2587,
      "name": "新玩家活动_第二天_联盟捐献",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 77, "name": "联盟科技捐献", "group": 1 }],
      "conditions": [
        { "code": 86, "name": "加入联盟时间(小时)", "group": 1, "parameters": ">;0" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180012_process;<;$newbie_180012_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180012_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180012_process;$newbie_180012_reward;$newbie_180012_max;1;update",
        },
      ],
    },
    {
      "id": 2588,
      "name": "新玩家活动_第三天_登录",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180013_process;<;$newbie_180013_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180013_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180013_process;$newbie_180013_reward;$newbie_180013_max;1;update",
        },
      ],
    },
    {
      "id": 2589,
      "name": "新玩家活动_第三天_大本升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 16, "name": "建造完成(指定建筑类型)", "group": 1, "parameters": "400" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180014_process;<;$newbie_180014_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180014_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180014_process;$newbie_180014_reward;$newbie_180014_max;1;update",
        },
      ],
    },
    {
      "id": 2590,
      "name": "新玩家活动_第三天_锻造装备",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 78, "name": "领取锻造装备", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180015_process;<;$newbie_180015_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180015_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180015_process;$newbie_180015_reward;$newbie_180015_max;1;update",
        },
      ],
    },
    {
      "id": 2591,
      "name": "新玩家活动_第三天_治疗伤兵",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 19, "name": "点击恢复伤兵", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180016_process;<;$newbie_180016_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180016_process;+;$key_soilder_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180016_process;$newbie_180016_reward;$newbie_180016_max;1;update",
        },
      ],
    },
    {
      "id": 2592,
      "name": "新玩家活动_第三天_联盟宝藏",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 86, "name": "挖掘联盟宝藏", "group": 1 }],
      "conditions": [
        { "code": 87, "name": "联盟创建时间(小时)", "group": 1, "parameters": ">;0" },
        { "code": 86, "name": "加入联盟时间(小时)", "group": 1, "parameters": ">;23" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180017_process;<;$newbie_180017_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180017_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180017_process;$newbie_180017_reward;$newbie_180017_max;1;update",
        },
      ],
    },
    {
      "id": 2593,
      "name": "新玩家活动_第三天_探索遗迹",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 63, "name": "探索遗迹（无需类型）", "group": 1, "parameters": "false" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180018_process;<;$newbie_180018_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180018_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180018_process;$newbie_180018_reward;$newbie_180018_max;1;update",
        },
      ],
    },
    {
      "id": 2594,
      "name": "新玩家活动_第三天_累积充值",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 79, "name": "充值金币", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180019_process;<;$newbie_180019_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180019_process;+;$key_buy_gold_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180019_process;$newbie_180019_reward;$newbie_180019_max;1;update",
        },
      ],
    },
    {
      "id": 2595,
      "name": "新玩家活动_第四天_登录",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180020_process;<;$newbie_180020_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180020_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180020_process;$newbie_180020_reward;$newbie_180020_max;1;update",
        },
      ],
    },
    {
      "id": 2596,
      "name": "新玩家活动_第四天_大本升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 16, "name": "建造完成(指定建筑类型)", "group": 1, "parameters": "400" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180021_process;<;$newbie_180021_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180021_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180021_process;$newbie_180021_reward;$newbie_180021_max;1;update",
        },
      ],
    },
    {
      "id": 2597,
      "name": "新玩家活动_第四天_联盟商店购买",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 80, "name": "从联盟商店购买到玩家背包", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180022_process;<;$newbie_180022_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180022_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180022_process;$newbie_180022_reward;$newbie_180022_max;1;update",
        },
      ],
    },
    {
      "id": 2598,
      "name": "新玩家活动_第四天_龙升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 81, "name": "龙升级", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$key_pet_dragon_level;>=;10",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180023_process;<;$newbie_180023_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180023_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180023_process;$newbie_180023_reward;$newbie_180023_max;1;update",
        },
      ],
    },
    {
      "id": 2599,
      "name": "新玩家活动_第四天_收集资源",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 21, "name": "收获资源", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180024_process;<;$newbie_180024_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180024_process;+;$resource_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180024_process;$newbie_180024_reward;$newbie_180024_max;1;update",
        },
      ],
    },
    {
      "id": 2600,
      "name": "新玩家活动_第四天_龙游历",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 82, "name": "龙游历", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180025_process;<;$newbie_180025_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180025_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180025_process;$newbie_180025_reward;$newbie_180025_max;1;update",
        },
      ],
    },
    {
      "id": 2601,
      "name": "新玩家活动_第五天_登录",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180026_process;<;$newbie_180026_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180026_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180026_process;$newbie_180026_reward;$newbie_180026_max;1;update",
        },
      ],
    },
    {
      "id": 2602,
      "name": "新玩家活动_第五天_大本升级",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 16, "name": "建造完成(指定建筑类型)", "group": 1, "parameters": "400" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180027_process;<;$newbie_180027_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180027_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180027_process;$newbie_180027_reward;$newbie_180027_max;1;update",
        },
      ],
    },
    {
      "id": 2603,
      "name": "新玩家活动_第五天_帮助盟友",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 83, "name": "联盟帮助", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180028_process;<;$newbie_180028_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180028_process;+;$key_alliance_help_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180028_process;$newbie_180028_reward;$newbie_180028_max;1;update",
        },
      ],
    },
    {
      "id": 2604,
      "name": "新玩家活动_第五天_旅行商人",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 84, "name": "购买旅行商人", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180029_process;<;$newbie_180029_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180029_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180029_process;$newbie_180029_reward;$newbie_180029_max;1;update",
        },
      ],
    },
    {
      "id": 2605,
      "name": "新玩家活动_第五天_使用加速",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 85, "name": "使用加速道具", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180030_process;<;$newbie_180030_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180030_process;+;$key_itemNum",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180030_process;$newbie_180030_reward;$newbie_180030_max;1;update",
        },
      ],
    },
    {
      "id": 2606,
      "name": "新玩家活动_第五天_龙塔试炼",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 87, "name": "龙塔试炼", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180031_process;<;$newbie_180031_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180031_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180031_process;$newbie_180031_reward;$newbie_180031_max;1;update",
        },
      ],
    },
    {
      "id": 2607,
      "name": "新玩家活动_第五天_累积充值",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 79, "name": "充值金币", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180032_process;<;$newbie_180032_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为其他变量的值",
          "group": 1,
          "parameters": "$newbie_180032_process;+;$key_buy_gold_num",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180032_process;$newbie_180032_reward;$newbie_180032_max;1;update",
        },
      ],
    },
    {
      "id": 2608,
      "name": "新玩家活动_推送",
      "state": -1,
      "openType": 2,
      "events": [
        { "code": 89, "name": "客户端完成登录所有加载事件", "group": 1 },
        { "code": 51, "name": "客户端请求变量", "group": 2, "parameters": "53;2" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_got_finial_reward;==;0",
        },
      ],
      "actions": [
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters":
            "$newbie_180000_process;$newbie_180000_reward;$newbie_180001_process;$newbie_180001_reward;$newbie_180002_process;$newbie_180002_reward;$newbie_180003_process;$newbie_180003_reward;$newbie_180004_process;$newbie_180004_reward;$newbie_180005_process;$newbie_180005_reward;$newbie_180006_process;$newbie_180006_reward;$newbie_180007_process;$newbie_180007_reward;$newbie_180008_process;$newbie_180008_reward;$newbie_180009_process;$newbie_180009_reward;$newbie_180010_process;$newbie_180010_reward;$newbie_180011_process;$newbie_180012_process;$newbie_180012_reward;$newbie_180013_process;$newbie_180013_reward;$newbie_180014_process;$newbie_180014_reward;$newbie_180015_process;$newbie_180015_reward;$newbie_180016_process;$newbie_180016_reward;$newbie_180017_process;$newbie_180017_reward;$newbie_180018_process;$newbie_180018_reward;$newbie_180019_process;$newbie_180019_reward;$newbie_180020_process;$newbie_180020_reward;$newbie_180021_process;$newbie_180021_reward;$newbie_180022_process;$newbie_180022_reward;$newbie_180023_process;$newbie_180023_reward;$newbie_180024_process;$newbie_180024_reward;$newbie_180025_process;$newbie_180025_reward;$newbie_180026_process;$newbie_180026_reward;$newbie_180027_process;$newbie_180027_reward;$newbie_180028_process;$newbie_180028_reward;$newbie_180029_process;$newbie_180029_reward;$newbie_180030_process;$newbie_180030_reward;$newbie_180031_process;$newbie_180031_reward;$newbie_180032_process;$newbie_180032_reward;$newbie_register_starttime;$newbie_180000_max;$newbie_180001_max;$newbie_180002_max;$newbie_180003_max;$newbie_180004_max;$newbie_180005_max;$newbie_180006_max;$newbie_180007_max;$newbie_180008_max;$newbie_180010_max;$newbie_180009_max;$newbie_180011_max;$newbie_180011_reward;$newbie_180012_max;$newbie_180013_max;$newbie_180014_max;$newbie_180015_max;$newbie_180017_max;$newbie_180016_max;$newbie_180018_max;$newbie_180019_max;$newbie_180020_max;$newbie_180021_max;$newbie_180022_max;$newbie_180023_max;$newbie_180024_max;$newbie_180025_max;$newbie_180026_max;$newbie_180027_max;$newbie_180029_max;$newbie_180028_max;$newbie_180030_max;$newbie_180031_max;$newbie_180032_max;1;info",
        },
      ],
    },
    {
      "id": 2628,
      "name": "新玩家活动_第一天_登录领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180000" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180000",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180000_process;>=;$newbie_180000_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180000_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2629,
      "name": "新玩家活动_第一天_大本8级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180001" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180001",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180001_process;>=;$newbie_180001_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180001_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2630,
      "name": "新玩家活动_第一天_击杀野怪5次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180002" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180002",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180002_process;>=;$newbie_180002_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180002_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2631,
      "name": "新玩家活动_第一天_训练100士兵领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180003" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180003",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180003_process;>=;$newbie_180003_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180003_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2632,
      "name": "新玩家活动_第一天_领取时间礼包3次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180004" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180004",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180004_process;>=;$newbie_180004_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180004_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2633,
      "name": "新玩家活动_第一天_加入一个联盟领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180005" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180005",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180005_process;>=;$newbie_180005_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180005_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2634,
      "name": "新玩家活动_第二天_登录领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180006" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180006",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180006_process;>=;$newbie_180006_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180006_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2635,
      "name": "新玩家活动_第二天_大本等级10级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180007" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180007",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180007_process;>=;$newbie_180007_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180007_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2636,
      "name": "新玩家活动_第二天_许愿5次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180008" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180008",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180008_process;>=;$newbie_180008_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180008_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2637,
      "name": "新玩家活动_第二天_采集资源3次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180009" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180009",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180009_process;>=;$newbie_180009_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180009_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2638,
      "name": "新玩家活动_第二天_拥有5名好友领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180010" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180010",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180010_process;>=;$newbie_180010_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180010_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2639,
      "name": "新玩家活动_第二天_科技研究2次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180011" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180011",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180011_process;>=;$newbie_180011_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180011_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2640,
      "name": "新玩家活动_第二天_联盟捐献10次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180012" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180012",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180012_process;>=;$newbie_180012_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180012_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2641,
      "name": "新玩家活动_第三天_登录领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180013" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180013",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180013_process;>=;$newbie_180013_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180013_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2642,
      "name": "新玩家活动_第三天_大本等级12级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180014" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180014",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180014_process;>=;$newbie_180014_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180014_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2643,
      "name": "新玩家活动_第三天_锻造装备领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180015" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180015",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180015_process;>=;$newbie_180015_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180015_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2644,
      "name": "新玩家活动_第三天_治疗伤兵领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180016" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180016",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180016_process;>=;$newbie_180016_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180016_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2645,
      "name": "新玩家活动_第三天_开联盟宝藏领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180017" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180017",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180017_process;>=;$newbie_180017_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180017_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2646,
      "name": "新玩家活动_第三天_探索遗迹领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180018" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180018",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180018_process;>=;$newbie_180018_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180018_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2647,
      "name": "新玩家活动_第三天_累积充值3000金币领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180019" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180019",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180019_process;>=;$newbie_180019_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180019_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2648,
      "name": "新玩家活动_第四天_登录领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180020" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180020",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180020_process;>=;$newbie_180020_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180020_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2649,
      "name": "新玩家活动_第四天_大本等级14级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180021" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180021",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180021_process;>=;$newbie_180021_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180021_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2650,
      "name": "新玩家活动_第四天_联盟商店购买领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180022" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180022",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180022_process;>=;$newbie_180022_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180022_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2651,
      "name": "新玩家活动_第四天_龙等级10级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180023" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180023",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180023_process;>=;$newbie_180023_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180023_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2652,
      "name": "新玩家活动_第四天_收集资源领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180024" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180024",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180024_process;>=;$newbie_180024_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180024_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2653,
      "name": "新玩家活动_第四天_龙游历领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180025" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180025",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180025_process;>=;$newbie_180025_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180025_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2654,
      "name": "新玩家活动_第五天_登录领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180026" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180026",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180026_process;>=;$newbie_180026_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180026_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2655,
      "name": "新玩家活动_第五天_大本等级15级领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180027" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180027",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180027_process;>=;$newbie_180027_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180027_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2656,
      "name": "新玩家活动_第五天_帮助盟友10次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180028" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180028",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180028_process;>=;$newbie_180028_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180028_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2657,
      "name": "新玩家活动_第五天_旅行商人购买领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180029" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180029",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180029_process;>=;$newbie_180029_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180029_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2658,
      "name": "新玩家活动_第五天_使用加速道具5次领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180030" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180030",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180030_process;>=;$newbie_180030_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180030_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2659,
      "name": "新玩家活动_第五天_参加龙塔试炼领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180031" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180031",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180031_process;>=;$newbie_180031_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180031_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2660,
      "name": "新玩家活动_第五天_累积充值6000金币领奖",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 51, "name": "客户端请求事件（含参）", "group": 3, "parameters": "54;180032" },
      ],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 51,
                "name": "与 - 3",
                "group": 1,
                "conditions": [
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$key_client_event_var1;==;180032",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 变量)",
                    "group": 1,
                    "parameters": "$newbie_180032_process;>=;$newbie_180032_max",
                  },
                  {
                    "code": 7,
                    "name": "数值的比较(变量 vs 数值)",
                    "group": 1,
                    "parameters": "$newbie_180032_reward;==;0",
                  },
                ],
              },
            ],
            "onMatch": [{ "code": 21, "name": "执行多个操作 3", "group": 1 }],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2663,
      "name": "新玩家活动_活动结束",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        { "code": 13, "name": "主城等级(值)", "group": 1, "parameters": ">=;6" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_got_finial_reward;==;0",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$newbie_register_starttime;>;0",
        },
        {
          "code": 53,
          "name": "非",
          "group": 1,
          "conditions": [
            {
              "code": 110,
              "name": "变量最后一次刷新时间到现在是否在区间内",
              "group": 1,
              "parameters": "$newbie_register_starttime;7;1",
            },
          ],
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        { "code": 24, "name": "变量赋值", "group": 1, "parameters": "$newbie_got_finial_reward;1" },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180000_process;>=;$newbie_180000_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180001_process;>=;$newbie_180001_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180002_process;>=;$newbie_180002_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180003_process;>=;$newbie_180003_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180004_process;>=;$newbie_180004_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180005_process;>=;$newbie_180005_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180006_process;>=;$newbie_180006_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180007_process;>=;$newbie_180007_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180008_process;>=;$newbie_180008_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180009_process;>=;$newbie_180009_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180010_process;>=;$newbie_180010_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180011_process;>=;$newbie_180011_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180012_process;>=;$newbie_180012_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180013_process;>=;$newbie_180013_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180014_process;>=;$newbie_180014_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180015_process;>=;$newbie_180015_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180016_process;>=;$newbie_180016_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180017_process;>=;$newbie_180017_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180018_process;>=;$newbie_180018_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180019_process;>=;$newbie_180019_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180020_process;>=;$newbie_180020_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180021_process;>=;$newbie_180021_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180022_process;>=;$newbie_180022_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180023_process;>=;$newbie_180023_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180024_process;>=;$newbie_180024_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180025_process;>=;$newbie_180025_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180026_process;>=;$newbie_180026_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180027_process;>=;$newbie_180027_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180028_process;>=;$newbie_180028_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180029_process;>=;$newbie_180029_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180030_process;>=;$newbie_180030_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180031_process;>=;$newbie_180031_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 变量)",
                "group": 1,
                "parameters": "$newbie_180032_process;>=;$newbie_180032_max",
              },
            ],
            "onMatch": [
              {
                "code": 13,
                "name": "If Else",
                "group": 1,
                "branch": {
                  "conditions": [
                    { "code": 45, "name": "总付费金币", "group": 1, "parameters": ">;1" },
                  ],
                  "onMatch": [
                    {
                      "code": 14,
                      "name": "重复执行",
                      "group": 1,
                      "parameters": "3\n            \n          ",
                    },
                  ],
                  "otherwise": [
                    { "code": 4, "name": "发送邮件", "group": 1, "parameters": "12352" },
                  ],
                },
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2672,
      "name": "新玩家活动_第一天_登录领奖 cp",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件（无参）", "group": 1, "parameters": "54" }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$key_client_event_var1;==;180000",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "2132131" },
      ],
    },
    {
      "id": 2559,
      "name": "新玩家活动_第一天_登录",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        {
          "code": 7,
          "name": "数值的比较(变量 vs 变量)",
          "group": 1,
          "parameters": "$newbie_180000_process;<;$newbie_180000_max",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "ALL" },
      ],
      "actions": [
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$newbie_180000_process;+;1",
        },
        {
          "code": 29,
          "name": "给客户端推送一组变量",
          "group": 1,
          "parameters": "$newbie_180000_process;$newbie_180000_max;$newbie_180000_reward;1;info",
        },
      ],
    },
    {
      "id": 521,
      "name": "红包-全服公告（秒）",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "288;300" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-11 00:04:30;2024-01-16 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(1个参)",
          "group": 1,
          "parameters": "151751;NOTICE_TYPE_INT;30",
        },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151756;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 538,
      "name": "世界boss-创建350",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211319" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-01-23 23:59:59",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$use_item_server;<;350",
        },
      ],
      "actions": [
        {
          "code": 57,
          "name": "修改变量为使用物品的数量",
          "group": 1,
          "parameters": "$use_item_server;+",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item_server;>=;350",
              },
            ],
            "onMatch": [
              { "code": 52, "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$use_item_server;350;false;2",
        },
      ],
    },
    {
      "id": 539,
      "name": "世界boss-进度条350",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-01-23 23:59:59",
        },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$use_item_server;350;true;2",
        },
      ],
    },
    {
      "id": 540,
      "name": "世界boss-死亡",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 53, "name": "击杀特殊世界NPCBOSS怪物", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 58,
          "name": "添加作用于整个服的作用号(持续到当天24点)",
          "group": 1,
          "parameters": "TRIGGER_WHOLE_WORLD_RESOURCE_MAX;50",
        },
      ],
    },
    {
      "id": 551,
      "name": "击杀怪物打点",
      "state": 0,
      "openType": 2,
      "events": [
        {
          "code": 4,
          "name": "击杀怪物检查",
          "group": 1,
          "parameters": "900680;900681;900628;900683;900684;900685",
        },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 42,
          "name": "打印一个行为Log",
          "group": 1,
          "parameters": "${trigger_spring2017_monster}${monster_id}",
        },
      ],
    },
    {
      "id": 553,
      "name": "红包-系统发29",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "3;28800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-29 00:00:00;2024-01-29 23:59:58",
        },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "151752" },
        { "code": 47, "name": "系统发红包", "group": 1, "parameters": "0;0;100;10;11111;1111" },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151758;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 554,
      "name": "红包-系统发30",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "3;28800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-30 00:00:00;2024-01-30 23:59:59",
        },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "151752" },
        { "code": 47, "name": "系统发红包", "group": 1, "parameters": "0;0;6000;50;180;151765" },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151758;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 557,
      "name": "红包-107测试",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "720;1800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-16 00:00:00;2024-01-20 23:59:59",
        },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "151752" },
        { "code": 47, "name": "系统发红包", "group": 1, "parameters": "0;0;1500;50;180;151765" },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151758;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 558,
      "name": "红包-107测试-公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "720;1800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-15 23:59:00;2024-01-20 23:59:59",
        },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(1个参)",
          "group": 1,
          "parameters": "151750;NOTICE_TYPE_INT;1",
        },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151756;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 559,
      "name": "红包-107测试-领取公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 52, "name": "红包领取触发", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-16 00:00:00;2024-01-30 23:59:59",
        },
        { "code": 81, "name": "验证领取红包的大小", "group": 1, "parameters": "true;>=;100" },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(2个参)",
          "group": 1,
          "parameters": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1",
        },
      ],
    },
    {
      "id": 560,
      "name": "红包-线上1服测试-公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "8;10800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-18 03:50:00;2024-01-19 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(1个参)",
          "group": 1,
          "parameters": "151750;NOTICE_TYPE_INT;10",
        },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151756;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 561,
      "name": "红包-线上1服测试-发放",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "8;10800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-18 04:00:00;2024-01-19 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "151752" },
        { "code": 47, "name": "系统发红包", "group": 1, "parameters": "0;0;500;10;180;151765" },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151758;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 562,
      "name": "红包-线上1服测试-领取公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 52, "name": "红包领取触发", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-18 04:00:00;2024-01-19 00:00:00",
        },
        { "code": 81, "name": "验证领取红包的大小", "group": 1, "parameters": "true;>=;50" },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1" },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(2个参)",
          "group": 1,
          "parameters": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1",
        },
      ],
    },
    {
      "id": 563,
      "name": "世界boss-创建500",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 54, "name": "使用道具(指定ID)", "group": 1, "parameters": "211319" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-24 00:00:00;2024-02-07 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$use_item_server;<;500",
        },
      ],
      "actions": [
        {
          "code": 57,
          "name": "修改变量为使用物品的数量",
          "group": 1,
          "parameters": "$use_item_server;+",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$use_item_server;>=;500",
              },
            ],
            "onMatch": [
              { "code": 52, "name": "这个BOSS是一个及其特殊的世界BOSS(NPC)", "group": 1 },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$use_item_server;500;false;2",
        },
      ],
    },
    {
      "id": 564,
      "name": "世界boss-进度条500",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "49" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-24 00:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 40,
          "name": "推送怪物基数，活动期间,客户端全服玩家显示怪物计数",
          "group": 1,
          "parameters": "$use_item_server;500;true;2",
        },
      ],
    },
    {
      "id": 487,
      "name": "红包-系统发28",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "3;28800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-28 00:00:00;2024-01-28 23:59:59",
        },
      ],
      "actions": [
        { "code": 45, "name": "世界滚屏公告(无参)", "group": 1, "parameters": "151752" },
        { "code": 47, "name": "系统发红包", "group": 1, "parameters": "0;0;2000;50;180;151765" },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151758;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 488,
      "name": "红包-领取公告",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 52, "name": "红包领取触发", "group": 1 }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-28 00:00:00;2024-01-30 23:59:59",
        },
        { "code": 81, "name": "验证领取红包的大小", "group": 1, "parameters": "true;>=;100" },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(2个参)",
          "group": 1,
          "parameters": "151749;NOTICE_TYPE_USER;0;NOTICE_TYPE_GOLD;1",
        },
      ],
    },
    {
      "id": 489,
      "name": "红包-全服公告（分）",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "9;28800" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-27 23:59:00;2024-01-30 23:59:59",
        },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(1个参)",
          "group": 1,
          "parameters": "151750;NOTICE_TYPE_INT;1",
        },
        {
          "code": 55,
          "name": "给全服发送离线推送",
          "group": 1,
          "parameters": "ACTIVITY;151756;RED_SYSTEM_PUSH",
        },
      ],
    },
    {
      "id": 490,
      "name": "获得道具公告",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "211384" },
        { "code": 40, "name": "获得道具(指定ID)", "group": 1, "parameters": "211385" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 45,
          "name": "世界滚屏公告(2个参)",
          "group": 1,
          "parameters": "151748;NOTICE_TYPE_USER;0;NOTICE_TYPE_ITEM;1",
        },
      ],
    },
    {
      "id": 492,
      "name": "年画-兑换皮肤",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "44" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-09-09 00:00:00",
        },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211279;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211281;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211280;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211282;1" },
      ],
      "actions": [
        {
          "code": 46,
          "name": "物品兑换",
          "group": 1,
          "parameters": "211279,1|211280,1|211281,1|211282,1;2;248772",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11923" },
      ],
    },
    {
      "id": 493,
      "name": "年画-兑换名牌",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "44" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-09-09 00:00:00",
        },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211283;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211284;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211285;1" },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211286;1" },
      ],
      "actions": [
        {
          "code": 46,
          "name": "物品兑换",
          "group": 1,
          "parameters": "211283,1|211284,1|211285,1|211286,1;2;248773",
        },
        { "code": 4, "name": "发送邮件", "group": 1, "parameters": "11924" },
      ],
    },
    {
      "id": 494,
      "name": "砸蛋-客户端请求",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "42" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$gacha_refresh;<;1",
              },
            ],
            "onMatch": [
              {
                "code": 50,
                "name": "砸金蛋刷新",
                "group": 1,
                "parameters": "6900101,6900102,6900103|2000,500,100;6",
              },
            ],
            "otherwise": [],
          },
        },
        {
          "code": 51,
          "name": "砸金蛋盘面发送客户端",
          "group": 1,
          "parameters": "$gacha_day;$gacha_day;6;50",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              {
                "code": 7,
                "name": "数值的比较(变量 vs 数值)",
                "group": 1,
                "parameters": "$gacha_refresh;<;1",
              },
            ],
            "onMatch": [
              {
                "code": 24,
                "name": "给整数变量赋值",
                "group": 1,
                "parameters": "$gacha_refresh;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 495,
      "name": "砸蛋-免费刷新",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "41" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$gacha_day;>;0",
        },
      ],
      "actions": [
        {
          "code": 50,
          "name": "砸金蛋刷新",
          "group": 1,
          "parameters": "6900101,6900102,6900103|2000,500,100;6",
        },
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$gacha_day;-;1" },
        {
          "code": 51,
          "name": "砸金蛋盘面发送客户端",
          "group": 1,
          "parameters": "$gacha_day;$gacha_day;6;50",
        },
      ],
    },
    {
      "id": 496,
      "name": "砸蛋-金币刷新",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "41" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$gacha_day;==;0",
        },
        { "code": 83, "name": "验证金币", "group": 1, "parameters": ">=;50;true" },
      ],
      "actions": [
        {
          "code": 50,
          "name": "砸金蛋刷新",
          "group": 1,
          "parameters": "6900101,6900102,6900103|2000,500,100;6",
        },
        {
          "code": 51,
          "name": "砸金蛋盘面发送客户端",
          "group": 1,
          "parameters": "$gacha_day;$gacha_day;6;50",
        },
      ],
    },
    {
      "id": 497,
      "name": "砸蛋-砸",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 51, "name": "客户端请求事件", "group": 1, "parameters": "43" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
        { "code": 82, "name": "验证要消耗的物品ID和数量", "group": 1, "parameters": "211276;1" },
      ],
      "actions": [
        {
          "code": 49,
          "name": "砸金蛋",
          "group": 1,
          "parameters": "6;248707,248706,248705;6900101,6900102,6900103;211276,211276,211276;1,3,5",
        },
        {
          "code": 51,
          "name": "砸金蛋盘面发送客户端",
          "group": 1,
          "parameters": "$gacha_day;$gacha_day;6;50",
        },
      ],
    },
    {
      "id": 499,
      "name": "拜访-机制",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900685" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-22 02:00:00;2024-02-07 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "true;1000,1000,500,500,100;900680,900681,900682,900683,900684;60;2;100",
        },
        {
          "code": 41,
          "name": "if (",
          "group": 1,
          "branch": {
            "conditions": [
              { "code": 84, "name": "验证创建的怪物是谁", "group": 1, "parameters": "900684" },
            ],
            "onMatch": [
              {
                "code": 45,
                "name": "世界滚屏公告(2个参)",
                "group": 1,
                "parameters": "151755;NOTICE_TYPE_USER;0;COMMON_TYPE_POS;1",
              },
            ],
            "otherwise": [],
          },
        },
      ],
    },
    {
      "id": 2530,
      "name": "月中累充红包1",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 70, "name": "累充达到档位", "group": 1, "parameters": "4" }],
      "conditions": [],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "1;0;2000;10;1440;9440889;1;2000",
        },
      ],
    },
    {
      "id": 2558,
      "name": "月中累充红包2",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 70, "name": "累充达到档位", "group": 1, "parameters": "6" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-11-01 00:00:00;2024-12-02 00:00:00",
        },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$3_lc_rank_6;==;0",
        },
      ],
      "actions": [
        {
          "code": 47,
          "name": "系统发红包",
          "group": 1,
          "parameters": "1;0;6000;30;1440;9440889;1;6000",
        },
      ],
    },
    {
      "id": 2691,
      "name": "王国限时增益 1963 1964",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1680;360" }],
      "conditions": [
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-60" },
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-12-01 00:00:00;2024-12-08 00:00:00",
        },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILD_RESOURCE_REDUCE;360;5",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_ATT_MONSTER_ADD_ATTACK;360;25",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_COST_REDUCE;360;10",
        },
      ],
    },
    {
      "id": 2287,
      "name": "正式版  111111",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "168;1" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "1" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 2288,
      "name": "正式版  111111 cp",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 2289,
      "name": "正式版  111111 cp cp",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;20",
        },
      ],
    },
    {
      "id": 2291,
      "name": "正式版  111111 cp cp cp",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 2292,
      "name": "正式版  222 cp cp cp cp",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 2293,
      "name": "正式版  2333",
      "state": -1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 2294,
      "name": "正式版  2333 cp",
      "state": 1,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "1;30" }],
      "conditions": [{ "code": 17, "name": "开服时间不小于", "group": 1, "parameters": "20" }],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_BUILDING_TIME_REDUCE;3600;28800",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_RESEARCH_TIME_REDUCE;3600;14400",
        },
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_CURE_COST_REDUCE;1200;120",
        },
      ],
    },
    {
      "id": 1866,
      "name": "1-15级野怪",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900705" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900706" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900707" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900708" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900709" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900710" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900711" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900712" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900713" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900714" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900715" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900716" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900717" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900718" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900719" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-09 00:00:00;2024-10-17 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900771;30;15;100",
        },
      ],
    },
    {
      "id": 1867,
      "name": "16-25级野怪",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900720" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900721" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900722" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900723" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900724" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900725" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900726" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900727" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900728" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900729" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-09 00:00:00;2024-10-17 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900772;30;15;100",
        },
      ],
    },
    {
      "id": 1868,
      "name": "26-30级野怪",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900730" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900731" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900732" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900733" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "900734" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-09 00:00:00;2024-10-17 02:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900773;30;15;100",
        },
      ],
    },
    {
      "id": 2439,
      "name": "1-30野怪",
      "state": 2,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-10-18 00:00:00;2024-10-31 00:00:00",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-8902" },
      ],
      "actions": [],
    },
    {
      "id": 1837,
      "name": "打怪双倍掉落",
      "state": 0,
      "openType": 2,
      "events": [{ "code": 43, "name": "定时器", "group": 1, "parameters": "-1;600" }],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-06-14 02:00:00;2024-06-17 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 53,
          "name": "添加作用于整个服的作用号",
          "group": 1,
          "parameters": "TRIGGER_MONSTER_FIGHT_REWARD;600;100",
        },
      ],
    },
    {
      "id": 2525,
      "name": "跑马灯单服鲜花排行榜",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        { "code": 109, "name": "上次鲜花榜前几名", "group": 1, "parameters": "1" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$flower_rank_times;<;1",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-50" },
      ],
      "actions": [
        {
          "code": 61,
          "name": "发送跑马灯（玩家触发的事件）",
          "group": 1,
          "parameters": "2;9440790",
        },
        {
          "code": 9,
          "name": "修改变量为具体值",
          "group": 1,
          "parameters": "$flower_rank_times;+;1",
        },
      ],
    },
    {
      "id": 2538,
      "name": "跑马灯王国官职",
      "state": 1,
      "openType": 2,
      "events": [
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "0" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "1" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "2" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "3" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "4" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "5" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "6" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "7" },
        { "code": 73, "name": "王国职位被任命", "group": 1, "parameters": "8" },
      ],
      "conditions": [],
      "actions": [
        {
          "code": 61,
          "name": "发送跑马灯（玩家触发的事件）",
          "group": 1,
          "parameters": "2;9440791",
        },
      ],
    },
    {
      "id": 2539,
      "name": "跑马灯盟主上线",
      "state": 2,
      "openType": 2,
      "events": [{ "code": 8, "name": "登陆", "group": 1 }],
      "conditions": [
        { "code": 108, "name": "在联盟内的等级", "group": 1, "parameters": "5" },
        {
          "code": 7,
          "name": "数值的比较(变量 vs 数值)",
          "group": 1,
          "parameters": "$union_marquees;<;1",
        },
        { "code": 32, "name": "服务器编号", "group": 1, "parameters": "1-50" },
      ],
      "actions": [
        {
          "code": 61,
          "name": "发送跑马灯（玩家触发的事件）",
          "group": 1,
          "parameters": "1;9440792",
        },
        { "code": 9, "name": "修改变量为具体值", "group": 1, "parameters": "$union_marquees;+;1" },
      ],
    },
    {
      "id": 533,
      "name": "1到4级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9400" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9401" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9402" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9403" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;5;900691;30;10;100",
        },
      ],
    },
    {
      "id": 534,
      "name": "5到8级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9404" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9405" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9406" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9407" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;10;900691;30;10;100",
        },
      ],
    },
    {
      "id": 543,
      "name": "9到10级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9408" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9409" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;15;900691;30;10;100",
        },
      ],
    },
    {
      "id": 544,
      "name": "11到14级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9410" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9411" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9412" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9413" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;20;900692;30;10;100",
        },
      ],
    },
    {
      "id": 545,
      "name": "15到18级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9414" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9415" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9416" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9417" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;25;900692;30;10;100",
        },
      ],
    },
    {
      "id": 546,
      "name": "19到20级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9418" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9419" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;30;900692;30;10;100",
        },
      ],
    },
    {
      "id": 547,
      "name": "21到24级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9420" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9421" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9422" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9423" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;35;900693;30;10;100",
        },
      ],
    },
    {
      "id": 548,
      "name": "25到28级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9424" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9425" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9426" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9427" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;40;900693;30;10;100",
        },
      ],
    },
    {
      "id": 549,
      "name": "29到30级野怪",
      "state": 0,
      "openType": 2,
      "events": [
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9428" },
        { "code": 39, "name": "击杀怪物(指定ID)", "group": 1, "parameters": "9429" },
      ],
      "conditions": [
        {
          "code": 9,
          "name": "时间区间",
          "group": 1,
          "parameters": "2024-01-17 02:00:00;2024-01-24 02:00:00",
        },
      ],
      "actions": [
        {
          "code": 54,
          "name": "在死亡怪物周围刷新怪物(随机出现)",
          "group": 1,
          "parameters": "false;45;900693;30;10;100",
        },
      ],
    },
  ],
  "variables": [],
};
