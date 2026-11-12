FROM golang:1.27.1-alpine AS development

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY ./ ./

EXPOSE 9933

CMD ["go", "run", "./cmd/gameserver", "-addr", "0.0.0.0:9933"]

FROM development AS build

RUN CGO_ENABLED=0 go build -trimpath -o /out/gameserver ./cmd/gameserver

FROM scratch AS runtime

COPY --from=build /out/gameserver /gameserver

USER 65532:65532

EXPOSE 9933

ENTRYPOINT ["/gameserver"]

CMD ["-addr", "0.0.0.0:9933"]
