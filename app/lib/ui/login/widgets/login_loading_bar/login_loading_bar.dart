import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/login/painters/loading_bar_shimmer_painter/loading_bar_shimmer_painter.dart';

class LoginLoadingBar extends StatefulWidget {
  const LoginLoadingBar({super.key, this.onCompleted});

  final VoidCallback? onCompleted;

  @override
  State<LoginLoadingBar> createState() => _LoginLoadingBarState();
}

class _LoginLoadingBarState extends State<LoginLoadingBar>
    with TickerProviderStateMixin {
  late final AnimationController _progress = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 10),
  );
  late final AnimationController _shimmer = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1800),
  );
  late final _animations = Listenable.merge([_progress, _shimmer]);

  @override
  void initState() {
    super.initState();
    _progress.addStatusListener((status) {
      if (status == AnimationStatus.completed) widget.onCompleted?.call();
    });
    _progress.forward();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _shimmer.stop();
    } else if (!_shimmer.isAnimating) {
      _shimmer.repeat();
    }
  }

  @override
  void dispose() {
    _progress.dispose();
    _shimmer.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RepaintBoundary(
    child: AnimatedBuilder(
      animation: _animations,
      builder: (context, _) => Semantics(
        label: context.l10n.loading,
        value: '${(_progress.value * 100).round()}%',
        child: ExcludeSemantics(
          child: AspectRatio(
            aspectRatio: 378 / 32,
            child: LayoutBuilder(
              builder: (context, constraints) {
                final scale = constraints.maxWidth / 378;
                return Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 340 * scale,
                      height: 15 * scale,
                      child: Image.asset(
                        'assets/ui/login/loading_bar.png',
                        fit: BoxFit.fill,
                      ),
                    ),
                    SizedBox(
                      width: 340 * scale,
                      height: 13 * scale,
                      child: ClipRect(
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: FractionallySizedBox(
                            widthFactor: _progress.value,
                            heightFactor: 1,
                            child: Image.asset(
                              'assets/ui/login/loading_progress.png',
                              fit: BoxFit.fill,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 340 * scale,
                      height: 13 * scale,
                      child: CustomPaint(
                        painter: LoadingBarShimmerPainter(
                          progress: _progress.value,
                          phase: _shimmer.value,
                        ),
                      ),
                    ),
                    Positioned.fill(
                      child: Image.asset(
                        'assets/ui/login/loading_bar_background.png',
                        fit: BoxFit.fill,
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    ),
  );
}
