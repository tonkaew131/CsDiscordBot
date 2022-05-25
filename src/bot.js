const { createLogger, format, transports } = require('winston');
const { Client, Intents } = require('discord.js');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = require('./commands');

const Embed = require('./embed');
const embed = new Embed();

module.exports = class DiscordClient {
    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
            ],
            partials: [
                'CHANNEL' // Needed for DM message caching
            ],
        });

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

        this.devMode = (process.env.DEV_MODE == 'true' ? true : false);
        this.devGuildID = process.env.DEV_GUILD_ID;
    }

    login(token) {
        this.client.login(token);
        this.client.on('ready', () => {
            this.logger.info(`Logged in as ${this.client.user.tag}!`);

            embed.setProflePicture(this.client.user.avatarURL());
            this.#registerCommand(token);
        });

        this.#handleEvent();
    }

    #registerCommand(token) {
        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                this.logger.info(`Started refreshing application (/) commands.${this.devMode ? ' (dev)' : ''}`);

                await rest.put(
                    this.devMode ?
                        Routes.applicationGuildCommands(this.client.user.id, this.devGuildID) :
                        Routes.applicationCommands(this.client.user.id),
                    { body: commands },
                );

                this.logger.info(`Successfully reloaded application (/) commands.${this.devMode ? ' (dev)' : ''}`);
            } catch (error) {
                this.logger.error(error);
            }
        })();
    }

    #handleEvent() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'help') {
                await interaction.reply({ embeds: [embed.helpEmbed()] });
            }
        });

        this.client.on('messageCreate', async message => {
            if (message.author.bot) return;

            if (message.content === '!help') {
                message.reply({ embeds: [embed.helpEmbed()] });
            }
        });
    }
}