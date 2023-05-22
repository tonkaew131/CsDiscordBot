package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/tonkaew131/CsDiscordBot/discord"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	discordToken := os.Getenv("DISCORD_TOKEN")

	discord.Initial(discordToken)
}
