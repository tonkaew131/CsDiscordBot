const { MessageEmbed } = require("discord.js");

module.exports = class Embed {
    constructor() {
        this.color = '#154997';
        this.profilePicture = '';
    }

    setColor(color) {
        this.color = color;
    }

    setProflePicture(url) {
        this.profilePicture = url;
    }

    helpEmbed() {
        let embed = new MessageEmbed();
        embed.setColor(this.color);

        embed.setTitle('**CsDiscordBot\'s Commands**');
        embed.setThumbnail(this.profilePicture);

        let micsCommands = '**• help**: Shows informations about bot\n';
        embed.addField('- Mics commands', micsCommands);
        return embed;
    }
};