package redis

import (
	"context"
	"time"

	"github.com/dickeyy/poof/internal/config"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
)

type Client struct {
	client *redis.Client
	log    zerolog.Logger
}

func New(cfg *config.Config, log zerolog.Logger) (*Client, error) {
	opt, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		return nil, err
	}

	client := redis.NewClient(opt)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}

	log.Info().Msg("Connected to Redis")

	return &Client{
		client: client,
		log:    log,
	}, nil
}

func (c *Client) Get(ctx context.Context, key string) (string, error) {
	val, err := c.client.Get(ctx, key).Result()
	if err == redis.Nil {
		return "", nil
	}
	return val, err
}

func (c *Client) Set(ctx context.Context, key string, value string, ttl time.Duration) error {
	return c.client.Set(ctx, key, value, ttl).Err()
}

func (c *Client) Del(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}

func (c *Client) Close() error {
	return c.client.Close()
}

func (c *Client) Incr(ctx context.Context, key string) (int64, error) {
	return c.client.Incr(ctx, key).Result()
}
