import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/data/castle/castle_environment_loader/castle_environment_loader.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'castle loader decodes terrain, water and all military buildings',
    () async {
      final environment = await CastleEnvironmentLoader.load();
      addTearDown(environment.dispose);
      expect(environment.images['river_surface']!.width, 190);
      expect(environment.images['river_surface']!.height, 75);
      for (final building in CastleBuildings.military) {
        expect(environment.images.containsKey(building.asset), isTrue);
      }
    },
  );
}
