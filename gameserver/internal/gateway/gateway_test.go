package gateway

import (
	"encoding/binary"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func setup(t *testing.T, max int) (*Gateway, string) {
	t.Helper()
	g := New(Config{MaxConnections: max, Heartbeat: 20 * time.Millisecond, Timeout: 100 * time.Millisecond})
	s := httptest.NewServer(g.Handler())
	t.Cleanup(func() { g.Close(); s.Close() })
	return g, "ws" + strings.TrimPrefix(s.URL, "http") + "/ws"
}

func dial(t *testing.T, url string) *websocket.Conn {
	t.Helper()
	d := websocket.Dialer{Subprotocols: []string{Subprotocol}}
	c, _, err := d.Dial(url, nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { c.Close() })
	return c
}

func welcome(t *testing.T, c *websocket.Conn) {
	t.Helper()
	if err := c.WriteMessage(websocket.BinaryMessage, []byte{1, 1}); err != nil {
		t.Fatal(err)
	}
	_ = c.SetReadDeadline(time.Now().Add(time.Second))
	kind, b, err := c.ReadMessage()
	if err != nil || kind != websocket.BinaryMessage || len(b) != 26 || b[0] != 1 || b[1] != 2 {
		t.Fatalf("welcome: %x %v", b, err)
	}
	if binary.BigEndian.Uint32(b[18:22]) != 20 || binary.BigEndian.Uint32(b[22:26]) != 100 {
		t.Fatal("incorrect heartbeat limits")
	}
}

func eventuallyOffline(t *testing.T, g *Gateway) {
	t.Helper()
	deadline := time.Now().Add(time.Second)
	for time.Now().Before(deadline) {
		if g.Online() == 0 {
			return
		}
		time.Sleep(time.Millisecond)
	}
	t.Fatal("presence was not removed")
}

func TestHeartbeatPresenceAndDisconnect(t *testing.T) {
	g, url := setup(t, 2)
	c := dial(t, url)
	if g.Online() != 0 {
		t.Fatal("unadmitted connection counted online")
	}
	welcome(t, c)
	for i := 0; i < 8; i++ {
		kind, b, err := c.ReadMessage()
		if err != nil || kind != websocket.BinaryMessage || string(b) != string([]byte{1, 3}) {
			t.Fatalf("ping: %x %v", b, err)
		}
		if err := c.WriteMessage(websocket.BinaryMessage, []byte{1, 4}); err != nil {
			t.Fatal(err)
		}
	}
	if g.Online() != 1 {
		t.Fatal("session not online")
	}
	c.Close()
	eventuallyOffline(t, g)
}

func TestSilentClientExpires(t *testing.T) {
	g, url := setup(t, 1)
	c := dial(t, url)
	welcome(t, c)
	for {
		if _, _, err := c.ReadMessage(); err != nil {
			break
		}
	}
	eventuallyOffline(t, g)
}

func TestRejectInvalidFrames(t *testing.T) {
	for _, tc := range []struct {
		name string
		kind int
		data []byte
	}{
		{"text", websocket.TextMessage, []byte("hello")},
		{"version", websocket.BinaryMessage, []byte{2, 1}},
		{"opcode", websocket.BinaryMessage, []byte{1, 9}},
		{"truncated", websocket.BinaryMessage, []byte{1}},
		{"oversize", websocket.BinaryMessage, make([]byte, 65)},
	} {
		t.Run(tc.name, func(t *testing.T) {
			g, url := setup(t, 1)
			c := dial(t, url)
			_ = c.WriteMessage(tc.kind, tc.data)
			_ = c.SetReadDeadline(time.Now().Add(time.Second))
			if _, _, err := c.ReadMessage(); err == nil {
				t.Fatal("invalid frame accepted")
			}
			eventuallyOffline(t, g)
		})
	}
}

func TestAdmissionAndShutdown(t *testing.T) {
	g, url := setup(t, 1)
	d := websocket.Dialer{Subprotocols: []string{Subprotocol}}
	_, response, err := d.Dial(url, http.Header{"Origin": []string{"https://untrusted.example"}})
	if err == nil || response.StatusCode != 403 {
		t.Fatal("untrusted origin accepted")
	}
	response.Body.Close()
	c := dial(t, url)
	welcome(t, c)
	_, response, err = d.Dial(url, nil)
	if err == nil || response.StatusCode != 503 {
		t.Fatal("capacity limit not enforced")
	}
	response.Body.Close()
	g.Close()
	for {
		if _, _, err := c.ReadMessage(); err != nil {
			break
		}
	}
	eventuallyOffline(t, g)
	_, response, err = d.Dial(url, nil)
	if err == nil || response.StatusCode != 503 {
		t.Fatal("admitted after shutdown")
	}
	response.Body.Close()
}

func TestSharedWireFixture(t *testing.T) {
	data, err := os.ReadFile("../../testdata/bootstrap.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture map[string][]byte
	if err := json.Unmarshal(data, &fixture); err != nil {
		t.Fatal(err)
	}
	w := fixture["welcome"]
	if len(w) != 26 || w[0] != 1 || w[1] != 2 || binary.BigEndian.Uint32(w[18:22]) != 25000 || binary.BigEndian.Uint32(w[22:26]) != 60000 {
		t.Fatal("invalid shared fixture")
	}
}
