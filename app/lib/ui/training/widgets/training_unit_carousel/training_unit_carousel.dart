import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';
import 'package:opencok/ui/training/widgets/training_position/training_position.dart';
import 'package:opencok/ui/training/widgets/training_unit_card/training_unit_card.dart';

class TrainingUnitCarousel extends StatelessWidget {
  const TrainingUnitCarousel({
    super.key,
    required this.heroHeight,
    required this.culture,
    required this.units,
    required this.carousel,
    required this.selectedIndex,
    required this.onScrollEnd,
  });
  final double heroHeight;
  final TrainingCulture culture;
  final List<TrainingUnit> units;
  final PageController carousel;
  final int selectedIndex;
  final bool Function(ScrollEndNotification) onScrollEnd;
  @override
  Widget build(BuildContext context) => trainingPosition(
    245,
    70,
    395,
    heroHeight,
    TweenAnimationBuilder<double>(
      key: ValueKey(culture),
      tween: Tween(begin: 0, end: 1),
      duration: const Duration(milliseconds: 160),
      builder: (context, opacity, child) =>
          Opacity(opacity: opacity, child: child),
      child: ShaderMask(
        blendMode: BlendMode.dstIn,
        shaderCallback: (bounds) => const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Colors.transparent,
            Colors.white,
            Colors.white,
            Colors.transparent,
          ],
          stops: [0, 0.26, 0.72, 1],
        ).createShader(bounds),
        child: NotificationListener<ScrollEndNotification>(
          onNotification: onScrollEnd,
          child: PageView.builder(
            key: PageStorageKey('training-unit-list-${culture.name}'),
            controller: carousel,
            reverse: true,
            scrollDirection: Axis.vertical,
            itemCount: units.length,
            itemBuilder: (context, index) {
              final unit = units[index];
              return AnimatedBuilder(
                animation: carousel,
                builder: (context, child) {
                  final page =
                      carousel.hasClients &&
                          carousel.position.hasContentDimensions
                      ? carousel.page ?? selectedIndex.toDouble()
                      : selectedIndex.toDouble();
                  final selected = index == selectedIndex;
                  final distance = (index - page).abs();
                  return TrainingUnitCard(
                    unit: unit,
                    index: index,
                    selected: selected,
                    distance: distance,
                    onTap: () => carousel.animateToPage(
                      index,
                      duration: const Duration(milliseconds: 230),
                      curve: Curves.easeOut,
                    ),
                  );
                },
              );
            },
          ),
        ),
      ),
    ),
  );
}
