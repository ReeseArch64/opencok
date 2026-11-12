package realm

import (
	"context"
	contracts "github.com/opencok/gameserver/internal/contracts/generated"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRejectInvalidRealmResponses(t *testing.T) {
	query := contracts.MapQuery{RequestId: 42, KingdomId: 1}
	for _, mode := range []string{"good", "wrong-request", "wrong-kingdom", "oversize", "unavailable", "truncated", "redirect"} {
		t.Run(mode, func(t *testing.T) {
			server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				if r.Method != "POST" || r.URL.Path != "/map/query" {
					t.Error("incorrect route")
				}
				region := contracts.MapRegion{RequestId: 42, KingdomId: 1, Columns: 1200, Rows: 1200}
				switch mode {
				case "wrong-request":
					region.RequestId++
				case "wrong-kingdom":
					region.KingdomId++
				case "oversize":
					_, _ = w.Write(make([]byte, contracts.MaxPacketBytes+1))
					return
				case "unavailable":
					w.WriteHeader(503)
					return
				case "truncated":
					_, _ = w.Write([]byte{1, 17})
					return
				case "redirect":
					w.Header().Set("Location", "/other")
					w.WriteHeader(302)
					return
				}
				body, _ := contracts.EncodeMapRegion(region)
				_, _ = w.Write(body)
			}))
			defer server.Close()
			_, err := New(server.URL).Query(context.Background(), query)
			if (err == nil) != (mode == "good") {
				t.Fatalf("mode %s: %v", mode, err)
			}
		})
	}
}
