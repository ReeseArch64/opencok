import 'dart:async';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/core/network/game_connection/game_connection.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';
import 'package:opencok/generated/world.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/ui/world_map/painters/world_map_painter/world_map_painter.dart';
import 'package:opencok/ui/world_map/widgets/world_map_viewport/world_map_viewport.dart';

class MapConnection extends GameConnection {
  MapConnection() : super(endpoint: Uri.parse('ws://localhost')) {
    status = GameConnectionStatus.online;
  }
  final requests = <Completer<MapRegion>>[];
  @override
  Future<MapRegion> queryMap({
    required int minX,
    required int minY,
    required int maxX,
    required int maxY,
  }) {
    final reply = Completer<MapRegion>();
    requests.add(reply);
    return reply.future;
  }

  void reconnect(bool online) {
    status = online
        ? GameConnectionStatus.online
        : GameConnectionStatus.reconnecting;
    notifyListeners();
  }
}

const region = MapRegion(
  requestId: 1,
  status: 0,
  kingdomId: 1,
  name: 'Reino',
  columns: 1200,
  rows: 1200,
  objects: [
    MapRegionObjectsItem(
      id: 1,
      kind: 1,
      x: 570,
      y: 570,
      width: 2,
      height: 2,
      level: 1,
    ),
  ],
  blocked: [],
);

void main() {
  testWidgets(
    'server objects replace preview objects; reconnect discards stale replies',
    (tester) async {
      final recorder = ui.PictureRecorder();
      final canvas = Canvas(recorder);
      canvas.drawColor(Colors.green, BlendMode.src);
      final picture = recorder.endRecording();
      final image = await picture.toImage(2, 2);
      picture.dispose();
      final scene = WorldMapScene(
        size: const Size(307200, 153612),
        images: {1: image, 1101: image, 2099: image},
        focus: WorldMapScene.positionForCell(570, 570),
        templateColumns: 1,
        templateRows: 1,
        layers: [
          {0: 1},
        ],
        centralTerrain: {},
        objects: [MapTile(1, WorldMapScene.positionForCell(570, 570))],
      );
      final connection = MapConnection();
      addTearDown(connection.dispose);
      addTearDown(image.dispose);
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          home: WorldMapViewport(scene: scene, connection: connection),
        ),
      );
      WorldMapPainter painter() => tester
          .widgetList<CustomPaint>(find.byType(CustomPaint))
          .map((w) => w.painter)
          .whereType<WorldMapPainter>()
          .single;
      expect(painter().objects, isEmpty);
      await tester.pump(const Duration(milliseconds: 200));
      expect(connection.requests.length, 1);
      connection.reconnect(false);
      await tester.pump();
      connection.requests.first.complete(region);
      await tester.pump();
      expect(painter().objects, isEmpty);
      connection.reconnect(true);
      await tester.pump(const Duration(milliseconds: 200));
      expect(connection.requests.length, 2);
      connection.requests.last.complete(region);
      await tester.pump();
      await tester.pump();
      expect(painter().objects!.single.image, 1101);
      final viewer = tester.widget<InteractiveViewer>(
        find.byType(InteractiveViewer),
      );
      viewer.transformationController!.value =
          viewer.transformationController!.value.clone()
            ..translateByDouble(-400, 0, 0, 1);
      await tester.pump(const Duration(milliseconds: 200));
      expect(connection.requests.length, 3);
      connection.requests.last.complete(
        const MapRegion(
          requestId: 3,
          status: 0,
          kingdomId: 1,
          name: 'Reino',
          columns: 1200,
          rows: 1200,
          objects: [],
          blocked: [],
        ),
      );
      await tester.pump();
      await tester.pump();
      expect(painter().objects, isEmpty);
      await tester.pumpWidget(const SizedBox());
    },
  );
}
