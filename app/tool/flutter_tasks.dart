import 'dart:convert';
import 'dart:io';

Future<int> _run(List<String> arguments) async {
  final process = await Process.start(
    'flutter',
    arguments,
    mode: ProcessStartMode.inheritStdio,
    runInShell: Platform.isWindows,
  );
  return process.exitCode;
}

Future<int> _dev(String platform, List<String> arguments) async {
  final result = await Process.run('flutter', [
    'devices',
    '--machine',
  ], runInShell: Platform.isWindows);
  if (result.exitCode != 0) {
    stderr.write(result.stderr);
    return result.exitCode;
  }
  final devices = (jsonDecode(result.stdout as String) as List)
      .cast<Map<String, dynamic>>()
      .where(
        (device) =>
            device['isSupported'] == true &&
            (device['targetPlatform'] as String).split('-').first == platform,
      )
      .toList();
  final requestedId = arguments.isNotEmpty && !arguments.first.startsWith('-')
      ? arguments.removeAt(0)
      : null;
  final matching = devices
      .where((device) => requestedId == null || device['id'] == requestedId)
      .toList();
  if (matching.length != 1) {
    stderr.writeln(
      'Conecte um dispositivo $platform ou inicie um emulador. '
      'Se houver mais de um, informe o ID: '
      'bun run dev:$platform <device-id>.',
    );
    for (final device in devices) {
      stderr.writeln('${device['id']} — ${device['name']}');
    }
    return 1;
  }
  return _run([
    'run',
    '-d',
    matching.single['id'] as String,
    '--dart-define-from-file=.env',
    ...arguments,
  ]);
}

Future<int> _buildAll(List<String> arguments) async {
  final native = Platform.isLinux
      ? ['linux']
      : Platform.isMacOS
      ? ['macos', 'ios']
      : Platform.isWindows
      ? ['windows']
      : <String>[];
  final targets = ['web', 'android', ...native];
  final unavailable = [
    'linux',
    'macos',
    'ios',
    'windows',
  ].where((target) => !native.contains(target));
  stdout.writeln('Builds neste sistema: ${targets.join(', ')}.');
  stdout.writeln(
    'Exigem outro sistema operacional: ${unavailable.join(', ')}.',
  );
  var failed = false;
  for (final target in targets) {
    final status = await _run([
      'build',
      target == 'android' ? 'apk' : target,
      '--dart-define-from-file=.env',
      ...arguments,
    ]);
    if (status != 0) {
      stderr.writeln('Build de $target falhou (código $status).');
      failed = true;
    }
  }
  return failed ? 1 : 0;
}

Future<void> main(List<String> arguments) async {
  if (arguments.isNotEmpty && arguments.first == 'build-all') {
    exitCode = await _buildAll(arguments.skip(1).toList());
  } else if (arguments.length >= 2 &&
      arguments.first == 'dev' &&
      ['android', 'ios'].contains(arguments[1])) {
    exitCode = await _dev(arguments[1], arguments.skip(2).toList());
  } else {
    stderr.writeln(
      'Uso: dart run tool/flutter_tasks.dart '
      'build-all | dev <android|ios> [device-id] [opções do Flutter]',
    );
    exitCode = 64;
  }
}
