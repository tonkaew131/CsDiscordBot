import { MessageEmbed, MessageAttachment } from 'discord.js';
import prisma from './prisma.js';
import { formatAgo, formatDate } from './utils.js';

const KMUTNB_COLOR = '#AC3520';

export default class Embed {
    constructor() {
        this.color = '#154997';
    }

    setColor(color) {
        this.color = color;
    }

    setProflePicture(url) {
        this.profilePicture = url;
    }

    setUsername(username) {
        this.username = username;
    }

    setID(id) {
        this.id = id;
    }

    setPrefix(prefix) {
        this.prefix = prefix;
    }

    helpEmbed() {
        let embed = new MessageEmbed();
        embed.setColor(this.color);

        embed.setTitle('**CsDiscordBot\'s Commands**');
        embed.setThumbnail(this.profilePicture);
        embed.setDescription(`The prefix for <@${this.id}> is \`${this.prefix}\``);

        let mainCommands = '**• help**: Shows informations about bot\n';
        mainCommands += '**• contact**: ช่องทางติดต่อกับภาควิชา\n';
        mainCommands += '**• links**: รวมลิงค์ต่างๆ\n';
        mainCommands += '**• curriculum**: หลักสูตร\n';
        mainCommands += '**• calendar**: ปฏิทินการศึกษา\n';
        embed.addField('- คำสั่ง', mainCommands);

        // let creditField = '<@352448254304321537>';
        // embed.addField('- ', creditField);

        embed.setFooter({
            text: 'https://github.com/tonkaew131/CsDiscordBot'
        });

        return { embeds: [embed] };
    }

    contactEmbed(type = '') {
        // This is 2564
        const contacts = {
            'คณิตศาสตร์': 'http://sci.kmutnb.ac.th/uploads/content/870/MA.jpg',
            'เคมีอุตสาหกรรม': 'http://sci.kmutnb.ac.th/uploads/content/870/IC.jpg',
            'เทคโนโลยีอุตสาหกรรมเกษตร อาหาร และสิ่งแวดล้อม': 'http://sci.kmutnb.ac.th/uploads/content/870/AFET.jpg',
            'เทคโนโลยีชีวภาพ': 'http://sci.kmutnb.ac.th/uploads/content/870/BT.jpg',
            'คอมพิวเตอร์และสารสนเทศ': 'http://sci.kmutnb.ac.th/uploads/content/870/CS.jpg',
            'สถิติประยุกต์': 'http://sci.kmutnb.ac.th/uploads/content/870/AS.jpg',
        };

        type = type ? type : '';
        if (type.startsWith('ภาควิชา')) type = type.replace('ภาควิชา', '');
        if (type in contacts) {
            let image = new MessageAttachment(contacts[type]);
            return { files: [image] };
        }

        let embed = new MessageEmbed();
        embed.setColor(KMUTNB_COLOR);

        // This is 2564
        embed.setTitle('ช่องทางติดต่อกับภาควิชา (คณะวิทยาศาสตร์ประยุกต์)');
        embed.addField('- ภาควิชาคณิตศาสตร์', '• [LINE](http://line.me/ti/g/vPiX6UK46G)');
        embed.addField('- ภาควิชาเคมีอุตสาหกรรม', '• [LINE](http://line.me/ti/g/iDyXnhJzpM)');
        embed.addField('- ภาควิชาเทคโนโลยีอุตสาหกรรมเกษตร อาหาร และสิ่งแวดล้อม', '• [LINE](http://line.me/ti/g/Kyhq5hFjhy)');
        embed.addField('- ภาควิชาเทคโนโลยีชีวภาพ', '• [LINE](http://line.me/ti/g/sZDEiwjdso)');
        embed.addField('- ภาควิชาฟิสิกส์และอุปกรณ์การแพทย์', '• imitcas@sci.kmutnb.ac.th');
        embed.addField('- ภาควิชาคอมพิวเตอร์และสารสนเทศ', '• [LINE](https://line.me/ti/g2/nUZ6Jg9GDj6XZ7TkV-x1Tw?utm_source=invitation&utm_medium=QR_code&utm_campaign=default)');
        embed.addField('- ภาควิชาสถิติประยุกต์', '• [LINE](http://line.me/ti/g/aWFxflYW-l)');
        return { embeds: [embed] };
    }

    timetableEmbed() {
        return 'http://klogic.kmutnb.ac.th:8080/kris/tess/dataQuerySelector.jsp?query=studentTab';
    }

    curriculumEmbed() {
        let image = new MessageAttachment('https://cdn.discordapp.com/attachments/1038048164466393148/1112378534074261644/Screenshot_2022-07-11_114001.png');
        return { files: [image] }
    }

    linksEmbed() {
        let embed = new MessageEmbed();
        embed.setColor(KMUTNB_COLOR);

        // This is 2564
        embed.setTitle('รวมลิงค์ต่างๆ');
        embed.addField('- ทั้งมจพ', `
- [ตารางเรียน](http://klogic.kmutnb.ac.th:8080/kris/tess/dataQuerySelector.jsp?query=studentTab)
- [ลงทะเบียน](http://klogic.kmutnb.ac.th:8080)
- [เช็คเกรด](https://grade-report.icit.kmutnb.ac.th)
- [ประเมินอาจารย์](https://grade.icit.kmutnb.ac.th)
        `, true);
        embed.addField('- คณะวิทย์', `
- [เว็ปคณะ](http://sci.kmutnb.ac.th)
- [เพจคณะ](https://www.facebook.com/PR.AppSci.KMUTNB)
        `, true);
        embed.addField('- ภาควิชาคอม', `
- [เว็ปคณะ](http://cs.kmutnb.ac.th/index.jsp)
- [เพจสาขา](https://www.facebook.com/profile.php?id=100057122843991)
        `, true);
        return { embeds: [embed] };
    }

    async calendarEmbed() {
        let events;
        try {
            events = await prisma.calendar.findMany({
                orderBy: {
                    startFrom: 'asc'
                }
            });
        } catch (err) {
            console.error(err);
            return 'ดึงข้อมูลจาก database ไม่ได้ nooooo ;-;';
        }

        let embed = new MessageEmbed();
        embed.setColor(KMUTNB_COLOR);
        embed.setTitle('ปฏิทินการศึกษา ภาค 1 ปีการศึกษา 2566');

        for (let i = 0; i < events.length; i++) {
            const event = events[i];

            embed.addField(`- ${formatDate(event.startFrom)}: ${event.name} `, `
            >> ${formatAgo(event.startFrom)}
            ${event.description}
            `);
        }

        return { embeds: [embed] };
    }
};