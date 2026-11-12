import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_data/hud_data.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/profile/widgets/desktop_player_profile/desktop_player_profile.dart';
import 'package:opencok/ui/profile/actions/show_profile_preview/show_profile_preview.dart';
import 'package:opencok/ui/profile/widgets/profile_action_area/profile_action_area.dart';
import 'package:opencok/ui/profile/widgets/profile_add_button/profile_add_button.dart';
import 'package:opencok/ui/profile/widgets/profile_image/profile_image.dart';
import 'package:opencok/ui/profile/widgets/profile_progress_bar/profile_progress_bar.dart';
import 'package:opencok/ui/profile/widgets/profile_round_action/profile_round_action.dart';
import 'package:opencok/ui/profile/widgets/profile_text/profile_text.dart';

class PlayerProfileScreen extends StatelessWidget {
  const PlayerProfileScreen({
    super.key,
    required this.data,
    this.playerName = 'OpenCoK',
  });

  final HudData data;
  final String playerName;

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xff101017),
    body: SafeArea(
      child: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth >= 900) {
            return DesktopPlayerProfile(data: data, playerName: playerName);
          }
          final height = math.max(
            1100.0,
            constraints.maxHeight / constraints.maxWidth * 640,
          );
          final footerY = height - 128;
          return Center(
            key: const ValueKey('profile-mobile-layout'),
            child: FittedBox(
              fit: BoxFit.contain,
              child: SizedBox(
                width: 640,
                height: height,
                child: Stack(
                  children: [
                    const Positioned.fill(
                      child: ColoredBox(color: Color(0xff101017)),
                    ),
                    profileImage('scene_background', 0, 80, 640, 620),
                    profileImage('border', 0, 80, 8, height - 80),
                    profileImage('border', 632, 80, 8, height - 80, flip: true),
                    profileImage('title', 0, 0, 640, 80),
                    profileImage('back', 0, 0, 80, 80),
                    profileActionArea(
                      context.l10n.backToGame,
                      0,
                      0,
                      80,
                      80,
                      () => Navigator.of(context).pop(),
                    ),
                    profileText(playerName, 90, 17, 410, 45, 28),
                    profileImage('rename', 514, 17, 38, 43),
                    profileActionArea(
                      context.l10n.rename,
                      500,
                      0,
                      65,
                      80,
                      () => showProfilePreview(context, context.l10n.rename),
                    ),
                    profileImage('equipment_rail', 0, 100, 140, 560),
                    profileImage(
                      'equipment_rail',
                      500,
                      100,
                      140,
                      560,
                      flip: true,
                    ),
                    profileImage(
                      'default_avatar',
                      136,
                      125,
                      368,
                      525,
                      fit: BoxFit.contain,
                    ),
                    for (var column = 0; column < 2; column++)
                      for (var row = 0; row < 4; row++)
                        Positioned(
                          left: column == 0 ? 15 : 520,
                          top: 134.0 + row * 128.6,
                          width: 105,
                          height: 105,
                          child: Semantics(
                            label: context.l10n.emptyEquipmentSlot(
                              column * 4 + row + 1,
                            ),
                            child: Image.asset(
                              'assets/ui/profile/empty_slot.png',
                              fit: BoxFit.fill,
                            ),
                          ),
                        ),
                    profileImage('background', 0, 696, 320, 330),
                    profileImage('background', 320, 696, 320, 330, flip: true),
                    profileImage('experience', 48, 720, 60, 58),
                    profileImage('bar_end', 118, 728, 34, 26),
                    profileImage('bar_end', 488, 728, 34, 26, flip: true),
                    profileProgressBar(
                      context,
                      728,
                      data.experience,
                      '${(data.experience * 100).round()}%',
                      false,
                    ),
                    profileAddButton(
                      context,
                      538,
                      723,
                      context.l10n.experience,
                    ),
                    Positioned(
                      left: 53,
                      top: 790,
                      width: 52,
                      height: 53,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xff7e806b),
                            width: 3,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: Colors.black,
                              blurRadius: 3,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Image.asset(
                            'assets/ui/profile/energy.png',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                    ),
                    profileImage('bar_end', 118, 796, 34, 26),
                    profileImage('bar_end', 488, 796, 34, 26, flip: true),
                    profileProgressBar(
                      context,
                      796,
                      data.energy,
                      '${(data.energy * 120).round()}/120',
                      true,
                    ),
                    profileAddButton(context, 538, 791, context.l10n.energy),
                    Positioned(
                      left: 0,
                      top: footerY,
                      width: 640,
                      height: 128,
                      child: DecoratedBox(
                        decoration: BoxDecoration(
                          color: const Color(0xff1b2732),
                          border: Border.all(
                            color: const Color(0xff5b5b56),
                            width: 3,
                          ),
                        ),
                      ),
                    ),
                    for (final (index, icon, label) in [
                      (0, 'ranking', context.l10n.ranking),
                      (1, 'achievements', context.l10n.achievements),
                      (2, 'scroll', context.l10n.information),
                      (3, 'reset', context.l10n.reset),
                      (4, 'skills', context.l10n.skills),
                      (5, 'settings', context.l10n.settings),
                    ])
                      profileRoundAction(
                        context,
                        icon,
                        label,
                        18.0 + index * 104,
                        footerY + 26,
                        84,
                      ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    ),
  );
}
