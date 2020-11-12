import moment from 'moment-timezone';

export const convertStringToDate = (
    string: string,
    type: 'dd/mm/yyyy' | 'yyyy/mm/dd' = 'dd/mm/yyyy'
) => {
    const arrStr = string.split('/');
    switch (type) {
        case 'dd/mm/yyyy':
            return new Date(arrStr[2], arrStr[1] - 1, arrStr[0]);

        case 'yyyy/mm/dd':
            return new Date(arrStr[0], arrStr[1] - 1, arrStr[2]);

        default:
            break;
    }
};

export const isToday = timeStamp => {
    const today = new Date();
    return (
        moment(timeStamp)
            .toDate()
            .toDateString() === today.toDateString()
    );
};

export const isBetween = (begin, end) => {
    try {
        let current = new Date();
        let beginDate = new Date(begin);
        let endDate = new Date(end);
        return current >= beginDate && current <= endDate;
    } catch (e) {
        return false;
    }
};

export const momentTimeZone = date => {
    if (!date) {
        return moment().tz('Asia/Ho_Chi_Minh');
    }
    return moment(date, 'DD/MM/YYYY').tz('Asia/Ho_Chi_Minh');
};

export const parseTime = timeStamp => {
    const sec = parseInt(timeStamp, 10) / 1000;
    let day = Math.floor(sec / 3600 / 24);
    let hour = Math.floor((sec - day * 86400) / 3600);
    let minute = Math.floor((sec - day * 86400 - hour * 3600) / 60);
    let second = Math.floor(sec - day * 86400 - hour * 3600 - minute * 60);
    return { day, hour, minute, second };
};

export const getTimeLeft = (timeStamp, minDay) => {
    let result = '';
    const time = parseTime(timeStamp);
    if (time.day > 0) {
        result = `Còn ${time.day} ngày`;
    } else if (time.hour > 0) {
        result = `Còn ${time.hour} giờ`;
    } else if (time.minute > 0) {
        result = `Còn ${time.minute} phút`;
    }
    if (minDay && time.day > minDay) {
        result = '';
    }
    return result;
};

export default {
    convertStringToDate,
    isBetween,
    momentTimeZone,
    getTimeLeft,
    parseTime,
};
