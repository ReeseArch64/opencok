// Package realm provides bounded read-only routing to a development Realm.
package realm

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	contracts "github.com/opencok/gameserver/internal/contracts/generated"
)

type Client struct {
	endpoint string
	http     *http.Client
}

func New(endpoint string) *Client {
	return &Client{strings.TrimRight(endpoint, "/") + "/map/query", &http.Client{Timeout: 3 * time.Second, CheckRedirect: func(_ *http.Request, _ []*http.Request) error { return http.ErrUseLastResponse }}}
}
func (c *Client) Query(ctx context.Context, query contracts.MapQuery) (contracts.MapRegion, error) {
	var empty contracts.MapRegion
	body, err := contracts.EncodeMapQuery(query)
	if err != nil {
		return empty, err
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, c.endpoint, bytes.NewReader(body))
	if err != nil {
		return empty, err
	}
	request.Header.Set("Content-Type", "application/octet-stream")
	response, err := c.http.Do(request)
	if err != nil {
		return empty, err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return empty, fmt.Errorf("realm status: %d", response.StatusCode)
	}
	data, err := io.ReadAll(io.LimitReader(response.Body, contracts.MaxPacketBytes+1))
	if err != nil {
		return empty, err
	}
	region, err := contracts.DecodeMapRegion(data)
	if err != nil {
		return empty, err
	}
	if region.RequestId != query.RequestId || region.KingdomId != query.KingdomId {
		return empty, fmt.Errorf("realm response scope mismatch")
	}
	return region, nil
}
