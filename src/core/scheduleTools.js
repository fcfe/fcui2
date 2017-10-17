/**
 * Schedule 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @author 0.0.2.1
 */
define(function (require) {

    var language = require('./language').schedule;
    var CELL_LENGTH = 24;

    return {
        /**
         * 输入值转内部结构
         * @interface parseValue
         * @param {String} value schedule值
         * @return {Array.<Array.<null|String>>} 内部值结构
         * @note
         * 内部值结构是一个二位数组，第一维表示星期，第二维表示小时，共 7x24 = 168个元素。
         *
         * 每个元素要么为null，要么为字符串。为null时表示该小时未被选中；为字符串时表示选中。
         */
        parseValue: function (value) {
            var arrValue = [];
            try {
                arrValue = JSON.parse(value);
            }
            catch (e) {
                // do nothing
            }
            arrValue = arrValue instanceof Array ? arrValue : [];
            var result = [];
            var day = [];
            for (var i = 0; i < 7 * 24; i++) {
                if (i % 24 === 0) {
                    day = [];
                }
                day.push(arrValue.length > i ? arrValue[i] : null);
                if (i % 24 === 23) {
                    result.push(day);
                }
            }
            return result;
        },
        /**
         * 内部结构转字符串
         * @interface stringifyValue
         * @return {String} schedule值
         * @param {Array.<Array.<null|String>>} 内部值结构
         * @note
         * 将内部结构的二维数组以行优先形式合并成一个数组，并转成JSON返回
         */
        stringifyValue: function (rawValue) {
            if (!(rawValue instanceof Array)) return '';
            var result = [];
            rawValue.map(function (item) {
                if (item instanceof Array) {
                    result = result.concat(item);
                }
                else {
                    result.push(item);
                }
            });
            return JSON.stringify(result);
        },
        /**
         * 获取虚拟鼠标尺寸
         * @interface getCursorSize
         * @param {Object} param 输入数据对象
         * @param {Number} param.mouseDownX 鼠标按下时的x坐标
         * @param {Number} param.mouseDownY 鼠标按下时的y坐标
         * @param {Number} param.mouseCurrentX 鼠标当前x坐标
         * @param {Number} param.mouseCurrentY 鼠标当前y坐标
         * @return {ScheduleCursorSize} 虚拟鼠标的样式
         */
        /**
         * @structure ScheduleCursorSize
         * @param {Number} left 虚拟鼠标left值
         * @param {Number} top 虚拟鼠标top值
         * @param {Number} width 虚拟鼠标width值
         * @param {Number} height 虚拟鼠标height值
         */
        getCursorSize: function (state) {
            var pos = {
                left: -2,
                top: -2,
                width: 0,
                height: 0
            };
            if (state.mouseCurrentX < 0 && (state.mouseDownX < 0 && state.mouseDownY < 0)) {
                return pos;
            }
            if (state.mouseDownX < 0) {
                var axis = this.getGridAxis(state.mouseCurrentX, state.mouseCurrentY);
                pos.left = axis.x * CELL_LENGTH + 1;
                pos.top = axis.y * CELL_LENGTH + 1;
                pos.width = CELL_LENGTH - 1;
                pos.height = CELL_LENGTH - 1;
                return pos;
            }
            var axis1 = this.getGridAxis(
                Math.min(state.mouseDownX, state.mouseCurrentX),
                Math.min(state.mouseDownY, state.mouseCurrentY)
            );
            var axis2 = this.getGridAxis(
                Math.max(state.mouseDownX, state.mouseCurrentX),
                Math.max(state.mouseDownY, state.mouseCurrentY)
            );
            pos.left = axis1.x * CELL_LENGTH + 1;
            pos.top = axis1.y * CELL_LENGTH + 1;
            pos.width = (axis2.x - axis1.x + 1) * CELL_LENGTH - 1;
            pos.height = (axis2.y - axis1.y + 1) * CELL_LENGTH - 1;
            return pos;
        },
        /**
         * 获取格子坐标
         * @interface getGridAxis
         * @param {Number} x 相对操作区左上角x坐标
         * @param {Number} y 相对操作区左上角y坐标
         * @return {ScheduleAxis} 格子坐标 
         */
        /**
         * @structure ScheduleAxis
         * @param {Number} x 格子横坐标，有效区间[0, 23]
         * @param {Number} y 格子纵坐标，有效区间[0, 6]
         */
        getGridAxis: function (x, y) {
            var x = (x - x % CELL_LENGTH) / CELL_LENGTH;
            var y = (y - y % CELL_LENGTH) / CELL_LENGTH;
            x = x < 0 ? 0 : x;
            x = x > 23 ? 23 : x;
            y = y < 0 ? 0 : y;
            y = y > 6 ? 6 : y;
            return {
                x: x,
                y: y
            };
        },
        /**
         * 合并同值value
         * @interface getMergedValues
         * @param {Arrray.<null|String>} arr 单行value数据
         * @return {Array.<ScheduleMergedValue>} 同值合并后的对象数组
         */
        /**
         * @structure ScheduleMergedValue
         * @param {Number} begin 起始小时
         * @param {Number} end 结束小时
         * @param {String} value 区间内的value值
         */
        getMergedValues: function (arr) {
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
                    if (arr[i] === prevValue) {
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

        /**
         * 获取选中区域
         * @interface getSelectedRange
         * @param {Object} param 输入数据对象
         * @param {Number} param.mouseDownX 鼠标按下时的x坐标
         * @param {Number} param.mouseDownY 鼠标按下时的y坐标
         * @param {Number} param.mouseCurrentX 鼠标当前x坐标
         * @param {Number} param.mouseCurrentY 鼠标当前y坐标
         * @return {ScheduleRange} 选中区域对象
         */
        /**
         * @structure ScheduleRange
         * @param {Number} startHour 起始小时
         * @param {Number} endHour 结束小时
         * @param {Number} startWeekday 起始星期
         * @param {Number} endWeekday 结束星期
         */
        getSelectedRange: function (state) {
            var axis1 = this.getGridAxis(
                Math.min(state.mouseDownX, state.mouseCurrentX),
                Math.min(state.mouseDownY, state.mouseCurrentY)
            );
            var axis2 = this.getGridAxis(
                Math.max(state.mouseDownX, state.mouseCurrentX),
                Math.max(state.mouseDownY, state.mouseCurrentY)
            );
            return {
                startHour: axis1.x,
                endHour: axis2.x,
                startWeekday: axis1.y,
                endWeekday: axis2.y
            };
        },
        /**
         * 获取区域内选中小时个数
         * @interface getRangeSelectedCount
         * @param {String} value schedule的value
         * @param {ScheduleAxis} axis1 区域左上角坐标
         * @param {ScheduleAxis} axis2 区域右下角坐标
         * @return {Number} 区域内被选中的小时个数
         */
        getRangeSelectedCount: function (value, axis1, axis2) {
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
                    if (value[y][x] != null) {
                        result++;
                    }
                }
            }
            return result;
        },
        /**
         * 获取区域说明
         * @interface getRangeIntro
         * @param {Number} startHour 起始小时
         * @param {Number} endHour 结束小时
         * @param {Number} startWeekday 起始星期
         * @param {Number} endWeekday 结束星期
         * @return {String} 区域说明文本
         */
        getRangeIntro: function (startHour, endHour, startWeekday, endWeekday) {
            if (isEmpty(startHour)) return '';
            var res = '';
            res += isEmpty(startWeekday) ? '' : language.day[startWeekday];
            res += isEmpty(endWeekday) || startWeekday === endWeekday
                ? '' : ((res.length ? ' - ' : '') + language.day[endWeekday]);
            res += res.length ? ' ' : '';
            if (+startHour === 0 && +endHour === 23) {
                res += language.allDay;
            }
            else {
                res += startHour + ':00' + (isEmpty(endHour) ? '' : (' - ' + (endHour + 1) + ':00'));
            }
            return res;
            function isEmpty(v) {
                return v == null || v === undefined;
            }
        },
        /**
         * 反选鼠标拖拽区域内的值
         * @interface updateValueByMouse
         * @param {String} value schedule的值
         * @param {Object} param 输入数据对象
         * @param {Number} param.mouseDownX 鼠标按下时的x坐标
         * @param {Number} param.mouseDownY 鼠标按下时的y坐标
         * @param {Number} param.mouseCurrentX 鼠标当前x坐标
         * @param {Number} param.mouseCurrentY 鼠标当前y坐标
         */
        updateValueByMouse: function (value, state) {
            var scheduleRange = this.getSelectedRange(state);
            return this.updateValueByAxis(value, {
                x: scheduleRange.startHour,
                y: scheduleRange.startWeekday
            }, {
                x: scheduleRange.endHour,
                y: scheduleRange.endWeekday
            });
        },
        /**
         * 设置坐标区域内的值
         * @interface updateValueByMouse
         * @param {String} value schedule的值
         * @param {ScheduleAxis} axis1 区域左上角坐标
         * @param {ScheduleAxis} axis2 区域右下角坐标
         * @param {?String} v 选中值，如果不制定，则反选
         */
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
                    value[y][x] = (v == null || v === undefined) ? (value[y][x] == null ? '' : null) : v;
                }
            }
            return this.stringifyValue(value);
        }

    };

});
