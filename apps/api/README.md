# Poof API

A Go Fiber API starter with zerolog logging.

## Features

- Go Fiber web framework
- Structured logging with zerolog
- Configuration management via environment variables
- Request ID middleware
- CORS middleware
- Recovery middleware
- Graceful shutdown
- Health check endpoint

## Project Structure

```
apps/api/
├── main.go                 # Application entry point
├── internal/
│   ├── config/            # Configuration management
│   ├── handlers/          # HTTP handlers
│   ├── logger/            # Logger setup
│   ├── middleware/        # HTTP middleware
│   └── router/            # Route setup
└── go.mod                 # Go dependencies
```

## Getting Started

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
go mod download
```

3. Run the application:
```bash
go run main.go
```

The API will start on port 3000 (or the port specified in your `.env` file).

## Configuration

The application can be configured using environment variables:

- `APP_NAME` - Application name (default: poof-api)
- `PORT` - Server port (default: 3000)
- `ENVIRONMENT` - Environment (development/production)
- `READ_TIMEOUT` - Read timeout in seconds (default: 10)
- `WRITE_TIMEOUT` - Write timeout in seconds (default: 10)
- `IDLE_TIMEOUT` - Idle timeout in seconds (default: 120)
- `LOG_LEVEL` - Log level (debug/info/warn/error/fatal/panic, default: info)

## API Endpoints

### Health Check
- `GET /api/v1/health` - Returns service health status

## Adding New Routes

To add new routes, edit `internal/router/router.go`:

```go
api := app.Group("/api/v1")
api.Get("/your-route", yourHandler.Handle)
```

## Adding New Handlers

Create handlers in `internal/handlers/`:

```go
package handlers

type YourHandler struct {
    log zerolog.Logger
}

func NewYourHandler(log zerolog.Logger) *YourHandler {
    return &YourHandler{log: log}
}

func (h *YourHandler) Handle(c *fiber.Ctx) error {
    // Your handler logic
    return c.JSON(fiber.Map{"message": "success"})
}
```

## Logging

The application uses zerolog for structured logging. Logs are automatically formatted based on the environment:
- Development: Colorized console output
- Production: JSON output

Logs include request ID, method, path, status code, duration, and IP address for HTTP requests.

