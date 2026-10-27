# TypeScript stack gateway

Traefik routes HTTP discovery to `api:8080` and SFS/TCP to `server:9933`.
Configuration lives in [traefik.yml](traefik.yml) and [dynamic.yml](dynamic.yml).
No Docker socket or administration dashboard is exposed.

| Public route                                                                                             | Methods         | Destination                           |
| -------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------- |
| `/gameservice/getserverlist.php`, `/gameservice/getline.php`, `/gameservice/getserverlist_memoryold.php` | GET, POST, HEAD | Shared TypeScript API                 |
| `/api/v1global_config`, `/chat/server/links`, `/chat/server/all`                                         | GET             | API proxy to configured chat metadata |
| `/healthz`, `/_health.php`                                                                               | GET, HEAD       | API process liveness                  |
| `/readyz`                                                                                                | GET, HEAD       | API database/Redis readiness          |
| Game port (default 9933)                                                                                 | TCP             | TypeScript realm server               |

The CDN routes `/cok/*` (excluding `/cok/img/*`) and `/100001/*` map to fixed
storage paths under the origin configured by `CDN_URL` in the root `.env`.
Use an HTTP(S) origin without a path, query, fragment or credentials. The storage
must serve `/opencok-cdn/cok.eleximg.com/cok/*` and
`/opencok-cdn/asset.cok.chat/100001/*`; these prefixes remain fixed.
Development uses `CDN_URL=http://minio:9000`; production uses the external origin.
This setting is independent of the API upload storage configured by `S3_*`.

The three chat metadata paths are forwarded to the API;
`CHAT_URL` controls their upstream and an unset value preserves 404. The chat service
supplies the public WebSocket endpoint; WebSocket traffic does not pass through this
gateway. Signed avatar uploads use POST `/gameservice/www/gateway/json.php` with
a 2,162,688-byte body limit; JPEG reads under `/cok/img/` go to the API.
Other paths, including `/chat/ws`, `/external/session` and private avatar confirmation,
have no router and return 404. The discovery body limit is 64 KiB. Unknown methods
are not forwarded. The internal API's account-name lookup is not a public route.

Development ports and advertised endpoints are direct Compose values: HTTP 80,
TCP 9933 and LAN host `192.168.1.104`. Ports have no host-IP prefix; edit these
values when moving the local stack. Production ingress is configured separately.
The TCP upstream uses service DNS `server`,
not the retired `gameserver` name. HTTP and TCP ports remain distinct.

The private port-8082 Traefik ping is used only for its container healthcheck.
The public health aliases are forwarded to the API. Dependency readiness is
separate from gateway process liveness; neither proves native APK rendering.
Gateway startup waits for API/server health. Only the development override adds
a wait for successful MinIO CDN initialization; the base gateway has no MinIO dependency.

Access logs omit paths, queries, headers and player identifiers, retaining only
UTC time, method, router, statuses and duration. The API returns a request ID and
logs status/duration without payloads. Client Authorization headers are not stripped
by an obsolete media compatibility middleware. Forwarded headers are not trusted
from arbitrary sources.

Historical Nginx, Apache-upload and avatar configs have been removed from this
stage instead of serving as misleading deployment alternatives.

Chat discovery forwarding is unit-checked through the API and existing chat handlers,
including unavailable replies and exact GET/path allowlisting. Isolated Traefik checks
verify CDN origin substitution, path prefixes and method filtering with synthetic files.
Live external CDN access, HTTP/WebSocket traffic and native client behavior require
deployment verification.
