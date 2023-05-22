package discord

import (
	"github.com/bwmarrin/discordgo"
)

func initial(discordToken string) {
	botClient, err := discordgo.New("Bearer " + discordToken)

}
