FROM oven/bun:1.4.2

WORKDIR /workspace
COPY . .
RUN bun install --frozen-lockfile --production --ignore-scripts
RUN mkdir /configuration && chown bun:bun /configuration

USER bun
CMD ["bun", "--no-env-file", "packages/drizzle/scripts/setup-compose.ts"]
