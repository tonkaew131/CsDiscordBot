const { createLogger, format, transports } = require('winston');

const { Client, Intents } = require('discord.js');

module.exports = class DiscordClient {
    constructor() {
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });

        const logLevels = {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            debug: 4,
            trace: 5,
        };

        const logFormat = format.printf(({ level, message, label, timestamp }) => {
            return `[${label}] [${level}]: ${message}`;
        });

        this.logger = createLogger({
            levels: logLevels,
            transports: [new transports.Console()],
            format: format.combine(
                format.label({ label: 'DISCORD' }),
                logFormat,
            ),
        });
    }

    login(token) {
        this.#handleEvent();

        this.client.login(token);
    }

    #handleEvent() {
        this.client.on('ready', () => {
            this.logger.info(`Logged in as ${this.client.user.tag}!`);
        });

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'ping') {
                await interaction.reply('Pong!');
            }
        });
    }
}