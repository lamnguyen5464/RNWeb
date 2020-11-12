import NumberUtils from './NumberUtils';

export const parseJsonString = stringObject => {
    try {
        if (
            !stringObject ||
            stringObject == null ||
            typeof stringObject === 'undefined' ||
            stringObject.length === 0
        ) {
            return null;
        }
        let result = JSON.parse(stringObject);
        return result;
    } catch (ex) {
        if (ex && typeof ex === 'object') {
            if (typeof ex === 'object') {
                //this.ShowFullLog("parseJsonString error: " + JSON.stringify(ex));
            } else if (typeof ex === 'string') {
                //this.ShowFullLog("parseJsonString error: " + ex);
            }
        }
        return null;
    }
};

export const getStringNumber = (value, thousandToK) => {
    let number = Number(value);
    let result = number + '';
    if (number >= 1000000000) {
        // 1,000,000,000 => 1 tỷ; 1,500,000,000 => 1,5 tỷ
        let bil = (number / 1000000000).toFixed(number % 1000000000 === 0 ? 0 : 1);
        result = NumberUtils.formatNumberToMoney(bil, 0, ' tỷ');
    } else if (number >= 1000000) {
        // 1,000,000 => 1 triệu; 1,500,000 => 1.5 triệu
        let mil = (number / 1000000).toFixed(number % 1000000 === 0 ? 0 : 1);
        result = NumberUtils.formatNumberToMoney(mil, 0, ' triệu');
    } else if (thousandToK && number >= 1000) {
        // 1,000 => 1k; 1,500 => 1.5k
        let thousand = (number / 1000).toFixed(number % 1000 === 0 ? 0 : 1);
        result = NumberUtils.formatNumberToMoney(thousand, 0, 'k');
    }
    return result;
};

export const displayNumber = (number, displayThousand = false) => {
    if (!number) {
        return 0;
    }
    if ((number / 1000 >= 1 && number >= 10000) || displayThousand) {
        let value = number / 1000;
        if (value.toString().length >= 5) {
            value = value.toFixed(0);
        } else {
            value = value.toFixed(1);
        }

        return `${value}k`.replace('.0', '');
    }
    return NumberUtils.formatNumberToMoney(number, '0', '');
};
