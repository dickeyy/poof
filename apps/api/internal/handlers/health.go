package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
)

type HealthHandler struct {
	log zerolog.Logger
}

func NewHealthHandler(log zerolog.Logger) *HealthHandler {
	return &HealthHandler{
		log: log,
	}
}

func (h *HealthHandler) Health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "ok",
		"service": "poof-api",
	})
}

