import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/core/network/game_connection/game_connection.dart';

void main() {
  const endpoint = String.fromEnvironment('GAMESERVER_TEST_URL');
  test(
    'Dart connects to Go and stays online through a heartbeat',
    () async {
      final connection = GameConnection(endpoint: Uri.parse(endpoint));
      addTearDown(connection.dispose);
      final admitted = Completer<void>();
      connection.addListener(() {
        if (connection.online && !admitted.isCompleted) admitted.complete();
      });
      connection.start();
      await admitted.future.timeout(const Duration(seconds: 10));
      expect(connection.sessionId, matches(RegExp(r'^[0-9a-f]{32}$')));
      final region = await connection.queryMap(
        minX: 565,
        minY: 565,
        maxX: 575,
        maxY: 575,
      );
      expect(region.status, 0);
      expect(region.kingdomId, 1);
      expect(region.columns, 1200);
      expect(region.objects.map((o) => o.id), containsAll([1, 2, 3]));
      final empty = await connection.queryMap(
        minX: 1,
        minY: 1,
        maxX: 1,
        maxY: 1,
      );
      expect(empty.objects, isEmpty);
      final invalid = await connection.queryMap(
        minX: 1,
        minY: 1,
        maxX: 65,
        maxY: 1,
      );
      expect(invalid.status, 1);
      await Future<void>.delayed(const Duration(seconds: 27));
      expect(connection.online, isTrue);
      connection.stop();
      expect(connection.online, isFalse);
      expect(connection.sessionId, isNull);
    },
    skip: endpoint.isEmpty,
    timeout: const Timeout(Duration(seconds: 45)),
  );
}
