import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/core/network/game_connection/game_connection.dart';
import 'package:opencok/core/network/game_protocol/game_protocol.dart';

void main() {
  test(
    'reconnects after remote close, responds to binary ping and stops',
    () async {
      final server = await HttpServer.bind(InternetAddress.loopbackIPv4, 0);
      final sockets = <WebSocket>[];
      addTearDown(() async {
        for (final socket in sockets) {
          await socket.close();
        }
        await server.close(force: true);
      });
      final fixture = jsonDecode(
        File('../gameserver/testdata/bootstrap.json').readAsStringSync(),
      ) as Map<String, dynamic>;
      final welcome = (fixture['welcome'] as List).cast<int>();
      final secondPong = Completer<void>();
      var admissions = 0;
      server.listen((request) async {
        final socket = await WebSocketTransformer.upgrade(
          request,
          protocolSelector: (protocols) => GameProtocol.subprotocol,
        );
        sockets.add(socket);
        final attempt = ++admissions;
        socket.listen((dynamic frame) {
          expect(frame, isA<List<int>>());
          if ((frame as List<int>)[1] == 1) {
            socket.add(welcome);
            socket.add(GameProtocol.binary([1, 3]));
          } else {
            expect(frame, GameProtocol.pong);
            if (attempt == 1) {
              unawaited(socket.close());
            } else if (!secondPong.isCompleted) {
              secondPong.complete();
            }
          }
        });
      });
      final connection = GameConnection(
        endpoint: Uri.parse('ws://127.0.0.1:${server.port}/ws'),
      );
      addTearDown(connection.dispose);
      connection.start();
      await secondPong.future.timeout(const Duration(seconds: 6));
      expect(admissions, 2);
      expect(connection.online, isTrue);
      connection.stop();
      expect(connection.online, isFalse);
      expect(connection.sessionId, isNull);
      await Future<void>.delayed(const Duration(seconds: 2));
      expect(admissions, 2);
    },
  );
}
