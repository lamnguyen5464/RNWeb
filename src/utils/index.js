import { AppConfig } from '../App';
import { parseJsonString } from '../utils/StringUtils';
import { PhoneUtil } from '@momo-platform/utils';

export const getAvatarUrlById = id => {
    return `${AppConfig.AVATAR_ENDPOINT}${formatPhone(id, 11)}.png`;
};

let config = null;

const DEFAULT_CONFIG =
    '{"prefix":{"tenNumber":["086","096","097","098","091","094","088","090","093","089","092","099","052","032","033","034","035","036","037","038","039","083","084","085","081","082","070","079","077","076","078","058","056","059","044","087"],"elevenNumber":["0162","0163","0164","0165","0166","0167","0168","0169","0123","0124","0125","0127","0129","0120","0121","0122","0126","0128","0188","0186","0199"],"group":["0120-070","0121-079","0122-077","0126-076","0128-078","0123-083","0124-084","0125-085","0127-081","0129-082","0162-032","0163-033","0164-034","0165-035","0166-036","0167-037","0168-038","0169-039","0199-059","0186-056","0188-058"]}}';

const add0ToPhoneNumber = phone => {
    if (!phone.startsWith('0')) {
        phone = '0' + phone;
    }
    return phone;
};

const removeAreaCode = phone1 => {
    let phone = phone1 + '';
    phone = phone.replace(' ', '');
    if (phone.startsWith('84')) {
        phone = phone.substring(2);
    } else if (phone.startsWith('84-')) {
        phone = phone.substring(3);
    } else if (phone.startsWith('+84')) {
        phone = phone.substring(3);
    } else if (phone.startsWith('+84-')) {
        phone = phone.substring(4);
    } else if (phone.startsWith('(+84)')) {
        phone = phone.substring(5);
    }
    phone = add0ToPhoneNumber(phone);
    return phone;
};

export const convertTenNumberToElevenNumber = _tenNumber => {
    let tenNumber = removeAreaCode(_tenNumber);
    try {
        if (!config) {
            config = parseJsonString(DEFAULT_CONFIG);
        }
        if (config && config.prefix && config.prefix.group && tenNumber.length === 10) {
            let group = config.prefix.group;
            let prefix = tenNumber.substring(0, 3);
            for (let str of group) {
                if (str.indexOf(prefix) !== -1) {
                    prefix = str.replace(tenNumber.substring(0, 3), '').replace('-', '');
                    return prefix + tenNumber.substring(3, tenNumber.length);
                }
            }
            return tenNumber;
        }
        return tenNumber;
    } catch (e) {
        return tenNumber;
    }
};

export const formatPhone = (number = '', output = 10) => {
    if (number) {
        let phoneNumber = removeAreaCode(number);
        if (phoneNumber?.length != output) {
            phoneNumber = PhoneUtil.convertPhoneNumerWithMode({
                phone: number,
            });
        }
        return phoneNumber;
    }
};

/*
Example:
const string = 'Để đổi %@ heo vàng, bạn sẽ dùng %@ huy hiệu sức khỏe'
replaceStringByPosition(strings, [numberGoldenPig, numberHealthBadge], '%@')
*/
/**
 *
 * @param {String} string
 * @param {Array} arrayPosition
 * @param {String} character
 */
export const replaceStringByPosition = (string, arrayPosition, character = '%@') => {
    let newString = string;
    for (let i = 0; i < arrayPosition.length; i++) {
        newString = newString.replace(character, arrayPosition[i]);
    }
    return newString;
};
