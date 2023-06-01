import { createLogger, format, transports } from 'winston';
import { Client, Intents } from 'discord.js';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import commands from './commands.data.js';

import Embed from './embed.js';
const embed = new Embed();

export default class DiscordClient {
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
        this.prefix = process.env.BOT_PREFIX;
    }

    login(token) {
        this.client.login(token);
        this.client.on('ready', () => {
            this.logger.info(`Logged in as ${this.client.user.tag}!`);

            embed.setProflePicture(this.client.user.displayAvatarURL());
            embed.setUsername(this.client.user.username);
            embed.setID(this.client.user.id);
            embed.setPrefix(this.prefix);
            this.#registerCommand(token);

            this.client.user.setActivity('💀 cs!help', { type: 'LISTENING' });
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
                return await interaction.reply(embed.helpEmbed());
            }

            if (interaction.commandName === 'contact') {
                let type = interaction.options.getString('ภาควิชา');
                return await interaction.reply(embed.contactEmbed(type));
            }

            if (interaction.commandName === 'timetable') {
                return await interaction.reply(embed.timetableEmbed());
            }

            if (interaction.commandName === 'calendar') {
                return await interaction.reply(await embed.calendarEmbed());
            }
        });

        this.client.on('messageCreate', async message => {
            if (message.author.bot) return;
            if (!message.content.startsWith(this.prefix)) return;
            const args = message.content.slice(this.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            if (command === 'help') {
                return message.reply(embed.helpEmbed());
            }

            if (command === 'contact') {
                return message.reply(embed.contactEmbed(args[0] ? args[0] : ''));
            }

            if (command === 'timetable') {
                return message.reply(embed.timetableEmbed());
            }

            if (command === 'calendar') {
                return message.reply(await embed.calendarEmbed());
            }
        });

        this.logger.info('Event registered');
    }
}