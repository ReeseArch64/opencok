import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:opencok/security/browser_device/browser_device.dart';
import 'package:opencok/security/device_security_block/device_security_block.dart';

class DeviceSecurity {
  static const developmentExemption =
      kDebugMode &&
      String.fromEnvironment('APP_ENV', defaultValue: 'production') ==
          'development';

  static const _mobile = MethodChannel('jailbreak_root_detection');
  static const _desktop = MethodChannel('org.opencok/device_security');

  static Future<DeviceSecurityBlock?> check() async {
    if (developmentExemption) return null;
    try {
      return await _checkPlatform().timeout(const Duration(seconds: 8));
    } catch (_) {
      return DeviceSecurityBlock.verificationFailed;
    }
  }

  static Future<bool> _mobileFlag(String method) async {
    final value = await _mobile.invokeMethod<bool>(method);
    if (value == null) throw StateError('Missing device security result');
    return value;
  }

  static Future<DeviceSecurityBlock?> _checkPlatform() async {
    if (kIsWeb) {
      return isMobileBrowser ? DeviceSecurityBlock.mobileBrowser : null;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        if (await _mobileFlag('isJailBroken')) {
          return DeviceSecurityBlock.compromised;
        }
        if (await _mobileFlag('isDevMode')) {
          return DeviceSecurityBlock.developerMode;
        }
        if (await _mobileFlag('isDebugged')) {
          return DeviceSecurityBlock.debugger;
        }
        return null;
      case TargetPlatform.iOS:
        final issues = await _mobile.invokeListMethod<String>('checkForIssues');
        if (issues == null) throw StateError('Missing iOS security result');
        if (issues.contains('jailbreak')) {
          return DeviceSecurityBlock.compromised;
        }
        if (issues.contains('debugged')) return DeviceSecurityBlock.debugger;
        return null;
      case TargetPlatform.linux:
      case TargetPlatform.macOS:
      case TargetPlatform.windows:
        final flags = await _desktop.invokeMapMethod<String, Object?>('check');
        if (flags == null ||
            [
              'privileged',
              'developerMode',
              'debuggerAttached',
            ].any((key) => flags[key] is! bool)) {
          throw StateError('Incomplete desktop security result');
        }
        if (flags['privileged'] == true) return DeviceSecurityBlock.privileged;
        if (flags['developerMode'] == true) {
          return DeviceSecurityBlock.developerMode;
        }
        if (flags['debuggerAttached'] == true) {
          return DeviceSecurityBlock.debugger;
        }
        return null;
      case TargetPlatform.fuchsia:
        return DeviceSecurityBlock.verificationFailed;
    }
  }
}
