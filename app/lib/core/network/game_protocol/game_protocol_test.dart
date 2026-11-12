// ignore_for_file: depend_on_referenced_packages

import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/core/network/game_protocol/game_protocol.dart';

void main() {
  test('Go and Dart share the binary bootstrap fixture', () {
    final fixture = jsonDecode(
      File('../gameserver/testdata/bootstrap.json').readAsStringSync(),
    ) as Map<String, dynamic>;
    Uint8List bytes(String key) =>
        Uint8List.fromList((fixture[key] as List).cast<int>());
    expect(GameProtocol.hello, bytes('hello'));
    expect(GameProtocol.pong, bytes('pong'));
    final welcome = GameProtocol.welcome(bytes('welcome'));
    expect(welcome.sessionId, '000102030405060708090a0b0c0d0e0f');
    expect(welcome.heartbeat, const Duration(seconds: 25));
    expect(welcome.timeout, const Duration(seconds: 60));
    GameProtocol.ping(bytes('ping'));
  });

  test(
    'rejects text, truncation, unknown opcodes and incompatible versions',
    () {
      for (final frame in <Object>[
        'hello',
        [1],
        List.filled(26, 0),
        [2, 2],
      ]) {
        expect(() => GameProtocol.welcome(frame), throwsFormatException);
      }
      for (final frame in <Object>[
        'ping',
        [1],
        [1, 4],
        [2, 3],
        [1, 3, 0],
      ]) {
        expect(() => GameProtocol.ping(frame), throwsFormatException);
      }
    },
  );
}
