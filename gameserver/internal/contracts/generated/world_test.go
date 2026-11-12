package contracts

import (
	"bytes"
	"encoding/json"
	"os"
	"testing"
)

func TestSharedWorldFixtures(t *testing.T) {
	data, err := os.ReadFile("../../../testdata/world.json")
	if err != nil {
		t.Fatal(err)
	}
	var fixture map[string][]byte
	if err = json.Unmarshal(data, &fixture); err != nil {
		t.Fatal(err)
	}
	q, err := DecodeMapQuery(fixture["query"])
	if err != nil || q.RequestId != 42 || q.MinX != 568 {
		t.Fatalf("query: %+v %v", q, err)
	}
	encoded, err := EncodeMapQuery(q)
	if err != nil || !bytes.Equal(encoded, fixture["query"]) {
		t.Fatal("query parity")
	}
	r, err := DecodeMapRegion(fixture["region"])
	if err != nil || len(r.Objects) != 1 || r.Objects[0].X != 570 {
		t.Fatalf("region: %+v %v", r, err)
	}
	encoded, err = EncodeMapRegion(r)
	if err != nil || !bytes.Equal(encoded, fixture["region"]) {
		t.Fatal("region parity")
	}
	for i := 0; i < len(encoded); i++ {
		if _, err = DecodeMapRegion(encoded[:i]); err == nil {
			t.Fatalf("accepted truncation %d", i)
		}
	}
	for _, offset := range []int{0, 1, 31} {
		invalid := bytes.Clone(encoded)
		invalid[offset] = 255
		if _, err = DecodeMapRegion(invalid); err == nil {
			t.Fatalf("accepted malformed offset %d", offset)
		}
	}
	if _, err = DecodeMapRegion(append(encoded, 0)); err == nil {
		t.Fatal("accepted trailing byte")
	}
}
