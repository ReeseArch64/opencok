import 'dart:typed_data';

class GameProtocol {
  static const subprotocol = 'opencok.binary.v1';
  static Uint8List get hello => Uint8List.fromList([1, 1]);
  static Uint8List get pong => Uint8List.fromList([1, 4]);

  static ({String sessionId, Duration heartbeat, Duration timeout}) welcome(
    Object? frame,
  ) {
    final bytes = binary(frame);
    if (bytes.length != 26 || bytes[0] != 1 || bytes[1] != 2) {
      throw const FormatException('Invalid welcome');
    }
    final data = ByteData.sublistView(bytes);
    final heartbeat = data.getUint32(18);
    final timeout = data.getUint32(22);
    if (heartbeat < 1 || timeout <= heartbeat || timeout > 3600000) {
      throw const FormatException('Invalid heartbeat limits');
    }
    return (
      sessionId: bytes
          .sublist(2, 18)
          .map((b) => b.toRadixString(16).padLeft(2, '0'))
          .join(),
      heartbeat: Duration(milliseconds: heartbeat),
      timeout: Duration(milliseconds: timeout),
    );
  }

  static void ping(Object? frame) {
    final bytes = binary(frame);
    if (bytes.length != 2 || bytes[0] != 1 || bytes[1] != 3) {
      throw const FormatException('Invalid ping');
    }
  }

  static Uint8List binary(Object? frame) {
    if (frame is! List<int>) {
      throw const FormatException('Binary frame required');
    }
    return frame is Uint8List ? frame : Uint8List.fromList(frame);
  }
}
