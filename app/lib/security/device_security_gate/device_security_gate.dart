import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/security/device_security/device_security.dart';
import 'package:opencok/security/device_security_block/device_security_block.dart';
import 'package:opencok/ui/errors/game_error_overlay/game_error_overlay.dart';
import 'package:opencok/ui/errors/game_error_panel/game_error_panel.dart';
import 'package:opencok/ui/splash/screens/splash_screen/splash_screen.dart';

class DeviceSecurityGate extends StatefulWidget {
  const DeviceSecurityGate({super.key, required this.builder});

  final WidgetBuilder builder;

  @override
  State<DeviceSecurityGate> createState() => _DeviceSecurityGateState();
}

class _DeviceSecurityGateState extends State<DeviceSecurityGate>
    with WidgetsBindingObserver {
  bool _checking = true;
  DeviceSecurityBlock? _block;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _check();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (DeviceSecurity.developmentExemption) return;
    if (state == AppLifecycleState.resumed) {
      _check();
    } else if (state == AppLifecycleState.hidden ||
        state == AppLifecycleState.paused) {
      _generation++;
      setState(() => _checking = true);
    }
  }

  Future<void> _check() async {
    final generation = ++_generation;
    setState(() => _checking = true);
    final block = await DeviceSecurity.check();
    if (generation == 1) {
      await Future<void>.delayed(const Duration(milliseconds: 900));
    }
    if (!mounted || generation != _generation) return;
    setState(() {
      _checking = false;
      _block = block;
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_checking) {
      return const SplashScreen();
    }
    if (_block == null) return widget.builder(context);
    final message = switch (_block!) {
      DeviceSecurityBlock.compromised => context.l10n.securityCompromised,
      DeviceSecurityBlock.privileged => context.l10n.securityPrivileged,
      DeviceSecurityBlock.developerMode => context.l10n.securityDeveloperMode,
      DeviceSecurityBlock.debugger => context.l10n.securityDebugger,
      DeviceSecurityBlock.mobileBrowser => context.l10n.securityMobileBrowser,
      DeviceSecurityBlock.verificationFailed =>
        context.l10n.securityVerificationFailed,
    };
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          const SplashScreen(),
          GameErrorOverlay(
            panel: GameErrorPanel(
              message: message,
              primaryLabel: context.l10n.verifyAgain,
              onPrimary: _check,
            ),
          ),
        ],
      ),
    );
  }
}
