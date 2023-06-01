export function generateId(length = 16) {
    const allowedChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

    let output = [];
    for (let i = 0; i < length; i++) {
        output.push(allowedChar[Math.floor(Math.random() * allowedChar.length)]);
    }
    return output.join('');
}

export function formatAgo(_date) {
    let age = Math.abs(Date.now() - new Date(_date).getTime());
    if (typeof (_date) == Date) {
        age = Math.abs(Date.now() - _date.getTime());
    }

    console.log(Date.now(), _date.getTime());

    const out = [];

    const YEAR = 1000 * 60 * 60 * 24 * 365;
    const year = Math.floor(age / YEAR);
    age -= year * YEAR;

    if (year > 0) {
        out.push(`${year} ปี`);
    }

    const month = Math.floor(age / (YEAR / 12));
    age -= month * (YEAR / 12);

    if (month > 0) {
        out.push(`${month} เดือน`);
    }

    const day = Math.floor(age / (YEAR / 365));
    age -= day * (YEAR / 365);

    if (day > 0) {
        out.push(`${day} วัน`);
    }

    return out.join(' ');
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}