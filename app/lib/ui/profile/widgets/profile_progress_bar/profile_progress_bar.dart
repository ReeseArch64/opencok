import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';

Widget profileProgressBar(
  BuildContext context,
  double y,
  double value,
  String label,
  bool energy,
) => Positioned(
  left: 141,
  top: y,
  width: 357,
  height: 25,
  child: Semantics(
    label: context.l10n.resourceValue(
      energy ? context.l10n.energy : context.l10n.experience,
      label,
    ),
    child: Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: const Color(0xff190c0b),
        border: Border.all(color: const Color(0xff9a9a86), width: 2),
      ),
      child: Stack(
        children: [
          FractionallySizedBox(
            widthFactor: value.clamp(0, 1),
            heightFactor: 1,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  stops: const [0, .16, .30, .65, 1],
                  colors: energy
                      ? const [
                          Color(0xff27650b),
                          Color(0xffbcff8e),
                          Color(0xff68f817),
                          Color(0xff30c900),
                          Color(0xff165600),
                        ]
                      : const [
                          Color(0xff08658c),
                          Color(0xffa0f5ff),
                          Color(0xff20d5f5),
                          Color(0xff0099d1),
                          Color(0xff03456c),
                        ],
                ),
              ),
            ),
          ),
          Center(
            child: Text(
              label,
              textScaler: TextScaler.noScaling,
              style: const TextStyle(
                fontFamily: 'Cooljazz',
                fontSize: 19,
                height: 1,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    ),
  ),
);
