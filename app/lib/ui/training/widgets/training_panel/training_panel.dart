import 'package:flutter/material.dart';
import 'package:opencok/domain/castle/castle_building/castle_building.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_actions/training_actions.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_button/training_button.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_quantity_selector/training_quantity_selector.dart';
import 'package:opencok/ui/training/widgets/training_resource_costs/training_resource_costs.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingPanel extends StatelessWidget {
  const TrainingPanel({
    super.key,
    required this.selected,
    required this.count,
    required this.culture,
    required this.quantity,
    required this.onCountChanged,
    required this.capacity,
    required this.building,
    required this.onInfo,
  });
  final TrainingUnit selected;
  final int count;
  final TrainingCulture culture;
  final TextEditingController quantity;
  final ValueChanged<int> onCountChanged;
  final int capacity;
  final CastleBuilding building;
  final void Function(String, String) onInfo;
  @override
  Widget build(BuildContext context) => Stack(
    children: [
      trainingPosition(
        12,
        0,
        616,
        383,
        ColoredBox(
          color: const Color(0xff212121),
          child: Image.asset(
            '${TrainingUnit.assetRoot}panel_frame.png',
            fit: BoxFit.fill,
            centerSlice: const Rect.fromLTWH(20, 20, 18, 18),
          ),
        ),
      ),
      trainingPosition(
        20,
        8,
        600,
        52,
        Stack(
          fit: StackFit.expand,
          children: [
            trainingArt('training_panel_heading'),
            Center(
              child: trainingText(
                context.l10n.trainingHeading(
                  context.l10n.cultureTitle(culture),
                  context.l10n.gameName(building.nameKey),
                ),
                size: 21,
              ),
            ),
          ],
        ),
      ),
      trainingPosition(
        45,
        78,
        490,
        40,
        trainingText(context.l10n.trainingBonusHint, size: 19),
      ),
      trainingPosition(
        540,
        73,
        38,
        38,
        trainingButton(
          context.l10n.trainingBonus,
          'increase_button',
          () => onInfo(
            context.l10n.trainingBonus,
            context.l10n.trainingBonusDescription,
          ),
        ),
      ),
      trainingPosition(
        65,
        130,
        510,
        36,
        trainingText(
          context.l10n.trainingCapacity(capacity),
          size: 16,
          color: const Color(0xffbfb6a1),
        ),
      ),
      TrainingResourceCosts(selected: selected, count: count),
      TrainingQuantitySelector(
        count: count,
        capacity: capacity,
        quantity: quantity,
        onCountChanged: onCountChanged,
      ),
      TrainingActions(selected: selected, count: count, onInfo: onInfo),
    ],
  );
}
