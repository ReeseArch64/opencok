import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/generated/world.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';

void main() {
  test('world packets share exact TypeScript and Go fixtures', () {
    final fixture = jsonDecode(
      File('../gameserver/testdata/world.json').readAsStringSync(),
    ) as Map<String, dynamic>;
    final query = Uint8List.fromList((fixture['query'] as List).cast<int>());
    final bytes = Uint8List.fromList((fixture['region'] as List).cast<int>());
    expect(MapQuery.decode(query).encode(), query);
    final region = MapRegion.decode(bytes);
    expect(region.encode(), bytes);
    expect(region.objects.single.x, 570);
    expect(region.blocked.single.x, 574);
    for (var i = 0; i < bytes.length; i++) {
      expect(
        () => MapRegion.decode(Uint8List.sublistView(bytes, 0, i)),
        throwsFormatException,
      );
    }
    for (final offset in [0, 1, 31]) {
      final invalid = Uint8List.fromList(bytes)..[offset] = 255;
      expect(() => MapRegion.decode(invalid), throwsFormatException);
    }
    expect(
      () => MapRegion.decode(Uint8List.fromList([...bytes, 0])),
      throwsFormatException,
    );
  });
  test(
    'logical cell coordinates round trip independently of camera projection',
    () {
      for (final (x, y) in [
        (1, 1),
        (570, 570),
        (1200, 1200),
        (1, 1200),
        (1200, 1),
      ]) {
        final cell = WorldMapScene.cellAt(WorldMapScene.positionForCell(x, y));
        expect(cell.dx, x.toDouble());
        expect(cell.dy, y.toDouble());
      }
    },
  );
}
