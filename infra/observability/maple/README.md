# Maple v0.3.0 WebAssembly CSP workaround

The bundled dashboard compiles WebAssembly, but upstream v0.3.0 serves its UI with
`script-src 'self'`. Browsers enforce this policy and can leave the authenticated
dashboard blank. CLI service queries and the separate login page do not exercise
this path. See the upstream
[policy source](https://github.com/MapleTechLabs/maple/blob/v0.3.0/apps/cli/src/server/serve.ts).

The derived image retains the official v0.3.0 entrypoint, library, data directory,
authentication and API. It adds only `'wasm-unsafe-eval'` to the dashboard's
`script-src`; JavaScript string evaluation remains prohibited. Login CSP and all
other UI directives are unchanged. No proxy or additional runtime service is added.

The build selects the official v0.3.0 image tag and verifies the original amd64
executable SHA-256. The tag itself is mutable; the checksum guards the patched
executable, not the image's other files. `patch-csp.ts` requires exactly one complete expected UI
policy block in the Bun executable. It adds the permission and removes equivalent
JavaScript indentation whitespace inside that same block, preserving its byte
length, executable offsets and all bytes outside the block. The final image contains
only the patched executable, not the build-time Bun toolchain. Any checksum,
architecture, occurrence-count or size mismatch fails the build.

This workaround currently supports only the verified Linux amd64 release. Other
architectures fail closed and require independently verified executable hashes and
runtime testing before support is added. Do not repoint the patch at a different
release or disable its guards. Remove the derived image after an upstream release
fixes the CSP and passes authenticated browser, ingest, query and persistence checks.

## Validation and activation

The verified amd64 executable was patched outside Docker and run with a disposable
in-memory store on a separate loopback port. An isolated Chromium session signed in
and rendered the dashboard without startup errors. A browser probe successfully
compiled a minimal WebAssembly module while JavaScript string evaluation remained
blocked. The original running container and its volume were not changed. This does
not certify a Docker image build, Firefox behavior, ingest or restart persistence.

Run Docker-free patch and Compose wiring tests with:

```sh
bun --no-env-file test tests/compose
```

The Maple integration test builds the derived image and checks login/dashboard CSP,
unauthorized-query rejection, ingest, authenticated queries and restart persistence.
It starts disposable containers and must only be run when Docker execution is allowed:

```sh
bun run --cwd packages/core test:maple
```

To activate the image later, from the repository root:

```sh
docker compose --profile observability up --build -d
```

The `observability` profile selects only Maple. There is no periodic Compose
healthcheck; validate readiness explicitly before relying on the endpoint. The
45-second shutdown grace period and bounded Docker logs remain intentional.

Building files alone does not update an already running Maple container. Recreating
Maple with the same named volume preserves telemetry; do not delete the volume or
reset the store. Verify the actual authenticated dashboard, not only `/login` or the
CLI service queries, after activation.
