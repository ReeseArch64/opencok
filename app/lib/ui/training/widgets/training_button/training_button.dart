import 'package:flutter/material.dart';
import 'package:opencok/ui/training/widgets/training_art/training_art.dart';

Widget trainingButton(String label, String image, VoidCallback onTap) =>
    Semantics(
      button: true,
      label: label,
      child: GestureDetector(
        onTap: onTap,
        behavior: HitTestBehavior.opaque,
        child: trainingArt(image),
      ),
    );
