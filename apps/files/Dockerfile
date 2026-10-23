FROM oven/bun:1.4.2 AS dependencies
WORKDIR /workspace
COPY . .
RUN bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.4.2-slim
WORKDIR /workspace
COPY --from=dependencies --chown=bun:bun /workspace /workspace
ENV TZ=UTC
USER bun
ENV FILES_HOST=0.0.0.0
EXPOSE 8084
STOPSIGNAL SIGTERM
CMD ["bun", "--no-env-file", "apps/files/src/index.ts"]
