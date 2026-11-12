import 'package:flutter/material.dart';
import 'package:opencok/data/castle/castle_environment_loader/castle_environment_loader.dart';
import 'package:opencok/domain/castle/castle_environment/castle_environment.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/castle/widgets/castle_viewport/castle_viewport.dart';
import 'package:opencok/ui/errors/game_error_overlay/game_error_overlay.dart';
import 'package:opencok/ui/errors/game_error_panel/game_error_panel.dart';

class CastleScreen extends StatefulWidget {
  const CastleScreen({
    super.key,
    this.loadEnvironment = CastleEnvironmentLoader.load,
  });

  final Future<CastleEnvironment> Function() loadEnvironment;

  @override
  State<CastleScreen> createState() => _CastleScreenState();
}

class _CastleScreenState extends State<CastleScreen> {
  late Future<CastleEnvironment> _loading;
  CastleEnvironment? _environment;

  @override
  void initState() {
    super.initState();
    _loading = _load();
  }

  Future<CastleEnvironment> _load() async {
    final environment = await widget.loadEnvironment();
    if (mounted) {
      _environment = environment;
    } else {
      environment.dispose();
    }
    return environment;
  }

  @override
  void dispose() {
    _environment?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Semantics(
    label: context.l10n.castleInterior,
    child: ColoredBox(
      color: const Color(0xff50788f),
      child: FutureBuilder<CastleEnvironment>(
        future: _loading,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return GameErrorOverlay(
              panel: GameErrorPanel(
                message: context.l10n.castleLoadError,
                onPrimary: () => setState(() {
                  _loading = _load();
                }),
              ),
            );
          }
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }
          return CastleViewport(environment: snapshot.requireData);
        },
      ),
    ),
  );
}
