import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:opencok/core/network/game_connection/game_connection.dart';
import 'package:opencok/l10n/localization_context.dart';

class GameConnectionScope extends StatefulWidget {
  const GameConnectionScope({super.key, required this.child});
  final Widget child;

  static GameConnection? maybeOf(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<_ConnectionProvider>()
      ?.notifier;

  static GameConnection of(BuildContext context) => context
      .dependOnInheritedWidgetOfExactType<_ConnectionProvider>()!
      .notifier!;

  @override
  State<GameConnectionScope> createState() => _GameConnectionScopeState();
}

class _GameConnectionScopeState extends State<GameConnectionScope>
    with WidgetsBindingObserver {
  static const _gatewayUrl = String.fromEnvironment('GATEWAY_URL');

  late final connection = GameConnection(
    endpoint: Uri.parse(
      _gatewayUrl.isNotEmpty
          ? _gatewayUrl
          : (dotenv.isInitialized ? dotenv.env['GATEWAY_URL'] : null) ??
                'ws://localhost:9933/ws',
    ),
  );

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    connection.start();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      connection.start();
    } else if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.detached) {
      connection.stop();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    connection.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => _ConnectionProvider(
    notifier: connection,
    child: ListenableBuilder(
      listenable: connection,
      builder: (context, _) => Stack(
        fit: StackFit.expand,
        children: [
          widget.child,
          if (!connection.online)
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: SafeArea(
                child: IgnorePointer(
                  child: Material(
                    color: const Color(0xdd101822),
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Text(
                        connection.status == GameConnectionStatus.connecting
                            ? context.l10n.connectingToServer
                            : context.l10n.reconnectingToServer,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    ),
  );
}

class _ConnectionProvider extends InheritedNotifier<GameConnection> {
  const _ConnectionProvider({required super.notifier, required super.child});
}
