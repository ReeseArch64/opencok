// Package gateway implements the anonymous OpenCoK binary connection bootstrap.
package gateway

import (
	"context"
	"crypto/rand"
	"encoding/binary"
	"encoding/json"
	"net/http"
	"net/url"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
	contracts "github.com/opencok/gameserver/internal/contracts/generated"
)

const Subprotocol = "opencok.binary.v1"

type WorldReader interface {
	Query(context.Context, contracts.MapQuery) (contracts.MapRegion, error)
}

type Config struct {
	World          WorldReader
	MaxConnections int
	Heartbeat      time.Duration
	Timeout        time.Duration
	Origins        []string
}

type Gateway struct {
	cfg         Config
	mu          sync.Mutex
	connections map[*websocket.Conn]bool
	slots       chan struct{}
	closed      bool
}

func New(cfg Config) *Gateway {
	if cfg.MaxConnections <= 0 || cfg.Heartbeat < time.Millisecond || cfg.Timeout <= cfg.Heartbeat || cfg.Timeout > time.Hour {
		panic("invalid gateway limits")
	}
	return &Gateway{cfg: cfg, connections: make(map[*websocket.Conn]bool), slots: make(chan struct{}, cfg.MaxConnections)}
}

func (g *Gateway) Online() int {
	g.mu.Lock()
	defer g.mu.Unlock()
	n := 0
	for _, online := range g.connections {
		if online {
			n++
		}
	}
	return n
}

func (g *Gateway) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		g.mu.Lock()
		closed := g.closed
		g.mu.Unlock()
		if closed {
			http.Error(w, "draining", http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"status": "ok", "online_sessions": g.Online()})
	})
	mux.HandleFunc("GET /ws", g.connect)
	return mux
}

func (g *Gateway) originAllowed(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	} // Native clients do not send Origin.
	for _, allowed := range g.cfg.Origins {
		if origin == allowed {
			return true
		}
	}
	u, err := url.Parse(origin)
	// Default only permits local development origins, never arbitrary sites.
	return len(g.cfg.Origins) == 0 && err == nil && (u.Scheme == "http" || u.Scheme == "https") && (u.Hostname() == "localhost" || u.Hostname() == "127.0.0.1" || u.Hostname() == "[::1]" || u.Hostname() == "::1")
}

func (g *Gateway) connect(w http.ResponseWriter, r *http.Request) {
	g.mu.Lock()
	closed := g.closed
	g.mu.Unlock()
	if closed {
		http.Error(w, "draining", http.StatusServiceUnavailable)
		return
	}
	select {
	case g.slots <- struct{}{}:
	default:
		http.Error(w, "capacity reached", http.StatusServiceUnavailable)
		return
	}
	defer func() { <-g.slots }()
	found := false
	for _, p := range websocket.Subprotocols(r) {
		if p == Subprotocol {
			found = true
		}
	}
	if !found {
		http.Error(w, "unsupported subprotocol", http.StatusBadRequest)
		return
	}
	u := websocket.Upgrader{Subprotocols: []string{Subprotocol}, CheckOrigin: g.originAllowed, HandshakeTimeout: 5 * time.Second, ReadBufferSize: 256, WriteBufferSize: 256}
	c, err := u.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer c.Close()
	g.mu.Lock()
	if g.closed {
		g.mu.Unlock()
		return
	}
	g.connections[c] = false
	g.mu.Unlock()
	defer func() { g.mu.Lock(); delete(g.connections, c); g.mu.Unlock() }()
	c.SetReadLimit(64)
	_ = c.SetReadDeadline(time.Now().Add(5 * time.Second))
	kind, hello, err := c.ReadMessage()
	if err != nil {
		return
	}
	if kind != websocket.BinaryMessage || len(hello) != 2 || hello[0] != 1 || hello[1] != 1 {
		g.reject(c)
		return
	}
	// One writer is shared by query replies and the heartbeat goroutine.
	var writeMu sync.Mutex
	send := func(data []byte) error { writeMu.Lock(); defer writeMu.Unlock(); return write(c, data) }
	welcome := make([]byte, 26)
	welcome[0], welcome[1] = 1, 2
	if _, err := rand.Read(welcome[2:18]); err != nil {
		return
	}
	binary.BigEndian.PutUint32(welcome[18:22], uint32(g.cfg.Heartbeat.Milliseconds()))
	binary.BigEndian.PutUint32(welcome[22:26], uint32(g.cfg.Timeout.Milliseconds()))
	if err := send(welcome); err != nil {
		return
	}
	g.mu.Lock()
	g.connections[c] = true
	g.mu.Unlock()
	_ = c.SetReadDeadline(time.Now().Add(g.cfg.Timeout))
	var awaiting atomic.Bool
	done := make(chan struct{})
	defer close(done)
	go func() {
		ticker := time.NewTicker(g.cfg.Heartbeat)
		defer ticker.Stop()
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				if awaiting.Swap(true) {
					continue
				}
				if send([]byte{1, 3}) != nil {
					_ = c.Close()
					return
				}
			}
		}
	}()
	// Queries do not refresh the heartbeat deadline. Rate limits are per socket.
	tokens, refill := 8.0, time.Now()
	for {
		kind, data, err := c.ReadMessage()
		if err != nil {
			return
		}
		if kind != websocket.BinaryMessage || len(data) < 2 || data[0] != 1 {
			g.reject(c)
			return
		}
		if data[1] == 16 {
			query, err := contracts.DecodeMapQuery(data)
			if err != nil {
				g.reject(c)
				return
			}
			now := time.Now()
			tokens += now.Sub(refill).Seconds() * 8
			if tokens > 8 {
				tokens = 8
			}
			refill = now
			if tokens < 1 {
				g.reject(c)
				return
			}
			tokens--
			region := contracts.MapRegion{RequestId: query.RequestId, KingdomId: query.KingdomId, Status: 2}
			if g.cfg.World != nil {
				if result, err := g.cfg.World.Query(r.Context(), query); err == nil {
					region = result
				}
			}
			reply, err := contracts.EncodeMapRegion(region)
			if err != nil || send(reply) != nil {
				return
			}
			continue
		}
		if len(data) != 2 || data[1] != 4 || !awaiting.Swap(false) {
			g.reject(c)
			return
		}
		_ = c.SetReadDeadline(time.Now().Add(g.cfg.Timeout))
	}
}

func write(c *websocket.Conn, data []byte) error {
	_ = c.SetWriteDeadline(time.Now().Add(5 * time.Second))
	return c.WriteMessage(websocket.BinaryMessage, data)
}

func (g *Gateway) reject(c *websocket.Conn) {
	_ = c.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseProtocolError, "invalid binary message"), time.Now().Add(time.Second))
}

// Close also terminates upgraded sockets, which http.Server.Shutdown does not own.
func (g *Gateway) Close() {
	g.mu.Lock()
	g.closed = true
	for c := range g.connections {
		_ = c.Close()
	}
	g.mu.Unlock()
}
