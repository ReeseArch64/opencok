import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/core/errors/game_error_notice/game_error_notice.dart';
import 'package:opencok/core/errors/game_errors/game_errors.dart';

void main() {
  testWidgets('deduplicates pending errors and dismisses them in order', (
    tester,
  ) async {
    final errors = GameErrors();
    addTearDown(errors.dispose);
    var notifications = 0;
    errors.addListener(() => notifications++);
    errors.report(const GameErrorNotice('First', key: 'network'));
    errors.report(const GameErrorNotice('Duplicate', key: 'network'));
    errors.report(const GameErrorNotice('Second'));
    await tester.pump();
    expect(notifications, 1);
    expect(errors.current!.message, 'First');
    errors.dismiss();
    expect(errors.current!.message, 'Second');
    errors.dismiss();
    errors.dismiss();
    await tester.pump();
    expect(errors.current, isNull);
    expect(notifications, 2);
  });

  testWidgets('localized notices deduplicate by message key', (tester) async {
    final errors = GameErrors();
    addTearDown(errors.dispose);
    errors.report(const GameErrorNotice.localized('unexpected'));
    errors.report(const GameErrorNotice.localized('unexpected'));
    errors.report(const GameErrorNotice.localized('music'));
    await tester.pump();
    expect(errors.current!.messageKey, 'unexpected');
    errors.dismiss();
    expect(errors.current!.messageKey, 'music');
    errors.dismiss();
    expect(errors.current, isNull);
    await tester.pump();
  });
}
