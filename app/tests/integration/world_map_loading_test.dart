import 'dart:ui';

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/data/world_map/world_map_loader/world_map_loader.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test(
    'world loader connects the layout to the images rendered around the castle',
    () async {
      final scene = await WorldMapLoader.load();
      addTearDown(scene.dispose);
      expect(scene.focus, WorldMapScene.positionForCell(570, 570));
      final tiles = scene
          .tilesIn(
            Rect.fromCenter(center: scene.focus, width: 1024, height: 768),
          )
          .toList();
      expect(tiles, isNotEmpty);
      expect(
        tiles.every((tile) => scene.images.containsKey(tile.image)),
        isTrue,
      );
      final playerCastle = tiles.singleWhere((tile) => tile.image == 1101);
      expect(playerCastle.level, 1);
      expect(playerCastle.size, const Size(353, 314));
      expect(scene.images.keys.where((id) => id >= 1101 && id <= 1105), [1101]);
    },
  );
}
