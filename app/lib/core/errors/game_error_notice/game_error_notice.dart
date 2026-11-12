import 'dart:async';

class GameErrorNotice {
  const GameErrorNotice(this.message, {this.onRetry, this.key})
    : messageKey = null;

  const GameErrorNotice.localized(this.messageKey, {this.onRetry, this.key})
    : message = '';

  final String? messageKey;
  final String message;
  final FutureOr<void> Function()? onRetry;
  final Object? key;
}
