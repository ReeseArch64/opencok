import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_button/training_button.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';

class TrainingQuantitySelector extends StatelessWidget {
  const TrainingQuantitySelector({
    super.key,
    required this.count,
    required this.capacity,
    required this.quantity,
    required this.onCountChanged,
  });
  final int count;
  final int capacity;
  final TextEditingController quantity;
  final ValueChanged<int> onCountChanged;
  @override
  Widget build(BuildContext context) => Stack(
    children: [
      trainingPosition(
        44,
        230,
        40,
        40,
        trainingButton(
          context.l10n.decreaseQuantity,
          'decrease_button',
          () => onCountChanged(count - 1),
        ),
      ),
      trainingPosition(
        92,
        231,
        330,
        38,
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              height: 26,
              width: 330,
              child: trainingArt('quantity_slider_track'),
            ),
            Align(
              alignment: Alignment.centerLeft,
              child: SizedBox(
                height: 19,
                width: 330 * count / capacity,
                child: trainingArt('quantity_slider_fill'),
              ),
            ),
            SliderTheme(
              data: SliderThemeData(
                trackHeight: 0,
                overlayShape: SliderComponentShape.noOverlay,
                thumbShape: SliderComponentShape.noThumb,
              ),
              child: Slider(
                semanticFormatterCallback: (value) =>
                    context.l10n.unitCount(value.round()),
                value: count.toDouble(),
                min: 1,
                max: capacity.toDouble(),
                onChanged: (value) => onCountChanged(value.round()),
              ),
            ),
            Positioned(
              left: 292 * (count - 1) / (capacity - 1),
              width: 38,
              height: 38,
              child: IgnorePointer(child: trainingArt('quantity_slider_thumb')),
            ),
          ],
        ),
      ),
      trainingPosition(
        438,
        230,
        40,
        40,
        trainingButton(
          context.l10n.increaseQuantity,
          'increase_button',
          () => onCountChanged(count + 1),
        ),
      ),
      trainingPosition(
        490,
        232,
        112,
        36,
        TextField(
          key: const ValueKey('training-quantity'),
          controller: quantity,
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontFamily: 'Cooljazz',
            fontSize: 21,
            color: Colors.white,
          ),
          decoration: const InputDecoration(
            filled: true,
            fillColor: Color(0xff101010),
            contentPadding: EdgeInsets.all(5),
            border: InputBorder.none,
          ),
          onChanged: (value) {
            final count = int.tryParse(value);
            if (count != null) onCountChanged(count);
          },
          onEditingComplete: () {
            onCountChanged(int.tryParse(quantity.text) ?? 1);
            FocusScope.of(context).unfocus();
          },
        ),
      ),
    ],
  );
}
