const { MessageEmbed, MessageAttachment } = require("discord.js");

const KMUTNB_COLOR = '#AC3520';

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

    contactEmbed(type = '') {
        const contacts = {
            'คณิตศาสตร์': 'http://sci.kmutnb.ac.th/uploads/content/870/MA.jpg',
            'เคมีอุตสาหกรรม': 'http://sci.kmutnb.ac.th/uploads/content/870/IC.jpg',
            'เทคโนโลยีอุตสาหกรรมเกษตร อาหาร และสิ่งแวดล้อม': 'http://sci.kmutnb.ac.th/uploads/content/870/AFET.jpg',
            'เทคโนโลยีชีวภาพ': 'http://sci.kmutnb.ac.th/uploads/content/870/BT.jpg',
            'คอมพิวเตอร์และสารสนเทศ': 'http://sci.kmutnb.ac.th/uploads/content/870/CS.jpg',
            'สถิติประยุกต์': 'http://sci.kmutnb.ac.th/uploads/content/870/AS.jpg',
        };

        if (type in contacts) {
            let image = new MessageAttachment(contacts[type]);
            return { files: [image] };
        }

        let embed = new MessageEmbed();
        embed.setColor(KMUTNB_COLOR);

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
};