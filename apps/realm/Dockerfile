FROM oven/bun:1.4.4-alpine
WORKDIR /app
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/realm ./apps/realm
COPY app/package.json ./app/package.json
COPY gameserver/package.json ./gameserver/package.json
RUN bun install --frozen-lockfile --ignore-scripts
USER bun
EXPOSE 9940
CMD ["bun", "--no-env-file", "apps/realm/src/main.ts"]
