import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/core/platform/platform_ui/platform_ui.dart';
import 'package:opencok/data/castle/castle_buildings/castle_buildings.dart';
import 'package:opencok/domain/castle/castle_building/castle_building.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/castle/painters/castle_ambience_painter/castle_ambience_painter.dart';
import 'package:opencok/ui/castle/painters/castle_environment_painter/castle_environment_painter.dart';
import 'package:opencok/ui/castle/painters/castle_water_painter/castle_water_painter.dart';
import 'package:opencok/ui/castle/widgets/castle_building_menu/castle_building_menu.dart';
import 'package:opencok/ui/training/screens/training_screen/training_screen.dart';

class CastleViewport extends StatefulWidget {
  const CastleViewport({super.key, required this.environment});

  final CastleEnvironment environment;

  @override
  State<CastleViewport> createState() => _CastleViewportState();
}

class _CastleViewportState extends State<CastleViewport>
    with TickerProviderStateMixin {
  late final _ambience = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 120),
  );
  late final _cameraMotion = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 440),
  );
  Matrix4Tween? _cameraTween;
  CastleBuilding? _selected;

  @override
  void initState() {
    super.initState();
    _camera.addListener(_constrainCamera);
    _cameraMotion.addListener(() {
      final tween = _cameraTween;
      if (tween != null) {
        _camera.value = tween.transform(
          Curves.easeOutCubic.transform(_cameraMotion.value),
        );
      }
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _ambience.stop();
    } else {
      _ambience.repeat();
    }
  }

  void _constrainCamera() {
    final viewport = _viewport;
    if (viewport == null) return;
    final scale = _camera.value.getMaxScaleOnAxis();
    final bounds = CastleEnvironment.playableBounds;
    final translation = _camera.value.getTranslation();
    final x = translation.x.clamp(
      viewport.width - bounds.right * scale,
      -bounds.left * scale,
    );
    final y = translation.y.clamp(
      viewport.height - bounds.bottom * scale,
      -bounds.top * scale,
    );
    if ((x - translation.x).abs() < 0.001 &&
        (y - translation.y).abs() < 0.001) {
      return;
    }
    _camera.value = _camera.value.clone()..setTranslationRaw(x, y, 0);
  }

  void _select(Offset position, Size viewport, double minimumScale) {
    CastleBuilding? selected;
    for (final building in CastleBuildings.military.reversed) {
      if (building.bounds.contains(position)) {
        selected = building;
        break;
      }
    }
    setState(() => _selected = selected);
    if (selected == null) return;
    final scale = math
        .max(
          _camera.value.getMaxScaleOnAxis(),
          math.max(minimumScale, viewport.height / 1500),
        )
        .clamp(0.0, 1.5);
    final focus = selected.bounds.center;
    final end = Matrix4.diagonal3Values(scale, scale, scale)
      ..setTranslationRaw(
        (viewport.width / 2 - focus.dx * scale).clamp(
          viewport.width - CastleEnvironment.size.width * scale,
          -CastleEnvironment.playableBounds.left * scale,
        ),
        (viewport.height * 0.43 - focus.dy * scale).clamp(
          viewport.height - CastleEnvironment.size.height * scale,
          0.0,
        ),
        0,
      );
    if (MediaQuery.disableAnimationsOf(context)) {
      _camera.value = end;
    } else {
      _cameraTween = Matrix4Tween(begin: _camera.value.clone(), end: end);
      _cameraMotion.forward(from: 0);
    }
  }

  final _camera = TransformationController();
  Size? _viewport;

  @override
  void dispose() {
    _cameraMotion.dispose();
    _ambience.dispose();
    _camera.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final viewport = constraints.biggest;
      const size = CastleEnvironment.size;
      final minimumScale = math.max(
        math.max(
          viewport.width / CastleEnvironment.playableBounds.width,
          viewport.height / size.height,
        ),
        usesMobileSystemUi ? viewport.height / 1900 : 0.0,
      );
      if (_viewport != viewport) {
        final focus = _viewport == null
            ? const Offset(4160, 1340)
            : _camera.toScene(_viewport!.center(Offset.zero));
        final scale = math.max(
          minimumScale,
          _viewport == null
              ? viewport.height / (viewport.width < 600 ? 1500 : 1900)
              : _camera.value.getMaxScaleOnAxis(),
        );
        final x = (viewport.width / 2 - focus.dx * scale)
            .clamp(
              viewport.width - size.width * scale,
              -CastleEnvironment.playableBounds.left * scale,
            )
            .toDouble();
        final y = (viewport.height / 2 - focus.dy * scale)
            .clamp(viewport.height - size.height * scale, 0.0)
            .toDouble();

        _viewport = viewport;
        _camera.value = Matrix4.diagonal3Values(scale, scale, scale)
          ..setTranslationRaw(x, y, 0);
      }
      return Stack(
        children: [
          Semantics(
            label: context.l10n.castleInstructions,
            child: InteractiveViewer(
              transformationController: _camera,
              constrained: false,
              alignment: Alignment.topLeft,
              minScale: minimumScale,
              maxScale: math.max(1.5, minimumScale),
              onInteractionStart: (_) => _cameraMotion.stop(),
              child: GestureDetector(
                behavior: HitTestBehavior.opaque,
                onTapUp: (details) =>
                    _select(details.localPosition, viewport, minimumScale),
                child: SizedBox.fromSize(
                  size: size,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      RepaintBoundary(
                        child: CustomPaint(
                          painter: CastleEnvironmentPainter(
                            widget.environment,
                            _camera,
                            viewport,
                            backdrop: true,
                          ),
                        ),
                      ),
                      RepaintBoundary(
                        child: CustomPaint(
                          painter: CastleWaterPainter(
                            widget.environment,
                            _ambience,
                            _camera,
                            viewport,
                          ),
                        ),
                      ),
                      RepaintBoundary(
                        child: CustomPaint(
                          painter: CastleEnvironmentPainter(
                            widget.environment,
                            _camera,
                            viewport,
                          ),
                        ),
                      ),
                      RepaintBoundary(
                        child: CustomPaint(
                          painter: CastleAmbiencePainter(
                            widget.environment,
                            _ambience,
                            _camera,
                            viewport,
                            selected: _selected,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (_selected case final building?)
            AnimatedBuilder(
              animation: _camera,
              builder: (context, _) {
                final anchor = MatrixUtils.transformPoint(
                  _camera.value,
                  building.bounds.bottomCenter,
                );
                final width = math.min(280.0, viewport.width - 24);
                return Positioned(
                  left: (anchor.dx - width / 2).clamp(
                    12.0,
                    viewport.width - width - 12,
                  ),
                  top: (anchor.dy + 16).clamp(
                    130.0,
                    math.max(130.0, viewport.height - 280),
                  ),
                  width: width,
                  child: CastleBuildingMenu(
                    key: ValueKey(building.asset),
                    building: building,
                    onClose: () => setState(() => _selected = null),
                    onTrain: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                        builder: (_) => TrainingScreen(building: building),
                      ),
                    ),
                  ),
                );
              },
            ),
        ],
      );
    },
  );
}
