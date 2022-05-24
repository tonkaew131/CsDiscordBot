const { createLogger, format, transports } = require('winston');
const { Client, Intents } = require('discord.js');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./commands');

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
        this.client.login(token);
        this.client.on('ready', () => {
            this.logger.info(`Logged in as ${this.client.user.tag}!`);

            this.#registerCommand(token);
        });

        this.#handleEvent();
    }

    #registerCommand(token) {
        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                this.logger.info('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(this.client.user.id),
                    { body: commands },
                );

                this.logger.info('Successfully reloaded application (/) commands.');
            } catch (error) {
                this.logger.error(error);
            }
        })();
    }

    #handleEvent() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'ping') {
                await interaction.reply('Pong!');
            }
        });
    }
}