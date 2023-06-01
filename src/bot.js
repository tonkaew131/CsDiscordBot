import { createLogger, format, transports } from 'winston';
import { Client, Intents, Modal, TextInputComponent, MessageActionRow } from 'discord.js';

const TextInputStyles = {
    SHORT: 1,
    PARAGRAPH: 2,
}

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import commands from './commands.data.js';

import Embed from './embed.js';
import prisma from './prisma.js';
import { generateId } from './utils.js';
const embed = new Embed();

export default class DiscordClient {
    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_TYPING,
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
            this.logger.info(`Logged in as ${this.client.user.tag}! with ${this.client.users.cache.size} users, ${this.client.guilds.cache.size} guids`);

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
            if (interaction.isModalSubmit()) {
                if (interaction.customId === 'cal_add') {
                    const userId = interaction.user.id;

                    let admin = undefined;
                    try {
                        admin = await prisma.admin.findUnique({
                            where: {
                                id: userId,
                            }
                        });
                    } catch (err) {
                        console.error(err);
                        return await interaction.reply('Error, getting admin data');
                    }

                    if (!admin) {
                        return await interaction.reply('คุณไม่มีสิทธิ์ในการเพิ่มปฏิทินการศึกษา ):');
                    }

                    const calName = interaction.fields.getTextInputValue('cal_add_name');
                    const calDesc = interaction.fields.getTextInputValue('cal_add_description');
                    const calStartFrom = interaction.fields.getTextInputValue('cal_add_startFrom');

                    const calId = generateId();

                    let data = {
                        id: calId,
                        name: calName,
                        description: calDesc,
                        startFrom: undefined,
                        createdBy: userId,
                    };

                    try {
                        data.startFrom = new Date(calStartFrom);
                    } catch (err) {
                        return await interaction.reply('Error: วันผิดหนิ');
                    }

                    try {
                        await prisma.calendar.create({
                            data: data
                        });
                    } catch (err) {
                        console.error(err);
                        return await interaction.reply('Error, adding calendar');
                    }

                    return await interaction.reply(`เพิ่มละค้าบ \`\`\`json
                    ${JSON.stringify(data)}
                    \`\`\``);
                }

                return;
            }

            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'help') {
                return await interaction.reply(embed.helpEmbed());
            }

            if (interaction.commandName === 'contact') {
                let type = interaction.options.getString('ภาควิชา');
                return await interaction.reply(embed.contactEmbed(type));
            }

            // if (interaction.commandName === 'timetable') {
            //     return await interaction.reply(embed.timetableEmbed());
            // }

            if (interaction.commandName === 'links') {
                return await interaction.reply(embed.linksEmbed());
            }

            if (interaction.commandName === 'curriculum') {
                return await interaction.reply(embed.curriculumEmbed());
            }

            if (interaction.commandName === 'calendar') {
                return await interaction.reply(await embed.calendarEmbed());
            }

            if (interaction.commandName === 'cal_add') {
                const userId = interaction.user.id;

                const admin = await prisma.admin.findUnique({
                    where: {
                        id: userId,
                    }
                });

                if (!admin) {
                    return await interaction.reply('คุณไม่มีสิทธิ์ในการเพิ่มปฏิทินการศึกษา ):');
                }

                const modal = new Modal({
                    customId: 'cal_add',
                    title: 'เพิ่มปฏิทินการศึกษา',
                }, this.client);

                const nameInput = new TextInputComponent().setCustomId('cal_add_name').setLabel('ชื่อ').setStyle(TextInputStyles.SHORT);
                const nameInputAction = new MessageActionRow().addComponents(nameInput);
                const descInput = new TextInputComponent().setCustomId('cal_add_description').setLabel('รายละเอียด').setStyle(TextInputStyles.PARAGRAPH);
                const descInputAction = new MessageActionRow().addComponents(descInput);
                const startInput = new TextInputComponent().setCustomId('cal_add_startFrom').setLabel('เริ่ม (YYYY-MM-DD hh:mm:ss)').setStyle(TextInputStyles.SHORT);
                const startInputAction = new MessageActionRow().addComponents(startInput);

                modal.addComponents(nameInputAction, descInputAction, startInputAction);

                return await interaction.showModal(modal);
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

            // if (command === 'timetable') {
            //     return message.reply(embed.timetableEmbed());
            // }

            if (command === 'calendar') {
                return message.reply(await embed.calendarEmbed());
            }
        });

        this.logger.info('Event registered');
    }
}