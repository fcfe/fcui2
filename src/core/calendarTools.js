define(function (require) {

    return {
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
        // 生成button props
        buttonProps: function (timer, disable, key, skin) {
            skin = skin || 'calendar';
            return {
                skin: skin,
                minWidth: 12,
                label: timer.getDate(),
                disable: disable,
                key: 'btns-' + key
            };
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
        }
    };

});
