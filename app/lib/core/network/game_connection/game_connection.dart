import 'dart:async';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:opencok/generated/world.dart';
import 'package:opencok/core/network/game_protocol/game_protocol.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

enum GameConnectionStatus { connecting, online, reconnecting }

class GameConnection extends ChangeNotifier {
  GameConnection({required this.endpoint});

  final Uri endpoint;
  GameConnectionStatus status = GameConnectionStatus.connecting;
  String? sessionId;
  WebSocketChannel? _channel;
  StreamSubscription<dynamic>? _subscription;
  Timer? _watchdog;
  Timer? _retry;
  int _generation = 0;
  int _failures = 0;
  bool _running = false;
  final _random = Random();
  int _nextRequestId = 0;
  final _mapRequests = <int, Completer<MapRegion>>{};

  Future<MapRegion> queryMap({
    required int minX,
    required int minY,
    required int maxX,
    required int maxY,
  }) async {
    if (!online || _mapRequests.length >= 16) {
      throw StateError('Map connection unavailable');
    }
    final requestId = _nextRequestId = (_nextRequestId + 1) & 0xffffffff;
    final query = MapQuery(
      requestId: requestId,
      kingdomId: 1,
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY,
    );
    final completer = Completer<MapRegion>();
    final bytes = query.encode();
    _mapRequests[requestId] = completer;
    try {
      _channel!.sink.add(bytes);
      return await completer.future.timeout(const Duration(seconds: 5));
    } finally {
      _mapRequests.remove(requestId);
    }
  }

  bool get online => status == GameConnectionStatus.online;

  void start() {
    if (_running) return;
    _running = true;
    unawaited(_connect());
  }

  Future<void> _connect() async {
    final generation = ++_generation;
    status = _failures == 0
        ? GameConnectionStatus.connecting
        : GameConnectionStatus.reconnecting;
    notifyListeners();
    try {
      final channel = WebSocketChannel.connect(
        endpoint,
        protocols: [GameProtocol.subprotocol],
      );
      _channel = channel;
      _watchdog = Timer(const Duration(seconds: 10), () => _fail(generation));
      Duration? timeout;
      _subscription = channel.stream.listen(
        (dynamic frame) {
          if (generation != _generation) return;
          try {
            if (timeout == null) {
              final welcome = GameProtocol.welcome(frame);
              timeout = welcome.timeout;
              sessionId = welcome.sessionId;
              status = GameConnectionStatus.online;
              _failures = 0;
              notifyListeners();
            } else {
              final bytes = GameProtocol.binary(frame);
              if (bytes.length >= 2 && bytes[0] == 1 && bytes[1] == 17) {
                final region = MapRegion.decode(bytes);
                _mapRequests[region.requestId]?.complete(region);
              } else {
                GameProtocol.ping(frame);
                channel.sink.add(GameProtocol.pong);
              }
            }
            _watchdog?.cancel();
            _watchdog = Timer(timeout!, () => _fail(generation));
          } catch (_) {
            _fail(generation);
          }
        },
        onError: (Object error) => _fail(generation),
        onDone: () => _fail(generation),
        cancelOnError: true,
      );
      await channel.ready.timeout(const Duration(seconds: 10));
      if (generation != _generation) return;
      if (channel.protocol != GameProtocol.subprotocol) {
        throw const FormatException('Unsupported subprotocol');
      }
      channel.sink.add(GameProtocol.hello);
    } catch (_) {
      _fail(generation);
    }
  }

  void _fail(int generation) {
    if (!_running || generation != _generation) return;
    ++_generation;
    _release();
    status = GameConnectionStatus.reconnecting;
    sessionId = null;
    final seconds = min(30, 1 << min(_failures++, 5));
    _retry = Timer(
      Duration(milliseconds: seconds * 1000 + _random.nextInt(1000)),
      () => unawaited(_connect()),
    );
    notifyListeners();
  }

  void _release() {
    for (final pending in _mapRequests.values) {
      if (!pending.isCompleted) {
        pending.completeError(StateError('Map connection closed'));
      }
    }
    _mapRequests.clear();
    _watchdog?.cancel();
    _retry?.cancel();
    unawaited(_subscription?.cancel());
    unawaited(_channel?.sink.close());
    _subscription = null;
    _channel = null;
  }

  void stop() {
    _running = false;
    ++_generation;
    _release();
    sessionId = null;
    status = GameConnectionStatus.reconnecting;
  }

  @override
  void dispose() {
    stop();
    super.dispose();
  }
}
