/**
 * @file default validation rules
 * @author Hu Jian <hujian02@baidu.com>
 * @author Brian Li (lbxxlht@163.com)
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


    return {

        required: function (value) {
            return {
                isValid: isExisty(value) && !isEmpty(value),
                template: '此处不能留空'
            };
        },

        matchRegexp: function (value, regexp) {
            return {
                isValid: !isExisty(value) || isEmpty(value) || regexp.test(value)
            };
        },

        notMatchRegexp: function (value, regexp) {
            return {
                isValid: !isExisty(value) || isEmpty(value) || !regexp.test(value)
            };
        },

        isEmail: function (value) {
            var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            return {
                isValid: this.matchRegexp(value, reg),
                template: '请输入正确的邮件地址'
            };
        },

        isUrl: function (value) {
            var reg = /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            return {
                isValid: this.matchRegexp(value, reg),
                template: '请输入正确的URL地址'
            };
        },

        isNumeric: function (value) {
            var isValid;
            if (typeof value === 'number') {
                isValid = true;
            }
            else {
                isValid = this.matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
            }
            return {
                isValid: isValid,
                template: '请输入数字'
            };
        },

        isAlpha: function (value) {
            return {
                isValid: this.matchRegexp(value, /^[A-Z]+$/i),
                template: '请输入英文字母'
            };
        },

        isAlphanumeric: function (value) {
            return {
                isValid: this.matchRegexp(value, /^[0-9A-Z_]+$/i),
                template: '请勿使用除字母、数字和英文下划线外的其他字符。'
            };
        },

        maxLength: function (value, length) {
            return {
                isValid: !isExisty(value) || value.length < length + 1,
                template: '输入长度不能超过' + length
            };
        },

        maxByteLength: function (value, length) {
            return {
                isValid: !isExisty(value) || getLengthInBytes(value) < length + 1,
                template: '不能超过' + length + '个字符'
            };
        },

        minLength: function (value, length) {
            return {
                isValid: !isExisty(value) || isEmpty(value) || value.length > length - 1,
                template: '输入长度不能小于' + length
            };
        },

        minByteLength: function (value, length) {
            return {
                isValid: !isExisty(value) || getLengthInBytes(value) > length - 1,
                template: '不能少于' + length + '个字符'
            };
        }
    };
});
