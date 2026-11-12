import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingActions extends StatelessWidget {
  const TrainingActions({
    super.key,
    required this.selected,
    required this.count,
    required this.onInfo,
  });
  final TrainingUnit selected;
  final int count;
  final void Function(String, String) onInfo;
  String _amount(int value) => value >= 1000000
      ? '${(value / 1000000).toStringAsFixed(1)}M'
      : value >= 1000
      ? '${(value / 1000).toStringAsFixed(1)}K'
      : '$value';

  String get _trainingTime {
    final total = selected.secondsPerUnit * count;
    return '${(total ~/ 3600).toString().padLeft(2, '0')}:${(total ~/ 60 % 60).toString().padLeft(2, '0')}:${(total % 60).toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) => Stack(
    children: [
      for (final (x, image, label) in [
        (29.0, 'instant_train_button', context.l10n.trainNow),
        (361.0, 'train_button', context.l10n.train),
      ])
        trainingPosition(
          x,
          300,
          250,
          73,
          Semantics(
            button: true,
            label: label,
            excludeSemantics: true,
            child: GestureDetector(
              onTap: () => onInfo(
                context.l10n.trainingUnavailable,
                context.l10n.trainingUnavailableDescription,
              ),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  trainingArt(image),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      trainingText(label, size: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 26,
                            height: 25,
                            child: trainingArt(
                              image == 'train_button'
                                  ? 'training_time_icon'
                                  : 'gold_cost_icon',
                            ),
                          ),
                          trainingText(
                            image == 'train_button'
                                ? ' $_trainingTime'
                                : ' ${_amount((selected.secondsPerUnit * count / 60).ceil())}',
                            size: 20,
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
    ],
  );
}
