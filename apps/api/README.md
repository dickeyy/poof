# Poof API

The backend API for [poof.sh](https://poof.sh) - a service for creating short-lived text entries that can only be viewed once. Built with Go and Fiber, this API handles the creation and retrieval of encrypted, self-destructing text snippets.

## Features

- Create encrypted text entries with unique IDs
- One-time retrieval (entries are deleted after viewing)
- Optional TTL (time-to-live) for automatic expiration
- AES-256 encryption for stored data
- Redis-based storage for high performance
- Structured logging with zerolog
- CORS support for web clients
- Request ID tracking
- Graceful shutdown
- Health check endpoint

## Project Structure

```
apps/api/
├── main.go                 # Application entry point
├── internal/
│   ├── config/            # Configuration management
│   ├── crypto/            # AES-256 encryption/decryption
│   ├── handlers/          # HTTP handlers (health, text)
│   ├── logger/            # Zerolog setup
│   ├── middleware/        # CORS, request ID, recovery
│   ├── redis/             # Redis client wrapper
│   └── router/            # Route definitions
├── Dockerfile             # Docker build configuration
├── docker-compose.yml     # Docker orchestration
└── go.mod                 # Go dependencies
```

## Getting Started

### Running with Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed

2. Create a `.env` file in the `apps/api` directory with your configuration:

```bash
ENCRYPTION_KEY=your_encryption_key_here
```

You can generate an encryption key with:

```bash
openssl rand -hex 32
```

3. Start the services:

```bash
docker-compose up -d
```

This will:

- Start a Redis instance (private, not exposed to the host)
- Build and start the API on port 8080
- Automatically configure the API to connect to Redis

4. View logs:

```bash
docker-compose logs -f api
```

5. Stop the services:

```bash
docker-compose down
```

### Custom Port Configuration

If port 8080 is already in use on your host machine, you can configure custom ports:

```bash
# Set custom host port (maps host port 3000 to container port 8080)
HOST_PORT=3000 docker-compose up -d

# Or set both host and container ports
HOST_PORT=3000 PORT=3000 docker-compose up -d
```

You can also create a `.env` file with these values:

```bash
HOST_PORT=3000
PORT=8080
ENCRYPTION_KEY=your_encryption_key_here
```

### Running Locally

1. Make sure Redis is running locally

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Install dependencies:

```bash
go mod download
```

4. Run the application:

```bash
go run main.go
```

The API will start on port 8080 (or the port specified in your `.env` file).

## Configuration

The application can be configured using environment variables:

- `APP_NAME` - Application name (default: poof-api)
- `PORT` - Server port inside the container (default: 8080)
- `HOST_PORT` - Host machine port for docker-compose (default: 8080)
- `ENVIRONMENT` - Environment (development/production)
- `READ_TIMEOUT` - Read timeout in seconds (default: 10)
- `WRITE_TIMEOUT` - Write timeout in seconds (default: 10)
- `IDLE_TIMEOUT` - Idle timeout in seconds (default: 120)
- `LOG_LEVEL` - Log level (debug/info/warn/error/fatal/panic, default: info)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)
- `ENCRYPTION_KEY` - Required encryption key for data encryption

## API Endpoints

### Health Check

- `GET /health` - Returns service health status

**Response:**

```json
{
  "status": "ok",
  "service": "poof-api"
}
```

### Text Entries

#### Create Entry

- `POST /text` - Create a new encrypted text entry

**Request Body:**

```json
{
  "text": "Your secret message here",
  "ttl": 3600 // Optional: Time-to-live in seconds
}
```

**Response:**

```json
{
  "id": "AbCdEfGhIjKl"
}
```

#### Retrieve Entry

- `GET /text/:id` - Retrieve and delete a text entry (one-time view)

**Response:**

```json
{
  "id": "AbCdEfGhIjKl",
  "value": "Your secret message here"
}
```

**Note:** After retrieval, the entry is immediately deleted from storage and cannot be accessed again.

## Security

- All text entries are encrypted using AES-256-GCM before being stored in Redis
- The encryption key must be provided via the `ENCRYPTION_KEY` environment variable
- Entries are automatically deleted after the first retrieval
- Optional TTL ensures entries expire even if never viewed
- CORS is configured to allow cross-origin requests from web clients

## Logging

The API uses zerolog for structured logging with automatic formatting:

- **Development:** Colorized console output with human-readable timestamps
- **Production:** JSON output optimized for log aggregation

Each request includes: request ID, method, path, status code, duration, and IP address.
