import 'package:flutter/material.dart';
import 'package:opencok/data/training/training_catalog/training_catalog.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';

class TrainingCultureSelector extends StatelessWidget {
  const TrainingCultureSelector({
    super.key,
    required this.selectedCulture,
    required this.onSelected,
  });
  final TrainingCulture selectedCulture;
  final ValueChanged<int> onSelected;
  @override
  Widget build(BuildContext context) => Stack(
    children: [
      trainingPosition(
        40,
        7,
        560,
        46,
        Row(
          children: [
            for (final culture in TrainingCatalog.availableCultures)
              Expanded(
                child: Semantics(
                  button: true,
                  selected: selectedCulture == culture,
                  label: context.l10n.cultureTitle(culture),
                  child: GestureDetector(
                    onTap: () => onSelected(
                      TrainingCatalog.availableCultures.indexOf(culture),
                    ),
                    behavior: HitTestBehavior.opaque,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: selectedCulture == culture
                                ? const Color(0xffd8bc74)
                                : const Color(0xff44433e),
                            border: Border.all(color: const Color(0xffa89468)),
                          ),
                        ),
                        const SizedBox(height: 5),
                        trainingText(
                          context.l10n.cultureLabel(culture),
                          size: 16,
                          color: selectedCulture == culture
                              ? const Color(0xffe8cf96)
                              : const Color(0xffc3bbaa),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    ],
  );
}
