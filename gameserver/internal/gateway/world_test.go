package gateway

import (
	"context"
	"github.com/gorilla/websocket"
	contracts "github.com/opencok/gameserver/internal/contracts/generated"
	"testing"
	"time"
)

type testWorld struct{}

func (testWorld) Query(_ context.Context, q contracts.MapQuery) (contracts.MapRegion, error) {
	return contracts.MapRegion{RequestId: q.RequestId, KingdomId: q.KingdomId, Columns: 1200, Rows: 1200, Objects: []contracts.MapRegionObjectsItem{{Id: 1, Kind: 1, X: 570, Y: 570, Width: 2, Height: 2, Level: 1}}}, nil
}
func TestWorldQueriesShareHeartbeatWriter(t *testing.T) {
	g, url := setup(t, 1)
	g.cfg.World = testWorld{}
	c := dial(t, url)
	welcome(t, c)
	for i := uint32(0); i < 6; i++ {
		data, _ := contracts.EncodeMapQuery(contracts.MapQuery{RequestId: i, KingdomId: 1, MinX: 568, MinY: 568, MaxX: 575, MaxY: 575})
		if err := c.WriteMessage(websocket.BinaryMessage, data); err != nil {
			t.Fatal(err)
		}
		for {
			_, reply, err := c.ReadMessage()
			if err != nil {
				t.Fatal(err)
			}
			if reply[1] == 3 {
				if err = c.WriteMessage(websocket.BinaryMessage, []byte{1, 4}); err != nil {
					t.Fatal(err)
				}
				continue
			}
			region, err := contracts.DecodeMapRegion(reply)
			if err != nil || region.RequestId != i || len(region.Objects) != 1 {
				t.Fatalf("region: %+v %v", region, err)
			}
			break
		}
		time.Sleep(25 * time.Millisecond)
	}
}
func TestWorldUnavailableDoesNotDisconnect(t *testing.T) {
	_, url := setup(t, 1)
	c := dial(t, url)
	welcome(t, c)
	data, _ := contracts.EncodeMapQuery(contracts.MapQuery{RequestId: 42, KingdomId: 1, MinX: 1, MinY: 1, MaxX: 1, MaxY: 1})
	_ = c.WriteMessage(websocket.BinaryMessage, data)
	for {
		_, reply, err := c.ReadMessage()
		if err != nil {
			t.Fatal(err)
		}
		if reply[1] == 3 {
			_ = c.WriteMessage(websocket.BinaryMessage, []byte{1, 4})
			continue
		}
		region, err := contracts.DecodeMapRegion(reply)
		if err != nil || region.Status != 2 || region.RequestId != 42 {
			t.Fatalf("unavailable: %+v %v", region, err)
		}
		break
	}
}
