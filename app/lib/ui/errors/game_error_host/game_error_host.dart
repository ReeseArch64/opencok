import 'package:flutter/material.dart';
import 'package:opencok/core/errors/game_errors/game_errors.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/errors/game_error_overlay/game_error_overlay.dart';
import 'package:opencok/ui/errors/game_error_panel/game_error_panel.dart';

class GameErrorHost extends StatelessWidget {
  const GameErrorHost({super.key, required this.child, this.errors});

  final Widget child;
  final GameErrors? errors;

  @override
  Widget build(BuildContext context) {
    final source = errors ?? GameErrors.instance;
    return ListenableBuilder(
      listenable: source,
      builder: (context, _) {
        final notice = source.current;
        return Stack(
          fit: StackFit.expand,
          children: [
            ExcludeFocus(excluding: notice != null, child: child),
            if (notice != null)
              GameErrorOverlay(
                panel: GameErrorPanel(
                  message: notice.messageKey == null
                      ? notice.message
                      : context.l10n.errorMessage(notice.messageKey!),
                  primaryLabel: notice.onRetry == null
                      ? context.l10n.ok
                      : context.l10n.retry,
                  onPrimary: () async {
                    if (!identical(source.current, notice)) return;
                    source.dismiss();
                    try {
                      await notice.onRetry?.call();
                    } catch (error, stack) {
                      FlutterError.presentError(
                        FlutterErrorDetails(exception: error, stack: stack),
                      );
                      source.report(notice);
                    }
                  },
                  onSecondary: notice.onRetry == null
                      ? null
                      : () {
                          if (identical(source.current, notice)) {
                            source.dismiss();
                          }
                        },
                ),
              ),
          ],
        );
      },
    );
  }
}
