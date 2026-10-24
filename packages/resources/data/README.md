# Nickname word catalog

`badwords.json` is the maintained UTF-8 array of blocked terms used by nickname
validation and celebrity-description filtering. It ships with the resources
package and the server image. No external TXT, `GAME_RESOURCES` sibling directory,
working-directory assumption or Compose volume is required.

The maintainer authorized conversion of the current reference dictionary on
2026-10-24. The source was
`data/reference/server/runtime/base/gameconfig/badwords.txt` (61,420 bytes;
SHA-256 `8dba90ba17d45f8de579d657e7c5b1df33fd8a449a095d96625a6d71902e092f`).
Conversion decoded UTF-8, split CRLF/CR/LF lines and comma-delimited tokens,
and dropped empty tokens without trimming, sorting or deduplicating. The initial
JSON preserves all 5,202 entries in source order. Only this authorized dictionary
conversion is versioned; the original reference remains read-only and ignored.
No legacy executable code, player records or client binaries are included.

Edit one term per JSON array entry. Strings preserve case, whitespace, duplicates
and Unicode; commas and line breaks inside a JSON string are literal characters.
The existing matcher retains its legacy boundary and pattern behavior. The loader
stably sorts new entries by descending UTF-16 length, appends retained entries,
and removes only the first exact space and `v`, as before.

The loader accepts only an array of strings, limits the file to 16 MiB and keeps
the previous filter after failed reads or invalid JSON. An unsuccessful initial
load still leaves an empty filter. Redis reserved-name patterns load after the
JSON and remain a separate mechanism. Rebuild and recreate the server to apply
catalog changes; no file watcher or administrative reload endpoint is introduced.

Rollback uses the previous application artifact with its catalog. A rollback to
a revision before this conversion also requires restoring the previous TXT mount.
No database migration or player-data conversion is needed.
