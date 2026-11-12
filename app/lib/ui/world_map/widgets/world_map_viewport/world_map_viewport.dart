import 'dart:math' as math;
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:opencok/core/network/game_connection/game_connection.dart';
import 'package:opencok/data/world_map/world_object_tiles/world_object_tiles.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';
import 'package:opencok/generated/world.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';
import 'package:opencok/ui/world_map/painters/world_map_painter/world_map_painter.dart';

class WorldMapViewport extends StatefulWidget {
  const WorldMapViewport({super.key, required this.scene, this.connection});
  final WorldMapScene scene;
  final GameConnection? connection;

  @override
  State<WorldMapViewport> createState() => _WorldMapViewportState();
}

class _WorldMapViewportState extends State<WorldMapViewport> {
  final _camera = TransformationController();
  Size? _viewport;
  Timer? _queryTimer;
  int _generation = 0;
  String? _regionKey;
  bool _online = false;
  bool _queryError = false;
  List<MapTile> _objects = [];

  @override
  void initState() {
    super.initState();
    _camera.addListener(_scheduleQuery);
    widget.connection?.addListener(_connectionChanged);
    _online = widget.connection?.online ?? false;
  }

  @override
  void didUpdateWidget(WorldMapViewport oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.connection != widget.connection ||
        oldWidget.scene != widget.scene) {
      oldWidget.connection?.removeListener(_connectionChanged);
      widget.connection?.addListener(_connectionChanged);
      _online = widget.connection?.online ?? false;
      _invalidate();
    }
  }

  void _invalidate() {
    ++_generation;
    _regionKey = null;
    _objects = [];
    _queryError = false;
    _scheduleQuery();
  }

  void _connectionChanged() {
    final online = widget.connection?.online ?? false;
    if (online == _online) return;
    _online = online;
    setState(_invalidate);
  }

  void _scheduleQuery() {
    _queryTimer?.cancel();
    // Debounce camera motion; changing the requested region also invalidates late replies.
    ++_generation;
    _queryTimer = Timer(
      const Duration(milliseconds: 180),
      () => unawaited(_query()),
    );
  }

  Future<void> _query() async {
    final connection = widget.connection;
    final viewport = _viewport;
    if (connection == null || !connection.online || viewport == null) return;
    final corners = [
      Offset.zero,
      Offset(viewport.width, 0),
      Offset(0, viewport.height),
      viewport.bottomRight(Offset.zero),
    ].map((p) => WorldMapScene.cellAt(_camera.toScene(p))).toList();
    final minX = (corners.map((p) => p.dx).reduce(math.min).floor() - 4).clamp(
      1,
      1200,
    );
    final minY = (corners.map((p) => p.dy).reduce(math.min).floor() - 4).clamp(
      1,
      1200,
    );
    final maxX = (corners.map((p) => p.dx).reduce(math.max).ceil() + 4).clamp(
      1,
      1200,
    );
    final maxY = (corners.map((p) => p.dy).reduce(math.max).ceil() + 4).clamp(
      1,
      1200,
    );
    final key = '$minX,$minY,$maxX,$maxY';
    if (key == _regionKey && !_queryError) return;
    final generation = _generation;
    try {
      final objects = <int, MapRegionObjectsItem>{};
      var chunks = 0;
      // Split unusually wide viewports into bounded server regions.
      for (var y = minY; y <= maxY; y += 64) {
        for (var x = minX; x <= maxX; x += 64) {
          if (chunks++ > 0) {
            await Future<void>.delayed(const Duration(milliseconds: 150));
          }
          if (!mounted || generation != _generation) return;
          final region = await connection.queryMap(
            minX: x,
            minY: y,
            maxX: math.min(x + 63, maxX),
            maxY: math.min(y + 63, maxY),
          );
          if (region.status != 0 ||
              region.kingdomId != 1 ||
              region.columns != 1200 ||
              region.rows != 1200) {
            throw const FormatException('Map unavailable');
          }
          for (final object in region.objects) {
            objects[object.id] = object;
          }
        }
      }
      if (!mounted || generation != _generation) return;
      setState(() {
        _objects = worldObjectTiles(widget.scene, objects.values);
        _regionKey = key;
        _queryError = false;
      });
    } catch (_) {
      if (mounted && generation == _generation) {
        setState(() => _queryError = true);
      }
    }
  }

  @override
  void dispose() {
    ++_generation;
    _queryTimer?.cancel();
    widget.connection?.removeListener(_connectionChanged);
    _camera.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final viewport = constraints.biggest;
      final scene = widget.scene;
      final minimumScale = math.max(
        0.35,
        math.max(
          viewport.width / scene.size.width,
          viewport.height / scene.size.height,
        ),
      );
      if (_viewport != viewport) {
        final focus = _viewport == null
            ? scene.focus
            : _camera.toScene(_viewport!.center(Offset.zero));
        final scale = math.max(
          minimumScale,
          _viewport == null ? 0.7 : _camera.value.getMaxScaleOnAxis(),
        );
        final x = (viewport.width / 2 - focus.dx * scale)
            .clamp(viewport.width - scene.size.width * scale, 0.0)
            .toDouble();
        final y = (viewport.height / 2 - focus.dy * scale)
            .clamp(viewport.height - scene.size.height * scale, 0.0)
            .toDouble();

        _camera.value = Matrix4.diagonal3Values(scale, scale, scale)
          ..setTranslationRaw(x, y, 0);
        _viewport = viewport;
        _scheduleQuery();
      }
      final map = Semantics(
        label: 'Mapa. Arraste para explorar e use dois dedos para ampliar.',
        child: RepaintBoundary(
          child: InteractiveViewer(
            transformationController: _camera,
            constrained: false,
            alignment: Alignment.topLeft,
            minScale: minimumScale,
            maxScale: math.max(1.5, minimumScale),
            child: CustomPaint(
              size: scene.size,
              painter: WorldMapPainter(
                scene,
                _camera,
                viewport,
                objects: widget.connection == null ? null : _objects,
              ),
            ),
          ),
        ),
      );
      return Stack(
        children: [
          Positioned.fill(child: map),
          if (_queryError)
            Positioned(
              left: 16,
              right: 16,
              bottom: 100,
              child: Material(
                color: const Color(0xdd101822),
                child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: Row(
                    children: [
                      Expanded(child: Text(context.l10n.mapLoadError)),
                      IconButton(
                        tooltip: context.l10n.retry,
                        onPressed: _scheduleQuery,
                        icon: const Icon(Icons.refresh),
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      );
    },
  );
}
