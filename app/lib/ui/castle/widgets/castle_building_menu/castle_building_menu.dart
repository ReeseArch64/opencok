import 'package:flutter/material.dart';
import 'package:opencok/domain/castle/castle_building/castle_building.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';

/// The scenery remains cached in separate repaint boundaries. Only these
/// transparent layers advance with time; animation never rebuilds the HUD.
class CastleBuildingMenu extends StatelessWidget {
  const CastleBuildingMenu({
    super.key,
    required this.building,
    required this.onClose,
    required this.onTrain,
  });

  final CastleBuilding building;
  final VoidCallback onClose;
  final VoidCallback onTrain;

  @override
  Widget build(BuildContext context) => TweenAnimationBuilder<double>(
    tween: Tween(begin: 0, end: 1),
    duration: Duration(
      milliseconds: MediaQuery.disableAnimationsOf(context) ? 0 : 180,
    ),
    curve: Curves.easeOutCubic,
    builder: (context, value, child) => Opacity(
      opacity: value,
      child: Transform.translate(
        offset: Offset(0, 10 * (1 - value)),
        child: child,
      ),
    ),
    child: Material(
      color: Colors.transparent,
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xf52e3029), Color(0xf5141d20)],
          ),
          border: Border.all(color: const Color(0xffa68b53)),
          borderRadius: BorderRadius.circular(5),
          boxShadow: const [
            BoxShadow(
              color: Colors.black54,
              blurRadius: 18,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 16, top: 3, right: 2),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      context.l10n.gameName(building.nameKey),
                      style: const TextStyle(
                        color: Color(0xffffe7ae),
                        fontFamily: 'serif',
                        fontSize: 16,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: onClose,
                    tooltip: context.l10n.closeSelection,
                    icon: const Icon(
                      Icons.close,
                      size: 18,
                      color: Color(0xffc3b995),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
              child: SizedBox(
                width: double.infinity,
                height: 44,
                child: FilledButton.icon(
                  onPressed: onTrain,
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xff596944),
                    foregroundColor: const Color(0xffffedbf),
                    shape: RoundedRectangleBorder(
                      side: const BorderSide(color: Color(0xffb39a61)),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                  icon: const Icon(Icons.shield_outlined, size: 20),
                  label: Text(
                    context.l10n.trainTroops,
                    style: TextStyle(fontFamily: 'serif', fontSize: 15),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
