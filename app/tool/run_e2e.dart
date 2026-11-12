import 'dart:io';

Future<void> main(List<String> arguments) async {
  final tests =
      Directory('tests/e2e')
          .listSync(recursive: true)
          .whereType<File>()
          .where((file) => file.path.endsWith('_test.dart'))
          .toList()
        ..sort((a, b) => a.path.compareTo(b.path));
  if (tests.isEmpty) {
    stderr.writeln('Nenhum teste E2E encontrado em tests/e2e/.');
    exitCode = 1;
    return;
  }
  for (final test in tests) {
    final process = await Process.start(
      'flutter',
      [
        'drive',
        '--driver=tests/e2e/driver.dart',
        '--target=${test.path}',
        '--dart-define-from-file=.env',
        ...arguments,
      ],
      mode: ProcessStartMode.inheritStdio,
      runInShell: Platform.isWindows,
    );
    final status = await process.exitCode;
    if (status != 0) {
      exitCode = status;
      return;
    }
  }
}
