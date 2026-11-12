import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:opencok/l10n/localization_context.dart';
import 'package:opencok/ui/profile/actions/show_profile_preview/show_profile_preview.dart';

Widget profileAddButton(
  BuildContext context,
  double x,
  double y,
  String label,
) => Positioned(
  left: x,
  top: y,
  width: 44,
  height: 44,
  child: Semantics(
    button: true,
    label: context.l10n.addResource(label),
    child: GestureDetector(
      onTap: () => showProfilePreview(context, label),
      child: Stack(
        alignment: Alignment.center,
        children: [
          Transform.rotate(
            angle: math.pi / 4,
            child: Container(
              width: 29,
              height: 29,
              decoration: BoxDecoration(
                color: const Color(0xff1b222a),
                border: Border.all(color: const Color(0xff6c6d63), width: 2),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black,
                    blurRadius: 2,
                    spreadRadius: 1,
                  ),
                ],
              ),
            ),
          ),
          Image.asset('assets/ui/profile/plus.png', width: 34, height: 34),
        ],
      ),
    ),
  ),
);
