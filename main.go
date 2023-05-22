package main

import (
	"github.com/joho/godotenv"
	"log"
	"os"

	"github.com/tonkaew131/CsDiscordBot/discord"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	discordToken := os.Getenv("DISCORD_TOKEN")

	discord.initial(discordToken)
}
