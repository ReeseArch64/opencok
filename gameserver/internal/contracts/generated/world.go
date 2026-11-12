package contracts

import (
	"bytes"
	"encoding/binary"
	"errors"
	"io"
	"unicode/utf8"
)

const MaxPacketBytes = 65536

var ErrPacket = errors.New("invalid world packet")

type reader struct{ *bytes.Reader }

func (r reader) uint(max uint32) uint32 {
	var n uint32
	if binary.Read(r.Reader, binary.BigEndian, &n) != nil || n > max {
		panic(ErrPacket)
	}
	return n
}
func (r reader) str(max uint32) string {
	n := r.uint(max)
	b := make([]byte, n)
	if _, e := io.ReadFull(r.Reader, b); e != nil || !utf8.Valid(b) {
		panic(ErrPacket)
	}
	return string(b)
}
func put(w *bytes.Buffer, n uint32) { _ = binary.Write(w, binary.BigEndian, n) }

type MapQuery struct {
	RequestId uint32
	KingdomId uint32
	MinX      uint32
	MinY      uint32
	MaxX      uint32
	MaxY      uint32
}

func readMapQuery(r reader) MapQuery {
	var v MapQuery
	v.RequestId = r.uint(4294967295)
	v.KingdomId = r.uint(4294967295)
	v.MinX = r.uint(1200)
	v.MinY = r.uint(1200)
	v.MaxX = r.uint(1200)
	v.MaxY = r.uint(1200)
	return v
}
func (v MapQuery) write(w *bytes.Buffer) {
	if v.RequestId > 4294967295 {
		panic(ErrPacket)
	}
	put(w, v.RequestId)
	if v.KingdomId > 4294967295 {
		panic(ErrPacket)
	}
	put(w, v.KingdomId)
	if v.MinX > 1200 {
		panic(ErrPacket)
	}
	put(w, v.MinX)
	if v.MinY > 1200 {
		panic(ErrPacket)
	}
	put(w, v.MinY)
	if v.MaxX > 1200 {
		panic(ErrPacket)
	}
	put(w, v.MaxX)
	if v.MaxY > 1200 {
		panic(ErrPacket)
	}
	put(w, v.MaxY)
}
func DecodeMapQuery(b []byte) (v MapQuery, err error) {
	defer func() {
		if recover() != nil {
			err = ErrPacket
		}
	}()
	if len(b) < 2 || len(b) > MaxPacketBytes || b[0] != 1 || b[1] != 16 {
		return v, ErrPacket
	}
	r := reader{bytes.NewReader(b[2:])}
	v = readMapQuery(r)
	if r.Len() != 0 {
		return v, ErrPacket
	}
	return v, nil
}
func EncodeMapQuery(v MapQuery) (b []byte, err error) {
	defer func() {
		if recover() != nil {
			err = ErrPacket
		}
	}()
	w := new(bytes.Buffer)
	w.Write([]byte{1, 16})
	v.write(w)
	if w.Len() > MaxPacketBytes {
		return nil, ErrPacket
	}
	return w.Bytes(), nil
}

type MapRegion struct {
	RequestId uint32
	Status    uint32
	KingdomId uint32
	Name      string
	Columns   uint32
	Rows      uint32
	Objects   []MapRegionObjectsItem
	Blocked   []MapRegionBlockedItem
}

