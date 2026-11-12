import 'package:opencok/domain/training/training_culture/training_culture.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';

const additionalTrainingUnits = <TrainingUnit>[
  TrainingUnit(
    'cavalry',
    11,
    'unitSlaughterCavalry',
    culture: TrainingCulture.simple,
    assetName: 'simple_cavalry_tier_11_slaughter_cavalry',
    sourceTier: 11,
    sourceId: '107410',
  ),
  TrainingUnit(
    'cavalry',
    11,
    'unitRangerKnight',
    culture: TrainingCulture.simple,
    assetName: 'simple_cavalry_tier_11_ranger_knight',
    sourceTier: 11,
    sourceId: '107412',
  ),
];
