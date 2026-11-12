import 'package:opencok/domain/training/training_culture/training_culture.dart';

class TrainingUnit {
  const TrainingUnit(
    this.family,
    this.tier,
    this.nameKey, {
    this.culture = TrainingCulture.simple,
    this.assetName,
    this.sourceTier,
    this.sourceId,
  });
  final String family;
  final int tier;
  final String nameKey;
  final TrainingCulture culture;
  final String? assetName;
  final int? sourceTier;
  final String? sourceId;
  int get combatTier => sourceTier ?? tier;
  bool get hasRankStar => combatTier <= 10;
  bool get usesBodyPortrait =>
      assetName == null &&
      culture.special &&
      culture != TrainingCulture.persian;
  static const assetRoot = 'assets/ui/training/';
  String get assetPrefix =>
      '$assetRoot${assetName ?? '${culture.assetPrefix}${family}_tier_${tier.toString().padLeft(2, '0')}'}';
  String get body => '${assetPrefix}_body.png';
  String get portrait =>
      usesBodyPortrait ? body : '${assetPrefix}_portrait.png';

  int _strength(int base, int growth) =>
      ((base + combatTier * growth) *
              (switch (culture) {
                TrainingCulture.simple => 1.0,
                TrainingCulture.viking => 1.25,
                TrainingCulture.japanese => 1.2,
                TrainingCulture.chinese => 1.15,
                TrainingCulture.persian => 1.3,
                TrainingCulture.elite => 1.5,
              }))
          .round();
  int get attack => _strength(switch (family) {
    'cavalry' => 30,
    'archer' => 35,
    'siege' => 50,
    _ => 22,
  }, 9);
  int get defense => _strength(switch (family) {
    'cavalry' => 25,
    'archer' => 15,
    'siege' => 18,
    _ => 30,
  }, 7);
  int get hp => _strength(switch (family) {
    'cavalry' => 45,
    'archer' => 26,
    'siege' => 70,
    _ => 40,
  }, 12);
  int get foodCost => 30 + combatTier * 15 + (culture.special ? 12 : 0);
  int get woodCost => 20 + combatTier * 12 + (culture.special ? 8 : 0);
  int get ironCost => combatTier < 4 ? 0 : combatTier * 4;
  int get mithrilCost => combatTier < 8 ? 0 : combatTier * 2;
  int get secondsPerUnit => 2 + combatTier + (culture.special ? 1 : 0);
}
