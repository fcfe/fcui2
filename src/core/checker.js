define(function (require) {
    return {
        /**
         * 最大长度校验工厂
         *
         * @param {number} length 长度
         * @param {string} msg 超长时回传的错误提示
         * @param {boolean} trim 是否去掉两端空格，默认为true 
         * @return {function} 用于校验的闭包函数
         */
        maxLength: function (length, msg, trim) {
            length = isNaN(length) ? 1000 : length;
            msg = typeof msg === 'string' ? msg : '最大长度不能超过' + length;
            trim = trim === undefined ? true : trim;
            return function (v) {
                if (typeof v !== 'string') {
                    return 'Please input a string as a parameter, function maxLength.';
                }
                v = trim ? v.trim() : v;
                return v.length > length ? msg : true;
            };
        },
        /**
         * 最小长度校验工厂
         *
         * @param {number} length 长度
         * @param {string} msg 超长时回传的错误提示
         * @param {boolean} trim 是否去掉两端空格，默认为true 
         * @return {function} 用于校验的闭包函数
         */
        minLength: function (length, msg, trim) {
            length = isNaN(length) ? 0 : length;
            msg = typeof msg === 'string' ? msg : '最小长度不能超过' + length;
            trim = trim === undefined ? true : trim;
            return function (v) {
                if (typeof v !== 'string') {
                    return 'Please input a string as a parameter, function minLength.';
                }
                v = trim ? v.trim() : v;
                return v.length < length ? msg : true;
            };
        }
    }
});