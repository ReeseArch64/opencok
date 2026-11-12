import 'dart:convert';
import 'dart:typed_data';

const maxWorldPacketBytes = 65536;

class _Reader {
  _Reader(this.bytes) : view = ByteData.sublistView(bytes);
  final Uint8List bytes;
  final ByteData view;
  int offset = 2;
  int uint(int max) {
    if (offset + 4 > bytes.length) {
      throw const FormatException('Truncated world packet');
    }
    final n = view.getUint32(offset);
    offset += 4;
    if (n > max) {
      throw const FormatException('World field out of range');
    }
    return n;
  }

  String string(int max) {
    final n = uint(max);
    if (offset + n > bytes.length) {
      throw const FormatException('Truncated string');
    }
    final s = utf8.decode(bytes.sublist(offset, offset + n));
    offset += n;
    return s;
  }
}

class _Writer {
  final bytes = BytesBuilder();
  void uint(int n, int max) {
    if (n < 0 || n > max) {
      throw const FormatException('World field out of range');
    }
    final b = ByteData(4)..setUint32(0, n);
    bytes.add(b.buffer.asUint8List());
  }

  void string(String s, int max) {
    final b = utf8.encode(s);
    uint(b.length, max);
    bytes.add(b);
  }
}

class MapQuery {
  const MapQuery({
    required this.requestId,
    required this.kingdomId,
    required this.minX,
    required this.minY,
    required this.maxX,
    required this.maxY,
  });
  final int requestId;
  final int kingdomId;
  final int minX;
  final int minY;
  final int maxX;
  final int maxY;
  static MapQuery _read(_Reader r) => MapQuery(
    requestId: r.uint(4294967295),
    kingdomId: r.uint(4294967295),
    minX: r.uint(1200),
    minY: r.uint(1200),
    maxX: r.uint(1200),
    maxY: r.uint(1200),
  );
  void _write(_Writer w) {
    w.uint(requestId, 4294967295);
    w.uint(kingdomId, 4294967295);
    w.uint(minX, 1200);
    w.uint(minY, 1200);
    w.uint(maxX, 1200);
    w.uint(maxY, 1200);
  }

  static MapQuery decode(Uint8List b) {
    if (b.length < 2 ||
        b.length > maxWorldPacketBytes ||
        b[0] != 1 ||
        b[1] != 16) {
      throw const FormatException('Invalid world packet');
    }
    final r = _Reader(b);
    final v = _read(r);
    if (r.offset != b.length) {
      throw const FormatException('Trailing world bytes');
    }
    return v;
  }

  Uint8List encode() {
    final w = _Writer();
    w.bytes.add([1, 16]);
    _write(w);
    final b = w.bytes.takeBytes();
    if (b.length > maxWorldPacketBytes) {
      throw const FormatException('World packet too large');
    }
    return b;
  }
}

class MapRegion {
  const MapRegion({
    required this.requestId,
    required this.status,
    required this.kingdomId,
    required this.name,
    required this.columns,
    required this.rows,
    required this.objects,
    required this.blocked,
  });
  final int requestId;
  final int status;
  final int kingdomId;
  final String name;
  final int columns;
  final int rows;
  final List<MapRegionObjectsItem> objects;
  final List<MapRegionBlockedItem> blocked;
  static MapRegion _read(_Reader r) => MapRegion(
    requestId: r.uint(4294967295),
    status: r.uint(2),
    kingdomId: r.uint(4294967295),
    name: r.string(64),
    columns: r.uint(1200),
    rows: r.uint(1200),
    objects: List.generate(
      r.uint(256),
      (_) => MapRegionObjectsItem._read(r),
      growable: false,
    ),
    blocked: List.generate(
      r.uint(4096),
      (_) => MapRegionBlockedItem._read(r),
      growable: false,
    ),
  );
  void _write(_Writer w) {
    w.uint(requestId, 4294967295);
    w.uint(status, 2);
    w.uint(kingdomId, 4294967295);
    w.string(name, 64);
    w.uint(columns, 1200);
    w.uint(rows, 1200);
    w.uint(objects.length, 256);
    for (final item in objects) {
      item._write(w);
    }
    w.uint(blocked.length, 4096);
    for (final item in blocked) {
      item._write(w);
    }
  }

  static MapRegion decode(Uint8List b) {
    if (b.length < 2 ||
        b.length > maxWorldPacketBytes ||
        b[0] != 1 ||
        b[1] != 17) {
      throw const FormatException('Invalid world packet');
    }
    final r = _Reader(b);
    final v = _read(r);
    if (r.offset != b.length) {
      throw const FormatException('Trailing world bytes');
    }
    return v;
  }

  Uint8List encode() {
    final w = _Writer();
    w.bytes.add([1, 17]);
    _write(w);
    final b = w.bytes.takeBytes();
    if (b.length > maxWorldPacketBytes) {
      throw const FormatException('World packet too large');
    }
    return b;
  }
}

class MapRegionObjectsItem {
  const MapRegionObjectsItem({
    required this.id,
    required this.kind,
    required this.x,
    required this.y,
    required this.width,
    required this.height,
    required this.level,
  });
  final int id;
  final int kind;
  final int x;
  final int y;
  final int width;
  final int height;
  final int level;
  static MapRegionObjectsItem _read(_Reader r) => MapRegionObjectsItem(
    id: r.uint(4294967295),
    kind: r.uint(4),
    x: r.uint(1200),
    y: r.uint(1200),
    width: r.uint(16),
    height: r.uint(16),
    level: r.uint(100),
  );
  void _write(_Writer w) {
    w.uint(id, 4294967295);
    w.uint(kind, 4);
    w.uint(x, 1200);
    w.uint(y, 1200);
    w.uint(width, 16);
    w.uint(height, 16);
    w.uint(level, 100);
  }
}

class MapRegionBlockedItem {
  const MapRegionBlockedItem({required this.x, required this.y});
  final int x;
  final int y;
  static MapRegionBlockedItem _read(_Reader r) =>
      MapRegionBlockedItem(x: r.uint(1200), y: r.uint(1200));
  void _write(_Writer w) {
    w.uint(x, 1200);
    w.uint(y, 1200);
  }
}
