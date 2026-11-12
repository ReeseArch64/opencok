// ignore_for_file: depend_on_referenced_packages

import 'package:flutter_test/flutter_test.dart';
import 'package:opencok/security/browser_device_info/browser_device_info.dart';

void main() {
  test('detects mobile agents and iPad desktop mode without blocking Mac', () {
    expect(
      isMobileBrowserUserAgent('Mozilla/5.0 (Linux; Android 14)', 1),
      isTrue,
    );
    expect(isMobileBrowserUserAgent('Mozilla/5.0 (iPhone)', 0), isTrue);
    expect(isMobileBrowserUserAgent('Mozilla/5.0 (Macintosh)', 5), isTrue);
    expect(isMobileBrowserUserAgent('Mozilla/5.0 (Macintosh)', 0), isFalse);
    expect(
      isMobileBrowserUserAgent('Mozilla/5.0 (X11; Linux x86_64)', 0),
      isFalse,
    );
  });
}
