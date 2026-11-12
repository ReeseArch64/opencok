import 'package:flutter/material.dart';
import 'package:opencok/domain/training/training_unit/training_unit.dart';

Widget trainingArt(String name, {BoxFit fit = BoxFit.fill}) => Image.asset(
  '${TrainingUnit.assetRoot}$name.png',
  fit: fit,
  excludeFromSemantics: true,
);
