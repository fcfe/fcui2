define(function (require) {

    var language = 'ch';
    var data = {
        ch: {
            pager: {
                previousPage: '上一页',
                nextPage: '下一页'
            },
            button: {
                enter: '确定',
                cancel: '取消',
                fresh: '刷新'
            },
            tableSelector: {
                selectAll: '选择全部',
                selectCurrentPage: '选择当前页'
            },
            table: {
                noData: '没有数据'
            },
            calendar: {
                day: ['一', '二', '三', '四', '五', '六', '日']
            },
            rangeCalendar: {
                enter: '确定',
                cancel: '取消',
                startTime: '起始时间：',
                endTime: '结束时间：',
                today: '今天',
                yesterday: '昨天',
                beforeYesterday: '前天',
                lastWeek: '上周',
                last7: '过去7天',
                last14: '过去14天',
                last30: '过去30天',
                currentMonth: '本月',
                lastMonth: '上月',
                lastQuarter: '上个季度'
            }
        }
    };

    return data[language];
});