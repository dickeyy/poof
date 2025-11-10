# poof

Share one-time information securely. Create a short-lived text file, send a link, and it disappears forever after someone views it. 100% free, open-source, and self-hostable.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Features

- **One-time view**: Content is automatically deleted after being viewed once
- **End-to-end encryption**: All entries are encrypted with AES-256-GCM before storage
- **Optional TTL**: Set a time-to-live for automatic expiration
- **Anonymous**: No account required, no tracking, no ads
- **Self-hostable**: Deploy your own instance with Docker in minutes
- **Modern UI**: Clean, minimal interface built with Next.js and Tailwind CSS
- **High performance**: Redis-based storage with sub-millisecond read/write times
- **Structured logging**: Production-ready logging with zerolog

## Tech Stack

### API

- Go (1.25.4)
- Fiber (web framework)
- Redis (data storage)
- Zerolog (structured logging)

### Web

- Next.js 16
- React 19
- Tailwind CSS
- Shadcn UI
- Zod (validation)

## Quick Start (Self-Hosting)

The easiest way to self-host poof is using Docker Compose. This will set up both the API and Redis in minutes.

### Prerequisites

- Docker
- Docker Compose
- Bun (for web app) or Node.js

### 1. Clone the repository

```bash
git clone https://github.com/dickeyy/poof.git
cd poof
```

### 2. Set up the API

```bash
cd apps/api
```

Create a `.env` file:

```bash
ENCRYPTION_KEY=your_64_character_hex_encryption_key_here
```

Generate a secure encryption key:

```bash
openssl rand -hex 32
```

Start the API and Redis:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:8080`.

To view logs:

```bash
docker-compose logs -f api
```

To stop the services:

```bash
docker-compose down
```

### 3. Set up the Web App

```bash
cd ../web
```

Install dependencies:

```bash
bun install
# or
npm install
```

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Build and start the web app:

```bash
bun run build
bun run start
# or
npm run build
npm run start
```

The web app will be available at `http://localhost:3000`.

## Development

### API Development

```bash
cd apps/api
```

Make sure Redis is running locally or via Docker:

```bash
docker run -d -p 6379:6379 redis:7-alpine
```

Create a `.env` file with your configuration:

```bash
APP_NAME=poof-api
PORT=8080
ENVIRONMENT=development
LOG_LEVEL=debug
REDIS_URL=redis://localhost:6379
ENCRYPTION_KEY=your_encryption_key_here
```

Install dependencies:

```bash
go mod download
```

Run the API:

```bash
go run main.go
# or
make run
```

Build the API:

```bash
make build
```

Run tests:

```bash
make test
```

### Web Development

```bash
cd apps/web
```

Install dependencies:

```bash
bun install
```

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Start the development server:

```bash
bun run dev
```

The web app will be available at `http://localhost:3000`.

Build for production:

```bash
bun run build
```

## Configuration

### API Environment Variables

| Variable         | Description                                          | Default                  |
| ---------------- | ---------------------------------------------------- | ------------------------ |
| `APP_NAME`       | Application name                                     | `poof-api`               |
| `PORT`           | Server port                                          | `8080`                   |
| `ENVIRONMENT`    | Environment (development/production)                 | `development`            |
| `READ_TIMEOUT`   | Read timeout in seconds                              | `10`                     |
| `WRITE_TIMEOUT`  | Write timeout in seconds                             | `10`                     |
| `IDLE_TIMEOUT`   | Idle timeout in seconds                              | `120`                    |
| `LOG_LEVEL`      | Log level (debug/info/warn/error/fatal/panic)        | `info`                   |
| `REDIS_URL`      | Redis connection URL                                 | `redis://localhost:6379` |
| `ENCRYPTION_KEY` | **Required** - AES-256 encryption key (64 hex chars) | -                        |

### Web Environment Variables

| Variable              | Description  | Default |
| --------------------- | ------------ | ------- |
| `NEXT_PUBLIC_API_URL` | API base URL | -       |

## API Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

**Response:**

```json
{
  "status": "ok",
  "service": "poof-api"
}
```

