/**
 * Calendar 工具集
 * @author Brian Li
 * @email lbxxlht@163.com
 * @version 0.0.2.1
 */
define(function (require) {

    var util = require('./util');

    var me = {
        /**
         * 分割日期
         * @interface cutValues
         * @param {String} value 日期串，如：YYYY-MM-DD;YYYY-MM-DD
         * @return {CalendarValues} 分割后的日期对象
         */
        /**
         * @structure CalendarValues
         * @param {Date} ___v1 输入串中日期靠前的Date实例
         * @param {Date} ___v2 输入串中日期靠后的Date实例
         * @param {String} value1 输入串中日期靠前的半部分
         * @param {String} value2 输入串中日期靠后的半部分
         */
        cutValues: function cutValues(values) {
            var valueArr = (values + '').split(';');
            var value1 = this.str2date(valueArr.shift()) || new Date();
            var value2 = this.str2date(valueArr.shift()) || new Date();
            if (this.compareDate(value1, value2) === 1) {
                // value1 > value2
                var tmp = value1;
                value1 = value2;
                value2 = tmp;
            }
            return {
                ___v1: value1,
                ___v2: value2,
                value1: util.dateFormat(value1, 'YYYY-MM-DD'),
                value2: util.dateFormat(value2, 'YYYY-MM-DD')
            };
        },
        /**
         * 字符串转日期
         * @interface str2date
         * @param {String} str 日期字符串，要求年月日之间必须以'-'分割。
         * @return {Date} 对应日期
         */
        str2date: function str2date(str) {
            if (typeof str !== 'string' || !str.length || str.indexOf('-') < 0) return null;
            var arr = (str + '').split('-');
            if (arr.length !== 3 || isNaN(arr[0]) || isNaN(arr[1]) || isNaN(arr[2])) {
                return null;
            }
            var date = new Date();
            date.setMilliseconds(0);
            date.setSeconds(0);
            date.setMinutes(0);
            date.setHours(0);
            date.setDate(31);
            date.setMonth(11);
            date.setDate(parseInt(arr[2], 10));
            date.setMonth(parseInt(arr[1], 10) - 1);
            date.setFullYear(parseInt(arr[0], 10));
            return date;
        },
        /**
         * 比较日期
         * @interface compareDate
         * @param {Date} a 日期A
         * @param {Date} b 日期B
         * @return {Number} 日期比较结果：-1，a在b之前；0，a和b是同一天；1，a在b之后
         */
        compareDate: function compareDate(a, b) {
            if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()) {
                return 0;
            }
            return a.getTime() < b.getTime() ? -1 : 1;
        },
        /**
         * 获取某月最后一天
         * @interface getLastDayInMonth
         * @param {String|Number} year 年份
         * @param {String|Number} month 月份
         * @return {Date} 该月的最后一天日期实例
         */
        getLastDayInMonth: function getLastDayInMonth(year, month) {
            var date = this.str2date(year + '-' + (month + 1) + '-1');
            var i = 31;
            while (date.getMonth() + '' === month + '' && i > 0) {
                date.setDate(date.getDate() + 1);
                i--;
            }
            date.setDate(date.getDate() - 1);
            return date;
        },
        /**
         * 获取某月第一天
         * @interface getLastDayInMonth
         * @param {String|Number} year 年份
         * @param {String|Number} month 月份
         * @return {Date} 该月第一天日期实例
         */
        getFirstDayInMonth: function getFirstDayInMonth(year, month) {
            return this.str2date(year + '-' + (month + 1) + '-1');
        },
        /**
         * 某月是否在指定区间内
         * @interface monthInRange
         * @param {String|Number} year 年份
         * @param {String|Number} month 月份
         * @param {String} min 日期区间左值，格式：YYYY-MM-DD
         * @param {String} max 日期区间右值，格式：YYYY-MM-DD
         * @return {Boolean} 某月是否在给定区间内
         */
        monthInRange: function monthInRange(year, month, min, max) {
            var firstDay = this.getFirstDayInMonth(year, month);
            var lastDay = this.getLastDayInMonth(year, month);
            var min = this.str2date(min);
            var max = this.str2date(max);
            return this.compareDate(min, lastDay) === -1 && this.compareDate(firstDay, max) === -1;
        },
        getDataRange: {
            /**
             * 获取今天
             * @interface getDataRange.today
             * @return {CalendarRangeData} 日期区间
             */
            /**
             * @structure CalendarRangeData
             * @param {Date} value1 日期区间左值
             * @param {Date} value2 日期区间右值
             */
            today: function today() {
                var value1 = new Date();
                var value2 = value1;
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取昨天
             * @interface getDataRange.yesterday
             * @return {CalendarRangeData} 日期区间
             */
            yesterday: function yesterday() {
                var value1 = new Date();
                value1.setDate(value1.getDate() - 1);
                var value2 = value1;
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取前天
             * @interface getDataRange.beforeYesterday
             * @return {CalendarRangeData} 日期区间
             */
            beforeYesterday: function beforeYesterday() {
                var value1 = new Date();
                value1.setDate(value1.getDate() - 2);
                var value2 = value1;
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取上一周
             * @interface getDataRange.lastWeek
             * @return {CalendarRangeData} 日期区间
             */
            lastWeek: function lastWeek() {
                var value2 = new Date();
                value2.setDate(value2.getDate() - (value2.getDay() === 0 ? 7 : value2.getDay()));
                var value1 = new Date();
                value1.setTime(value2.getTime());
                value1.setDate(value1.getDate() - 6);
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取过去7天
             * @interface getDataRange.last7
             * @return {CalendarRangeData} 日期区间
             */
            last7: function last7() {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 7);
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取过去14天
             * @interface getDataRange.last14
             * @return {CalendarRangeData} 日期区间
             */
            last14: function last14() {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 14);
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取过去30天
             * @interface getDataRange.last30
             * @return {CalendarRangeData} 日期区间
             */
            last30: function last30() {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 30);
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取当前月
             * @interface getDataRange.currentMonth
             * @return {CalendarRangeData} 日期区间
             */
            currentMonth: function currentMonth() {
                var tmp = new Date();
                var value1 = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                var value2 = me.getLastDayInMonth(tmp.getFullYear(), tmp.getMonth());
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取上月
             * @interface getDataRange.lastMonth
             * @return {CalendarRangeData} 日期区间
             */
            lastMonth: function lastMonth() {
                var tmp = new Date();
                tmp = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                tmp.setDate(tmp.getDate() - 1);
                var value1 = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                var value2 = me.getLastDayInMonth(tmp.getFullYear(), tmp.getMonth());
                return {
                    value1: value1,
                    value2: value2
                };
            },
            /**
             * 获取上季度
             * @interface getDataRange.lastQuarter
             * @return {CalendarRangeData} 日期区间
             */
            lastQuarter: function lastQuarter(data) {
                var tmp = data || new Date();
                var currentYear = tmp.getFullYear();
                var quarter = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
                var year = [currentYear - 1, currentYear, currentYear, currentYear];
                var month = [[10, 12], [1, 3], [4, 6], [7, 9]];
                var day = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var currentQuarter = quarter[tmp.getMonth()];
                var displayYear = year[currentQuarter - 1];
                var displayMonth = month[currentQuarter - 1];
                var value1 = me.str2date(displayYear + '-' + displayMonth[0] + '-1');
                var value2 = me.str2date(displayYear + '-' + displayMonth[1] + '-' + day[displayMonth[1]]);
                return {
                    value1: value1,
                    value2: value2
                };
            }
        }
    };

    return me;
});