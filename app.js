const DiscordClient = require('./src/bot');

require('dotenv').config();

const discordClient = new DiscordClient();

discordClient.login(process.env.DISCORD_TOKEN);