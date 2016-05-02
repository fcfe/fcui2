/**
 * @file 文本输入框组件
 * @author Brian Li
 * @author Han Bing Feng
 * @email lbxxlht@163.com
 * @version 0.0.2
 */

define(function (require) {
    // 168 = 7 x 24;
    return {

        /**
         * 将string类型的value转换成日优先的二维数组。
         * value为选定的选定的时段值。
         * 是一个有7x24元素的数组JSON.stringify后的值。日优先存放一星期每天24小时的时段选择情况。
         * 每个元素可为null，或者一个string。
         * 当为null时，表示该时段没有被选择。
         * 当为string时，表示该时段被选择，string的内容为当前时段的label。
         * 相邻时段相同值的label会被合并。
         * 若label为空串（''），则显示默认label。默认为时段跨度。如1:00-2:00
         *
         * @param {string} value 字符串值
         * @return {Array}
         */
        parseValue: function (value) {
            var arrValue;
            try {
                arrValue = JSON.parse(value);
            }
            catch (e) {
                return [];
            }
            var result = [];
            var hourCount = 0;
            var arrDay;
            for (var i = 0; i < 168; i++) {
                if (hourCount === 0) {
                    arrDay = [];
                }
                hourCount++;
                arrDay.push(arrValue[i]);
                if (hourCount === 24) {
                    result.push(arrDay);
                    hourCount = 0;
                }
            }
            return result;
        },

        /**
         * 将value从原始格式转换成string
         *
         * @override
         *
         * @param {Array} rawValue 原始值
         * @return {string}
         */
        stringifyValue: function (rawValue) {
            var arr = [];
            if (!rawValue) {
                return '';
            }
            for (var i = 0; i < rawValue.length; i++) {
                arr.push(rawValue[i].join(''));
            }
            return arr.join('');
        },

        selectedCount: function (value, axis1, axis2) {
            value = this.parseValue(value);
            var result = 0;
            for (var y = axis1.y; y < axis2.y + 1; y++) {
                if (y > value.length - 1) {
                    continue;
                }
                for (var x = axis1.x; x < axis2.x + 1; x++) {
                    if (x > value[y].length - 1) {
                        continue;
                    }
                    if (value[y][x] !== 0) {
                        result++;
                    }
                }
            }

            return result;
        },

        updateValueByAxis: function (value, axis1, axis2, v) {
            value = this.parseValue(value);
            for (var y = axis1.y; y < axis2.y + 1; y++) {
                if (y > value.length - 1) {
                    continue;
                }
                for (var x = axis1.x; x < axis2.x + 1; x++) {
                    if (x > value[y].length - 1) {
                        continue;
                    }
                    value[y][x] = v === undefined ? Math.abs(value[y][x] - 1) : v;
                }
            }
            return this.stringifyValue(value);
        },

        updateValueByMouse: function (value, state) {
            var axis1 = this.gridAxis(
                Math.min(state.mouseDownX, state.mouseCurrentX),
                Math.min(state.mouseDownY, state.mouseCurrentY)
            );
            var axis2 = this.gridAxis(
                Math.max(state.mouseDownX, state.mouseCurrentX),
                Math.max(state.mouseDownY, state.mouseCurrentY)
            );
            return this.updateValueByAxis(value, axis1, axis2);
        },

        /**
         * 将数组形式的24小时值转换为一组label。数组每一位值表示当前小时的状态，
         * 相同状态的值将合并为一个label元素返回。每一个label元素为一个object。
         *
         * @param  {Array<string>} arr 数组形式的24小时值
         * @return {Object} label元素数组
         * @param {number} return.begin label的开始小时
         * @param {number} return.end label的结束小时
         * @param {string} return.value label上显示的值，默认为当前小时范围
         */
        value2label: function (arr) {
            var result = [];
            var beginIndex = 0;
            var prevValue = null;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == null) {
                    if (prevValue == null) {
                        continue;
                    }
                    else {
                        result.push({begin: beginIndex, end: i - 1, value: prevValue});
                        prevValue = null;
                        continue;
                    }
                }
                else {
                    if (arr[i] == prevValue) {
                        continue;
                    }
                    else {
                        if (prevValue != null) {
                            result.push({begin: beginIndex, end: i - 1, value: prevValue});
                        }
                        beginIndex = i;
                        prevValue = arr[i];
                    }
                }
            }
            if (prevValue != null) {
                result.push({begin: beginIndex, end: 23, value: prevValue});
            }
            return result;
        },

        titleLayerSize: function (axis, hide) {
            var pos = {
                width: 100,
                height: 60,
                left: -200,
                top: -200
            };
            var padding = 10;
            var tWidth = 577;
            var tHeight = 170;
            if (hide) {
                return pos;
            }
            pos.top = ((axis.y + 1) * 24 + padding + pos.height < tHeight)
                ? ((axis.y + 1) * 24 + padding) : (axis.y * 24 - padding - pos.height);
            pos.left = (axis.x * 24 + pos.width < tWidth)
                ? (axis.x * 24) : ((axis.x + 1) * 24 - pos.width);
            return pos;
        },

        gridAxis: function (x, y) {
            return {
                x: (x - x % 24) / 24,
                y: (y - y % 24) / 24
            };
        },

        cursorSize: function (state) {
            var pos = {
                left: -2,
                top: -2,
                width: 0,
                height: 0
            };
            if (state.mouseCurrentX < 0) {
                return pos;
            }
            else if (state.mouseDownX < 0) {
                var axis = this.gridAxis(state.mouseCurrentX, state.mouseCurrentY);
                pos.left = axis.x * 24 + 1;
                pos.top = axis.y * 24 + 1;
                pos.width = 23;
                pos.height = 23;
                return pos;
            }
            var axis1 = this.gridAxis(
                Math.min(state.mouseDownX, state.mouseCurrentX),
                Math.min(state.mouseDownY, state.mouseCurrentY)
            );
            var axis2 = this.gridAxis(
                Math.max(state.mouseDownX, state.mouseCurrentX),
                Math.max(state.mouseDownY, state.mouseCurrentY)
            );
            pos.left = axis1.x * 24 + 1;
            pos.top = axis1.y * 24 + 1;
            pos.width = (axis2.x - axis1.x + 1) * 24 - 1;
            pos.height = (axis2.y - axis1.y + 1) * 24 - 1;
            // color-blue-2
            pos.backgroundColor = 'rgba(47, 130, 245, 0.5)';
            return pos;
        }
    };

});
