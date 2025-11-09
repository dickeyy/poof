package logger

import (
	"os"
	"time"

	"github.com/dickeyy/poof/internal/config"
	"github.com/rs/zerolog"
)

func New(cfg *config.Config) zerolog.Logger {
	zerolog.TimeFieldFormat = time.RFC3339
	zerolog.SetGlobalLevel(parseLogLevel(cfg.LogLevel))

	var output zerolog.ConsoleWriter
	if cfg.Environment == "development" {
		output = zerolog.ConsoleWriter{
			Out:        os.Stderr,
			TimeFormat: time.RFC3339,
			NoColor:    false,
		}
	} else {
		output = zerolog.ConsoleWriter{
			Out:        os.Stdout,
			TimeFormat: time.RFC3339,
			NoColor:    true,
		}
	}

	logger := zerolog.New(output).With().
		Timestamp().
		Str("service", cfg.AppName).
		Str("environment", cfg.Environment).
		Logger()

	return logger
}

func parseLogLevel(level string) zerolog.Level {
	switch level {
	case "debug":
		return zerolog.DebugLevel
	case "info":
		return zerolog.InfoLevel
	case "warn":
		return zerolog.WarnLevel
	case "error":
		return zerolog.ErrorLevel
	case "fatal":
		return zerolog.FatalLevel
	case "panic":
		return zerolog.PanicLevel
	default:
		return zerolog.InfoLevel
	}
}

