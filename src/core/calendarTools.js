define(function (require) {


    var me = {
        // 将YYYY-MM-DD格式的字符串翻译成日期
        str2date: function (str) {
            var arr = (str + '').split('-');
            if (arr.length !== 3 || isNaN(arr[0]) || isNaN(arr[1]) || isNaN(arr[2])) {
                return null;
            }
            var date = new Date();
            date.setFullYear(parseInt(arr[0], 10));
            date.setMonth(parseInt(arr[1], 10) - 1);
            date.setDate(arr[2]);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        },
        // 比较两个日期，a和b。如果a、b是同一天返回0；a在b之前返回-1；否则返回1。
        compareDate: function (a, b) {
            if (
                a.getFullYear() === b.getFullYear()
                && a.getMonth() === b.getMonth()
                && a.getDate() === b.getDate()
            ) {
                return 0;
            }
            return a.getTime() < b.getTime() ? -1 : 1;
        },
        // 获取某个月的最后一天
        getLastDayInMonth: function (year, month) {
            var date = this.str2date(year + '-' + (month + 1) + '-31');
            var i = 12;
            while(date.getMonth() + '' !== month + '' && i > 0) {
                date.setDate(date.getDate() - 1);
                i--;
            }
            return date;
        },
        // 获取某个月第一天
        getFirstDayInMonth: function (year, month) {
            return this.str2date(year + '-' + (month + 1) + '-1');
        },
        // 判断某个月是否在min和max区间内，有一天落在这个区间内就算
        monthInRange: function (year, month, min, max) {
            var firstDay = this.getFirstDayInMonth(year, month);
            var lastDay = this.getLastDayInMonth(year, month);
            var min = this.str2date(min);
            var max = this.str2date(max);
            return this.compareDate(min, lastDay) === -1 && this.compareDate(firstDay, max) === -1;
        },
        getDataRange: {
            today: function () {
                var value1 = new Date();
                var value2 = value1;
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            yesterday: function () {
                var value1 = new Date();
                value1.setDate(value1.getDate() - 1);
                var value2 = value1;
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            beforeYesterday: function () {
                var value1 = new Date();
                value1.setDate(value1.getDate() - 2);
                var value2 = value1;
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            lastWeek: function () {
                var value2 = new Date();
                value2.setDate(value2.getDate() - (value2.getDay() === 0 ? 7 : value2.getDay()));
                var value1 = new Date();
                value1.setTime(value2.getTime());
                value1.setDate(value1.getDate() - 6);
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            last7: function () {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 7);
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            last14: function () {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 14);
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            last30: function () {
                var value2 = new Date();
                value2.setDate(value2.getDate() - 1);
                var value1 = new Date();
                value1.setDate(value1.getDate() - 30);
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            currentMonth: function () {
                var tmp = new Date();
                var value1 = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                var value2 = me.getLastDayInMonth(tmp.getFullYear(), tmp.getMonth());
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            lastMonth: function () {
                var tmp = new Date();
                tmp = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                tmp.setDate(tmp.getDate() - 1);
                var value1 = me.getFirstDayInMonth(tmp.getFullYear(), tmp.getMonth());
                var value2 = me.getLastDayInMonth(tmp.getFullYear(), tmp.getMonth());
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            },
            lastQuarter: function () {
                var tmp = new Date();
                var cMonth = tmp.getMonth();
                var cYear = tmp.getFullYear();
                var cQ = Math.floor((cMonth % 3 == 0 ? (cMonth / 3) : (cMonth / 3 + 1 ))) - 1;
                var year = [cYear - 1, cYear, cYear, cYear];
                var month = [[10, 12], [1, 3], [4, 6], [7, 9]];
                var end = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var value1 = me.str2date(year[cQ] + '-' + month[cQ][0] + '-1');
                var value2 = me.str2date(year[cQ] + '-' + month[cQ][1] + '-' + end[month[cQ][1]]);
                return {
                    ___v1: value1,
                    ___v2: value2
                };
            }
        }
    };

    return me;
});
