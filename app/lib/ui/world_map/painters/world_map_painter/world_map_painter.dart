import 'package:flutter/material.dart';
import 'package:opencok/domain/world_map/map_tile/map_tile.dart';
import 'package:opencok/domain/world_map/world_map_scene/world_map_scene.dart';

class WorldMapPainter extends CustomPainter {
  WorldMapPainter(this.scene, this.camera, this.viewport, {this.objects})
    : super(repaint: camera);
  final WorldMapScene scene;
  final TransformationController camera;
  final Size viewport;
  final List<MapTile>? objects;

  static const _levelOverlayImage = 2099;
  static const _levelOverlaySize = Size(40, 43);

  @override
  void paint(Canvas canvas, Size size) {
    final visible = Rect.fromPoints(
      camera.toScene(Offset.zero),
      camera.toScene(viewport.bottomRight(Offset.zero)),
    ).inflate(1);
    final paint = Paint()..filterQuality = FilterQuality.low;
    for (final tile in scene.tilesIn(visible, objects: objects)) {
      if (!visible.overlaps(tile.bounds)) continue;
      final image = scene.images[tile.image]!;
      canvas.drawImageRect(
        image,
        Rect.fromLTWH(0, 0, image.width.toDouble(), image.height.toDouble()),
        tile.bounds,
        paint,
      );
      if (tile.level case final level?) {
        final overlay = scene.images[_levelOverlayImage]!;
        final levelOffset =
            tile.levelOffset ??
            Offset(
              tile.size.width - _levelOverlaySize.width - 8,
              tile.size.height - _levelOverlaySize.height + 5,
            );
        final overlayBounds = Rect.fromLTWH(
          tile.position.dx + levelOffset.dx,
          tile.position.dy + levelOffset.dy,
          _levelOverlaySize.width,
          _levelOverlaySize.height,
        );
        canvas.drawImageRect(
          overlay,
          Rect.fromLTWH(
            0,
            0,
            overlay.width.toDouble(),
            overlay.height.toDouble(),
          ),
          overlayBounds,
          paint,
        );
        final levelPainter = TextPainter(
          text: TextSpan(
            text: '$level',
            style: const TextStyle(
              color: Colors.white,
              fontFamily: 'serif',
              fontSize: 14,
              shadows: [
                Shadow(
                  color: Colors.black,
                  blurRadius: 2,
                  offset: Offset(1, 1),
                ),
              ],
            ),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        levelPainter.paint(
          canvas,
          Offset(
            overlayBounds.center.dx - levelPainter.width / 2,
            overlayBounds.top + 18 - levelPainter.height / 2,
          ),
        );
      }
    }
  }

  @override
  bool shouldRepaint(WorldMapPainter oldDelegate) =>
      objects != oldDelegate.objects ||
      scene != oldDelegate.scene ||
      viewport != oldDelegate.viewport ||
      camera != oldDelegate.camera;
}