func readMapRegion(r reader) MapRegion {
	var v MapRegion
	v.RequestId = r.uint(4294967295)
	v.Status = r.uint(2)
	v.KingdomId = r.uint(4294967295)
	v.Name = r.str(64)
	v.Columns = r.uint(1200)
	v.Rows = r.uint(1200)
	v.Objects = make([]MapRegionObjectsItem, r.uint(256))
	for i := range v.Objects {
		v.Objects[i] = readMapRegionObjectsItem(r)
	}
	v.Blocked = make([]MapRegionBlockedItem, r.uint(4096))
	for i := range v.Blocked {
		v.Blocked[i] = readMapRegionBlockedItem(r)
	}
	return v
}
func (v MapRegion) write(w *bytes.Buffer) {
	if v.RequestId > 4294967295 {
		panic(ErrPacket)
	}
	put(w, v.RequestId)
	if v.Status > 2 {
		panic(ErrPacket)
	}
	put(w, v.Status)
	if v.KingdomId > 4294967295 {
		panic(ErrPacket)
	}
	put(w, v.KingdomId)
	if len(v.Name) > 64 || !utf8.ValidString(v.Name) {
		panic(ErrPacket)
	}
	put(w, uint32(len(v.Name)))
	w.WriteString(v.Name)
	if v.Columns > 1200 {
		panic(ErrPacket)
	}
	put(w, v.Columns)
	if v.Rows > 1200 {
		panic(ErrPacket)
	}
	put(w, v.Rows)
	if len(v.Objects) > 256 {
		panic(ErrPacket)
	}
	put(w, uint32(len(v.Objects)))
	for _, item := range v.Objects {
		item.write(w)
	}
	if len(v.Blocked) > 4096 {
		panic(ErrPacket)
	}
	put(w, uint32(len(v.Blocked)))
	for _, item := range v.Blocked {
		item.write(w)
	}
}
func DecodeMapRegion(b []byte) (v MapRegion, err error) {
	defer func() {
		if recover() != nil {
			err = ErrPacket
		}
	}()
	if len(b) < 2 || len(b) > MaxPacketBytes || b[0] != 1 || b[1] != 17 {
		return v, ErrPacket
	}
	r := reader{bytes.NewReader(b[2:])}
	v = readMapRegion(r)
	if r.Len() != 0 {
		return v, ErrPacket
	}
	return v, nil
}
func EncodeMapRegion(v MapRegion) (b []byte, err error) {
	defer func() {
		if recover() != nil {
			err = ErrPacket
		}
	}()
	w := new(bytes.Buffer)
	w.Write([]byte{1, 17})
	v.write(w)
	if w.Len() > MaxPacketBytes {
		return nil, ErrPacket
	}
	return w.Bytes(), nil
}

type MapRegionObjectsItem struct {
	Id     uint32
	Kind   uint32
	X      uint32
	Y      uint32
	Width  uint32
	Height uint32
	Level  uint32
}

func readMapRegionObjectsItem(r reader) MapRegionObjectsItem {
	var v MapRegionObjectsItem
	v.Id = r.uint(4294967295)
	v.Kind = r.uint(4)
	v.X = r.uint(1200)
	v.Y = r.uint(1200)
	v.Width = r.uint(16)
	v.Height = r.uint(16)
	v.Level = r.uint(100)
	return v
}
func (v MapRegionObjectsItem) write(w *bytes.Buffer) {
	if v.Id > 4294967295 {
		panic(ErrPacket)
	}
	put(w, v.Id)
	if v.Kind > 4 {
		panic(ErrPacket)
	}
	put(w, v.Kind)
	if v.X > 1200 {
		panic(ErrPacket)
	}
	put(w, v.X)
	if v.Y > 1200 {
		panic(ErrPacket)
	}
	put(w, v.Y)
	if v.Width > 16 {
		panic(ErrPacket)
	}
	put(w, v.Width)
	if v.Height > 16 {
		panic(ErrPacket)
	}
	put(w, v.Height)
	if v.Level > 100 {
		panic(ErrPacket)
	}
	put(w, v.Level)
}

type MapRegionBlockedItem struct {
	X uint32
	Y uint32
}

func readMapRegionBlockedItem(r reader) MapRegionBlockedItem {
	var v MapRegionBlockedItem
	v.X = r.uint(1200)
	v.Y = r.uint(1200)
	return v
}
func (v MapRegionBlockedItem) write(w *bytes.Buffer) {
	if v.X > 1200 {
		panic(ErrPacket)
	}
	put(w, v.X)
	if v.Y > 1200 {
		panic(ErrPacket)
	}
	put(w, v.Y)
}
