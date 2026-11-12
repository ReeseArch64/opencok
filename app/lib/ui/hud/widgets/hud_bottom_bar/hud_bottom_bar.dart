import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_action/hud_action.dart';
import 'package:opencok/domain/hud/hud_data/hud_data.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/hud/widgets/hud_action_area/hud_action_area.dart';
import 'package:opencok/ui/hud/widgets/hud_badge/hud_badge.dart';
import 'package:opencok/ui/hud/widgets/hud_label/hud_label.dart';
import 'package:opencok/ui/hud/widgets/hud_sprite/hud_sprite.dart';

class HudBottomBar extends StatelessWidget {
  const HudBottomBar({
    super.key,
    required this.width,
    required this.data,
    required this.onAction,
    required this.onWorldMap,
  });
  final double width;
  final HudData data;
  final ValueChanged<HudAction> onAction;
  final bool onWorldMap;
  @override
  Widget build(BuildContext context) {
    final extra = width - 640;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        hudSprite('chat/chat_bar_background.png', 0, -6, width, 66),
        hudSprite('chat/translate_icon.png', 10, 6, 54, 38),
        if (data.chatVip.isNotEmpty)
          hudLabel(
            data.chatVip,
            72,
            10,
            76,
            34,
            size: 18,
            serif: true,
            color: const Color(0xff20190f),
          ),
        hudLabel(
          data.chat,
          data.chatVip.isEmpty ? 72 : 156,
          10,
          width - (data.chatVip.isEmpty ? 86 : 170),
          34,
          size: 19,
          color: const Color(0xff20190f),
          align: TextAlign.left,
        ),
        hudSprite(
          'navigation/navigation_bar_background.png',
          0,
          52,
          width,
          104,
        ),
        hudSprite(
          onWorldMap
              ? 'navigation/city_icon.png'
              : 'navigation/world_map_icon.png',
          21 + extra * .1,
          77,
          92,
          76,
        ),
        hudSprite(
          'navigation/daily_tasks_icon.png',
          164 + extra * .3,
          56,
          84,
          84,
        ),
        hudSprite(
          'navigation/inventory_icon.png',
          287 + extra * 0.5,
          55,
          84,
          84,
        ),
        hudSprite('navigation/mail_icon.png', 408 + extra * .7, 57, 84, 84),
        hudSprite('navigation/alliance_icon.png', 538 + extra * .9, 57, 84, 84),
        hudLabel(
          context.l10n.daily,
          144 + extra * .3,
          130,
          124,
          25,
          size: 20,
          color: const Color(0xfffefbd2),
        ),
        hudLabel(
          context.l10n.items,
          273 + extra * 0.5,
          130,
          112,
          25,
          size: 20,
          color: const Color(0xfffefcc8),
        ),
        hudLabel(
          context.l10n.mail,
          396 + extra * .7,
          130,
          112,
          25,
          size: 20,
          color: const Color(0xfffefdc6),
        ),
        hudLabel(
          context.l10n.alliance,
          524 + extra * .9,
          130,
          112,
          25,
          size: 20,
          color: const Color(0xfffefdc6),
        ),
        if (data.dailyCount > 0)
          hudBadge(data.dailyCount, 222.2 + extra * .3, 49.2),
        if (data.mailCount > 0)
          hudBadge(data.mailCount, 459.2 + extra * .7, 49.7),
        hudActionArea(
          onAction,
          HudAction.chat,
          context.l10n.chat,
          0,
          0,
          width,
          50,
        ),
        hudActionArea(
          onAction,
          HudAction.map,
          onWorldMap ? context.l10n.city : context.l10n.map,
          0,
          52,
          136 + extra * .2,
          104,
        ),
        hudActionArea(
          onAction,
          HudAction.daily,
          context.l10n.daily,
          136 + extra * .2,
          52,
          132 + extra * .2,
          104,
        ),
        hudActionArea(
          onAction,
          HudAction.items,
          context.l10n.items,
          268 + extra * .4,
          52,
          122 + extra * .2,
          104,
        ),
        hudActionArea(
          onAction,
          HudAction.mail,
          context.l10n.mail,
          390 + extra * .6,
          52,
          128 + extra * .2,
          104,
        ),
        hudActionArea(
          onAction,
          HudAction.alliance,
          context.l10n.alliance,
          518 + extra * .8,
          52,
          122 + extra * .2,
          104,
        ),
      ],
    );
  }
}
