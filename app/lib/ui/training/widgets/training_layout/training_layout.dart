import 'dart:math' as math;

import 'package:flutter/material.dart';

class TrainingLayout extends StatelessWidget {
  const TrainingLayout({
    super.key,
    required this.header,
    required this.previewBuilder,
    required this.cultures,
    required this.panel,
  });
  final Widget header;
  final Widget Function(double) previewBuilder;
  final Widget cultures;
  final Widget panel;
  Widget _section(double width, double height, Widget child) => SizedBox(
    width: width,
    height: width / 640 * height,
    child: FittedBox(
      fit: BoxFit.contain,
      child: SizedBox(width: 640, height: height, child: child),
    ),
  );

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xff101010),
    body: DecoratedBox(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(-0.65, -0.35),
          radius: 1.2,
          colors: [Color(0xff796041), Color(0xff2c211c), Color(0xff101010)],
        ),
      ),
      child: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final wide = constraints.maxWidth >= 900;
            if (!wide) {
              final width = math.min(640.0, constraints.maxWidth);
              final heroHeight = (constraints.maxHeight * 640 / width - 615)
                  .clamp(540.0, 740.0);
              return SingleChildScrollView(
                key: const ValueKey('training-mobile-layout'),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _section(width, 90, header),
                      _section(
                        width,
                        heroHeight + 70,
                        previewBuilder(heroHeight),
                      ),
                      _section(width, 60, cultures),
                      _section(width, 395, panel),
                    ],
                  ),
                ),
              );
            }
            final panelWidth = (constraints.maxWidth * 0.4).clamp(360.0, 540.0);
            final previewWidth = math.min(
              math.min(740.0, constraints.maxWidth - panelWidth - 48),
              math.max(420.0, (constraints.maxHeight - 90) * 640 / 670),
            );
            final heroHeight =
                ((constraints.maxHeight - 110) * 640 / previewWidth - 130)
                    .clamp(540.0, 740.0);
            return Column(
              key: const ValueKey('training-desktop-layout'),
              children: [
                Align(
                  alignment: Alignment.topLeft,
                  child: _section(640, 90, header),
                ),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Flexible(
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _section(
                                previewWidth,
                                heroHeight + 70,
                                previewBuilder(heroHeight),
                              ),
                              _section(previewWidth, 60, cultures),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 24),
                      SingleChildScrollView(
                        child: _section(panelWidth, 395, panel),
                      ),
                      const SizedBox(width: 24),
                    ],
                  ),
                ),
              ],
            );
          },
        ),
      ),
    ),
  );
}
