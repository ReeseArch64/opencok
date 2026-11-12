import 'package:flutter/material.dart';
import 'package:opencok/domain/hud/hud_data/hud_data.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/profile/actions/show_profile_preview/show_profile_preview.dart';
import 'package:opencok/ui/profile/widgets/profile_image/profile_image.dart';

class DesktopPlayerProfile extends StatelessWidget {
  const DesktopPlayerProfile({
    super.key,
    required this.data,
    required this.playerName,
  });

  final HudData data;
  final String playerName;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    key: const ValueKey('profile-desktop-layout'),
    decoration: const BoxDecoration(
      gradient: RadialGradient(
        center: Alignment(-0.5, -0.2),
        radius: 1.3,
        colors: [Color(0xff3a3435), Color(0xff101017)],
      ),
    ),
    child: Column(
      children: [
        Container(
          height: 76,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/ui/profile/title.png'),
              fit: BoxFit.fill,
            ),
            border: Border(bottom: BorderSide(color: Color(0xff756344))),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            children: [
              IconButton(
                tooltip: context.l10n.backToGame,
                onPressed: () => Navigator.of(context).pop(),
                icon: Image.asset('assets/ui/profile/back.png', width: 44),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Text(
                  playerName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 26,
                    color: Color(0xffffe7ae),
                  ),
                ),
              ),
              IconButton(
                tooltip: context.l10n.rename,
                onPressed: () =>
                    showProfilePreview(context, context.l10n.rename),
                icon: Image.asset('assets/ui/profile/rename.png', width: 28),
              ),
            ],
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(28),
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1280),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(flex: 6, child: _equipment(context)),
                    const SizedBox(width: 32),
                    Expanded(
                      flex: 5,
                      child: Column(
                        children: [
                          _panel(
                            child: Column(
                              children: [
                                _stat(
                                  context,
                                  'experience',
                                  context.l10n.experience,
                                  data.experience,
                                  '${(data.experience * 100).round()}%',
                                  const Color(0xff20d5f5),
                                ),
                                const SizedBox(height: 28),
                                _stat(
                                  context,
                                  'energy',
                                  context.l10n.energy,
                                  data.energy,
                                  '${(data.energy * 120).round()}/120',
                                  const Color(0xff68d847),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          _panel(
                            child: GridView.count(
                              crossAxisCount: 2,
                              mainAxisSpacing: 12,
                              crossAxisSpacing: 12,
                              mainAxisExtent: 74,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              children: [
                                for (final (icon, label) in [
                                  ('ranking', context.l10n.ranking),
                                  ('achievements', context.l10n.achievements),
                                  ('scroll', context.l10n.information),
                                  ('reset', context.l10n.reset),
                                  ('skills', context.l10n.skills),
                                  ('settings', context.l10n.settings),
                                ])
                                  OutlinedButton(
                                    onPressed: () =>
                                        showProfilePreview(context, label),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: const Color(0xffead6ac),
                                      side: const BorderSide(
                                        color: Color(0xff756344),
                                      ),
                                      padding: const EdgeInsets.all(10),
                                    ),
                                    child: Row(
                                      children: [
                                        Image.asset(
                                          'assets/ui/profile/$icon.png',
                                          width: 28,
                                          height: 32,
                                          fit: BoxFit.contain,
                                          excludeFromSemantics: true,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(child: Text(label)),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
    ),
  );

  Widget _panel({required Widget child}) => Container(
    padding: const EdgeInsets.all(24),
    decoration: BoxDecoration(
      color: const Color(0xe61b222a),
      border: Border.all(color: const Color(0xff756344)),
      borderRadius: BorderRadius.circular(6),
    ),
    child: child,
  );

  Widget _equipment(BuildContext context) => AspectRatio(
    aspectRatio: 640 / 620,
    child: FittedBox(
      child: SizedBox(
        width: 640,
        height: 620,
        child: Stack(
          children: [
            profileImage('scene_background', 0, 0, 640, 620),
            profileImage('border', 0, 0, 8, 620),
            profileImage('border', 632, 0, 8, 620, flip: true),
            profileImage('equipment_rail', 0, 20, 140, 560),
            profileImage('equipment_rail', 500, 20, 140, 560, flip: true),
            profileImage(
              'default_avatar',
              136,
              45,
              368,
              525,
              fit: BoxFit.contain,
            ),
            for (var column = 0; column < 2; column++)
              for (var row = 0; row < 4; row++)
                Positioned(
                  left: column == 0 ? 15 : 520,
                  top: 54.0 + row * 128.6,
                  width: 105,
                  height: 105,
                  child: Semantics(
                    label: context.l10n.emptyEquipmentSlot(
                      column * 4 + row + 1,
                    ),
                    child: Image.asset('assets/ui/profile/empty_slot.png'),
                  ),
                ),
          ],
        ),
      ),
    ),
  );

  Widget _stat(
    BuildContext context,
    String icon,
    String label,
    double value,
    String amount,
    Color color,
  ) => Row(
    children: [
      Image.asset(
        'assets/ui/profile/$icon.png',
        width: 42,
        height: 42,
        fit: BoxFit.contain,
        excludeFromSemantics: true,
      ),
      const SizedBox(width: 16),
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: Color(0xffead6ac))),
            const SizedBox(height: 8),
            Semantics(
              label: label,
              value: amount,
              child: LinearProgressIndicator(
                value: value.clamp(0, 1),
                minHeight: 12,
                color: color,
                backgroundColor: const Color(0xff101017),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            const SizedBox(height: 6),
            Text(amount),
          ],
        ),
      ),
      const SizedBox(width: 12),
      IconButton(
        tooltip: context.l10n.addResource(label),
        onPressed: () => showProfilePreview(context, label),
        icon: Image.asset('assets/ui/profile/plus.png', width: 30),
      ),
    ],
  );
}