### Create Entry

```
POST /text
```

Create a new encrypted text entry.

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

### Retrieve Entry

```
GET /text/:id
```

Retrieve and delete a text entry (one-time view).

**Response:**

```json
{
  "id": "AbCdEfGhIjKl",
  "value": "Your secret message here"
}
```

**Note:** After retrieval, the entry is immediately deleted from storage and cannot be accessed again.

## Using the API

You can create and retrieve poofs programmatically using the API. This is useful for integrating poof into scripts, CI/CD pipelines, or other applications.

### Creating a Poof with cURL

```bash
# Create a poof
curl -X POST http://localhost:8080/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Your secret message here"}'

# Response: {"id":"AbCdEfGhIjKl"}

# Retrieve the poof
curl http://localhost:8080/text/AbCdEfGhIjKl

# Response: {"id":"AbCdEfGhIjKl","value":"Your secret message here"}
```

### Creating a Poof with a TTL

```bash
# Create a poof that expires in 1 hour (3600 seconds)
curl -X POST http://localhost:8080/text \
  -H "Content-Type: application/json" \
  -d '{"text": "This will expire in 1 hour", "ttl": 3600}'
```

## Deployment

### Deploying the API

#### Docker (Recommended)

The API includes a multi-stage Dockerfile for optimized production builds.

```bash
cd apps/api

# Build the image
docker build -t poof-api .

# Run the container
docker run -d \
  -p 8080:8080 \
  -e ENCRYPTION_KEY=your_key_here \
  -e REDIS_URL=redis://your-redis:6379 \
  --name poof-api \
  poof-api
```

#### Using Docker Compose (with Redis)

```bash
cd apps/api
docker-compose up -d
```

This will start both Redis and the API with proper networking.

#### Manual Deployment

```bash
cd apps/api

# Build the binary
CGO_ENABLED=0 go build -o poof-api main.go

# Run the binary
ENCRYPTION_KEY=your_key ./poof-api
```

### Deploying the Web App

#### Vercel (Recommended)

The easiest way to deploy the web app is with [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Set the root directory to `apps/web`
4. Add the environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy

#### Docker

Create a `Dockerfile` in `apps/web`:

```dockerfile
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["bun", "server.js"]
```

#### Static Hosting

```bash
cd apps/web
bun run build
```

Deploy the `.next` directory to any static hosting provider (Netlify, Cloudflare Pages, etc.).

## Project Structure

```
poof/
├── apps/
│   ├── api/                    # Go API
│   │   ├── internal/
│   │   │   ├── config/        # Configuration management
│   │   │   ├── crypto/        # AES-256 encryption/decryption
│   │   │   ├── handlers/      # HTTP handlers
│   │   │   ├── logger/        # Zerolog setup
│   │   │   ├── middleware/    # CORS, request ID, recovery
│   │   │   ├── redis/         # Redis client wrapper
│   │   │   └── router/        # Route definitions
│   │   ├── main.go
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── web/                   # Next.js web app
│       ├── app/               # App router pages
│       ├── components/        # React components
│       └── lib/               # Utility functions
├── LICENSE
└── README.md
```

## Security

- All text entries are encrypted using **AES-256-GCM** before being stored in Redis
- Encryption key must be provided via the `ENCRYPTION_KEY` environment variable
- Entries are automatically deleted after the first retrieval
- Optional TTL ensures entries expire even if never viewed
- No user data or tracking information is stored
- CORS is configured to allow cross-origin requests from web clients

## Planned Features

- [ ] Password protection for entries
- [ ] Custom expiration times from the UI
- [ ] File upload support
- [ ] Syntax highlighting for code snippets
- [ ] API rate limiting
- [ ] Analytics dashboard (self-hosted)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Built with [Go](https://golang.org/) and [Fiber](https://gofiber.io/)
- UI powered by [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Shadcn UI](https://ui.shadcn.com/)
- Inspired by services like Pastebin and PrivateBin

## Support

If you find this project useful, please consider [sponsoring me](https://github.com/sponsors/dickeyy).
