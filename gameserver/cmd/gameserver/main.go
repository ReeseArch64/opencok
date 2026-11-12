package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/opencok/gameserver/internal/gateway"
	"github.com/opencok/gameserver/internal/realm"
)

const banner = `
  ___                   ____ ___  _  __
 / _ \ _ __   ___ _ __ / ___/ _ \| |/ /
| | | | '_ \ / _ \ '_ \ |  | | | | ' /
| |_| | |_) |  __/ | | | |__| |_| | . \
 \___/| .__/ \___|_| |_|\____\___/|_|\_\
      |_|

                 GAME SERVER
`

func main() {
	addr := flag.String("addr", "127.0.0.1:9933", "HTTP/WS listen address")
	limit := flag.Int("max-connections", 1000, "maximum connections including pending handshakes")
	origins := flag.String("origins", "", "comma-separated exact browser origins; default: localhost only")
	realmURL := flag.String("realm-url", "http://127.0.0.1:9940", "read-only development Realm URL")
	flag.Parse()
	fmt.Fprint(os.Stderr, banner)
	if *limit <= 0 {
		slog.Error("max-connections must be positive")
		os.Exit(1)
	}
	var allowed []string
	if *origins != "" {
		for _, origin := range strings.Split(*origins, ",") {
			allowed = append(allowed, strings.TrimSpace(origin))
		}
	}
	g := gateway.New(gateway.Config{MaxConnections: *limit, Heartbeat: 25 * time.Second, Timeout: 60 * time.Second, Origins: allowed, World: realm.New(*realmURL)})
	srv := &http.Server{Addr: *addr, Handler: g.Handler(), ReadHeaderTimeout: 5 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 8192}
	slog.Info("gameserver starting", "protocol", gateway.Subprotocol)
	slog.Info("connection limits configured", "max_connections", *limit, "heartbeat", "25s", "timeout", "60s")
	if len(allowed) == 0 {
		slog.Info("browser origins configured", "policy", "localhost only")
	} else {
		slog.Info("browser origins configured", "origins", allowed)
	}
	listener, err := net.Listen("tcp", *addr)
	if err != nil {
		slog.Error("server failed to listen", "address", *addr, "error", err)
		os.Exit(1)
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	drained := make(chan struct{})
	go func() {
		defer close(drained)
		<-ctx.Done()
		slog.Info("gameserver shutting down", "online_sessions", g.Online())
		g.Close()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			slog.Error("server shutdown failed", "error", err)
		}
	}()
	slog.Info("gameserver ready", "address", listener.Addr().String(), "websocket_path", "/ws", "health_path", "/healthz")
	if err := srv.Serve(listener); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("server failed", "error", err)
		os.Exit(1)
	}
	<-drained
	slog.Info("gameserver stopped")
}
