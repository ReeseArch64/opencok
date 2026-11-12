import 'package:flutter/material.dart';
import 'package:opencok/ui/login/painters/loading_atmosphere_painter/loading_atmosphere_painter.dart';

class LoadingAtmosphere extends StatefulWidget {
  const LoadingAtmosphere({super.key});

  @override
  State<LoadingAtmosphere> createState() => _LoadingAtmosphereState();
}

class _LoadingAtmosphereState extends State<LoadingAtmosphere>
    with SingleTickerProviderStateMixin {
  late final _animation = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 12),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _animation.stop();
    } else if (!_animation.isAnimating) {
      _animation.repeat();
    }
  }

  @override
  void dispose() {
    _animation.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: ExcludeSemantics(
      child: RepaintBoundary(
        child: CustomPaint(painter: LoadingAtmospherePainter(_animation)),
      ),
    ),
  );
}
