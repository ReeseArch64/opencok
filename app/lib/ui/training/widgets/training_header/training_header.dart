import 'package:flutter/material.dart';
import 'package:opencok/data/hud/reference_hud_data/reference_hud_data.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_button/training_button.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingHeader extends StatelessWidget {
  const TrainingHeader({super.key});
  @override
  Widget build(BuildContext context) => Stack(
    children: [
      trainingPosition(
        0,
        0,
        640,
        46,
        Image.asset(
          'assets/ui/hud/resources/resource_bar_background.png',
          fit: BoxFit.fill,
        ),
      ),
      for (final (index, icon, amount) in [
        (0, 'wood', referenceHudData.wood),
        (1, 'food', referenceHudData.food),
        (2, 'iron', referenceHudData.iron),
        (3, 'mithril', referenceHudData.mithril),
      ]) ...[
        trainingPosition(
          98 + index * 133.0,
          7,
          25,
          26,
          Image.asset(
            'assets/ui/hud/resources/${icon}_icon.png',
            fit: BoxFit.contain,
          ),
        ),
        trainingPosition(
          125 + index * 133.0,
          8,
          100,
          30,
          trainingText(amount, size: 23),
        ),
      ],
      trainingPosition(
        0,
        0,
        80,
        80,
        trainingButton(
          context.l10n.backToCastle,
          'back_button',
          () => Navigator.pop(context),
        ),
      ),
    ],
  );
}
