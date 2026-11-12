import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';

class GameErrorPanel extends StatelessWidget {
  const GameErrorPanel({
    super.key,
    required this.message,
    required this.onPrimary,
    this.primaryLabel,
    this.secondaryLabel,
    this.onSecondary,
  });

  final String message;
  final String? primaryLabel;
  final VoidCallback onPrimary;
  final String? secondaryLabel;
  final VoidCallback? onSecondary;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final width = math.min(600.0, constraints.maxWidth - 32);
      final scale = width / 600;
      final padding = 50 * scale;
      return Center(
        child: SizedBox(
          width: width,
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxHeight: math.max(0, constraints.maxHeight - 32),
            ),
            child: Stack(
              children: [
                Positioned.fill(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Expanded(child: _panelHalf()),
                      Expanded(
                        child: Transform.flip(flipX: true, child: _panelHalf()),
                      ),
                    ],
                  ),
                ),
                SingleChildScrollView(
                  padding: EdgeInsets.symmetric(
                    horizontal: padding,
                    vertical: 52 * scale,
                  ),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minHeight: 291 * scale),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Padding(
                          padding: EdgeInsets.only(top: 42 * scale),
                          child: Semantics(
                            liveRegion: true,
                            child: Text(
                              message,
                              style: TextStyle(
                                fontFamily: 'Cooljazz',
                                fontSize: math.max(16, 24 * scale),
                                height: 1.2,
                                color: const Color(0xfff2f2f2),
                                decoration: TextDecoration.none,
                              ),
                            ),
                          ),
                        ),
                        SizedBox(height: 50 * scale),
                        Row(
                          mainAxisAlignment: onSecondary == null
                              ? MainAxisAlignment.center
                              : MainAxisAlignment.spaceBetween,
                          children: [
                            _button(
                              primaryLabel ?? context.l10n.retry,
                              onPrimary,
                              scale,
                              false,
                            ),
                            if (onSecondary != null)
                              _button(
                                secondaryLabel ?? context.l10n.close,
                                onSecondary!,
                                scale,
                                true,
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );

  Widget _panelHalf() => Image.asset(
    'assets/ui/errors/panel_half.png',
    centerSlice: const Rect.fromLTRB(50, 55, 149, 111),
    fit: BoxFit.fill,
    filterQuality: FilterQuality.high,
    excludeFromSemantics: true,
  );

  Widget _button(String label, VoidCallback action, double scale, bool red) =>
      SizedBox(
        width: 216 * scale,
        height: math.max(48, 64 * scale),
        child: TextButton(
          onPressed: action,
          style: TextButton.styleFrom(
            padding: EdgeInsets.zero,
            shape: const RoundedRectangleBorder(),
            foregroundColor: Colors.white,
          ),
          child: Ink(
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(
                  'assets/ui/errors/button_${red ? 'red' : 'green'}.png',
                ),
                fit: BoxFit.fill,
              ),
            ),
            child: Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 12 * scale),
                child: Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontFamily: 'Cooljazz',
                    fontSize: math.max(14, 22 * scale),
                    height: 1.1,
                  ),
                ),
              ),
            ),
          ),
        ),
      );
}
