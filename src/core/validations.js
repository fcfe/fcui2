/**
 * 常用校验机
 * @author Hu Jian (hujian02@baidu.com), Brian Li (lbxxlht@163.com)
 * @version 0.0.2.1
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

    function matchRegexp(value, regexp) {
        return !isExisty(value) || isEmpty(value) || regexp.test(value);
    }

    return {
        /**
         * 是否存在，null, undefined视为不存在，其他值均为存在。
         * @interface required
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        /**
         * @structure ValidateResult
         * @param {Boolean} isValid 是否通过校验
         * @param {String} template 未通过校验时的默认错误信息
         */
        required: function (value, skip) {
            return {
                isValid: (isExisty(value) && !isEmpty(value)) || (skip === false),
                template: '此处不能留空'
            };
        },
        /**
         * 是否通过正则检查。值不存在，或值为空字符串，也视为通过校验
         * @interface matchRegexp
         * @param {Any} value 待校验值
         * @param {Reg} regexp 正则表达式
         * @return {ValidateResult} 校验结果对象
         */
        matchRegexp: function (value, regexp) {
            return {
                isValid: matchRegexp(value, regexp)
            };
        },
        /**
         * 是否未通过正则检查。值不存在，或值为空字符串，也视为通过校验
         * @interface notMatchRegexp
         * @param {Any} value 待校验值
         * @param {Reg} regexp 正则表达式
         * @return {ValidateResult} 校验结果对象
         */
        notMatchRegexp: function (value, regexp) {
            return {
                isValid: !isExisty(value) || isEmpty(value) || !regexp.test(value)
            };
        },
        /**
         * 是否是合法的email地址，内部调用this.matchRegexp
         * @interface isEmail
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isEmail: function (value) {
            var reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            return {
                isValid: matchRegexp(value, reg),
                template: '请输入正确的邮件地址'
            };
        },
        /**
         * 是否是合法的url地址，内部调用this.matchRegexp
         * @interface isUrl
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isUrl: function (value) {
            value = value && value.trim();
            var reg = /^((https?|s?ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|\{|\}|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'(\(\)|\[\])\*\+,;=|]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|\{|\}|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=|]|:|@)|\/|\?)*)?$/i;
            return {
                isValid: matchRegexp(value, reg),
                template: '请输入正确的URL地址'
            };
        },
        /**
         * 是否是带协议的合法的url地址，内部调用this.matchRegexp
         * @interface isUrl
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isProtocolUrl: function (value) {
            value = value && value.trim();
            var reg = /^((https?|s?ftp):\/\/){1}(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|\{|\}|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'(\(\)|\[\])\*\+,;=|]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|\{|\}|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=|]|:|@)|\/|\?)*)?$/i;
            return {
                isValid: matchRegexp(value, reg),
                template: '请输入正确的URL地址'
            };
        },
        /**
         * 是否是合法的座机号码或手机号码，内部调用this.matchRegexp
         * @interface isAnyPhone
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isAnyPhone: function (value) {
            var reg_phone = /^1[34578]\d{9}$/ig;
            var reg_telephone = /^(0\d{2,3}-)?\d+$/ig;
            return {
                isValid: matchRegexp(value, reg_phone) || matchRegexp(value, reg_telephone),
                template: '请输入正确的电话号码'
            };
        },
        /**
         * 是否是合法的手机号码，内部调用this.matchRegexp
         * @interface isPhone
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isPhone: function (value) {
            var reg = /^1[34578]\d{9}$/ig;
            return {
                isValid: matchRegexp(value, reg),
                template: '请输入正确的手机号码'
            };
        },
        /**
         * 是否是合法的座机号码，内部调用this.matchRegexp
         * @interface isTelephone
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isTelephone: function (value) {
            var reg = /^(0\d{2,3}-)?\d+$/ig;
            return {
                isValid: matchRegexp(value, reg),
                template: '请输入正确的座机号码'
            };
        },
        /**
         * 是否是合法数字，内部调用this.matchRegexp
         * @interface isNumeric
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isNumeric: function (value) {
            var isValid;
            if (typeof value === 'number') {
                isValid = true;
            }
            else {
                isValid = matchRegexp(value, /^[-+]?(?:\d*[.])?\d+$/);
            }
            return {
                isValid: isValid,
                template: '请输入数字'
            };
        },
        /**
         * 是否是英文字母，内部调用this.matchRegexp
         * @interface isAlpha
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isAlpha: function (value) {
            return {
                isValid: matchRegexp(value, /^[A-Z]+$/i),
                template: '请输入英文字母'
            };
        },
        /**
         * 是否是英文字母或数字，内部调用this.matchRegexp
         * @interface isAlphanumeric
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        isAlphanumeric: function (value) {
            return {
                isValid: matchRegexp(value, /^[0-9A-Z_]+$/i),
                template: '请勿使用除字母、数字和英文下划线外的其他字符'
            };
        },
        /**
         * 是否小于最大长度，值如果不存在也会通过校验
         * @interface maxLength
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        maxLength: function (value, length) {
            return {
                isValid: !isExisty(value) || value.length < length + 1,
                template: '输入长度不能超过' + length
            };
        },
        /**
         * 是否小于最大字节长度，值如果不存在也会通过校验，一个汉字的长度为2
         * @interface maxByteLength
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        maxByteLength: function (value, length) {
            return {
                isValid: !isExisty(value) || getLengthInBytes(value) < length + 1,
                template: '不能超过' + length + '个字符'
            };
        },
        /**
         * 是否大于最小长度，值如果不存在或值为空也会通过校验
         * @interface minLength
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        minLength: function (value, length) {
            return {
                isValid: !isExisty(value) || isEmpty(value) || value.length > length - 1,
                template: '输入长度不能小于' + length
            };
        },
        /**
         * 是否大于最小字节长度，值如果不存在或值为空也会通过校验，一个汉字的长度为2
         * @interface minByteLength
         * @param {Any} value 待校验值
         * @return {ValidateResult} 校验结果对象
         */
        minByteLength: function (value, length) {
            return {
                isValid: !isExisty(value) || getLengthInBytes(value) > length - 1,
                template: '不能少于' + length + '个字符'
            };
        }
    };
});
