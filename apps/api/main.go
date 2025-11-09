package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dickeyy/poof/internal/config"
	"github.com/dickeyy/poof/internal/logger"
	"github.com/dickeyy/poof/internal/redis"
	"github.com/dickeyy/poof/internal/router"
	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()
	log := logger.New(cfg)

	redisClient, err := redis.New(cfg, log)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect to Redis")
	}
	defer redisClient.Close()

	app := fiber.New(fiber.Config{
		AppName:      cfg.AppName,
		ServerHeader: "Fiber",
		ReadTimeout:  time.Second * time.Duration(cfg.ReadTimeout),
		WriteTimeout: time.Second * time.Duration(cfg.WriteTimeout),
		IdleTimeout:  time.Second * time.Duration(cfg.IdleTimeout),
	})

	router.Setup(app, cfg, log, redisClient)

	go func() {
		addr := ":" + cfg.Port
		log.Info().Str("address", addr).Msg("Starting server")
		if err := app.Listen(addr); err != nil {
			log.Fatal().Err(err).Msg("Failed to start server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	log.Info().Msg("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.ShutdownWithContext(ctx); err != nil {
		log.Error().Err(err).Msg("Server forced to shutdown")
	}

	log.Info().Msg("Server exited")
}
