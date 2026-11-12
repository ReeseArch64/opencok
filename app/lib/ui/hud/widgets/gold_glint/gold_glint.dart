import 'package:flutter/material.dart';
import 'package:opencok/ui/hud/painters/gold_glint_painter/gold_glint_painter.dart';

class GoldGlint extends StatefulWidget {
  const GoldGlint({super.key});

  @override
  State<GoldGlint> createState() => _GoldGlintState();
}

class _GoldGlintState extends State<GoldGlint>
    with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 4600),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
      _controller.value = 0;
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: RepaintBoundary(
      child: CustomPaint(painter: GoldGlintPainter(_controller)),
    ),
  );
}
