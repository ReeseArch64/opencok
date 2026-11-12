import 'package:opencok/security/browser_device_info/browser_device_info.dart';
import 'package:web/web.dart' as web;

bool get isMobileBrowser {
  final navigator = web.window.navigator;
  return isMobileBrowserUserAgent(
    navigator.userAgent,
    navigator.maxTouchPoints,
  );
}
