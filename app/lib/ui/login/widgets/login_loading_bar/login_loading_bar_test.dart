// ignore_for_file: depend_on_referenced_packages

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/l10n/app_localizations.dart';
import 'package:opencok/ui/login/painters/loading_bar_shimmer_painter/loading_bar_shimmer_painter.dart';
import 'package:opencok/ui/login/widgets/login_loading_bar/login_loading_bar.dart';

void main() {
  for (final reducedMotion in [false, true]) {
    testWidgets(
      'loading progresses and completes once, reduced motion: $reducedMotion',
      (tester) async {
        var completed = 0;
        await tester.pumpWidget(
          MaterialApp(
            locale: const Locale('pt'),
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            supportedLocales: AppLocalizations.supportedLocales,
            home: MediaQuery(
              data: MediaQueryData(disableAnimations: reducedMotion),
              child: Center(
                child: SizedBox(
                  width: 378,
                  child: LoginLoadingBar(onCompleted: () => completed++),
                ),
              ),
            ),
          ),
        );
        final paint = find.byWidgetPredicate(
          (widget) =>
              widget is CustomPaint &&
              widget.painter is LoadingBarShimmerPainter,
        );
        await tester.pump(const Duration(milliseconds: 450));
        final first =
            tester.widget<CustomPaint>(paint).painter!
                as LoadingBarShimmerPainter;
        await tester.pump(const Duration(milliseconds: 450));
        final next =
            tester.widget<CustomPaint>(paint).painter!
                as LoadingBarShimmerPainter;
        expect(next.progress, greaterThan(first.progress));
        expect(next.phase, reducedMotion ? first.phase : isNot(first.phase));
        expect(completed, 0);
        await tester.pump(const Duration(seconds: 10));
        expect(completed, 1);
        await tester.pump(const Duration(seconds: 2));
        expect(completed, 1);
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }
}
