# TypeScript formatting pilot for issue #550

Status: pilot completed. ReeseArch64 confirmed the proposal on 2026-10-27 in the
implementation session; see [ADR-0014](../../docs/decisions/0014-adopt-dprint-for-typescript-formatting.md).
The measurements below retain the pre-migration baseline.
No production source, root formatter configuration, editor defaults or CI ownership
changes in this delivery. The isolated pilot dependencies do not select a replacement.

## Reproduce

From the repository root, using Bun 1.4.2:

```sh
bun install --frozen-lockfile
bun --no-env-file install --cwd .github/formatting-pilot --frozen-lockfile
bun --no-env-file run .github/formatting-pilot/verify.ts
```

The harness reads only the three maintained sources below at commit
`ab051aaa224676e62f0cb6fea1589406b6c33541`, formats through stdin,
and writes complete before/dprint/Oxfmt artifacts into a newly created temporary
directory printed at completion. It never traverses private or generated inputs.
Each run prints SHA-256 hashes so reviewers can match the report to actual output.
The pilot config has a non-discoverable filename and must be passed explicitly.
Root lint/format continue to own the pilot implementation and config themselves.

## Pinned candidates and evidence

- dprint CLI 0.64.3 and TypeScript plugin 0.96.1, pinned in the isolated manifest and lockfile.
- Oxfmt 0.74.0 and Oxlint 1.89.0 from the root lockfile-resolved Vite+ 1.4.0.
- TypeScript 5.9.3 is an isolated AST test dependency, not a workspace compiler
  downgrade. The root TypeScript 7.0.2 package exposes a different API.
- All candidate keys are exercised against the pinned plugin; unknown keys fail
  the harness. `trailingCommas: onlyMultiLine` retains trailing commas in multiline
  constructs without introducing commas into every single-line call/import.
- The Oxfmt comparison uses the accepted root configuration with only `tabWidth`
  changed to four. Its installed configuration schema offers no Allman option.
