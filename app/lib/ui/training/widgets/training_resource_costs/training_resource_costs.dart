import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingResourceCosts extends StatelessWidget {
  const TrainingResourceCosts({
    super.key,
    required this.selected,
    required this.count,
  });
  final TrainingUnit selected;
  final int count;
  String _amount(int value) => value >= 1000000
      ? '${(value / 1000000).toStringAsFixed(1)}M'
      : value >= 1000
      ? '${(value / 1000).toStringAsFixed(1)}K'
      : '$value';

  @override
  Widget build(BuildContext context) => Stack(
    children: [
      trainingPosition(
        46,
        177,
        548,
        38,
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            for (final (icon, cost) in [
              ('food', selected.foodCost),
              ('wood', selected.woodCost),
              ('iron', selected.ironCost),
              ('mithril', selected.mithrilCost),
            ])
              Row(
                children: [
                  SizedBox(
                    width: 26,
                    height: 28,
                    child: trainingArt(
                      '${icon}_cost_icon',
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(width: 5),
                  trainingText(_amount(cost * count), size: 18),
                ],
              ),
          ],
        ),
      ),
    ],
  );
}
