export function deepExtend(destination = {}, source = {}) {
    for (var property in source) {
        if (source[property] && source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            this.deepExtend(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
}

export function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
}

export function floatToCurrency(input, decimals, euro, usekSufix = false, usemSufix = false) {
    decimals = (typeof decimals === 'undefined') ? 2 : decimals;
    let sufix = '';

    if (usemSufix && input > 999999) {
        sufix = 'M';
        input = input / 1000000;
        if (input !== parseInt(input)) {
            decimals = 2;
        }
    } else if (usekSufix && input > 9999) {
        sufix = 'k';
        input = input / 1000;
    }

    var numberStr = parseFloat(input).toFixed(2).toString();
    var numFormatDec = numberStr.slice(-decimals);

    numberStr = numberStr.substring(0, numberStr.length - 3);
    var numFormat = [];
    while (numberStr.length > 3) {
        numFormat.unshift(numberStr.slice(-3));
        numberStr = numberStr.substring(0, numberStr.length - 3);
    }
    numFormat.unshift(numberStr);
    numFormatDec = (decimals > 0) ? ',' + numFormatDec : '';
    return numFormat.join('.') + numFormatDec + ((euro) ? '\u20AC' : '') + sufix;
}

export function format(amount, digits = 2) {
    var numbers = Utils.floatToCurrency(amount, 0, false);
    var maxLength = digits + Math.floor((digits - 1) / 3);
    return numbers.substr(((numbers.length > maxLength) ? numbers.length : maxLength) - maxLength);
}

export function padLeft(number, quantity = 2, paddingChar = '0') {
    return Array(quantity - String(number).length + 1).join(paddingChar) + number;
}

/**
 * implementation of no operation
 */
export function noop() {}

/**
 * Generate a random GUID
 */
export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

export function getLanguage(allowed = []) {
    const languages = allowed.concat(['en','es']);
    const lang = Utils.getURLParameter('lang');
    return languages.reduce((current, language) => language === lang? language: current, 'en');
}