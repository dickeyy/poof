package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	AppName       string
	Port          string
	Environment   string
	ReadTimeout   int
	WriteTimeout  int
	IdleTimeout   int
	LogLevel      string
	RedisURL      string
	EncryptionKey string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	return &Config{
		AppName:       getEnv("APP_NAME", "poof-api"),
		Port:          getEnv("PORT", "8080"),
		Environment:   getEnv("ENVIRONMENT", "development"),
		ReadTimeout:   getEnvAsInt("READ_TIMEOUT", 10),
		WriteTimeout:  getEnvAsInt("WRITE_TIMEOUT", 10),
		IdleTimeout:   getEnvAsInt("IDLE_TIMEOUT", 120),
		LogLevel:      getEnv("LOG_LEVEL", "info"),
		RedisURL:      getEnv("REDIS_URL", "redis://localhost:6379"),
		EncryptionKey: getEnv("ENCRYPTION_KEY", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
