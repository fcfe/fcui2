/**
 * @file 文本输入框组件
 * @author Brian Li
 * @author Han Bing Feng
 * @email lbxxlht@163.com
 * @version 0.0.2
 */

define(function (require) {
    return {

        /**
         * 将string类型的value转换成原始格式
         *
         * @override
         * @param {string} value 字符串值
         * @return {Array}
         */
        parseValue: function (value) {
            if (typeof value !== 'string') {
                value = '';
            }
            while (value.length < 168) {
                value += '0';
            }
            value = value.substr(0, 168);
            var arr = [];
            for (var i = 0; i < value.length; i = i + 24) {
                var inner = value.substring(i, i + 24).split('');
                var innerOut = [];
                for (var j = 0; j < inner.length; j++) {
                    innerOut.push(inner[j] === '0' ? 0 : 1);
                }
                arr.push(innerOut);
            }
            return arr;
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

        value2label: function (arr) {
            var i = 0;
            var result = [];
            var begin = false;
            var beginIndex = 0;
            for (i = 0; i < arr.length; i++) {
                if (arr[i] === 0 && !begin) {
                    continue;
                }
                if (arr[i] === 0 && begin) {
                    begin = false;
                    result.push({begin: beginIndex, end: i - 1});
                    continue;
                }
                if (begin) {
                    continue;
                }
                begin = true;
                beginIndex = i;
            }
            if (begin) {
                result.push({begin: beginIndex, end: 23});
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