- Oxlint's installed schema and positive/negative fixtures verify `curly: [error,
  all]`, including multiline guards, nested dangling else, for/of/in, while and do.
  dprint `useBraces: always` alone leaves an unbraced do body: format, apply Oxlint
  curly fixes, format again, then lint is the verified correction sequence.
- Neither the installed Oxlint schema nor dprint offers general semantic-stage
  padding enforcement. Existing intentional separation is preserved and excess
  blank lines are collapsed; missing logical separation remains a review rule.
  Adding another general-purpose linter is not proposed.

Documentation consulted on 2026-10-27: [TypeScript plugin](https://dprint.dev/plugins/typescript/),
[configuration](https://dprint.dev/plugins/typescript/config/),
[installation/editor integrations](https://dprint.dev/install/), and
[CLI](https://dprint.dev/cli/). Runtime validation of the pinned release takes
precedence over evolving documentation.

## Measured comparison

| Maintained file                           | Current lines | Oxfmt, four spaces | dprint candidate |
| ----------------------------------------- | ------------: | -----------------: | ---------------: |
| `packages/identity/src/mobile.ts`         |           100 |                100 |              133 |
| `packages/storage/src/discovery-redis.ts` |            39 |                 43 |               54 |
| `packages/services/src/game.service.ts`   |          3085 |               3197 |             4006 |

Both candidates are stable on a second pass for each file. AST comparison passes
for all six outputs. Allman plus inserted braces increases vertical scanning
space; it does not decompose the 3,085-line gameplay service. Four spaces also
reduces the available width inside nested expressions. Keep 100 columns to isolate
these effects; no measured reason to change the width emerged.

The excerpts below are copied from the harness artifacts, not hand-formatted.
Text fences intentionally preserve the candidate layout under the current Markdown
formatter. Complete matched files are reproducible through the command above.

### packages/identity/src/mobile.ts

Before:

```text
export async function authenticate(
  packet: Fields,
  db: AuthenticationStore,
  config: MobileAuthConfig,
  now = Date.now(),
): Promise<Row> {
  if (str(packet, "zn") !== `COK${config.kingdomId}`) throw new LoginError("zone");
```

Candidate:

```text
export async function authenticate(
    packet: Fields,
    db: AuthenticationStore,
    config: MobileAuthConfig,
    now = Date.now(),
): Promise<Row>
{
    if (str(packet, "zn") !== `COK${config.kingdomId}`)
    {
        throw new LoginError("zone");
    }
```

### packages/storage/src/discovery-redis.ts

Before:

```text
    } catch {
      throw new DependencyError("redis");
    } finally {
```

Candidate:

```text
        catch
        {
            throw new DependencyError("redis");
        }
        finally
        {
```

### packages/services/src/game.service.ts

Before:

```text
  private async state(uid: string): Promise<ReadyCity> {
    const state = await this.db.getCityByPlayerId(uid, this.now());

    if (!state.profile || !state.resource) throw new GameError(errors.missing);

    if (long(state.profile, "banTime") > BigInt(this.now()) || num(state.profile, "banFlag") !== 0)
      throw new GameError(errors.invalid);

    return { ...state, profile: state.profile, resource: state.resource };
  }
```

Candidate:

```text
    private async state(uid: string): Promise<ReadyCity>
    {
        const state = await this.db.getCityByPlayerId(uid, this.now());

        if (!state.profile || !state.resource)
        {
            throw new GameError(errors.missing);
        }

        if (
            long(state.profile, "banTime") > BigInt(this.now())
            || num(state.profile, "banFlag") !== 0
        )
        {
            throw new GameError(errors.invalid);
        }

        return { ...state, profile: state.profile, resource: state.resource };
    }
```

## Confirmed policy

- Four spaces, LF, double quotes, semicolons, 100 columns; preserve property quotes
  and import/export order. Trailing commas only in multiline constructs.
- Allman braces for classes, interfaces, enums, constructors, methods, accessors,
  function declarations/expressions and control-flow blocks. Empty blocks may
  remain `{}` after a line break according to actual plugin output.
- `else`, `catch` and `finally` begin on their own line. Mandatory braces for
  control-flow bodies are enforced by Oxlint `curly`, including do/while.
- Arrow callback blocks keep same-line opening braces. Arrow expression callbacks
  and object-return parentheses remain ordinary TypeScript. Object literals keep
  expression-oriented layout; they do not inherit declaration brace placement.
- Multiline conditions use hanging indentation, with a closing parenthesis on
  its own line when expanded. Arguments, generic types and chains wrap at 100
  columns; operator/chain line breaks follow the pinned plugin output.
- One blank line between imports/declarations, top-level declarations, methods,
  logical stages, after control-flow blocks and before final returns. Preserve
  existing meaningful spacing, collapse decorative repetition, and review missing
  stage boundaries manually until a dedicated measurable enforcement proposal.
- Retain normal TypeScript names, public contracts and module responsibilities.

## Confirmed rollout

1. Capture the confirmed choice in ADR-0014; acceptance requires ReeseArch64's
   confirmation. Only on acceptance add reciprocal supersession links to ADR-0008
   and update the decisions index. Keep one commit per ADR.
2. Create a dependent integration PR. Pin dprint/plugin in root dev dependencies;
   use the npm-installed local Wasm plugin so frozen installation owns the binary
   and plugin versions in both development and CI, without remote plugin fetching.
   Retain Oxlint correctness and warnings-as-errors; add `curly: [error, all]`.
3. Assign dprint exclusively JS/JSX/TS/TSX (including module variants); Oxfmt
   exclusively all its other currently supported maintained formats, including
   JSON/Markdown/YAML/CSS/HTML. Exclude JS/TS variants from Oxfmt explicitly and
   preserve every current exclusion in both configs. Embedded Markdown examples
   remain owned by Oxfmt as part of the Markdown document.
4. Keep root `format`, `format:check`, `lint` and `lint:fix` commands. Format
   writing invokes the two owners; format checking checks both. CI installs root
   frozen dependencies and invokes these commands. Introduce per-language editor
   settings for dprint and four-space source indentation, retaining two-space
   defaults for other formats. Editors must use the same root configuration;
   extension availability is not proof of tested editor equivalence.
5. Create a dependent baseline PR, separating brace insertion from whitespace
   changes in commits. Run repository-wide AST comparison with explicitly bounded
   normalization before accepting the baseline; run workspace type checks and
   affected tests. Preserve exclusions, property/import order and all behavior.
6. Before structural refactoring, use the existing issue/discussion process to
   track separate service decompositions. Candidates from current methods:
   avatar grants/version/upload orchestration (`avatarVersion`, `avatarFinish`,
   `avatarUrl`, `avatarGrant`); postbox workflows (`mailStatus`, `mailSave`,
   `mailRead`, `mailDelete`, `mailSystem`, `mailUpdates`, `mailBatch`); and command
   dispatch (`execute`, lines 504–1254). Each requires constructor injection,
   controller/service boundaries and protocol regressions. These are tracked separately in [#552](https://github.com/ReeseArch64/opencok/issues/552)
   and [#553](https://github.com/ReeseArch64/opencok/issues/553); their implementation
   remains outside this formatting migration.

## Verification scope and limits

The harness compares syntax trees while ignoring formatting-only parentheses,
single-statement control-body wrappers, inert empty statements inside blocks and
newline-only JSX text. It retains node kinds, child order, identifiers, literals
and operator tokens. This proves syntax equivalence within those explicit
normalizations, not arbitrary program equivalence. It also runs six synthetic
fixtures before/after covering object returns, ASI bare returns, dangling else,
loops, generics, callbacks, template literals and spacing. The TSX case compares
emitted JavaScript ASTs as well as source ASTs; it is not a native-client test.

The pilot verifies preserved logical padding and positive/negative mandatory-brace
fixtures. It does not claim missing logical padding is automatically inserted.
It installs no production tooling replacement and does not verify editor behavior,
rollout CI, a repository-wide migration or mobile compatibility. Those checks
belong to the post-decision integration/baseline PRs. No database, account, state,
service restart, deployment or client packaging changes are involved. Reverting
this pilot removes only evaluation artifacts.

## Rollout evidence

See [migration validation](MIGRATION.md) for the adopted baseline, editor LSP/CLI
comparison, workspace checks and separately tracked structural work.
