FROM zookeeper:3.4.14

ENV ZOO_HEAP_SIZE=256 \
    ZOO_LOG4J_PROP=INFO,CONSOLE

COPY infra/zookeeper/zoo.cfg /conf/zoo.cfg

VOLUME ["/data", "/datalog", "/logs"]

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=12 \
  CMD printf srvr | nc -w 2 127.0.0.1 2181 | grep -q 'Mode: standalone'
