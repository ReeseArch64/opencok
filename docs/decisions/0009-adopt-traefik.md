---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0009: Adopt Traefik for current HTTP and realm TCP ingress

## Context and Problem Statement

The development stack needs one explicit ingress boundary for legacy discovery,
avatar media, fixed client assets and SmartFoxServer (SFS) realm TCP sessions.
The current Compose gateway already uses Traefik; recording its responsibilities
prevents a future deployment from exposing the entire internal API by default.
Kong HTTP/WebSocket policy remains target architecture, not this implementation.

Acceptance records the maintainer's selection, not completed production routing,
verified external hosting or native-client compatibility.

## Decision

Use the existing `traefik:v3.7.15` baseline with static settings in
`docker-compose.yml` and file-provider routes in `infra/gateway/dynamic.yml`.
Retain separate HTTP port 80 and realm TCP port 9933 entrypoints, routing to
`api:8080` and `server:9933`. Normal SFS TCP requires a reachable TCP endpoint;
it is not traffic for the ordinary Cloudflare HTTP proxy.

Preserve the exact path/method allowlist: discovery PHP aliases, API health and
readiness, three GET-only Chat metadata routes, POST avatar uploads, constrained
avatar JPEG reads and filtered GET/HEAD CDN prefixes. Keep discovery bodies at
65,536 bytes and avatar request bodies at 2,162,688 bytes. CDN origin configuration
is independent of private upload storage; fixed origin path prefixes remain intact.

Do not publish private avatar confirmation, account lookup, `/external/session`,
`/_internal/` endpoints or `/chat/ws` through a catch-all router. Chat WebSocket
clients use the separately advertised endpoint. Disable the dashboard and insecure
API; keep the port-8082 ping private and do not mount the Docker socket.

Non-goals: adopting Kong, adding public administration, automatic TLS/DNS setup,
changing client protocols or claiming production/high-availability readiness.

## Consequences

- Explicit routes limit accidental API exposure; each new public route needs contract and negative-routing tests.
- Separate TCP and HTTP ingress requires operators to provision both transports and verify advertised realm endpoints.
- File-provider configuration avoids Docker socket privileges but requires coordinated route/service changes and restart/readiness validation.
- Filtered logs and metrics support diagnosis without URLs, tokens or player identifiers; preserve disabled native ingress tracing and untrusted-forwarded-header boundaries.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `docker-compose.dev.yml`, `infra/gateway/dynamic.yml`, `infra/gateway/README.md`, `apps/api/tests/chat-discovery.test.ts`, `apps/api/tests/discovery.test.ts`, `.github/ARCHITECTURE.md`.
- **Dependencies**: Retain the current Traefik image baseline; validate and pin any replacement separately. This record installs nothing and changes no runtime configuration.
- **Patterns**: Follow current exact method/path rules, buffering middleware, fixed CDN prefix rewriting and bounded upstream timeouts. Never replace them with unrestricted API forwarding.
- **Configuration**: Keep `CDN_URL` origin-only, file mounts read-only, dashboard disabled and health entrypoint unpublished. Keep local telemetry filtered and independent of startup readiness.
- [ ] Maintain synthetic route tests covering positive paths, rejected methods, private paths, CDN traversal/script filters and body limits.
- [ ] Exercise an isolated Traefik instance against synthetic HTTP assets and a TCP backend; document ingress and backend outage behavior in the gateway guide.
- [ ] Validate production TCP reachability, TLS/HTTP ingress and DNS separately before release; do not infer them from Compose healthchecks.

### Verification

- [ ] Allowed discovery, media and CDN requests reach only their configured upstream; unknown paths/methods and private endpoints return 404.
- [ ] Requests exceeding each configured body limit are rejected without forwarding oversized bodies.
- [ ] A synthetic SFS TCP exchange reaches `server:9933` without HTTP conversion; Chat WebSocket traffic is not relayed by this gateway.
- [ ] Dashboard, port-8082 ping and internal API listener are not publicly published; no Docker socket is mounted.
- [ ] Access-log exports omit paths, queries, headers and identifiers; gateway startup does not require the telemetry collector.

## Alternatives Considered

These are tradeoff comparisons, not claims of historical trials or benchmarks.

- Kong offers HTTP/WebSocket policy plugins but introduces another configuration/control surface and does not by itself settle native TCP ingress; it remains a target, not selected here.
- Nginx can handle HTTP and stream proxying, but replacing the existing Traefik routes would require revalidating equivalent filters, limits and observability without a current migration need.

## More Information

See the [gateway contract](../../infra/gateway/README.md),
[architecture](../../.github/ARCHITECTURE.md) and
[contribution rules](../../.github/CONTRIBUTING.md).
Revisit if required transport or policy capabilities exceed this bounded gateway.
