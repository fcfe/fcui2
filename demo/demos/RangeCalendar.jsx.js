define(function (require) {

    var Creater = require('../ReactClassCreater.jsx');
    var RangeCalendar = require('fcui/RangeCalendar.jsx');
    var calendarTools = require('fcui/core/calendarTools');

    var timer = new Date();
    var tmpValue = timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() - 5)
        + ';' + timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() + 5)

    var items = [
        {
            title: 'Normal RangeCalendar',
            props: {}
        },
        {
            title: 'RangeCalendar with ClassName',
            props: {className: 'marginLeft100 border2'}
        },
        {
            title: 'Readonly RangeCalendar',
            props: {value: tmpValue}
        },
        {
            title: 'Disabled RangeCalendar',
            props: {disabled: true}
        },
        {
            title: 'RangeCalendar with Min and Max',
            props: {
                min: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() - 5),
                max: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() + 5)
            }
        },
        {
            title: 'RangeCalendar with ShortCut',
            props: {
                shortCut: [
                    {label: '今天', getValues: calendarTools.getDataRange.today},
                    {label: '昨天', getValues: calendarTools.getDataRange.yesterday},
                    {label: '前天', getValues: calendarTools.getDataRange.beforeYesterday},
                    {label: '上周', getValues: calendarTools.getDataRange.lastWeek},
                    {label: '过去7天', getValues: calendarTools.getDataRange.last7},
                    {label: '过去14天', getValues: calendarTools.getDataRange.last14},
                    {label: '过去30天', getValues: calendarTools.getDataRange.last30},
                    {label: '本月', getValues: calendarTools.getDataRange.currentMonth},
                    {label: '上月', getValues: calendarTools.getDataRange.lastMonth},
                    {label: '上季度', getValues: calendarTools.getDataRange.lastQuarter}
                ]
            }
        },
        {
            title: 'RangeCalendar with ShortCut and Min and Max',
            props: {
                min: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() - 5),
                max: timer.getFullYear() + '-' + (timer.getMonth() + 1) + '-' + (timer.getDate() + 5),
                shortCut: [
                    {label: '今天', getValues: calendarTools.getDataRange.today},
                    {label: '昨天', getValues: calendarTools.getDataRange.yesterday},
                    {label: '前天', getValues: calendarTools.getDataRange.beforeYesterday},
                    {label: '上周', getValues: calendarTools.getDataRange.lastWeek},
                    {label: '过去7天', getValues: calendarTools.getDataRange.last7},
                    {label: '过去14天', getValues: calendarTools.getDataRange.last14},
                    {label: '过去30天', getValues: calendarTools.getDataRange.last30},
                    {label: '本月', getValues: calendarTools.getDataRange.currentMonth},
                    {label: '上月', getValues: calendarTools.getDataRange.lastMonth},
                    {label: '上季度', getValues: calendarTools.getDataRange.lastQuarter}
                ]
            }
        },
        {
            title: 'RangeCalendar with RangeValidator',
            props: {
                rangeValidator: function (v1, v2) {
                    var d = v2.getTime() - v1.getTime();
                    d = parseInt(d / (1000 * 60 * 60 * 24), 10); 
                    return d > 3 ? '时间跨度不能超过3天' : true;
                }
            }
        }
    ];

    return Creater(RangeCalendar, items, 'onChange');
});
