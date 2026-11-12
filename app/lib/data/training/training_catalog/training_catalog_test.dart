import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/data/training/training_catalog/training_catalog.dart';
import 'package:opencok/domain/training/training_culture/training_culture.dart';

void main() {
  test('each military building has troops for every culture', () {
    for (final building in CastleBuildings.military) {
      final family = TrainingCatalog.forBuilding(building.asset).first.family;
      for (final culture in TrainingCulture.values) {
        final units = TrainingCatalog.forBuilding(
          building.asset,
          culture: culture,
        );
        expect(units, isNotEmpty, reason: '${building.nameKey}: $culture');
        expect(units.every((unit) => unit.family == family), isTrue);
        expect(units.every((unit) => unit.culture == culture), isTrue);
        expect(units.map((unit) => unit.body).toSet().length, units.length);
      }
    }
  });

  test('high-tier troops appear only in their owning culture', () {
    for (final building in CastleBuildings.military) {
      final family = TrainingCatalog.forBuilding(building.asset).first.family;
      for (final owner in TrainingCatalog.specialOwners.entries) {
        if (owner.key.$1 != family) continue;
        for (final culture in TrainingCulture.values.where(
          (culture) => culture != TrainingCulture.elite,
        )) {
          final matches = TrainingCatalog.forBuilding(
            building.asset,
            culture: culture,
          ).where((unit) => unit.tier == owner.key.$2 && unit.sourceId != null);
          expect(matches.length, culture == owner.value ? 1 : 0);
        }
      }
    }
  });
}
