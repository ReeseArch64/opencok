import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/l10n/game_names.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';
import 'package:opencok/ui/training/widgets/training_button/training_button.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_text/training_text.dart';
import 'package:opencok/ui/training/widgets/training_unit_carousel/training_unit_carousel.dart';
import 'package:opencok/ui/training/widgets/training_unit_stats/training_unit_stats.dart';

class TrainingUnitPreview extends StatelessWidget {
  const TrainingUnitPreview({
    super.key,
    required this.heroHeight,
    required this.selected,
    required this.selectedIndex,
    required this.units,
    required this.culture,
    required this.carousel,
    required this.onScrollEnd,
    required this.onDragStart,
    required this.onDragUpdate,
    required this.onDragEnd,
    required this.onInfo,
  });
  final double heroHeight;
  final TrainingUnit selected;
  final int selectedIndex;
  final List<TrainingUnit> units;
  final TrainingCulture culture;
  final PageController carousel;
  final bool Function(ScrollEndNotification) onScrollEnd;
  final VoidCallback onDragStart;
  final ValueChanged<double> onDragUpdate;
  final GestureDragEndCallback onDragEnd;
  final void Function(String, String) onInfo;
  @override
  Widget build(BuildContext context) => GestureDetector(
    onHorizontalDragStart: (_) => onDragStart(),
    onHorizontalDragUpdate: (details) => onDragUpdate(details.delta.dx),
    onHorizontalDragEnd: onDragEnd,
    child: Stack(
      children: [
        trainingPosition(
          42,
          20,
          37,
          40,
          trainingArt('${selected.family}_type_icon', fit: BoxFit.contain),
        ),
        trainingPosition(
          84,
          21,
          42,
          42,
          trainingButton(
            context.l10n.unitInformation,
            'info_button',
            () => onInfo(
              context.l10n.gameName(selected.nameKey),
              context.l10n.unitDetails(
                context.l10n.gameName(selected.nameKey),
                selected.tier,
                selected.attack,
                selected.defense,
                selected.hp,
              ),
            ),
          ),
        ),
        trainingPosition(
          140,
          27,
          190,
          35,
          trainingText(context.l10n.ownedUnits('1M')),
        ),
        trainingPosition(
          478,
          10,
          150,
          48,
          Semantics(
            button: true,
            label: context.l10n.combatRelation,
            child: GestureDetector(
              onTap: () => onInfo(
                context.l10n.combatRelation,
                context.l10n.combatRelationDescription,
              ),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  trainingArt('combat_relation_button'),
                  Center(
                    child: trainingText(
                      context.l10n.combatRelationButton,
                      size: 15,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        trainingPosition(
          0,
          85,
          380,
          heroHeight,
          IgnorePointer(
            child: ShaderMask(
              blendMode: BlendMode.dstIn,
              shaderCallback: (bounds) => const RadialGradient(
                colors: [Colors.white, Colors.white, Colors.transparent],
                stops: [0, 0.4, 1],
              ).createShader(bounds),
              child: ImageFiltered(
                imageFilter: ui.ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Image.asset(
                  'assets/castle/environment/upper_courtyard_r02_c05.png',
                  fit: BoxFit.cover,
                  color: const Color(0xffb89a72),
                  colorBlendMode: BlendMode.modulate,
                ),
              ),
            ),
          ),
        ),
        trainingPosition(
          40,
          90,
          280,
          heroHeight - 140,
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 160),
            child: Image.asset(
              selected.body,
              key: ValueKey(selected.body),
              gaplessPlayback: true,
              fit: BoxFit.contain,
              semanticLabel: context.l10n.gameName(selected.nameKey),
            ),
          ),
        ),
        TrainingUnitCarousel(
          heroHeight: heroHeight,
          culture: culture,
          units: units,
          carousel: carousel,
          selectedIndex: selectedIndex,
          onScrollEnd: onScrollEnd,
        ),
        trainingPosition(
          210,
          70,
          210,
          heroHeight,
          IgnorePointer(
            child: ColorFiltered(
              colorFilter: const ColorFilter.matrix([
                3,
                0,
                0,
                0,
                20,
                0,
                3,
                0,
                0,
                20,
                0,
                0,
                3,
                0,
                20,
                0,
                0,
                0,
                1,
                0,
              ]),
              child: trainingArt('unit_carousel_divider'),
            ),
          ),
        ),
        TrainingUnitStats(heroHeight: heroHeight, selected: selected),
      ],
    ),
  );
}
