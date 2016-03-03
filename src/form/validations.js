/**
 * @file validations.js default validation rules
 * @author Hu Jian <hujian02@baidu.com>
 */

define(function (require) {
    function isExisty(value) {
        return value !== null && value !== undefined;
    }

    function isEmpty(value) {
        return value === '';
    }

    function getLengthInBytes(str) {
        var b = str.match(/[^\x00-\xff]/g);
        return (str.length + (!b ? 0: b.length)); 
    }

    var validations = {
        required: function (values, value) {
            var isValid = isExisty(value) && !isEmpty(value);
            return {
                isValid: isValid,
                template: '此处不能留空'
            };
        },

        matchRegexp: function (values, value, regexp) {
            var isValid = !isExisty(value) || isEmpty(value) || regexp.test(value);
            return {
                isValid: isValid
            };
        },

        notMatchRegexp: function (values, value, regexp) {
            var isValid = !isExisty(value) || isEmpty(value) || !regexp.test(value);
            return {
                isValid: isValid
            };
        },

        isEmail: function (values, value) {
            var isValid = validations.matchRegexp(values, value, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);
            return {
                isValid: isValid,
                template: '请输入完整的电子邮件地址，包括“@”'
            };
        },

        isUrl: function (values, value) {
            var isValid = validations.matchRegexp(values, value, /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
            return {
                isValid: isValid,
                template: '请输入完整的URL地址'
            };
        },

        isNumeric: function (values, value) {
            var isValid;
            if (typeof value === 'number') {
                isValid = true;
            }
            else {
                isValid = validations.matchRegexp(values, value, /^[-+]?(?:\d*[.])?\d+$/);
            }
            return {
                isValid: isValid,
                template: '请输入数字'
            };
        },

        isAlpha: function (values, value) {
            var isValid = validations.matchRegexp(values, value, /^[A-Z]+$/i);
            return {
                isValid: isValid,
                template: '请输入英文字母'
            };
        },

        isAlphanumeric: function (values, value) {
            var isValid = validations.matchRegexp(values, value, /^[0-9A-Z_]+$/i);
            return {
                isValid: isValid,
                template: '请勿使用除字母、数字和英文下划线外的其他字符。'
            };
        },

        maxLength: function (values, value, length) {
            var isValid = !isExisty(value) || value.length <= length;
            return {
                isValid: isValid,
                template: '输入长度不能超过${validations.maxLength}'
            };
        },

        maxByteLength: function (values, value, length) {
            var isValid = !isExisty(value) || getLengthInBytes(value) <= length;
            return {
                isValid: isValid,
                template: '不能超过${validations.maxByteLength}个字符'
            };
        },

        minLength: function (values, value, length) {
            var isValid = !isExisty(value) || isEmpty(value) || value.length >= length;
            return {
                isValid: isValid,
                template: '输入长度不能小于${validations.minLength}'
            };
        },

        minByteLength: function (values, value, length) {
            var isValid = !isExisty(value) || getLengthInBytes(value) >= length;
            return {
                isValid: isValid,
                template: '不能小于${validations.minByteLength}个字符'
            };
        }
    };

    return validations;
});