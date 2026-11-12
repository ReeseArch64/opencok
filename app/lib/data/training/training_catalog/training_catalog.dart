import 'package:opencok/data/training/additional_training_units/additional_training_units.dart';
import 'package:opencok/data/training/elite_training_units/elite_training_units.dart';
import 'package:opencok/data/training/standard_training_units/standard_training_units.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';

class TrainingCatalog {
  // Other cultures remain in the catalog for future releases.
  static const availableCultures = [TrainingCulture.simple];

  // High-tier troops belong to one culture; they are not reskinned copies.
  static const specialOwners = <(String, int), TrainingCulture>{
    ('archer', 11): TrainingCulture.simple,
    ('archer', 12): TrainingCulture.japanese,
    ('cavalry', 12): TrainingCulture.viking,
    ('siege', 11): TrainingCulture.chinese,
    ('siege', 12): TrainingCulture.japanese,
    ('infantry', 11): TrainingCulture.japanese,
    ('infantry', 12): TrainingCulture.viking,
  };

  static const _highTierModels = <(String, int), (String, String)>{
    ('archer', 11): ('107211', 'unitHighArcher11'),
    ('archer', 12): ('107212', 'unitHighArcher12'),
    ('cavalry', 12): ('107111', 'unitHighCavalry12'),
    ('siege', 11): ('107311', 'unitHighSiege11'),
    ('siege', 12): ('107312', 'unitHighSiege12'),
    ('infantry', 11): ('107011', 'unitHighInfantry11'),
    ('infantry', 12): ('107012', 'unitHighInfantry12'),
  };

  static List<TrainingUnit> forBuilding(
    String building, {
    TrainingCulture culture = TrainingCulture.simple,
  }) {
    final standard = standardTrainingUnits[building]!;
    final family = standard.first.family;
    if (culture == TrainingCulture.elite) return eliteTrainingUnits[family]!;
    return [
      for (final unit in standard)
        culture == TrainingCulture.simple
            ? unit
            : TrainingUnit(
                family,
                unit.tier,
                _name(family, culture),
                culture: culture,
              ),
      for (final entry in specialOwners.entries)
        if (entry.key.$1 == family && entry.value == culture)
          TrainingUnit(
            family,
            entry.key.$2,
            _highTierModels[entry.key]!.$2,
            culture: culture,
            sourceId: _highTierModels[entry.key]!.$1,
          ),
      if (culture == TrainingCulture.simple)
        ...additionalTrainingUnits.where((unit) => unit.family == family),
    ];
  }

  static String _name(String family, TrainingCulture culture) =>
      'unit${culture.name}_$family';
}
