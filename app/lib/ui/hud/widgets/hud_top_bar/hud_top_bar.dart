import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_action/hud_action.dart';
import 'package:opencok/domain/hud/hud_data/hud_data.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/hud/widgets/gold_glint/gold_glint.dart';
import 'package:opencok/ui/hud/widgets/hud_action_area/hud_action_area.dart';
import 'package:opencok/ui/hud/widgets/hud_label/hud_label.dart';
import 'package:opencok/ui/hud/widgets/hud_progress/hud_progress.dart';
import 'package:opencok/ui/hud/widgets/hud_resource/hud_resource.dart';
import 'package:opencok/ui/hud/widgets/hud_sprite/hud_sprite.dart';

class HudTopBar extends StatelessWidget {
  const HudTopBar({
    super.key,
    required this.width,
    required this.data,
    required this.onAction,
  });
  final double width;
  final HudData data;
  final ValueChanged<HudAction> onAction;
  @override
  Widget build(BuildContext context) {
    final extra = width - 640;
    final resourceWidth = (width - 180) / 4;
    double resourceX(int index) =>
        90 + index * resourceWidth + (resourceWidth - 115) / 2;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        hudSprite(
          'resources/power_background.png',
          186 + extra / 2,
          48,
          134,
          49,
        ),
        hudSprite(
          'resources/power_background.png',
          320 + extra / 2,
          48,
          134,
          49,
          flip: true,
        ),
        hudSprite('resources/resource_bar_background.png', 0, 0, width / 2, 58),
        hudSprite(
          'resources/resource_bar_background.png',
          width / 2,
          0,
          width / 2,
          58,
          flip: true,
        ),
        hudResource('resources/wood_icon.png', data.wood, resourceX(0)),
        hudResource('resources/food_icon.png', data.food, resourceX(1)),
        hudResource('resources/iron_icon.png', data.iron, resourceX(2)),
        hudResource('resources/mithril_icon.png', data.mithril, resourceX(3)),
        hudLabel(
          data.power,
          216 + extra / 2,
          51,
          210,
          30,
          size: 20,
          serif: true,
        ),
        hudSprite('profile/vip_background.png', 76, 48, 122.1, 39),
        hudLabel(data.vip, 103, 53, 95, 25, size: 19.5, serif: true),
        hudSprite('profile/portrait_background.png', 3.2, 0, 80, 80),
        hudSprite('profile/progress_panel_background.png', 0, 63.4, 102, 50),
        hudProgress(88.4, data.experience, 'profile/experience_bar_fill.png'),
        hudProgress(101.4, data.energy, 'profile/energy_bar_fill.png'),
        if (data.portrait case final portrait?)
          Positioned(
            left: 5.2,
            top: 0,
            width: 82,
            height: 82,
            child: Image.asset(
              portrait,
              fit: BoxFit.cover,
              filterQuality: FilterQuality.medium,
            ),
          ),
        hudSprite('profile/portrait_frame.png', 0, 0, 94, 82),
        hudSprite('profile/level_badge.png', 6.6, 48.8, 25.2, 25.2),
        hudLabel('${data.level}', 6, 49.4, 27, 25, size: 18),
        hudSprite(
          'resources/gold_button_background.png',
          545 + extra,
          0,
          100,
          94,
        ),
        hudSprite('resources/gold_coins_icon.png', 557 + extra, 4, 78, 58),
        Positioned(
          left: 557 + extra,
          top: 4,
          width: 78,
          height: 58,
          child: const GoldGlint(),
        ),
        hudLabel(
          data.gold,
          550 + extra,
          62,
          86,
          25,
          size: 20,
          color: const Color(0xffe6e738),
        ),
        hudActionArea(
          onAction,
          HudAction.wood,
          context.l10n.resourceValue(context.l10n.wood, data.wood),
          90 + 0 * resourceWidth,
          0,
          resourceWidth,
          43,
        ),
        hudActionArea(
          onAction,
          HudAction.food,
          context.l10n.resourceValue(context.l10n.food, data.food),
          90 + 1 * resourceWidth,
          0,
          resourceWidth,
          43,
        ),
        hudActionArea(
          onAction,
          HudAction.iron,
          context.l10n.resourceValue(context.l10n.iron, data.iron),
          90 + 2 * resourceWidth,
          0,
          resourceWidth,
          43,
        ),
        hudActionArea(
          onAction,
          HudAction.mithril,
          context.l10n.resourceValue(context.l10n.mithril, data.mithril),
          90 + 3 * resourceWidth,
          0,
          resourceWidth,
          43,
        ),
        hudActionArea(
          onAction,
          HudAction.power,
          context.l10n.resourceValue(context.l10n.power, data.power),
          200 + extra / 2,
          46,
          245,
          43,
        ),
        hudActionArea(onAction, HudAction.vip, data.vip, 99, 50, 96, 44),
        hudActionArea(
          onAction,
          HudAction.profile,
          context.l10n.profileLevel(data.level),
          0,
          0,
          97,
          85,
        ),
        hudActionArea(
          onAction,
          HudAction.experience,
          context.l10n.resourceValue(
            context.l10n.experienceShort,
            '${(data.experience * 100).round()}%',
          ),
          0,
          85,
          97,
          13,
        ),
        hudActionArea(
          onAction,
          HudAction.energy,
          context.l10n.resourceValue(
            context.l10n.energy,
            '${(data.energy * 100).round()}%',
          ),
          0,
          98,
          97,
          15,
        ),
        hudActionArea(
          onAction,
          HudAction.gold,
          context.l10n.resourceValue(context.l10n.gold, data.gold),
          548 + extra,
          0,
          92,
          80,
        ),
      ],
    );
  }
}
