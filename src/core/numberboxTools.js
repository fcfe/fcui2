define(function (require) {

    return {


        /**
         * 过滤掉字符串中所有非数字，包括串中间的负号，第二次出现的小数点，前方不合法的0
         *
         * @param {string | number} value 待处理数据
         * @return {string} 过滤后串
         */
        charFilter: function (value) {
            value = (typeof value === 'string' || typeof value === 'number') ? value + '' : '';
            if (value.length === 0) return value;
            // 过滤非法字符
            var str = '-.0123456789';
            var result = '';
            for (var i = 0; i < value.length; i++) {
                var char = value.charAt(i);
                if (
                    str.indexOf(char) < 0
                    || (char === '-' && i > 0)
                    || (char === '.' && result.indexOf('.') > -1)
                ) {
                    continue;
                }
                result += char;
            }
            if (result.length === 0) return result;
            // 去除前方非法0
            while (result.charAt(0) === '0' && result.length > 1 && result.charAt(1) !== '.') {
                result = result.substr(1, result.length);
            }
            // 小数点前自动添0
            if (result.charAt(0) === '.') {
                result = '0' + result;
            }
            return result;
        },


        /**
         * 数字区间过滤，在区间内，返回值；否则返回区间边界
         *
         * @param {string | number} value 待处理值
         * @param {number} max 最大值
         * @param {number} min 最小值
         * @return {string | number} 在区间内的值
         */
        regionFilter: function (value, min, max) {
            if (isNaN(value)) return NaN;
            var result = value;
            min = isNaN(min) ? Number.NEGATIVE_INFINITY : parseFloat(min);
            max = isNaN(max) ? Number.POSITIVE_INFINITY : parseFloat(max);
            if (min > max) {
                var tmp = min;
                min = max;
                max = tmp;
            }
            result = result > max ? max : result;
            result = result < min ? min: result;
            return result;
        },


        /**
         * 截取小数点
         *
         * @param {string} value 是一个数字的字符串
         * @param {number} fixed 小数位数
         * @return {}
         */
        fixed: function (value, fixed) {
            value = (typeof value === 'string' || typeof value === 'number') ? value + '' : '';
            fixed = isNaN(fixed) ? 2 : parseInt(fixed, 10);
            var arr = value.split('.').slice(0, 2);
            if (arr.length > 1 && arr[1].length > fixed) {
                arr[1] = arr[1].slice(0, fixed);
            }
            if (arr.length > 1) {
                return arr.join('.');
            }
            if (arr.length === 1) {
                return  arr[0];
            }
            if (arr.length === 0) {
                return '';
            }
        },


        /**
         * 根据配置将字符串处理成合法数字
         *
         * @param {string} value 字符串
         * @param {Object} config 配置参数
         * @param {number} config.max 最大值
         * @param {number} config.min 最小值
         * @param {string} config.type 类型，int或float
         * @param {number} config.fixed 小数位数，只在type=float时才有用
         * @return {string} 
         */
        numberFormater: function (value, config) {
            config = config || {};
            value = this.charFilter(value);
            if (!value.length || value === '-' || value === '.') {
                return value;
            }
            if (isNaN(value)) {
                return '';
            }
            value = this.regionFilter(value, config.min, config.max) + '';
            return config.type === 'int' ? value.split('.')[0] : this.fixed(value, config.fixed);
        }
    };

});