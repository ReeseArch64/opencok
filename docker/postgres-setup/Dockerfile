FROM oven/bun:1.4.2

WORKDIR /workspace

COPY . .

RUN bun install --frozen-lockfile --production --ignore-scripts \
    && mkdir /configuration \
    && chown bun:bun /configuration

USER bun

ENTRYPOINT ["bun", "--no-env-file", "docker/postgres-setup/entrypoint.mjs"]
CMD ["bun", "--no-env-file", "packages/drizzle/scripts/setup-compose.ts"]
