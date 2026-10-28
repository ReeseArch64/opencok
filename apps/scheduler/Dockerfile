FROM oven/bun:1.4.2 AS dependencies
WORKDIR /workspace
COPY . .
RUN bun install --frozen-lockfile --production --ignore-scripts
RUN bun run --cwd apps/scheduler build

FROM oven/bun:1.4.2-slim
WORKDIR /workspace
COPY --from=dependencies --chown=bun:bun /workspace /workspace
ENV TZ=UTC
USER bun
EXPOSE 18092
STOPSIGNAL SIGTERM
CMD ["bun", "--no-env-file", "apps/scheduler/dist/src/index.js"]
