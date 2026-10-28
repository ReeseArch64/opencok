# Content policy

This package owns nickname/description word filtering and reserved-name matching,
as confirmed in [#558](https://github.com/ReeseArch64/opencok/issues/558). The first
vertical slice is [#589](https://github.com/ReeseArch64/opencok/issues/589), following
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).

## Boundaries and public entrypoints

- `rules/nickname-words`: pure matching, replacement and ordered entry loading.
- `rules/nickname-reserved`: pure reserved-name normalization and pattern translation.
- `rules/java-nickname-characters`: the maintained Java 8 nickname character-property table and lookup.
- `rules/nickname-text`: shared bounded text validation and legacy trimming; no player mutation or occupation lookup.
- `services/nickname-word-filter`: injected readers, retained entries, loading state and reserved-name snapshots.
- `resources/nickname-words`: bounded JSON file adapter and filter factory.
- `resources/nickname-reserved`: bounded worker execution of translated reserved patterns.
- `resources/data/badwords.json`: the single maintained dictionary; [provenance and editing](src/resources/data/README.md).

Pure rules do not import file access, workers, transport, repositories or a catalog
registry. File/worker adapters are separate selective imports; there is no broad
root barrel. The package depends only on existing constants/error contracts.
Player nickname validation, occupation, global mutation coordination, payments,
alliance tasks and wire Controllers remain with their current owners.

The realm composes the filter and Redis readers. Services for dragon names and
red-packet text import the pure matcher directly. The current resources Rules
loader imports the dictionary through its explicit asset export. No process,
database authority, filtering algorithm, deadline or content changes here.

## Compatibility and migration

The five former `rules/{nickname-words,nickname-reserved,java-nickname-characters}`
and `resources/{nickname-words,nickname-reserved}` paths are retired in
[#590](https://github.com/ReeseArch64/opencok/issues/590). All maintained
application/service/test consumers use policy directly; import/architecture checks
confirm that no caller requires the removed facades. Use the selective exports
listed above when updating a source consumer from an older checkout.

The broader `rules/nickname` entrypoint still exposes `nicknameTrim` for its own
validation and current repository/celebrity consumers until player nickname
extraction under #558. It delegates to the one policy implementation. This does
not retain any of the five retired module paths or duplicate the dictionary.

The adapter's default asset is `./data/badwords.json` relative to its module.
The server build therefore copies the exact dictionary to `dist/src/data`, beside
the bundled `dist/src/index.js` entrypoint. Rebuild the complete server artifact
when updating code/data; source execution reads this package's own resource.
An explicit alternate file path retains its existing semantics. A failed initial
read still leaves an empty filter; failed reloads keep existing entries, as before.

## Verification

Run `bun run --cwd packages/policy test` and `bun run --cwd packages/policy check-types`.
The root `test:packages` command also discovers these tests, including the relocated
4,071 Java matching vectors, 4,071 replacement vectors and 340 reserved-pattern
vectors. The character-property digest covers every Unicode code point. Synthetic
fixtures and the 5,202-entry dictionary preserve their pre-move bytes.

Server tests retain command/occupation/mutation behavior; integration suites cover
nickname ownership/replacement, dragon progression and red-packet filtering under
disposable persistence. Build validation must verify the dictionary's packaged
location and default loader, not merely a successful JavaScript bundle. The full
domain register and remaining work are in [MIGRATION.md](../MIGRATION.md).
