package handlers

import (
	"time"

	"github.com/dickeyy/poof/internal/config"
	"github.com/dickeyy/poof/internal/crypto"
	"github.com/dickeyy/poof/internal/redis"
	"github.com/gofiber/fiber/v2"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/rs/zerolog"
)

type TextHandler struct {
	redis *redis.Client
	log   zerolog.Logger
	cfg   *config.Config
}

type CreateEntryRequest struct {
	Text string `json:"text"`
	TTL  *int64 `json:"ttl,omitempty"`
}

type CreateEntryResponse struct {
	ID string `json:"id"`
}

func NewTextHandler(redisClient *redis.Client, log zerolog.Logger, cfg *config.Config) *TextHandler {
	return &TextHandler{
		redis: redisClient,
		log:   log,
		cfg:   cfg,
	}
}

func (h *TextHandler) GetText(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "id is required",
		})
	}

	ctx := c.UserContext()
	// get the entry
	value, err := h.redis.Get(ctx, id)
	if err != nil {
		h.log.Error().Err(err).Str("id", id).Msg("Failed to get entry from Redis")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to retrieve entry",
		})
	}

	if value == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "entry not found",
		})
	}

	// decrypt the text
	decryptedText, err := crypto.Decrypt(value, h.cfg.EncryptionKey)
	if err != nil {
		h.log.Error().Err(err).Msg("Failed to decrypt text")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to decrypt text",
		})
	}

	// delete the entry from redis
	if err := h.redis.Del(ctx, id); err != nil {
		h.log.Error().Err(err).Str("id", id).Msg("Failed to delete entry from Redis")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to delete entry",
		})
	}

	_, _ = h.redis.Incr(ctx, "stats:total_viewed")

	// return the id and decrypted text
	return c.JSON(fiber.Map{
		"id":    id,
		"value": decryptedText,
	})
}

func (h *TextHandler) CreateText(c *fiber.Ctx) error {
	// validate request
	var req CreateEntryRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	if req.Text == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "text is required",
		})
	}

	// generate id
	const urlSafeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	id, err := gonanoid.Generate(urlSafeAlphabet, 12)
	if err != nil {
		h.log.Error().Err(err).Msg("Failed to generate nanoid")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to generate id",
		})
	}

	// encrypt the text
	encryptedText, err := crypto.Encrypt(req.Text, h.cfg.EncryptionKey)
	if err != nil {
		h.log.Error().Err(err).Msg("Failed to encrypt text")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to encrypt text",
		})
	}

	// create the entry in redis with optional ttl
	err = nil
	ctx := c.UserContext()

	if req.TTL != nil {
		println("setting ttl", *req.TTL)
		err = h.redis.Set(ctx, id, encryptedText, time.Duration(*req.TTL)*time.Second)
	} else {
		err = h.redis.Set(ctx, id, encryptedText, 0)
	}

	if err != nil {
		h.log.Error().Err(err).Str("id", id).Msg("Failed to save entry to Redis")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to save entry",
		})
	}

	_, _ = h.redis.Incr(ctx, "stats:total_created")

	h.log.Info().Str("id", id).Msg("Created entry")

	// return just the entry id (used in client to create the full url)
	return c.Status(fiber.StatusCreated).JSON(CreateEntryResponse{
		ID: id,
	})
}
