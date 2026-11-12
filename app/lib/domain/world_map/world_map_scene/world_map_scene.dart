import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/services.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';

class WorldMapScene {
  const WorldMapScene({
    required this.size,
    required this.images,
    required this.focus,
    required this.templateColumns,
    required this.templateRows,
    required this.layers,
    required this.centralTerrain,
    this.objects = const [],
  });

  final Size size;
  final Map<int, ui.Image> images;
  final Offset focus;
  final int templateColumns;
  final int templateRows;
  final List<Map<int, int>> layers;
  final Map<int, int> centralTerrain;
  final List<MapTile> objects;

  static const columns = 1200;
  static const rows = 1200;
  static const centerX = 600;
  static const centerY = 600;
  static const centralMin = 596;
  static const centralMax = 605;
  static const mudMin = 574;
  static const mudMax = 626;
  static const tileWidth = 256.0;
  static const tileHeight = 128.0;

  static Offset positionForCell(int x, int y) => Offset(
    (rows - 1 + x - y) * tileWidth / 2 + tileWidth / 2,
    (x + y - 2) * tileHeight / 2 + tileHeight / 2,
  );

  static Offset cellAt(Offset position) {
    final diagonal = position.dx / (tileWidth / 2) - rows;
    final depth = position.dy / (tileHeight / 2) - 1;
    return Offset((diagonal + depth) / 2 + 1, (depth - diagonal) / 2 + 1);
  }

  int? imageForCell(int x, int y, {int layer = 0}) {
    if (x < 1 || x > columns || y < 1 || y > rows) return null;
    if (x >= centralMin &&
        x <= centralMax &&
        y >= centralMin &&
        y <= centralMax) {
      if (layer != 0) return null;

      final terrain = switch ((x, y)) {
        (centralMin, centralMin) => 1039,
        (centralMax, centralMin) => 1037,
        (centralMin, centralMax) => 1042,
        (centralMax, centralMax) => 1040,
        (centralMin, _) => 1041,
        (centralMax, _) => 1036,
        (_, centralMin) => 1038,
        (_, centralMax) => 1043,
        _ => 1045,
      };
      return centralTerrain[terrain]!;
    }

    if (x >= mudMin && x <= mudMax && y >= mudMin && y <= mudMax) {
      if (layer != 0) return null;

      return switch ((x, y)) {
        (mudMin, mudMin) => 65,
        (mudMax, mudMin) => 69,
        (mudMin, mudMax) => 62,
        (mudMax, mudMax) => 63,
        (mudMin, _) => 66,
        (mudMax, _) => 71,
        (_, mudMin) => 73,
        (_, mudMax) => 64,
        _ => 76,
      };
    }

    final column = (x - centerX + templateColumns ~/ 2) % templateColumns;
    final row = (y - centerY + templateRows ~/ 2) % templateRows;
    return layers[layer][row * templateColumns + column] ??
        (layer == 0 ? 1 : null);
  }

  Iterable<MapTile> tilesIn(Rect visible, {List<MapTile>? objects}) sync* {
    final corners = [
      visible.topLeft,
      visible.topRight,
      visible.bottomLeft,
      visible.bottomRight,
    ].map(cellAt).toList();
    final minX = math.max(
      1,
      corners.map((p) => p.dx).reduce(math.min).floor() - 2,
    );
    final maxX = math.min(
      columns,
      corners.map((p) => p.dx).reduce(math.max).ceil() + 2,
    );
    final minY = math.max(
      1,
      corners.map((p) => p.dy).reduce(math.min).floor() - 2,
    );
    final maxY = math.min(
      rows,
      corners.map((p) => p.dy).reduce(math.max).ceil() + 2,
    );
    for (var layer = 0; layer < layers.length; layer++) {
      for (var y = minY; y <= maxY; y++) {
        for (var x = minX; x <= maxX; x++) {
          final image = imageForCell(x, y, layer: layer);
          if (image == null) continue;
          final tile = MapTile(
            image,
            positionForCell(x, y) -
                const Offset(tileWidth / 2, tileHeight / 2) -
                (image == 101 ? const Offset(128, 0) : Offset.zero),
            size: image == 101 ? const Size(512, 268) : const Size(256, 140),
          );
          if (visible.overlaps(tile.bounds)) yield tile;
        }
      }
    }
    for (final object in objects ?? this.objects) {
      if (visible.overlaps(object.bounds)) yield object;
    }
  }

  void dispose() {
    for (final image in images.values) {
      image.dispose();
    }
  }
}
