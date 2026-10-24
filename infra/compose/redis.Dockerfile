FROM redis:6.2.24-bookworm

COPY infra/redis/redis.conf /usr/local/etc/redis/redis.conf

VOLUME /data

HEALTHCHECK --interval=5s --timeout=3s --retries=12 CMD ["redis-cli", "ping"]

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
