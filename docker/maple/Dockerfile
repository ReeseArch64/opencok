FROM ghcr.io/mapletechlabs/maple:v0.3.0 AS upstream

FROM --platform=$BUILDPLATFORM oven/bun:1.4.2 AS patch
ARG TARGETARCH
COPY --from=upstream /opt/maple/maple /tmp/maple-original
COPY patch-csp.ts /tmp/patch-csp.ts
RUN bun /tmp/patch-csp.ts /tmp/maple-original /tmp/maple "$TARGETARCH" && chmod 0755 /tmp/maple

FROM upstream
COPY --from=patch /tmp/maple /opt/maple/maple
