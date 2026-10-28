import type { Rule } from "@opencok/rules/game";

const records = `
player_max hero_soul hero_up affairs fight_position fight_number physical_bug physical
mail building_base cd_time cd_cost cd_gold vip2sviptime world_distance world_marchtime
world_detect world_fire1 world_fire2 world_rally world_alliancewar worldmap_map
resource_cost resource_num1 resource_num2 resource_num3 showstarskill tavern_base
alliance_territory hero_soulstone worldmap_pve facebook_gift function_on function_on2
function_on3 function_on4 function_on5 function_on6 function_on7 function_on8 function_on9
shake notice equip worldmap_pvenum hero_number hero_ability ability_lv ability_cost
hero_skillpoint worldmap_time march alliance_cost alliance_science alliance_gift
goldmine_fb resources_weight online_reward account hero simplemode recharge_event
bingying_star_on building_sync princess_quest dragonglass flowers general_official
civilization_fortress leader_monster wk_info_new trade_type 45skill scoutmark_time
ranking invite_cost lottery_cost lottery_cost2 alliance_territory1 wb_info wb_condition
wb_score wb_timing wb_fire wb_switch wa_army wa_matchreport wa_info wa_time wa_switch
wap_battle chat_switch chat chat_standalone chat_bubble chat_voice nearby_like pop_rate
activityconfig dragonglass_control wl_res_tile talktips_time trade_time on_kpi on_war
on_event on_function on_trumpet on_other smithy_history icon activityconfig2
world_despoil wk_info wonder science-test knight_title activity_name train mudi_md5
graveyard alliance_war kingdomskill superarmy dragon_words alliance_building_donate
alliance_connon wk_info_new1 dragon dragon_new dragon_notice dragon_tower
dragon_tower_config speedup_overflow alliance_trap equipment_refine equipment_combine
subcity_reward hero_challenge saga_tower foreigen_sciences kingdom_fight_miracle cn_bind
magic_mirror phone_bind mail_bind bind_reward_disable kingdom_neutralServer merge_server
bank_info power_info golden_opentime wk_kingdom_aegis 17_wk general_random_effect
fight_arena new_resource_battle_base p6_arms week_info p6_health dailytasks_info
wb_subsection golden_egg civilization alliance_boss red_envelopes overlord_random
`;

export function dataConfigItems(overrides: Readonly<Record<string, Rule>> = {}): Map<string, Rule>
{
    const result = new Map<string, Rule>(
        records
            .trim()
            .split(/\s+/)
            .map((id) => [id, { id }]),
    );
    const scalars: Record<string, Rule> = {
        player_max: { k1: "0010" },
        resources_basics: { k5: "0", k6: "0", k7: "0", k8: "0" },
        world_fire1: { k2: "0" },
        shield_base: { k2: "0" },
        monster: { k3: "0", k4: "0", k6: "0", k8: "0", k10: "0", k11: "boss;0" },
        beginner_move: { k1: "0" },
        worldmap_city: { k4: "0", k6: "50" },
        function_on8: { k2: "0" },
        on_trumpet: { k2: "0" },
        serviceterms_on: { k1: "0" },
        chrisms: { k12: "0" },
        function_on2: { k8: "0" },
        function_on3: { k2: "0" },
        wb_info: { k8: "0" },
        wa_score: { k10: "0" },
        wa_scene: { k1: "0" },
        graveyard: { k3: "0" },
        kingdom_neutralServer: { k4: "0" },
        kingdom_neutralServer_time: { k7: "0" },
        overlord: { k1: "0" },
    };
    for (const family of ["worldboss", "worldboss_elite", "worldboss_special", "worldboss_npc"])
    {
        result.set(family, { id: family, k1: "0", k10: "0" });
        if (family === "worldboss_npc")
        {
            continue;
        }
        for (const range of ["10_19", "20_29", "30_40"])
        {
            const id = `${family}_${range}`;
            result.set(id, { id, k1: "0", k10: "0" });
            result.set(`${id}_other`, { id: `${id}_other` });
        }
    }
    for (const [id, rule] of Object.entries(scalars))
    {
        result.set(id, { id, ...rule });
    }
    for (const [id, rule] of Object.entries(overrides))
    {
        result.set(id, { ...result.get(id), id, ...rule });
    }
    return result;
}
