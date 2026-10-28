# OpenCok Web

The first browser client slice: the OpenCok loading screen, real image-loading
progress and a periodic HTTP connectivity check. Written in TypeScript using
the existing Bun workspace; no frontend framework or new third-party library.

`WebApplication` composes the server and `PingController`; `HttpGatewayProbe` owns
the bounded health request. In the browser, `LoadingApplication` coordinates the
`LoadingView` and `GatewayPingClient` through explicit ports. Response contracts,
the health target enum and runtime validation use the shared workspace packages.
The existing `ping.ts` exports remain available to callers.

## Run locally

From the repository root:

```sh
bun install
bun run --cwd apps/web assets:prepare
bun run --cwd apps/web dev
```

Open <http://localhost:5173> on the host, or
<http://192.168.1.104:5173> on the LAN. The Bun process must be able to reach
`http://192.168.1.104/_health.php`.

## Docker Compose

The root Compose file includes `web` in profiles `all`, `dev` and `prod`.
The container serves the existing Bun application on <http://localhost:5173>,
including `/api/ping`. Port 5173 is published on all host interfaces as requested;
restrict access with host firewall rules when necessary.

Supply the three prepared images in `apps/web/assets/` before starting. Compose
mounts that directory read-only and does not create it, extract client assets or
package private images into the container image. Missing images prevent the page
from bundling correctly. The fixed gateway health target remains unchanged and
must be reachable from the container for the ping result to be online.

```sh
docker compose --profile dev up -d --build web
```

## Local assets

`assets:prepare` writes only three images to Git-ignored `apps/web/assets/`:

- OpenCok logo from `assets/imgs/logo.png`.
- Loading background from the extracted branding directory under
  `/mnt/storage/cok-assets/client/v12.06.0/assets/opencok_branding/`, when present.
  Otherwise it reads the already branded background from the local
  `android/install/split_InstallPack.apk`.
- Loading bar frame from the extracted `dr_face_race_4` sprite package under
  `/mnt/storage/cok-assets/packages/`.

No complete asset library is copied or publicly exposed. The source directories
and APK remain unchanged. If the local paths differ, pass explicit inputs:

```sh
python3 apps/web/scripts/prepare_assets.py \
  --assets-root /mnt/storage/cok-assets \
  --loading /path/to/loading.jpg \
  --logo /path/to/logo.png
```

Images remain local inputs subject to their owners' rights, as described in
[`PRODUCT.md`](../../PRODUCT.md). Do not force-add them to Git.

## Connectivity and scope

The browser calls this application's `GET /api/ping`. The Bun handler makes a
fixed, read-only GET to the existing gateway `/_health.php`, accepts only an
HTTP success with body `ok`, and measures that request's latency. Requests time
out after three seconds; failures report offline with no latency. Concurrent
tabs share an in-flight request and a one-second cache. Browser checks repeat
five seconds after completion and pause while the tab is hidden. A manual
retry is available. Visual progress measures the three image decodes only.

The web handler avoids requiring CORS changes in the existing services. It is
not a general proxy: the client cannot choose the destination or request a
file from the asset library.

**HTTP health proves gateway reachability only.** It does not prove that the
SmartFox gameserver is initialized or that gameplay/login works. This slice
does not implement accounts, authentication, gameplay, WebSockets or the game
protocol. Future browser transport compatibility needs investigation before
any server, service or gateway changes are proposed.

This application does not change game authority, database state or client protocol.

## Checks

```sh
bun run --cwd apps/web check:types
bun run --cwd apps/web test
bun run --cwd apps/web build
```

`build` validates and bundles the frontend into ignored `dist/`. It does not
create a standalone game server or provide `/api/ping` for a static host.
Use `bun run --cwd apps/web start` to serve the page together with its ping
handler. Full game compatibility is outside this initial slice.
