.PHONY: run build test clean deps

run:
	go run main.go

build:
	go build -o build/poof-api main.go

test:
	go test ./...

clean:
	rm -rf bin/

deps:
	go mod download
	go mod tidy

