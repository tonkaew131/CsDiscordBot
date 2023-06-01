import DiscordClient from './src/bot.js';

import 'dotenv/config';

const discordClient = new DiscordClient();

discordClient.login(process.env.DISCORD_TOKEN);