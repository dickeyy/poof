package router

import (
	"github.com/dickeyy/poof/internal/config"
	"github.com/dickeyy/poof/internal/handlers"
	"github.com/dickeyy/poof/internal/middleware"
	"github.com/dickeyy/poof/internal/redis"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
)

func Setup(app *fiber.App, cfg *config.Config, log zerolog.Logger, redisClient *redis.Client) {
	middleware.Setup(app, cfg, log)

	api := app.Group("/")

	healthHandler := handlers.NewHealthHandler(log)
	api.Get("/health", healthHandler.Health)

	textHandler := handlers.NewTextHandler(redisClient, log, cfg)
	api.Get("/text/:id", textHandler.GetText)
	api.Post("/text", textHandler.CreateText)

	log.Info().Msg("Routes configured")
}
