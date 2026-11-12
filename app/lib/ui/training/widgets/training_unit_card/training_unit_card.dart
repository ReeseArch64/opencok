import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingUnitCard extends StatelessWidget {
  const TrainingUnitCard({
    super.key,
    required this.unit,
    required this.index,
    required this.selected,
    required this.distance,
    required this.onTap,
  });
  final TrainingUnit unit;
  final int index;
  final bool selected;
  final double distance;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final focus = (1.0 - distance).clamp(0.0, 1.0);
    final inset = math.max(15.0, 140.0 - distance * distance * 25.0);
    return Semantics(
      button: true,
      selected: selected,
      label: context.l10n.unitLevel(
        context.l10n.gameName(unit.nameKey),
        unit.tier,
      ),
      child: GestureDetector(
        onTap: onTap,
        child: Stack(
          children: [
            Positioned(
              left: inset,
              right: 0,
              top: 5,
              bottom: 5,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color.lerp(
                        const Color(0xff24221a),
                        const Color(0xff554a28),
                        focus,
                      )!,
                      const Color(0xff1a1915),
                    ],
                  ),
                  border: Border.symmetric(
                    horizontal: BorderSide(
                      color: Color.lerp(
                        const Color(0xff4f432a),
                        const Color(0xff887140),
                        focus,
                      )!,
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              key: ValueKey('unit-portrait-$index'),
              left: inset + 8,
              top: 13,
              width: 94,
              height: 100,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  trainingArt('unit_portrait_frame', fit: BoxFit.contain),
                  Padding(
                    padding: const EdgeInsets.all(5),
                    child: SizedBox.square(
                      dimension: 84,
                      child: ClipOval(
                        child: Image.asset(
                          unit.portrait,
                          alignment: Alignment.topCenter,
                          fit: unit.usesBodyPortrait
                              ? BoxFit.cover
                              : BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Positioned(
              left: inset + 40,
              top: 105,
              width: 28,
              height: 22,
              child: trainingArt(
                'unit_level_${unit.tier.toString().padLeft(2, '0')}',
                fit: BoxFit.contain,
              ),
            ),
            Positioned(
              left: inset + 105,
              right: 6,
              top: 28,
              height: 35,
              child: trainingText(
                context.l10n.gameName(unit.nameKey),
                size: unit.culture.special ? 18 : 21,
              ),
            ),
            if (unit.hasRankStar) ...[
              Positioned(
                left: inset + 117,
                top: 79,
                width: 23,
                height: 23,
                child: trainingArt('unit_rank_badge', fit: BoxFit.contain),
              ),
              Positioned(
                left: inset + 142,
                top: 80,
                width: 25,
                height: 25,
                child: trainingText(
                  '6',
                  size: 17,
                  color: const Color(0xffb8a66b),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
