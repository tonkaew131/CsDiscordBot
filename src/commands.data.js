const commands = [
    {
        name: 'help',
        description: 'Shows informations about bot'
    },
    {
        name: 'contact',
        description: 'ช่องทางติดต่อกับภาควิชา',
        options: [
            {
                type: 3,
                name: 'ภาควิชา',
                description: 'ภาควิชา',
                required: false,
                choices: [
                    {
                        name: 'คณิตศาสตร์',
                        value: 'คณิตศาสตร์'
                    },
                    {
                        name: 'เคมีอุตสาหกรรม',
                        value: 'เคมีอุตสาหกรรม'
                    },
                    {
                        name: 'เทคโนโลยีอุตสาหกรรมเกษตร อาหาร และสิ่งแวดล้อม',
                        value: 'เทคโนโลยีอุตสาหกรรมเกษตร อาหาร และสิ่งแวดล้อม'
                    },
                    {
                        name: 'เทคโนโลยีชีวภาพ',
                        value: 'เทคโนโลยีชีวภาพ'
                    },
                    {
                        name: 'คอมพิวเตอร์และสารสนเทศ',
                        value: 'คอมพิวเตอร์และสารสนเทศ'
                    },
                    {
                        name: 'สถิติประยุกต์',
                        value: 'สถิติประยุกต์'
                    }
                ]
            }
        ]
    },
    {
        name: 'timetable',
        description: 'ลิงค์ตารางเรียน'
    },
    {
        name: 'calendar',
        description: 'ปฏิทินการศึกษา'
    }
];

export default commands;