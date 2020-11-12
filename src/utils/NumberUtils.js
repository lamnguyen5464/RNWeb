export default {
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    formatNumberToMoney(number, defaultNumber = '', currency = '') {
        if (!number || isNaN(number) || Number(number) == 0) {
            return '0' + currency;
        }

        let array = [];
        let result = '';
        let isNegative = false;

        if (number < 0) {
            number = -number;
            isNegative = true;
        }

        let numberString = number.toString();
        if (numberString.length < 3) {
            return numberString + currency;
        }

        let count = 0;
        for (let i = numberString.length - 1; i >= 0; i--) {
            count += 1;
            if (numberString[i] == '.' || numberString[i] == ',') {
                array.push(',');
                count = 0;
            } else {
                array.push(numberString[i]);
            }
            if (count == 3 && i >= 1) {
                array.push('.');
                count = 0;
            }
        }

        for (let i = array.length - 1; i >= 0; i--) {
            result += array[i];
        }

        if (isNegative) {
            result = '-' + result;
        }

        return result + currency;
    },

    formatMoneyToNumber(money) {
        if (money && money.length > 0) {
            let moneyString = money
                .replaceAll(',', '')
                .replaceAll('đ', '')
                .replaceAll('.', '')
                .replaceAll(' ', '');
            let number = Number(moneyString);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        } else {
            return money;
        }
    },
};
