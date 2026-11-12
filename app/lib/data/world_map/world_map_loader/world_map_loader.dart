import 'dart:convert';
import 'dart:ui' as ui;

import 'package:flutter/services.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';

class WorldMapLoader {
  static Future<WorldMapScene> load({AssetBundle? bundle}) async {
    final assetsBundle = bundle ?? rootBundle;
    final data = jsonDecode(
      await assetsBundle.loadString('assets/world_map/kingdom_layout.json'),
    ) as Map<String, dynamic>;
    final templateColumns = data['columns'] as int;
    final templateRows = data['rows'] as int;
    final width = (data['tileWidth'] as num).toDouble();
    final height = (data['tileHeight'] as num).toDouble();
    final assets = data['assets'] as Map<String, dynamic>;
    final focus = data['focus'] as Map<String, dynamic>;
    final images = <int, ui.Image>{};
    try {
      for (final entry in assets.entries) {
        final bytes = await assetsBundle.load('assets/${entry.value}');
        final codec = await ui.instantiateImageCodec(
          bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes),
        );
        try {
          images[int.parse(entry.key)] = (await codec.getNextFrame()).image;
        } finally {
          codec.dispose();
        }
      }
      final layers = <Map<int, int>>[];
      for (final layer in data['layers'] as List) {
        final cells = <int, int>{};
        layers.add(cells);
        for (final tile in layer['tiles'] as List) {
          final column = tile[0] as int;
          final row = tile[1] as int;
          cells[row * templateColumns + column] = tile[2] as int;
        }
      }
      final size = Size(
        (WorldMapScene.columns + WorldMapScene.rows) * width / 2,
        (WorldMapScene.columns + WorldMapScene.rows - 2) * height / 2 +
            (data['imageHeight'] as num),
      );
      return WorldMapScene(
        size: size,
        images: images,
        focus: WorldMapScene.positionForCell(
          focus['x'] as int,
          focus['y'] as int,
        ),
        templateColumns: templateColumns,
        templateRows: templateRows,
        layers: layers,
        centralTerrain: {
          for (final entry
              in (data['centralTerrain'] as Map<String, dynamic>).entries)
            int.parse(entry.key): entry.value as int,
        },
        objects: [
          for (final object in data['objects'] as List? ?? const [])
            MapTile(
              object['image'] as int,
              WorldMapScene.positionForCell(
                    object['x'] as int,
                    object['y'] as int,
                  ) +
                  Offset(
                    (object['offsetX'] as num).toDouble(),
                    (object['offsetY'] as num).toDouble(),
                  ),
              size: Size(
                images[object['image']]!.width.toDouble(),
                images[object['image']]!.height.toDouble(),
              ),
              level: object['level'] as int?,
              levelOffset: object['levelOffsetX'] == null
                  ? null
                  : Offset(
                      (object['levelOffsetX'] as num).toDouble(),
                      (object['levelOffsetY'] as num).toDouble(),
                    ),
            ),
        ],
      );
    } catch (_) {
      for (final image in images.values) {
        image.dispose();
      }
      rethrow;
    }
  }
}
