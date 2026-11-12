import 'package:flutter/foundation.dart';

bool get usesMobileSystemUi =>
    !kIsWeb &&
    (defaultTargetPlatform == TargetPlatform.android ||
        defaultTargetPlatform == TargetPlatform.iOS);
