import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';

void showProfilePreview(BuildContext context, String label) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Text(context.l10n.comingSoon(label))));
}
