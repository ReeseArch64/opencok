import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingUnitStats extends StatelessWidget {
  const TrainingUnitStats({
    super.key,
    required this.heroHeight,
    required this.selected,
  });
  final double heroHeight;
  final TrainingUnit selected;
  @override
  Widget build(BuildContext context) => trainingPosition(
    32,
    70 + heroHeight - 90,
    235,
    78,
    Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final (label, bar, value) in [
          (context.l10n.attack, 'attack', selected.attack),
          (context.l10n.defense, 'defense', selected.defense),
          (context.l10n.health, 'health', selected.hp),
        ])
          Row(
            children: [
              SizedBox(width: 85, child: trainingText('$label:', size: 18)),
              SizedBox(
                width: (value / 250 * 95).clamp(8.0, 95.0),
                height: 13,
                child: trainingArt('${bar}_bar'),
              ),
              trainingText(' $value', size: 16),
            ],
          ),
      ],
    ),
  );
}
