FROM oven/bun:1.4.2 AS dependencies
WORKDIR /workspace
COPY . .
RUN bun install --frozen-lockfile --production --ignore-scripts

FROM oven/bun:1.4.2-slim
WORKDIR /workspace
COPY --from=dependencies --chown=bun:bun /workspace /workspace
ENV TZ=UTC
USER bun
ENV CHAT_HOST=0.0.0.0
EXPOSE 8083
STOPSIGNAL SIGTERM
CMD ["bun", "--no-env-file", "apps/chat/src/index.ts"]
