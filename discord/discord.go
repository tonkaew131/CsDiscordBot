package discord

import (
	"fmt"
	"os"
	"os/signal"

	"github.com/bwmarrin/discordgo"
)

func Initial(discordToken string) {
	client, err := discordgo.New("Bot " + discordToken)

	client.AddHandler(messageCreate)

	err = client.Open()
	if err != nil {
		fmt.Println("error opening connection,", err)
		return
	}

	defer client.Close()

	fmt.Println("[Bot]: Bot running...")
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c
}

func messageCreate() {

}
