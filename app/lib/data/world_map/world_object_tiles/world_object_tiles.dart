import 'package:flutter/services.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';
import 'package:opencok/generated/world.dart';

List<MapTile> worldObjectTiles(
  WorldMapScene scene,
  Iterable<MapRegionObjectsItem> objects,
) {
  final result = <MapTile>[];
  void add(
    MapRegionObjectsItem object,
    int image,
    Offset offset, {
    Offset? levelOffset,
  }) {
    final sprite = scene.images[image]!;
    result.add(
      MapTile(
        image,
        WorldMapScene.positionForCell(object.x, object.y) + offset,
        size: Size(sprite.width.toDouble(), sprite.height.toDouble()),
        level: object.level == 0 ? null : object.level,
        levelOffset: levelOffset,
      ),
    );
  }

  final sorted = objects.toList()
    ..sort((a, b) {
      final depth = (a.x + a.y).compareTo(b.x + b.y);
      return depth == 0 ? a.id.compareTo(b.id) : depth;
    });
  for (final object in sorted) {
    switch (object.kind) {
      case 1:
        add(
          object,
          1101,
          const Offset(-176.5, -213),
          levelOffset: const Offset(225, 220),
        );
      case 2:
        add(
          object,
          2017,
          const Offset(-128, -70),
          levelOffset: const Offset(160, 92),
        );
      case 3:
        add(
          object,
          2020,
          const Offset(-128, -70),
          levelOffset: const Offset(160, 92),
        );
    }
  }
  return result;
}
